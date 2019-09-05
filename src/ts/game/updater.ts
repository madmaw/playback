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
        const activeRoom = currentRoomX == rx && currentRoomY == ry;
        const sounds = activeRoom 
            ? world.instructionSounds
            : {};
        const offloads = updateAndRenderRoom(c, world, room, delta, sounds, activeRoom && render);
        const [worldWidth, worldHeight] = world.size;
        offloads.forEach((entities, edge) => {
            const offset = EDGE_OFFSETS[edge];
            const roomX = rx + offset[0];
            const roomY = ry + offset[1];
            if (roomX >= 0 && roomY >= 0 && roomX < worldWidth && roomY < worldHeight) {
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
                            return (1-d) + adjust - v;
                        } else if (o < 0) {
                            return (l - 1) - adjust - v;
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
        ac = (ac as MovableEntity).carrier;
        if (ac == potentialCarrier) {
            return 1;
        }
    }
}

const carryingComparer = (a: Entity, b: Entity) => {
    return (isCarryingIndirectly(a, b) || 0) - (isCarryingIndirectly(b, a) || 0) || b.bounds[1] - a.bounds[1];
};

const updateAndRenderRoom = (
    c: CanvasRenderingContext2D, 
    world: World,
    room: Room, 
    delta: number, 
    sounds: {[_:number]: Sound}, 
    render?: boolean
): [Entity[], Entity[], Entity[], Entity[]] => {
    // sort so our attachments always work
    room.updatableEntities.sort(carryingComparer);
    // Gravity/AI/Player Input
    const worldAge = world.age;
    for (let entity of room.updatableEntities) {
        updateEntity(entity, world, room, delta, sounds);
    }

    // check collisions
    let remainingTime = delta;    
    for(;;) {
        // find the minimum collision time
        let minCollisionTime = remainingTime;
        let minCollisionEntity1: MovableEntity;
        let minCollisionEntity2: SpatialEntity;
        let minCollisionEdge1: Edge;
        room.updatableEntities.forEach(entity1 => {
            let movableEntity1 = entity1 as EveryEntity;
            entityUpdatePositionToTimeRemaining(room, entity1, remainingTime);
            if (movableEntity1.velocity && !movableEntity1.deathAge) {
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
                                const overlaps = rectangleLineOverlap(r1, r2);
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
        const minCollisionEdge2 = ((minCollisionEdge1+2)%4) as Edge;
        const crossAxis = (axis+1)%2;
        const map = entityUpdatePosition(minCollisionTime/* * .99*/);
        axisMap(minCollisionEntity1.bounds, velocity1, map, minCollisionEntity1.bounds);
        axisMap(minCollisionEntity2.bounds, velocity2, map, minCollisionEntity2.bounds);
        const calculatedMass1 = entityCalculateMass(minCollisionEntity1);
        const calculatedMass2 = entityCalculateMass(movableEntity2);
        let ignoreMass1: number | boolean;
        let ignoreMass2: number | boolean;
        if (!minCollisionEntity1.ignoreMass || !movableEntity2.ignoreMass) {
            ignoreMass1 = minCollisionEntity1.ignoreMass;
            ignoreMass2 = movableEntity2.ignoreMass;
        } else {
            ignoreMass1 = 0;
            ignoreMass2 = 0;
        }
        let mass1 = calculatedMass2 && !ignoreMass1 ? calculatedMass1 || 1 : 0;
        let mass2 = calculatedMass1 && !ignoreMass2 ? calculatedMass2 || 1 : 0;
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

        const collisionBehaviour1 = applyCollisionBehaviour(minCollisionEntity1 as Entity, minCollisionEntity2 as Entity, worldAge + minCollisionTime, dv, minCollisionEdge1);
        const collisionBehaviour2 = applyCollisionBehaviour(minCollisionEntity2 as Entity, minCollisionEntity1 as Entity, worldAge + minCollisionTime, dv, minCollisionEdge2);

        // restitution cannot be 0 as rounding errors can make things moving exactly the same speed overlap
        const restitution = Math.max(minCollisionEntity1.restitution || .1, movableEntity2.restitution || .1);
        const newVelocity = (velocity2[axis] * mass2 + velocity1[axis] * mass1) / (mass1 + mass2);
        if (collisionBehaviour1) {
            const newVelocity1 = active 
                ? newVelocity - (mass2 * restitution * dv)/(mass1 + mass2)
                : velocity1[axis] > 0 && minCollisionEdge1 < 2 || velocity1[axis] < 0 && minCollisionEdge1 > 1
                    ? velocity1[axis]
                    : 0;
            entitySetVelocity(room, minCollisionEntity1, newVelocity1, axis, remainingTime);
        }
        if (collisionBehaviour2) {
            const newVelocity2 = active
                ? newVelocity + (mass1 * restitution * dv)/(mass1 + mass2)
                : velocity2[axis] > 0 && minCollisionEdge1 > 1 || velocity2[axis] < 0 && minCollisionEdge1 < 2
                    ? velocity2[axis]
                    : 0;
            if (movableEntity2.velocity) {
                movableEntity2.lastCollisions[minCollisionEdge2] = worldAge + remainingTime;
                entitySetVelocity(room, movableEntity2, newVelocity2, axis, remainingTime);
            }
        }
        if (collisionBehaviour1 && collisionBehaviour2) {
            if (minCollisionEdge1 == EDGE_BOTTOM && calculatedMass1 && mass2) {
                // attach
                entitySetCarrying(minCollisionEntity2, minCollisionEntity1, 1);
            }
            if (minCollisionEdge1 == EDGE_TOP && calculatedMass2 && mass1) {
                // attach the other way around
                entitySetCarrying(minCollisionEntity1, minCollisionEntity2, 1);
            }    
        }        

        movableEntity2.timeRemaining = minCollisionEntity1.timeRemaining = remainingTime;
        roomAddEntityToTiles(room, minCollisionEntity1 as Entity);
        roomAddEntityToTiles(room, minCollisionEntity2 as Entity);

        if (FLAG_DEBUG_PHYSICS && rectangleOverlap(minCollisionEntity1.bounds, minCollisionEntity2.bounds) ) {
            console.log('should not be possible');
        }
    }


    FLAG_DEBUG_PHYSICS && room.allEntities.forEach(entity => entityUpdatePositionToTimeRemaining(room, entity, 0));

    // collision groups are ordered in render order
    room.allEntities.sort((a, b) => b.collisionGroup - a.collisionGroup);

    c.fillStyle = hslToStyle(room.backgroundColor);
    c.fillRect(0, 0, room.bounds[2], room.bounds[3]);

    // render
    let result: [Entity[], Entity[], Entity[], Entity[]] = [[], [], [], []];
    room.allEntities.forEach(entity => {
        const movableEntity = entity as ActiveMovableEntity;
        const graphicalEntity = entity as ActiveGraphicalEntity;
        const grabbingEntity = entity as GrabbingEntity;
        const everyEntity = entity as EveryEntity;
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
        }
        entityUpdatePositionToTimeRemaining(room, entity, 0);
        FLAG_DEBUG_PHYSICS && roomIterateEntities(room, entity.bounds, e => {
            if(e != entity) {
                console.log('inside', e);
            }
        });
        const newRoomPosition = axisMap(entity.bounds, room.bounds, ([s, l]: [number, number], [p, d]: [number, number]) => p + Math.floor((s+l/2)/d));
        if (!movableEntity.carrier && !arrayEqualsNoBoundsCheck(newRoomPosition, room.bounds)) {
            if (!everyEntity.deathAge) {
                const [rx, ry] = room.bounds;
                const [newRx, newRy] = newRoomPosition;
                const dx = newRx - rx;
                const dy = newRy - ry;
                const edge = EDGE_OFFSETS.findIndex(([ox, oy]) => ox == dx && oy == dy);
                if (edge >= 0) {
                    result[edge].push(entity);
                }    
            }
            roomRemoveEntity(room, entity, 1);
        }    
        if (render) {
            c.save();
            const [x, y, w, h] = entity.bounds;
            c.translate(x + w/2, y);
            drawEntity(c, entity, worldAge + delta);
            c.restore();
        }
    });
    return result;
};

const drawEntity = (c: CanvasRenderingContext2D, entity: Entity, worldAge: number, xscale = 1, yscale = 1) => {
    const [x, y, w, h] = entity.bounds;
    const movableEntity = entity as ActiveMovableEntity;
    const graphicalEntity = entity as ActiveGraphicalEntity;

    if (graphicalEntity.graphic) {
        if (graphicalEntity.currentAnimationId != graphicalEntity.targetAnimationId) {
            const currentAnimation = graphicalEntity.graphic.animations && graphicalEntity.graphic.animations[graphicalEntity.currentAnimationId];
            graphicalEntity.previousAnimationPoseDuration = currentAnimation && currentAnimation.poseDuration || 0;
            graphicalEntity.currentAnimationId = graphicalEntity.targetAnimationId;
            graphicalEntity.currentAnimationStartTime = worldAge;    
        }
        const orientableEntity = entity as OrientableEntity;
        let orientationXScale = 1;
        if (orientableEntity.orientation != null) {
            let turnProgress = Math.min(1, (worldAge - orientableEntity.orientationStartTime)/TURN_DURATION) * 2 - 1;
            // TODO there's got to be a better way to do this
            if (turnProgress > 0) {
                turnProgress = Math.max(.2, turnProgress);
            } else {
                turnProgress = Math.min(-.2, turnProgress);
            }
            orientationXScale = orientableEntity.orientation?turnProgress:-turnProgress;
        }            

        const newXScale = w/(graphicalEntity.graphic.imageryWidth * xscale);
        const newYScale = h/(graphicalEntity.graphic.imageryHeight * yscale)
        c.save();

        c.scale(newXScale * orientationXScale, newYScale);
        let currentPoseId: number | undefined;
        let progress: number | undefined;
        if (graphicalEntity.currentAnimationId) {
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
                    if (currentAnimation.count) {
                        let repeats = Math.floor(poseIndex / currentAnimation.poseIds.length);
                        const maxPoseDuration = currentAnimation.poseIds.length * currentAnimation.poseDuration;
                        if (repeats >= currentAnimation.count) {
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
        const callback: PostJointRenderCallback = (c, j) => {
            const held = movableEntity.holding && movableEntity.holding[j.id];
            if (held) {
                drawEntity(c, held as Entity, worldAge, newXScale, newYScale);
            }
        };
        const poses: PoseAndProgress[] = [];
        if (graphicalEntity.passiveAnimations) {
            objectIterate(graphicalEntity.passiveAnimations, (a, animationId) => {
                const animation = graphicalEntity.graphic.animations[animationId]; 
                let progress = (worldAge - a.startTime)/animation.poseDuration;
                let index: number;
                let previousIndex: number;
                if (progress < animation.poseIds.length) {
                    index = progress | 0;
                    progress -= index;
                    previousIndex = index - 1;
                } else {
                    index = animation.poseIds.length - 1;
                    progress = animation.poseIds.length - progress + 1;
                    previousIndex = -1;
                }
                poses.push({
                    poseId: animation.poseIds[index], 
                    progress, 
                });
                if (previousIndex >= 0) {
                    poses.push({
                        poseId: animation.poseIds[previousIndex], 
                        progress: 1 - progress, 
                    });    
                }
            });
        }
        
        if (currentPoseId != null) {
            poses.unshift({
                poseId: currentPoseId, 
                progress, 
            });
        }
        if (graphicalEntity.previousPoseId != null && progress < 1) {
            poses.unshift({
                poseId: graphicalEntity.previousPoseId, 
                progress: 1 - progress, 
            });
        }
        drawGraphic(
            c, 
            graphicalEntity.graphic, 
            graphicalEntity.palette, 
            callback, 
            poses, 
        );  
        c.restore();        
    }

    const speakingEntity = entity as SpeakingEntity;

    if (speakingEntity.lastInstructionsSpoken && speakingEntity.lastSpoke > worldAge - SPEECH_FADE_INTERVAL) {
        const s = speakingEntity.lastInstructionsSpoken.slice(-MAX_VISIBLE_INSTRUCTIONS).map(instructionToName).join('');
        const width = c.measureText(s).width;
        // draw a speech bubble
        // draw the text
        const r = SPEECH_TEXT_PADDING;
        const iw = width + SPEECH_TEXT_PADDING * 2;
        const ih = SPEECH_TEXT_HEIGHT + SPEECH_TEXT_PADDING * 2;
        const iy = -ih - SPEECH_CALLOUT_HEIGHT - SPEECH_TEXT_PADDING;
        const ix = -width/2 - SPEECH_TEXT_PADDING;
        const alpha = 1 - (worldAge - speakingEntity.lastSpoke)/SPEECH_FADE_INTERVAL;
        c.globalAlpha = alpha * alpha;
        c.beginPath();
        c.moveTo(ix + r, iy);
        c.arcTo(ix + iw, iy, ix + iw, iy + r, r);
        c.arcTo(ix + iw, iy + ih, ix + iw - r, iy + ih, r);
        c.lineTo(SPEECH_CALLOUT_WIDTH/2, iy + ih);
        c.lineTo(0, -SPEECH_TEXT_PADDING)
        c.lineTo(-SPEECH_CALLOUT_WIDTH/2, iy + ih);
        c.arcTo(ix, iy + ih, ix, iy + r, r);
        c.arcTo(ix, iy, ix + r, iy, r);
        c.fillStyle = '#fff';
        c.fill();
        c.strokeStyle = c.fillStyle = '#333'; 
        c.stroke();
        c.globalAlpha = alpha;
        c.fillText(s, 0, -SPEECH_CALLOUT_HEIGHT - SPEECH_TEXT_PADDING * 2);
        c.globalAlpha = 1;        
    }
}

const updateEntity = (
    entity: Entity, 
    world: World, 
    room: Room, 
    delta: number, 
    sounds: {[_:number]: Sound}, 
) => {
    roomRemoveEntityFromTiles(room, entity);
    const worldAge = world.age;

    const everyEntity = entity as EveryEntity;
    const activeMovableEntity = entity as ScriptedEntity;        
    const orientableEntity = entity as OrientableEntity;
    const graphicalEntity = entity as GraphicalEntity;
    const tape = activeMovableEntity.holding && activeMovableEntity.holding[activeMovableEntity.insertionJointId] as Tape;
    const script = tape && tape.script;
    
    const canSpeakNow: number | boolean = (worldAge / PLAYBACK_INTERVAL | 0) < ((worldAge + delta)/PLAYBACK_INTERVAL | 0);
    if (everyEntity.toSpeak && everyEntity.toSpeak.length && canSpeakNow) {
        const instruction = everyEntity.toSpeak.pop();
        if (instruction != null) {
            const utterance = instructionToUtterance(instruction);
            // inform any reachable listeners in the room
            const [rx, ry, roomWidth, roomHeight] = room.bounds;
            const tileReachability = array2DCreate(roomWidth, roomHeight, () => 0);
            const uncheckedTiles: Vector[] = [[everyEntity.bounds[0]| 0, everyEntity.bounds[1] | 0]];
            while (uncheckedTiles.length) {
                const [tx, ty] = uncheckedTiles.pop();
                if (tx >= 0 && ty >= 0 && tx < roomWidth && ty < roomHeight) {
                    const reachability = tileReachability[tx][ty];
                    if (!reachability) {
                        const tileBounds = [tx, ty, 1, 1] as Rectangle;
                        const blocked = room.tiles[tx][ty].find(e => rectangleOverlap(e.bounds, tileBounds) > .8 && (e.collisionGroup == COLLISION_GROUP_TERRAIN || e.collisionGroup == COLLISION_GROUP_PUSHABLES));
                        if (blocked) {
                            tileReachability[tx][ty] = blocked.id;
                        } else {
                            tileReachability[tx][ty] = -1;
                            EDGE_OFFSETS.forEach(([dx, dy]: Vector) => {
                                uncheckedTiles.push([tx + dx, ty + dy]);
                            });
                        }
                    }    
                }
            }
    
            let heard: boolean | number;
            room.updatableEntities.forEach(e => {
                const everyEntity = e as EveryEntity;
                const [x, y] = everyEntity.bounds;
                const reachability = tileReachability[x | 0][y | 0];
                if (reachability < 0 || reachability == e.id) {
                    heard = heard || e.entityType == ENTITY_TYPE_PLAYER;
                    if (everyEntity.instructionsHeard && e != entity) {
                        everyEntity.instructionsHeard.push(instruction);
                        everyEntity.lastHeard = worldAge;
                    }
                    if (everyEntity.capabilities && everyEntity.canLearnNew && everyEntity.capabilities.indexOf(instruction) < 0) {
                        everyEntity.capabilities.push(instruction);
                        everyEntity.lastLearnedInstructionId = instruction;
                        everyEntity.lastLearnedAt = worldAge;
                    }    
                }            
            });
            if (heard) {
                everyEntity.lastInstructionsSpoken = everyEntity.lastInstructionsSpoken || [];
                everyEntity.lastInstructionsSpoken.push(instruction);    
                utterance(everyEntity.mass || 1, 1);
                everyEntity.lastSpoke = worldAge;
            }
        }
    }

    graphicalEntity.passiveAnimations = (graphicalEntity.passiveAnimations || {});
    objectIterate(graphicalEntity.passiveAnimations, (passive, animationId) => {
        const animation = graphicalEntity.graphic.animations[animationId];
        const endTime = passive.startTime + animation.poseDuration * animation.poseIds.length;
        if (endTime < worldAge + delta) {
            if (endTime >= worldAge) {
                passive.resolve(worldAge);
            }
            if (endTime + animation.poseDuration < worldAge + delta) {
                delete graphicalEntity.passiveAnimations[animationId];
            }
        }
    });

    (entity as GrabbingEntity).grabbing = undefined;
    if (activeMovableEntity.velocity) {
        activeMovableEntity.timeRemaining = delta;
        axisMap(activeMovableEntity.velocity, room.gravity, ([v]: [number], [g]: [number]) => v + g * activeMovableEntity.gravityMultiplier * delta, activeMovableEntity.velocity);
        activeMovableEntity.velocity = activeMovableEntity.velocity.map(v => Math.min(Math.max(v, -MAX_VELOCITY), MAX_VELOCITY)) as Vector;
    }        

    let groundAge = worldAge - activeMovableEntity.lastCollisions[EDGE_BOTTOM];
    const grabAge = worldAge - activeMovableEntity.lastCollisions[EDGE_GRAB];
    const attachedAge = Math.min(groundAge, grabAge);
    let carrierVelocity = [0, 0];
    let carrierOrientation: Orientation = orientableEntity.orientation;
    let pickingUp: boolean | number;
    let rewinding: boolean | number;
    let fastForwarding: boolean | number;
    let recording: boolean | number;

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
    }
    let orientation: Orientation = carrierOrientation;
    
    if (activeMovableEntity.activeInputs && !everyEntity.deathAge) {
        const inputs = activeMovableEntity.activeInputs;
        let jump: number;
        let up: number;
        let down: boolean | number;
        // note CC doesn't like this being undefined (may no longer be true)
        //let animationId: number = ANIMATION_ID_NONE;
        let animationId: number;

        switch(entity.entityType) {
            case ENTITY_TYPE_ROBOT:
            case ENTITY_TYPE_PLATFORM:
            {
                
                if (entity.nextScriptInstructionTime < worldAge) {
                    // do a thing
                    let nextScriptInstructionDelta = 0;
                    let nextScriptIndex = entity.nextScriptIndex;
                    let instructionRepeat: number;
                    while (!nextScriptInstructionDelta) {
                        const scriptIndex = nextScriptIndex;
                        nextScriptIndex = scriptIndex + 1;
                        const instruction = everyEntity.instructionsHeard && everyEntity.instructionsHeard.pop() || 
                            (script && scriptIndex < script.length
                                ? script[scriptIndex]
                                : INSTRUCTION_ID_DO_NOTHING
                            );
                        inputs.states = {};
                        if (everyEntity.capabilities.indexOf(instruction) >= 0) {
                            switch (instruction) {
                                case INSTRUCTION_ID_LEFT:
                                case INSTRUCTION_ID_RIGHT:
                                case INSTRUCTION_ID_UP: 
                                case INSTRUCTION_ID_DOWN:
                                    nextScriptInstructionDelta = (instructionRepeat || 1)/entity.baseVelocity;
                                    inputs.states[instruction] = worldAge;
                                    break;
                                case INSTRUCTION_ID_DO_NOTHING:
                                    nextScriptInstructionDelta = (instructionRepeat || 1) * 1000;
                                    break;
                                case INSTRUCTION_ID_REWIND:
                                case INSTRUCTION_ID_FAST_FORWARD:
                                    inputs.states[instruction] = worldAge;
                                    nextScriptInstructionDelta = (instructionRepeat || 1) * REWIND_INTERVAL;
                                    break;
                                case INSTRUCTION_ID_SAVE: 
                                    // write every persistent entity in the world to local storage
                                    world.rooms.forEach((rooms, x) => 
                                        rooms.forEach((room, y) => 
                                            room.updatableEntities.forEach(e => {
                                                if (e.persistentId) {
                                                    const bounds = e.entityType == ENTITY_TYPE_PLAYER  
                                                        ? [entity.bounds[0], entity.bounds[1], e.bounds[2], e.bounds[3]] as Rectangle
                                                        : e.bounds;
                                                    const cleanEntity = {
                                                        ...e, 
                                                        bounds, 
                                                        carryingPreviously: [], 
                                                        carrying: [], 
                                                        carrier: undefined, 
                                                        grabbing: undefined, 
                                                        holding: {},  
                                                        inputs: {
                                                            states: {}, 
                                                            reads: {}, 
                                                        }, 
                                                        lastLearnedAt: 0, 
                                                    };
                                                    const roomAndEntity: RoomAndEntity = [x, y, cleanEntity];
                                                    localStorage.setItem(e.persistentId as any, JSON.stringify(roomAndEntity));
                                                }
                                            })
                                        )
                                    );
                                    localStorage.setItem('w', worldAge as any);
                                    world.lastSaved = worldAge;
                                    break;
                                default:
                                    // assume it's a count!
                                    instructionRepeat = (instructionRepeat || 0) * 10 + instruction;
                                    break;
                            }    
                        } else {
                            instructionRepeat = 0;
                        }
                    }
                    entity.nextScriptInstructionTime = worldAge + nextScriptInstructionDelta;
                    entity.nextScriptIndex = nextScriptIndex;
                }
                break;
            }
            case ENTITY_TYPE_REPEATER: 
                inputs.states[INSTRUCTION_ID_PLAY] = worldAge;                
                break;
            case ENTITY_TYPE_PRESSURE_PLATE: 
                // if mass >= 1 it will round down 
                inputs.states[INSTRUCTION_ID_PLAY] = (entityCalculateMass(entity, 1) | 0) || everyEntity.nextScriptIndex < script.length 
                    ? worldAge 
                    : 0;
                break;
            case ENTITY_TYPE_PLAYER: 
                if (readInput(entity, INSTRUCTION_ID_HELP, worldAge)) {
                    entity.commandsVisible = !entity.commandsVisible;
                }
                break;
        }    

        const attached = attachedAge <= MAX_JUMP_AGE;
        const left = readInput(entity, INSTRUCTION_ID_LEFT, worldAge);
        const right = readInput(entity, INSTRUCTION_ID_RIGHT, worldAge);
        const mass = entityCalculateMass(activeMovableEntity) || 1;
        const canJump = mass < activeMovableEntity.mass * 2;
        const effectiveBaseVelocity = activeMovableEntity.strong 
            ? activeMovableEntity.baseVelocity
            : activeMovableEntity.baseVelocity / mass;

        if (groundAge < MAX_DELTA) {
            animationId = ANIMATION_ID_RESTING;
        }
        up = readInput(entity, INSTRUCTION_ID_UP, worldAge);
        down = readInput(entity, INSTRUCTION_ID_DOWN, worldAge);
        jump = readInput(entity, INSTRUCTION_ID_JUMP, worldAge);
        pickingUp = readInput(entity, INSTRUCTION_ID_PICK_UP, worldAge);
        const dropping = readInput(entity, INSTRUCTION_ID_DROP, worldAge);
        const throwing = readInput(entity, INSTRUCTION_ID_THROW, worldAge);
        const inserting = readInput(entity, INSTRUCTION_ID_INSERT, worldAge);
        const ejecting = readInput(entity, INSTRUCTION_ID_EJECT, worldAge);
        const pressingPlay = readInput(entity, INSTRUCTION_ID_PLAY, worldAge);

        recording = readInput(entity, INSTRUCTION_ID_RECORD, worldAge);
        rewinding = readInput(entity, INSTRUCTION_ID_REWIND, worldAge);
        fastForwarding = readInput(entity, INSTRUCTION_ID_FAST_FORWARD, worldAge);

        if (activeMovableEntity.airTurn || attached) {
            let targetVelocity = (right - left) * effectiveBaseVelocity + carrierVelocity[0];
            activeMovableEntity.velocity[0] = targetVelocity;
            if (left) {
                if (attached || !activeMovableEntity.mass) {
                    animationId = ANIMATION_ID_WALKING;       
                    if (doRepeatingInput(entity, INSTRUCTION_ID_LEFT, worldAge, delta)) {
                        entityPlaySound(entity, INSTRUCTION_ID_LEFT, sounds);
                    }
                }
                orientation = ORIENTATION_LEFT;                    
            } else if (right) {
                orientation = ORIENTATION_RIGHT;
                if (attached || !activeMovableEntity.mass) {
                    animationId = ANIMATION_ID_WALKING;
                    if (doRepeatingInput(entity, INSTRUCTION_ID_RIGHT, worldAge, delta)) {
                        entityPlaySound(entity, INSTRUCTION_ID_RIGHT, sounds);
                    }
                }
            }    
        }

        if (activeMovableEntity.holding[activeMovableEntity.insertionJointId]) {
            if (rewinding) {
                animationId = ANIMATION_ID_PRESSING_BUTTON;
                if (doRepeatingInput(entity, INSTRUCTION_ID_REWIND, worldAge, delta, REWIND_INTERVAL)) {
                    if (activeMovableEntity.nextScriptIndex > 0) {
                        activeMovableEntity.nextScriptIndex--;
                        entityPlaySound(entity, INSTRUCTION_ID_REWIND, sounds);
                    }
                }
            } else if (fastForwarding) {
                animationId = ANIMATION_ID_PRESSING_BUTTON;
                if (doRepeatingInput(entity, INSTRUCTION_ID_FAST_FORWARD, worldAge, delta, REWIND_INTERVAL)) {
                    if (activeMovableEntity.nextScriptIndex < script.length) {
                        activeMovableEntity.nextScriptIndex++;
                        entityPlaySound(entity, INSTRUCTION_ID_FAST_FORWARD, sounds);    
                    }
                }
            } else if (recording) {
                animationId = ANIMATION_ID_PRESSING_BUTTON;
                if (!everyEntity.recording) {
                    if (!everyEntity.playbackStartTime) {
                        everyEntity.playbackStartTime = worldAge;
                    }
                    entityPlaySound(entity, INSTRUCTION_ID_RECORD, sounds);
                }
                everyEntity.recording = 1;
            } else if (pressingPlay) {
                animationId = ANIMATION_ID_PRESSING_BUTTON;
                if (!everyEntity.playing) {
                    everyEntity.playbackStartTime = worldAge;
                    everyEntity.nextScriptIndex = (0 || everyEntity.nextScriptIndex) % script.length;
                    entityPlaySound(entity, INSTRUCTION_ID_PLAY, sounds);
                }
                everyEntity.playing = 1;
            }
        }
        // catch all, only record while holding button
        if (!recording) {
            everyEntity.recording = 0;
        }
        if (!pressingPlay) {
            everyEntity.playing = 0;
        }

        let [ox, oy, ow, oh] = activeMovableEntity.bounds;
        if (jump && attached && canJump) {
            activeMovableEntity.velocity[1] = -JUMP_VELOCITY;
            activeMovableEntity.lastCollisions[EDGE_BOTTOM] = 0;
            activeMovableEntity.lastCollisions[EDGE_GRAB] = 0;
            entityPlaySound(entity, INSTRUCTION_ID_JUMP, sounds); 
            groundAge = MAX_DELTA+1;
        }
        if (up && (grabAge <= delta || !everyEntity.mass)) {
            activeMovableEntity.velocity[1] = everyEntity.mass ? -CLIMB_VELOCITY : -everyEntity.baseVelocity;
            activeMovableEntity.lastCollisions[EDGE_GRAB] = 0;
            groundAge = MAX_DELTA+1;
        }
        if (!everyEntity.mass) {
            if (down) {
                activeMovableEntity.velocity[1] = everyEntity.baseVelocity;
            } else if (!up) {
                // reset velocity to zero 
                activeMovableEntity.velocity[1] = 0;
            }
        }
        if (dropping && activeMovableEntity.holding) {
            entityAddPassiveAnimation(
                entity, 
                INSTRUCTION_ID_DROP, 
                sounds, 
                worldAge, 
                () => activeMovableEntity.holding[activeMovableEntity.handJointId] as MovableEntity, 
                held => {
                    held.velocity = [0, 0];
                    delete activeMovableEntity.holding[activeMovableEntity.handJointId];
                    axisMap(activeMovableEntity.bounds, held.bounds, ([p1, l1], [_, l2]) => p1 + (l1 - l2)/2, held.bounds);
                    roomAddEntity(room, held as Entity);            
                }
            );
        }
        if (inserting && activeMovableEntity.holding) {
            entityAddPassiveAnimation(
                entity, 
                INSTRUCTION_ID_INSERT,
                sounds,  
                worldAge, 
                () => !activeMovableEntity.holding[activeMovableEntity.insertionJointId] && activeMovableEntity.holding[activeMovableEntity.handJointId] as MovableEntity, 
                (held: MovableEntity) => {
                    activeMovableEntity.holding[activeMovableEntity.insertionJointId] = held;
                    delete activeMovableEntity.holding[activeMovableEntity.handJointId];    
                }
            );
        }
        if (ejecting && activeMovableEntity.holding) {
            const inserted = activeMovableEntity.holding[activeMovableEntity.insertionJointId];
            if (inserted) {
                const mass = entityCalculateMass(inserted);
                inserted.velocity = [(orientation - .5)*EJECT_POWER/mass, -EJECT_POWER/mass];
                delete activeMovableEntity.holding[activeMovableEntity.insertionJointId];
                axisMap(activeMovableEntity.bounds, inserted.bounds, ([p1, l1], [_, l2]) => p1 + (l1 - l2)/2, inserted.bounds);
                (inserted as any as OrientableEntity).orientation = orientableEntity.orientation;
                roomAddEntity(room, inserted as Entity);
                entityPlaySound(entity, INSTRUCTION_ID_EJECT, sounds);
            }
        }
        if (throwing) {
            entityAddPassiveAnimation(
                entity, 
                INSTRUCTION_ID_THROW, 
                sounds, 
                worldAge, 
                () => activeMovableEntity.carryingPreviously[0] || activeMovableEntity.carrying[0] || activeMovableEntity.holding && activeMovableEntity.holding[activeMovableEntity.handJointId], 
                (toThrow: MovableEntity) => {
                    const mass = entityCalculateMass(toThrow);
                    toThrow.velocity = [((orientation * 2) - 1)*THROW_POWER/mass, -THROW_POWER/mass];
                    if (activeMovableEntity.holding[activeMovableEntity.handJointId] == toThrow) {
                        delete activeMovableEntity.holding[activeMovableEntity.handJointId];
                        axisMap(activeMovableEntity.bounds, toThrow.bounds, ([p1, l1], [_, l2]) => p1 + (l1 - l2)/2, toThrow.bounds);
                        (toThrow as any as OrientableEntity).orientation = orientableEntity.orientation;
                        roomAddEntity(room, toThrow as Entity);
                    }
                    entitySetCarrying(activeMovableEntity, toThrow); 
                }
            );
        }
        // if (pressingPlay) {
        //     entityAddPassiveAnimation(
        //         entity, 
        //         INSTRUCTION_ID_PLAY, 
        //         sounds, 
        //         worldAge, 
        //         () => activeMovableEntity.holding.get(activeMovableEntity.insertionJointId) as MovableEntity, 
        //         (_, worldAge) => {
        //             activeMovableEntity.nextScriptIndex = activeMovableEntity.nextScriptIndex || 0;
        //             activeMovableEntity.playing = !activeMovableEntity.playing;
        //             activeMovableEntity.playbackStartTime = worldAge;
        //         }
        //     )
        // }

        activeMovableEntity.ignoreMass = groundAge > MAX_DELTA && activeMovableEntity.mass;        

        let grabbed: SpatialEntity | undefined;

        if (!down && activeMovableEntity.velocity[1] > 0 && (groundAge > MAX_DELTA || up)) {
            // grabbing
            // look for a grab-able block
            const grabX = ox + ow * orientation;
            const grabY = oy;
            const grabArea: Rectangle = [grabX - GRAB_DIMENSION, grabY - GRAB_DIMENSION, GRAB_DIMENSION_X_2, GRAB_DIMENSION_X_2];
            let blockCount = 0;
            roomIterateEntities(room, grabArea, e => {
                if ((1 << e.collisionGroup) & everyEntity.grabMask) {
                    blockCount ++;
                    const [bx, by, bw] = e.bounds;
                    if (
                        (Math.abs(bx + bw * ((orientation + 1)%2) - grabX) < GRAB_DIMENSION/2 || e.collisionGroup == COLLISION_GROUP_BACKGROUNDED) 
                        && Math.abs(by - grabY) < GRAB_DIMENSION
                    ) {
                        grabbed = e;
                    }
                }       
            });
            if (blockCount == 1 && grabbed) {
                const [bx, by, bw] = grabbed.bounds;
                const dx = grabbed.collisionGroup == COLLISION_GROUP_BACKGROUNDED   
                    ? 0
                    : bx + (bw + GRAB_OFFSET*2) * ((orientation + 1)%2) - grabX - GRAB_OFFSET;
                const dy = by - grabY - GRAB_OFFSET;
                activeMovableEntity.velocity = [dx/delta + carrierVelocity[0], dy/delta];
                (entity as GrabbingEntity).grabbing = grabbed;
                animationId = ANIMATION_ID_GRABBING;
            }
        }
        const activeGraphicalEntity = entity as ActiveGraphicalEntity;
        activeGraphicalEntity.targetAnimationId = animationId;
    } else if (activeMovableEntity.velocity) { 
        if ((groundAge <= MAX_DELTA || activeMovableEntity.airTurn) && activeMovableEntity.velocity[1] > 0) {
            activeMovableEntity.velocity[0] = carrierVelocity[0];
        }
    }

    if (orientableEntity.orientation != orientation && orientation != null) {
        orientableEntity.orientation = orientation;
        orientableEntity.orientationStartTime = worldAge;
    }  

    if ((activeMovableEntity.playing || everyEntity.recording) && !fastForwarding && !rewinding) {
        // play the tape
        const diff = worldAge - activeMovableEntity.playbackStartTime;
        if ((diff / PLAYBACK_INTERVAL | 0) < ((diff + delta)/PLAYBACK_INTERVAL | 0)) {
            const index = activeMovableEntity.nextScriptIndex || 0;
            if (index < script.length) {
                if (everyEntity.recording) {
                    // have we heard anything?
                    script[index] = everyEntity.instructionsHeard[0];
                    everyEntity.instructionsHeard = [];
                } else {
                    const instruction = script[index];
                    entityPlaySound(entity, instruction, sounds, worldAge);
                }
                activeMovableEntity.nextScriptIndex = index + 1;
            } else {
                if (everyEntity.autoRewind && !everyEntity.recording) {
                    // wrap around
                    everyEntity.nextScriptIndex = 0;
                } else {
                    everyEntity.playbackStartTime = 0;
                }
            }
        }
    }

    // sensors
    roomIterateEntities(room, entity.bounds, e => {
        if (FLAG_CHECK_CIRCULAR_CARRYING && e == entity) {
            console.log('overlapping self!!!');
        } else if (pickingUp) {
            entityAddPassiveAnimation(
                entity, 
                INSTRUCTION_ID_PICK_UP, 
                sounds, 
                worldAge, 
                () => e.collisionGroup == COLLISION_GROUP_ITEMS && activeMovableEntity.holding && !activeMovableEntity.holding[activeMovableEntity.handJointId], 
                () => {
                    roomRemoveEntity(room, e);
                    activeMovableEntity.holding[activeMovableEntity.handJointId] = e as MovableEntity;    
                }
            );
            pickingUp = 0;
        }
    });

    if (everyEntity.deathAge) {
        everyEntity.targetAnimationId = ANIMATION_ID_DEATH;
    }

    roomAddEntityToTiles(room, entity);    
}

const applyCollisionBehaviour = (entity: Entity, collidedWith: Entity, worldAge: number, dv: number, onEdge: Edge) => {
    if (collidedWith.entityType == ENTITY_TYPE_LETHAL) {
        // die comically
        (entity as MovableEntity).velocity = [0, -MAX_VELOCITY];
        (entity as MortalEntity).deathAge = worldAge;
        return 0;
    } 
    return 1;
}