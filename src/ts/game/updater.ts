const updateAndRenderWorld = (c: CanvasRenderingContext2D, world: World, delta: number, render?: boolean) => {
    const [currentRoomX, currentRoomY] = world.currentRoom;
    const activeBounds: Rectangle = [currentRoomX - ACTIVE_ROOM_SPREAD_HORIZONTAL, currentRoomY - ACTIVE_ROOM_SPREAD_VERTICAL, ACTIVE_ROOM_SPREAD_HORIZONTAL * 2, ACTIVE_ROOM_SPREAD_VERTICAL * 2];
    const worldBounds = [0, 0, ...world.size] as Rectangle;
    rectangleIterateBounds(activeBounds, worldBounds, (rx, ry) => {
        let room = world.rooms[rx][ry];
        if (FLAG_RECORD_PREVIOUS_FRAMES && currentRoomX == rx && currentRoomY == ry) {
            world.previousFrames = world.previousFrames || [];
            world.previousFrames.unshift(JSON.stringify(room))
        }
        const offloads = updateAndRenderRoom(c, room, delta, world.age, currentRoomX == rx && currentRoomY == ry && render);
        const [worldWidth, worldHeight] = world.size;
        offloads.forEach((entities, edge) => {
            const offset = EDGE_OFFSETS[edge];
            const roomX = rx + offset[0];
            const roomY = ry + offset[1];
            if (!FLAG_BOUNDS_CHECK_ROOM_TRANSITIONS || roomX >= 0 && roomY >= 0 && roomX < worldWidth && roomY < worldHeight) {
                const room = world.rooms[roomX][roomY];
                entities.forEach(e => {
                    // reposition entity
                    let adjust = 1;
                    if (e.entityType == ENTITY_TYPE_PLAYER) {
                        world.currentRoom = [roomX, roomY];
                        adjust = 0;
                    }
                    const deltas = axisMap([...offset, ...room.bounds], e.bounds, ([o, _, l], [v, d]) => {
                        if (o > 0) {
                            return -d/2 + adjust - v;
                        } else if (o < 0) {
                            return l - d/2 - adjust - v;
                        } else {
                            return 0;
                        }
                    }) as Vector;
                    roomAddEntity(room, e, deltas);
                });    
            }
        });
    });
    world.age += delta;
}

const isCarryingIndirectly = (carried: Entity, potentialCarrier: Entity) => {
    let ac: MovableEntity | Entity | SpatialEntity = carried;
    while (ac) {
        ac = (ac as MovableEntity).carrier || (ac as ItemEntity).heldBy;
        if (ac == potentialCarrier) {
            return 1;
        }
    }
}

const carryingComparer = (a: Entity, b: Entity) => {
    return (isCarryingIndirectly(a, b) || 0) - (isCarryingIndirectly(b, a) || 0) || b.bounds[1] - a.bounds[1];
};

const updateAndRenderRoom = (c: CanvasRenderingContext2D, room: Room, delta: number, worldAge: number, render?: boolean): [Entity[], Entity[], Entity[], Entity[]] => {

    // sort so our attachments always work
    room.updatableEntities.sort(carryingComparer);
    // Gravity/AI/Player Input
    room.updatableEntities.forEach(entity => {
        
        roomRemoveEntityFromTiles(room, entity);

        const activeMovableEntity = entity as ActiveMovableEntity;        
        const orientableEntity = entity as OrientableEntity;

        (entity as GrabbingEntity).grabbing = undefined;
        if (activeMovableEntity.velocity) {
            activeMovableEntity.timeRemaining = delta;
            axisMap(activeMovableEntity.velocity, room.gravity, ([v]: [number], [g]: [number]) => v + g * delta, activeMovableEntity.velocity);
            activeMovableEntity.velocity = activeMovableEntity.velocity.map(v => Math.min(Math.max(v, -MAX_VELOCITY), MAX_VELOCITY)) as Vector;
        }        

        let groundAge = worldAge - activeMovableEntity.lastCollisions[EDGE_BOTTOM];
        const grabAge = worldAge - activeMovableEntity.lastCollisions[EDGE_GRAB];
        const attachedAge = Math.min(groundAge, grabAge);
        let carrierVelocity = [0, 0];
        let carrierOrientation: Orientation = orientableEntity.orientation;
        let pickingUp: boolean | number;

        if (activeMovableEntity.velocity) {
            if (activeMovableEntity.carryingPreviously) {
                activeMovableEntity.carryingPreviously.forEach(e => entitySetCarrying(e.carrier, e));
            }
            if (activeMovableEntity.carrier) {
                carrierVelocity = activeMovableEntity.carrier.velocity || carrierVelocity;
                if (FLAG_CARRIER_TURNS_CARRIED) {
                    const orientableCarrier = activeMovableEntity.carrier as any as OrientableEntity;
                    carrierOrientation = orientableCarrier.orientation != null 
                        && orientableCarrier.orientationStartTime > orientableEntity.orientationStartTime
                        ? orientableCarrier.orientation 
                        : carrierOrientation;    
                }
            }
            activeMovableEntity.carryingPreviously = activeMovableEntity.carrying || [];
            activeMovableEntity.carrying = [];
            
            if (activeMovableEntity.holding) {
                activeMovableEntity.holding.forEach(held => 
                    entitySetCarrying(activeMovableEntity, held, 1)
                );
            }
        }
        let orientation: Orientation = carrierOrientation;

        if (activeMovableEntity.inputs) {
            const inputs = activeMovableEntity.inputs;
            let jump: number;
            let climb: number;
            let grabbing: boolean | number;
            let animationId: number;
    
            switch(entity.entityType) {
                case ENTITY_TYPE_ROBOT:
                {
                    if (entity.nextScriptInstructionTime < worldAge) {
                        // do a thing
                        let nextScriptInstructionDelta = 0;
                        let nextScriptIndex = entity.nextScriptIndex;
                        let count: number | undefined;
                        while (!nextScriptInstructionDelta) {
                            const scriptIndex = nextScriptIndex;
                            nextScriptIndex = scriptIndex + 1;
                            const instruction = scriptIndex < entity.script.length
                                ? entity.script[scriptIndex]
                                : INSTRUCTION_STOP;
                            inputs.states = {
                                [INSTRUCTION_DOWN]: 1, 
                            };
                            switch (instruction) {
                                case INSTRUCTION_LEFT:
                                    nextScriptInstructionDelta = (count || 1)/entity.baseVelocity;
                                    inputs.states[INSTRUCTION_LEFT] = worldAge;
                                    break;
                                case INSTRUCTION_RIGHT:
                                    nextScriptInstructionDelta = (count || 1)/entity.baseVelocity;
                                    inputs.states[INSTRUCTION_RIGHT] = worldAge;
                                    break;
                                case INSTRUCTION_STOP:
                                    nextScriptInstructionDelta = (count || 1) * 1000;
                                    break;
                                case INSTRUCTION_REWIND:
                                    nextScriptIndex = scriptIndex - (count || 1);
                                    nextScriptInstructionDelta = 1;
                                    break;
                                case INSTRUCTION_FAST_FORWARD:
                                    nextScriptIndex = scriptIndex + (count || 1);
                                    nextScriptInstructionDelta = 1;
                                    break;
                                default:
                                    // assume it's a count!
                                    count = (count || 0) * 10 + instruction;
                                    break;
                            }                            
                        }
                        entity.nextScriptInstructionTime = worldAge + nextScriptInstructionDelta;
                        entity.nextScriptIndex = nextScriptIndex;
                    }
                    break;
                }
            }    

            const left = readInput(inputs, INSTRUCTION_LEFT, worldAge);
            const right = readInput(inputs, INSTRUCTION_RIGHT, worldAge);
            const attached = attachedAge <= MAX_JUMP_AGE;
            const mass = entityCalculateMass(activeMovableEntity) || 1;
            const canJump = mass < activeMovableEntity.mass * 2;
            if (groundAge < MAX_DELTA) {
                animationId = ANIMATION_ID_RESTING;
            }
            if (activeMovableEntity.airTurn || attached) {
                let targetVelocity = (right - left) * activeMovableEntity.baseVelocity / mass + carrierVelocity[0];
                activeMovableEntity.velocity[0] = targetVelocity;
                if (left) {
                    if (attached) {
                        animationId = ANIMATION_ID_WALKING;                        
                    }
                    orientation = ORIENTATION_LEFT;                    
                } else if (right) {
                    orientation = ORIENTATION_RIGHT;
                    if (attached) {
                        animationId = ANIMATION_ID_WALKING;
                    }
                }    
            }
            climb = readInput(inputs, INSTRUCTION_UP, worldAge, 1);
            jump = readInput(inputs, INSTRUCTION_JUMP, worldAge, 1);
            grabbing = !readInput(inputs, INSTRUCTION_DOWN, worldAge) && (groundAge > MAX_DELTA || climb);
            pickingUp = readInput(inputs, INSTRUCTION_PICK_UP, worldAge, 1);
            let dropping = readInput(inputs, INSTRUCTION_DROP, worldAge, 1);
            let throwing = readInput(inputs, INSTRUCTION_THROW, worldAge, 1);

            let [ox, oy, ow, oh] = activeMovableEntity.bounds;
            if (jump && attached && canJump) {
                activeMovableEntity.velocity[1] = -JUMP_VELOCITY;
                activeMovableEntity.lastCollisions[EDGE_BOTTOM] = 0;
                activeMovableEntity.lastCollisions[EDGE_GRAB] = 0;
                groundAge = MAX_DELTA+1;
            }
            if (climb && grabAge <= delta) {
                activeMovableEntity.velocity[1] = -CLIMB_VELOCITY;
                activeMovableEntity.lastCollisions[EDGE_GRAB] = 0;
                groundAge = MAX_DELTA+1;
            }
            if (dropping && activeMovableEntity.holding) {
                (activeMovableEntity.holding as ItemEntity).heldBy = undefined;
                activeMovableEntity.holding.delete(activeMovableEntity.handJointId);
            }
            const toThrow = activeMovableEntity.holding && activeMovableEntity.holding.get(activeMovableEntity.handJointId) || activeMovableEntity.carryingPreviously[0];
            if (throwing && toThrow) {
                (toThrow as ItemEntity).heldBy = undefined;
                activeMovableEntity.holding.delete(activeMovableEntity.handJointId);
                const mass = entityCalculateMass(toThrow);
                toThrow.velocity = [((orientation * 2) - 1)*THROW_POWER/mass, -THROW_POWER];
                entitySetCarrying(activeMovableEntity, toThrow);
            }
            activeMovableEntity.ignoreMass = groundAge > MAX_DELTA;
            

            let grabbed: SpatialEntity | undefined;

            if (grabbing && activeMovableEntity.velocity[1] > 0) {
                // grabbing
                // look for a grab-able block
                const grabX = ox + ow * orientation;
                const grabY = oy;
                const grabArea: Rectangle = [grabX - GRAB_DIMENSION, grabY - GRAB_DIMENSION, GRAB_DIMENSION_X_2, GRAB_DIMENSION_X_2];
                let blockCount = 0;
                roomIterateEntities(room, grabArea, e => {
                    if (e.entityType == ENTITY_TYPE_BLOCK || e.entityType == ENTITY_TYPE_CRATE) {
                        blockCount ++;
                        const [bx, by, bw] = e.bounds;
                        if (Math.abs(bx + bw * ((orientation + 1)%2) - grabX) < GRAB_DIMENSION/2 && Math.abs(by - grabY) < GRAB_DIMENSION) {
                            grabbed = e;
                        }
                    }       
                });
                if (blockCount == 1 && grabbed) {
                    const [bx, by, bw] = grabbed.bounds;
                    const dx = bx + (bw + GRAB_OFFSET*2) * ((orientation + 1)%2) - grabX - GRAB_OFFSET;
                    const dy = by - grabY - GRAB_OFFSET;
                    activeMovableEntity.velocity = [dx/delta + carrierVelocity[0], dy/delta];
                    (entity as GrabbingEntity).grabbing = grabbed;
                    animationId = ANIMATION_ID_GRABBING;
                }
            }            
            const activeGraphicalEntity = entity as ActiveGraphicalEntity;
            activeGraphicalEntity.targetAnimationId = animationId;
        } else if (activeMovableEntity.velocity) { 
            if (groundAge <= MAX_DELTA && activeMovableEntity.velocity[1] > 0) {
                activeMovableEntity.velocity[0] = carrierVelocity[0];
            }
        }

        if (orientableEntity.orientation != orientation && orientation != null) {
            orientableEntity.orientation = orientation;
            orientableEntity.orientationStartTime = worldAge;
        }  

        // sensors
        roomIterateEntities(room, entity.bounds, e => {
            if (FLAG_CHECK_CIRCULAR_CARRYING && e == entity) {
                console.log('overlapping self!!!');
            } else {
                if (pickingUp && e.collisionGroup == COLLISION_GROUP_ITEMS && !activeMovableEntity.carrying.length && !activeMovableEntity.carryingPreviously.length) {
                    (e as ItemEntity).heldBy = activeMovableEntity;
                    activeMovableEntity.holding.set(activeMovableEntity.handJointId, e as MovableEntity);
                }
            }
        });

        const holding = activeMovableEntity.holding;
        if (holding) {
            holding.forEach(holding => {
                // move the entity
                roomRemoveEntityFromTiles(room, holding as Entity);
                axisMap([...activeMovableEntity.bounds, ...activeMovableEntity.velocity], holding.bounds, ([p1, l1, v1], [p2, l2]) => (p1 + (l1 - l2)/2 - p2)/delta + v1, holding.velocity);
                roomAddEntityToTiles(room, holding as Entity);
                // set an attachment to this entity 
                entitySetCarrying(activeMovableEntity, holding, 1);
            });
        }

        roomAddEntityToTiles(room, entity);            
    });

    // check collisions
    let remainingTime = delta;    
    for(;;) {
        // find the minimum collision time
        let minCollisionTime = remainingTime;
        let minCollisionEntity1: MovableEntity;
        let minCollisionEntity2: SpatialEntity;
        let minCollisionEdge1: Edge;
        room.updatableEntities.forEach(entity1 => {
            let movableEntity1 = entity1 as MovableEntity;
            entityUpdatePositionToTimeRemaining(room, entity1, remainingTime);
            if (movableEntity1.velocity) {
                roomIterateEntities(room, movableEntity1.boundsWithVelocity, entity2 => {
                    if (entity2 != entity1 && (entity2 != minCollisionEntity1 || entity1 != minCollisionEntity2)) {
                        const movableEntity2 = entity2 as MovableEntity;
                        entityUpdatePositionToTimeRemaining(room, entity2, remainingTime);                        
            
                        let dv = axisMap(
                            movableEntity1.velocity, 
                            (entity2 as MovableEntity).velocity || [0, 0], 
                            ([v1], [v2]) => v1 - v2,
                        );
                        let [xCollisionTime, yCollisionTime] = axisMap(
                            [...dv, ...movableEntity1.bounds], 
                            entity2.bounds, 
                            ([dv, s1, l1]: number[], [s2, l2]: number[]) => {
                                if (dv > 0) {
                                    const distance = s2 - (s1 + l1);
                                    return distance / dv;
                                } else if (dv < 0) {
                                    const distance =  s1 - (s2 + l2);
                                    return distance / -dv;
                                } 
                            }
                        );
                        if (xCollisionTime != null || yCollisionTime != null) {
                            let collisionTime: number | undefined;
                            let collisionEdge: Edge | undefined;
                            if ((yCollisionTime == null || xCollisionTime >= yCollisionTime) && xCollisionTime >= 0) {
                                collisionTime = xCollisionTime;
                                collisionEdge = dv[0] > 0
                                    ? EDGE_RIGHT
                                    : EDGE_LEFT;
                            } else if ((xCollisionTime == null || yCollisionTime > xCollisionTime) && yCollisionTime >= 0) {
                                collisionTime = yCollisionTime;
                                collisionEdge = dv[1] > 0 
                                    ? EDGE_BOTTOM
                                    : EDGE_TOP;
                            }
                            // check collision edge is valid
                            const collisionBits = (movableEntity1.collisionMask >> (movableEntity2.collisionGroup * 4 + collisionEdge)) 
                                    & (movableEntity2.collisionMask >> (movableEntity1.collisionGroup * 4 + (collisionEdge + 2)%4))
                                    & 1;
                            
                            if (collisionTime != null && collisionTime <= minCollisionTime && collisionBits) {
                                // does it actually collide ?
                                const f = entityUpdatePosition(collisionTime);
                                const r1 = axisMap(movableEntity1.bounds, movableEntity1.velocity, f, [...movableEntity1.bounds]) as Rectangle;
                                const r2 = axisMap(entity2.bounds, movableEntity2.velocity || [0, 0], f, [...entity2.bounds]) as Rectangle;
                                const overlaps = rectangleLineOverlaps(r1, r2);
                                if (overlaps[(collisionEdge+1)%2]) {
                                    minCollisionTime = collisionTime;
                                    minCollisionEntity1 = movableEntity1;
                                    minCollisionEntity2 = entity2;
                                    minCollisionEdge1 = collisionEdge;    
                                }
                            }
                        }
                    }
                }, 1);
            }
        });
        if (!minCollisionEntity1) {
            break;
        }
        // resolve collision
        remainingTime -= minCollisionTime;            
        roomRemoveEntityFromTiles(room, minCollisionEntity1 as Entity);
        roomRemoveEntityFromTiles(room, minCollisionEntity2 as Entity);
        const movableEntity2 = minCollisionEntity2 as MovableEntity;
        if ((minCollisionEntity1 as GrabbingEntity).grabbing != minCollisionEntity2) {
            (minCollisionEntity1 as GrabbingEntity).grabbing = undefined;
        }
        if ((minCollisionEntity2 as GrabbingEntity).grabbing != minCollisionEntity1) {
            (minCollisionEntity2 as GrabbingEntity).grabbing = undefined;
        }
        // collision on either side means we just freeze
        const active = minCollisionEntity1.lastCollisions[(minCollisionEdge1 + 2)%4] < worldAge
            && movableEntity2.lastCollisions 
            && movableEntity2.lastCollisions[minCollisionEdge1] < worldAge;

        const velocity1 = minCollisionEntity1.velocity;
        const velocity2 = movableEntity2.velocity || [0, 0];
        const axis = minCollisionEdge1 % 2;
        const crossAxis = (axis+1)%2;
        const map = entityUpdatePosition(minCollisionTime/* * .99*/);
        axisMap(minCollisionEntity1.bounds, velocity1, map, minCollisionEntity1.bounds);
        axisMap(minCollisionEntity2.bounds, velocity2, map, minCollisionEntity2.bounds);
        const calculatedMass1 = entityCalculateMass(minCollisionEntity1);
        const calculatedMass2 = entityCalculateMass(movableEntity2);
        let mass1 = calculatedMass2 && !minCollisionEntity1.ignoreMass ? calculatedMass1 || 1 : 0;
        let mass2 = calculatedMass1 && !movableEntity2.ignoreMass ? calculatedMass2 || 1 : 0;
        if (!mass1 && !mass2) {
            mass1 = mass2 = 1;
        }
        minCollisionEntity1.lastCollisions[minCollisionEdge1] = worldAge + remainingTime;
        const dv = velocity1[axis] - velocity2[axis];

        // uncarry both on horizontal collision with any mass (assuming they're not standing on the same thing)
        if (crossAxis && minCollisionEntity1.carrier != movableEntity2.carrier) {
            mass2 
                && (dv < 0 && minCollisionEdge1 == EDGE_LEFT || dv > 0 && minCollisionEdge1 == EDGE_RIGHT || minCollisionEntity1.carrier == minCollisionEntity2) 
                && entitySetCarrying(minCollisionEntity1.carrier, minCollisionEntity1);
            mass1 
                && (dv < 0 && minCollisionEdge1 == EDGE_RIGHT || dv > 0 && minCollisionEdge1 == EDGE_LEFT || movableEntity2.carrier == minCollisionEntity1)
                && entitySetCarrying(movableEntity2.carrier, movableEntity2);    
        }   

        // restitution cannot be 0 as rounding errors can make things moving exactly the same speed overlap
        const restitution = Math.max(minCollisionEntity1.restitution || .1, movableEntity2.restitution || .1);
        const newVelocity = (velocity2[axis] * mass2 + velocity1[axis] * mass1) / (mass1 + mass2);
        const newVelocity1 = active 
            ? newVelocity - (mass2 * restitution * dv)/(mass1 + mass2)
            : velocity1[axis] > 0 && minCollisionEdge1 < 2 || velocity1[axis] < 0 && minCollisionEdge1 > 1
                ? velocity1[axis]
                : 0;
        const newVelocity2 = active
            ? newVelocity + (mass1 * restitution * dv)/(mass1 + mass2)
            : velocity2[axis] > 0 && minCollisionEdge1 > 1 || velocity2[axis] < 0 && minCollisionEdge1 < 2
                ? velocity2[axis]
                : 0;

        entitySetVelocity(room, minCollisionEntity1, newVelocity1, axis, remainingTime);
        if (movableEntity2.velocity) {
            movableEntity2.lastCollisions[(minCollisionEdge1+2)%4] = worldAge + remainingTime;
            entitySetVelocity(room, movableEntity2, newVelocity2, axis, remainingTime);
        }
        
        if (minCollisionEdge1 == EDGE_BOTTOM && calculatedMass1 && mass2) {
            // attach
            entitySetCarrying(minCollisionEntity2, minCollisionEntity1, 1);
        }
        if (minCollisionEdge1 == EDGE_TOP && calculatedMass2 && mass1) {
            // attach the other way around
            entitySetCarrying(minCollisionEntity1, minCollisionEntity2, 1);
        }

        movableEntity2.timeRemaining = minCollisionEntity1.timeRemaining = remainingTime;
        roomAddEntityToTiles(room, minCollisionEntity1 as Entity);
        roomAddEntityToTiles(room, minCollisionEntity2 as Entity);

        if (FLAG_DEBUG_PHYSICS && rectangleOverlaps(minCollisionEntity1.bounds, minCollisionEntity2.bounds) ) {
            console.log('should not be possible');
        }
    }


    FLAG_DEBUG_PHYSICS && room.allEntities.forEach(entity => entityUpdatePositionToTimeRemaining(room, entity, 0));

    // collision groups are order in render order
    room.allEntities.sort((a, b) => b.collisionGroup - a.collisionGroup);

    // render
    let result: [Entity[], Entity[], Entity[], Entity[]] = [[], [], [], []];
    room.allEntities.forEach(entity => {
        const movableEntity = entity as MovableEntity;
        const graphicalEntity = entity as ActiveGraphicalEntity;
        const grabbingEntity = entity as GrabbingEntity;
        if (movableEntity.lastCollisions && movableEntity.lastCollisions[EDGE_BOTTOM] + AUTOMATIC_ANIMATION_DELAY < worldAge) {
            if (!graphicalEntity.targetAnimationId) {
                graphicalEntity.targetAnimationId = ANIMATION_ID_JUMPING;
            }
        }
        if(grabbingEntity.grabbing) {
            // (only grab when there are no collisions) we're grabbing
            movableEntity.lastCollisions[EDGE_GRAB] = worldAge + delta;
            // attach ourselves to whatever we grabbed
            entitySetCarrying(grabbingEntity.grabbing, grabbingEntity, 1);
            //graphicalEntity.targetAnimationId = ANIMATION_ID_GRABBING;
        }
        entityUpdatePositionToTimeRemaining(room, entity, 0);
        FLAG_DEBUG_PHYSICS && roomIterateEntities(room, entity.bounds, e => {
            if(e != entity) {
                console.log('inside', e);
            }
        });
        const newRoomPosition = axisMap(entity.bounds, room.bounds, ([s, l]: [number, number], [p, d]: [number, number]) => p + Math.floor((s+l/2)/d));
        if (!movableEntity.carrier && !arrayEqualsNoBoundsCheck(newRoomPosition, room.bounds)) {
            const [rx, ry] = room.bounds;
            const [newRx, newRy] = newRoomPosition;
            const dx = newRx - rx;
            const dy = newRy - ry;
            const edge = EDGE_OFFSETS.findIndex(([ox, oy]) => ox == dx && oy == dy);
            if (edge >= 0) {
                result[edge].push(entity);
            }
            roomRemoveEntity(room, entity, 1);
        }    
        if (render) {
            c.save();
            const [x, y, w, h] = entity.bounds;
            c.translate(x + w/2, y);
            const orientableEntity = entity as OrientableEntity;
            if (orientableEntity.orientation != null) {
                const turnProgress = Math.min(1, (worldAge - orientableEntity.orientationStartTime)/TURN_DURATION) * 2 - 1;
                c.scale(orientableEntity.orientation?turnProgress:-turnProgress, 1);
            }
            const graphicalEntity = entity as ActiveGraphicalEntity;
            if (graphicalEntity.graphic) {
                if (graphicalEntity.currentAnimationId != graphicalEntity.targetAnimationId) {
                    const currentAnimation = graphicalEntity.graphic.animations && graphicalEntity.graphic.animations[graphicalEntity.currentAnimationId];
                    graphicalEntity.previousAnimationPoseDuration = currentAnimation && currentAnimation.poseDuration || 0;
                    graphicalEntity.currentAnimationId = graphicalEntity.targetAnimationId;
                    graphicalEntity.currentAnimationStartTime = worldAge;    
                }
        
                c.scale(w/graphicalEntity.graphic.width, h/graphicalEntity.graphic.height);
                let currentPoseId: number | undefined;
                let progress: number | undefined;
                if (graphicalEntity.currentAnimationId != null) {
                    const currentAnimation = graphicalEntity.graphic.animations && graphicalEntity.graphic.animations[graphicalEntity.currentAnimationId];
                    if (currentAnimation) {
                        
                        let duration = worldAge - graphicalEntity.currentAnimationStartTime;
                        let previousAnimationPoseDuration = graphicalEntity.previousAnimationPoseDuration;
                        if (previousAnimationPoseDuration < currentAnimation.poseDuration) {
                            duration -= previousAnimationPoseDuration;
                        }
                        if (duration >= 0) {
                            let poseDuration: number;                        
                            let poseIndex = Math.floor(duration / currentAnimation.poseDuration);
                            if (currentAnimation.repeat) {
                                let repeats = Math.floor(poseIndex / currentAnimation.poseIds.length);
                                const maxPoseDuration = currentAnimation.poseIds.length * currentAnimation.poseDuration;
                                if (repeats >= currentAnimation.repeat) {
                                    poseIndex = currentAnimation.poseIds.length - 1;
                                }   
                                poseDuration = Math.min(duration - poseIndex * currentAnimation.poseDuration, maxPoseDuration);
                            } else {
                                poseDuration = duration - poseIndex * currentAnimation.poseDuration;
                                poseIndex = poseIndex % currentAnimation.poseIds.length;
                            }
                            progress = poseDuration / currentAnimation.poseDuration;
                            currentPoseId = currentAnimation.poseIds[poseIndex];        
                        } else {
                            progress = 1 - duration/previousAnimationPoseDuration;
                            currentPoseId = currentAnimation.poseIds[currentAnimation.poseIds.length - 1];
                        }
                    }
                }
                if (graphicalEntity.currentPoseId != currentPoseId) {
                    graphicalEntity.previousPoseId = graphicalEntity.currentPoseId;
                    graphicalEntity.currentPoseId = currentPoseId;
                }
                drawGraphic(c, graphicalEntity.graphic, currentPoseId, graphicalEntity.previousPoseId, progress);                
            } else {
                if (movableEntity.carrier) {
                    c.fillStyle = 'blue';
                } else {
                    c.fillStyle = 'black';
                }
                c.fillRect(-w/2, 0, w, h);        
            }
            c.restore();
        }
    });
    return result;
};

