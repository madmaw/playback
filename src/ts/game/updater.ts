const updateAndRenderWorld = (c: CanvasRenderingContext2D, world: World, delta: number, render?: boolean) => {
    const [currentRoomX, currentRoomY] = world.currentRoom;
    [...EDGE_OFFSETS, [0, 0]].forEach(([dx, dy]) => {
        const rx = currentRoomX + dx;
        const ry = currentRoomY + dy;
        if (rx >= 0 && rx < world.size[0]) {
            // don't care about ry bounds, it will just go off the end of the array and return undefined
            let room = world.rooms[rx][ry];
            if (room) {
                if (FLAG_RECORD_PREVIOUS_FRAMES && currentRoomX == rx && currentRoomY == ry) {
                    world.previousFrames = world.previousFrames || [];
                    world.previousFrames.unshift(JSON.stringify(room))
                }
                const activeRoom = !dx && !dy;
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
                        if (room) {
                            entities.forEach(e => {
                                const ee = e as EveryEntity;
                                // reposition entity
                                let adjust = 1;
                                if (isPlayerOrIsCarryingPlayer(e as MovableEntity)) {
                                    world.currentRoom = [roomX, roomY];
                                    if (offset[1] <= 0) {
                                        adjust = 0;
                                    }
                                }
                                const deltas = axisMap([...offset, ...room.bounds], ee.bounds, ([o, _, l], [p, d], i) => {
                                    if (o > 0) {
                                        return (adjust - (d - GRAB_DIMENSION)) - p + 1 - i;
                                    } else if (o < 0) {
                                        return ((l - GRAB_DIMENSION) - adjust) - p;
                                    } else {
                                        return 0;
                                    }
                                }) as Vector;
                                roomAddEntity(room, e, deltas);
                            });    
                        }
                    }
                });            
            }
        }
    })
    world.age += delta;
}

const isPlayerOrIsCarryingPlayer = (e: MovableEntity) => {
    return [...e.carrying, ...e.carryingPreviously].reduce((isPlayer, e) => isPlayer || isPlayerOrIsCarryingPlayer(e), e.entityType == ENTITY_TYPE_PLAYER);
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
    return (isCarryingIndirectly(a, b) || 0) - (isCarryingIndirectly(b, a) || 0) || (b as EveryEntity).bounds[1] - (a as EveryEntity).bounds[1];
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
    // for (let entity of [...room.updatableEntities]) {
    //     updateEntity(entity, world, room, delta, sounds);
    // }
    [...room.updatableEntities].forEach(e => updateEntity(e, world, room, delta, sounds));
    // for (let i=room.updatableEntities.length; i>0; ) {
    //     i--;
    //     updateEntity(room.updatableEntities[i], world, room, delta, sounds);
    // }

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
                            movableEntity2.bounds, 
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
                                const r2 = axisMap(movableEntity2.bounds, movableEntity2.velocity || [0, 0], f, [...movableEntity2.bounds]) as Rectangle;
                                const overlaps = rectangleLineOverlap(r1, r2);
                                if (overlaps[(collisionEdge+1)%2]) {
                                    minCollisionTime = collisionTime;
                                    minCollisionEntity1 = movableEntity1;
                                    minCollisionEntity2 = movableEntity2;
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

        const velocity1 = [...minCollisionEntity1.velocity];
        const velocity2 = [...movableEntity2.velocity || [0, 0]];
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
        const previousCollisionTime = minCollisionEntity1.lastCollisions[minCollisionEdge1];
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
        const restitution = Math.max(minCollisionEntity1.restitution || .15, movableEntity2.restitution || .15);
        const newVelocity = mass1 || mass2 
            ? (velocity2[axis] * mass2 + velocity1[axis] * mass1) / (mass1 + mass2)
            : 0;
        if (collisionBehaviour1) {
            const newVelocity1 = active && (mass1 || mass2)
                ? newVelocity - (mass2 * restitution * dv)/(mass1 + mass2)
                : velocity1[axis] > velocity2[axis] && minCollisionEdge1 < 2 || velocity1[axis] < velocity2[axis] && minCollisionEdge1 > 1
                    ? velocity1[axis]
                    : 0;
            entitySetVelocity(room, minCollisionEntity1, newVelocity1, axis, remainingTime);
        }
        if (collisionBehaviour2) {
            const newVelocity2 = active && (mass1 || mass2)
                ? newVelocity + (mass1 * restitution * dv)/(mass1 + mass2)
                : velocity2[axis] > velocity1[axis] && minCollisionEdge1 > 1 || velocity2[axis] < velocity1[axis] && minCollisionEdge1 < 2
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
                entitySetCarrying(minCollisionEntity2, minCollisionEntity1, worldAge);
            }
            if (minCollisionEdge1 == EDGE_TOP && calculatedMass2 && mass1) {
                // attach the other way around
                entitySetCarrying(minCollisionEntity1, minCollisionEntity2, worldAge);
            }
            // screen shake
            if (render && FLAG_SHAKE) {
                const t = Math.abs(dv * Math.min((calculatedMass1 || 99), (calculatedMass2 || 99)) *  599) - 99;
                if (world.lastShaken < worldAge + t && t > 0 && previousCollisionTime < worldAge - MAX_DELTA) {
                    world.lastShaken = worldAge + t;    
                    world.shakeSound();
                }
            }
        }        

        movableEntity2.remainingTime = minCollisionEntity1.remainingTime = remainingTime;
        roomAddEntityToTiles(room, minCollisionEntity1 as Entity);
        roomAddEntityToTiles(room, minCollisionEntity2 as Entity);

        if (FLAG_DEBUG_PHYSICS && rectangleOverlap(minCollisionEntity1.bounds, minCollisionEntity2.bounds) ) {
            console.log('should not be possible');
        }
    }


    FLAG_DEBUG_PHYSICS && room.allEntities.forEach(entity => entityUpdatePositionToTimeRemaining(room, entity, 0));

    // collision groups are ordered in render order
    room.allEntities.sort((a, b) => b.collisionGroup - a.collisionGroup);

    // render
    if (render) {
        const gradient = c.createLinearGradient(0, 0, 0, room.bounds[3]);
        room.bg.forEach((hsl, i) => gradient.addColorStop(i/Math.max(1, room.bg.length-1), hslToStyle(hsl)));
        c.fillStyle = gradient;
        c.fillRect(0, 0, room.bounds[2], room.bounds[3]);
        // fill in any sound waves
        c.save();
        room.soundWaves = room.soundWaves.filter(soundWave => {
            c.fillStyle = hslToStyle([soundWave.hue, 99, 80])
            soundWave.tileReachability.forEach((col, y) => {
                col.forEach((v, x) => {
                    if (v < 0) {
                        const displayTime = soundWave.timeSaid + -v * SOUND_WAVE_STEP_TIME;
                        const alpha = 1 - Math.abs(worldAge - displayTime) / SOUND_WAVE_DISPLAY_TIME;
                        if (alpha > 0) {
                            c.globalAlpha = alpha/-v;
                            c.fillRect(x - 1, y - 1, 1, 1);
                        }
                    }
                });
            });
            return soundWave.timeSaid + SOUND_WAVE_DISPLAY_TIME * MAX_TILES_ACROSS > worldAge;
        });
        c.restore();
    }

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
            entitySetCarrying(grabbingEntity.grabbing, grabbingEntity, worldAge);
        }
        entityUpdatePositionToTimeRemaining(room, entity, 0);
        FLAG_DEBUG_PHYSICS && roomIterateEntities(room, everyEntity.bounds, e => {
            if(e != entity) {
                console.log('inside', e);
            }
        });
        const newRoomPosition = axisMap(everyEntity.bounds, room.bounds, 
            ([s, l]: [number, number], [p, d]: [number, number]) => {
                //retrn p + Math.floor((s+l/2)/d)
                if (s + l < GRAB_DIMENSION + 1) {
                    return p - 1;
                } else if (s > d - GRAB_DIMENSION) {
                    return p + 1;
                } else {
                    return p;
                }
            }
        );
        if ((!movableEntity.lastCarried || movableEntity.lastCarried < worldAge - CARRY_AGE_CHECK)  && movableEntity.velocity && (!arrayEqualsNoBoundsCheck(newRoomPosition, room.bounds) || worldAge - everyEntity.deathAge > MAX_DEATH_AGE)) {
            let remove: boolean | number = everyEntity.deathAge;
            if (!remove) {
                const [dx, dy] = axisMap(room.bounds, [...newRoomPosition, ...everyEntity.velocity], ([p1]: number[], [p2, v]: number[]) => {
                    const p = p2 - p1;
                    if (p > 0 && v > 0 || p < 0 && v < 0 || !p) {
                        return p;
                    }
                });
                const edge = EDGE_OFFSETS.findIndex(([ox, oy]) => ox == dx && oy == dy);
                remove = edge >= 0;
                if (remove) {
                    result[edge].push(entity);
                }    
            }
            if (remove) {
                roomRemoveEntity(room, entity, !everyEntity.deathAge);
            }
        }     
        if (render) {
            c.save();
            const [x, y, w, h] = everyEntity.bounds;
            c.translate(x + w/2 - 1, y - 1);
            drawEntity(c, entity, worldAge + delta);
            c.restore();
        }
    });
    return result;
};

const drawEntity = (c: CanvasRenderingContext2D, entity: Entity, worldAge: number, xscale = 1, yscale = 1) => {
    const movableEntity = entity as ActiveMovableEntity;
    const graphicalEntity = entity as ActiveGraphicalEntity;
    const [x, y, w, h] = movableEntity.bounds;

    c.save();

    if (graphicalEntity.graphic) {
        if (graphicalEntity.currentAnimationId != graphicalEntity.targetAnimationId) {
            const currentAnimation = graphicalEntity.graphic.animations && graphicalEntity.graphic.animations[graphicalEntity.currentAnimationId];
            graphicalEntity.previousAnimationPoseDuration = currentAnimation && currentAnimation.poseDuration || 0;
            graphicalEntity.currentAnimationId = graphicalEntity.targetAnimationId;
            graphicalEntity.currentAnimationStartTime = worldAge;    
        }
        const orientableEntity = entity as OrientableEntity;
        let orientationXScale = 1;
        if (orientableEntity.orientationStartTime != null) {
            let turnProgress = Math.min(1, (worldAge - orientableEntity.orientationStartTime)/TURN_DURATION) * 2 - 1;
            // TODO there's got to be a better way to do this
            if (turnProgress > 0) {
                turnProgress = Math.max(.2, turnProgress);
            } else {
                turnProgress = Math.min(-.2, turnProgress);
            }
            orientationXScale = orientableEntity.entityOrientation != 0 ? turnProgress:-turnProgress;
        }            

        const newXScale = w/(graphicalEntity.graphic.imageryWidth * xscale);
        const newYScale = h/(graphicalEntity.graphic.imageryHeight * yscale)

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
                    if (currentAnimation.repeatCount) {
                        let repeats = Math.floor(poseIndex / currentAnimation.poseIds.length);
                        const maxPoseDuration = currentAnimation.poseIds.length * currentAnimation.poseDuration;
                        if (repeats >= currentAnimation.repeatCount) {
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
            const held = movableEntity.holding && movableEntity.holding[j.gid];
            if (held) {
                drawEntity(c, held as Entity, worldAge, newXScale, newYScale);
            }
        };
        const poses: PoseAndProgress[] = [];
        if (graphicalEntity.passiveAnimations) {
            objectIterate(graphicalEntity.passiveAnimations, (a, animationId) => {
                const animation = graphicalEntity.graphic.animations[animationId]; 
                let progress = (worldAge - a.animationStartTime)/animation.poseDuration;
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
                    animationProgress: progress, 
                });
                if (previousIndex >= 0) {
                    poses.push({
                        poseId: animation.poseIds[previousIndex], 
                        animationProgress: 1 - progress, 
                    });    
                }
            });
        }
        
        if (currentPoseId != null) {
            poses.unshift({
                poseId: currentPoseId, 
                animationProgress: progress, 
            });
        }
        if (graphicalEntity.previousPoseId != null && progress < 1) {
            poses.unshift({
                poseId: graphicalEntity.previousPoseId, 
                animationProgress: 1 - progress, 
            });
        }
        drawGraphic(
            c, 
            graphicalEntity.graphic, 
            graphicalEntity.palette, 
            callback, 
            poses, 
        );  
    } else if (entity.entityType == ENTITY_TYPE_SCENERY) {
        const scale = entity.bounds[3];
        c.scale(scale, scale)
        c.fillText(entity.text, 0, 1); 
    } else {
        // assume it's a speech bubble
        const speechBubble = entity as SpeechBubble;
        const s = instructionToName(speechBubble.instruction);
        const width = c.measureText(s).width;
        // draw a speech bubble
        // draw the text
        const r = SPEECH_TEXT_PADDING;
        const iw = width + SPEECH_TEXT_PADDING * 2;
        const ih = SPEECH_TEXT_HEIGHT + SPEECH_TEXT_PADDING * 2;
        const iy = -ih - SPEECH_CALLOUT_HEIGHT - SPEECH_TEXT_PADDING;
        const ix = -width/2 - SPEECH_TEXT_PADDING;
        const alpha = Math.sqrt(Math.abs(1 - (worldAge - speechBubble.spokenAge)/SPEECH_FADE_INTERVAL));
        const scale = (speechBubble.deathAge 
            ? 1 - (worldAge - speechBubble.deathAge)/MAX_DEATH_AGE
            : 1) * SPEECH_TEXT_SCALE;
        c.scale(scale, scale);
        c.globalAlpha = alpha;
        c.beginPath();
        c.moveTo(ix + r, iy);
        c.arcTo(ix + iw, iy, ix + iw, iy + r, r);
        c.arcTo(ix + iw, iy + ih, ix + iw - r, iy + ih, r);
        c.lineTo(SPEECH_CALLOUT_WIDTH/2, iy + ih);
        c.lineTo(0, -SPEECH_TEXT_PADDING)
        c.lineTo(-SPEECH_CALLOUT_WIDTH/2, iy + ih);
        c.arcTo(ix, iy + ih, ix, iy + r, r);
        c.arcTo(ix, iy, ix + r, iy, r);
        c.fillStyle = hslToStyle([speechBubble.hue, 80, 80]);
        c.fill();
        c.strokeStyle = c.fillStyle = '#333'; 
        c.stroke();
        c.fillText(s, 0, -SPEECH_CALLOUT_HEIGHT - SPEECH_TEXT_PADDING * 2);
    }
    c.restore();

}

const updateEntity = (
    entity: Entity, 
    world: World, 
    room: Room, 
    delta: number, 
    sounds: {[_:number]: Sound}, 
) => {
    let removedSelf: boolean | number;
    roomRemoveEntityFromTiles(room, entity);
    const worldAge = world.age;

    if (FLAG_DEBUG_SKIPPED_FRAMES) {
        let entityAge = entity['a'] || 0;
        if (entityAge != 0 && entityAge != worldAge - MAX_DELTA) {
            console.log('somehow skipped # frames', (worldAge - entityAge)/MAX_DELTA);
        }
        entity['a'] = worldAge;    
    }



    const everyEntity = entity as EveryEntity;
    const activeMovableEntity = entity as InstructableEntity;        
    const orientableEntity = entity as OrientableEntity;
    const graphicalEntity = entity as GraphicalEntity;
    const tape = activeMovableEntity.holding && activeMovableEntity.holding[activeMovableEntity.insertionJointId] as Tape;
    const script = tape && tape.script;
    activeMovableEntity.crushedEdges = 0;
    activeMovableEntity.lastCollisions = activeMovableEntity.lastCollisions || [0, 0, 0, 0, 0];
    activeMovableEntity.boundsWithVelocity = activeMovableEntity.boundsWithVelocity || [0, 0, 0, 0];
    activeMovableEntity.instructionsHeard = activeMovableEntity.instructionsHeard || [];
    
    //const canSpeakNow: number | boolean = (worldAge / PLAYBACK_INTERVAL | 0) < ((worldAge + delta)/PLAYBACK_INTERVAL | 0);
    const canSpeakNow = true;
    if (everyEntity.toSpeak && everyEntity.toSpeak.length && canSpeakNow) {
        const instruction = everyEntity.toSpeak.pop();
        if (instruction != null) {
            const utterance = instructionToUtterance(instruction);
            // inform any reachable listeners in the room
            const [rx, ry, roomWidth, roomHeight] = room.bounds;
            // note we reverse the axis so we can easily read this in debug mode
            const tileReachability = array2DCreate(roomHeight, roomWidth, () => 0);
            const uncheckedTiles: [number, number, number][] = [[everyEntity.bounds[0]| 0, Math.max(1, everyEntity.bounds[1] | 0), -1]];
            while (uncheckedTiles.length) {
                const [tx, ty, cost] = uncheckedTiles.pop();
                // note we intentionally don't look at tiles where x or y is 0
                if (tx > 0 && ty > 0 && tx < roomWidth && ty < roomHeight) {
                    const reachability = tileReachability[ty][tx];
                    if (!reachability || cost > reachability) {
                        const tileBounds = [tx, ty, 1, 1] as Rectangle;
                        const blocked = room.tiles[tx][ty].find(e => rectangleOverlap((e as MovableEntity).bounds, tileBounds) > .8 && (e.collisionGroup == COLLISION_GROUP_TERRAIN || e.collisionGroup == COLLISION_GROUP_PUSHABLES));
                        if (blocked) {
                            tileReachability[ty][tx] = blocked.eid;
                        } else {
                            tileReachability[ty][tx] = cost;
                            EDGE_OFFSETS.forEach(([dx, dy]: Vector) => {
                                uncheckedTiles.push([tx + dx, ty + dy, cost-1]);
                            });
                        }
                    }    
                }
            }
    
            let playerHeard: boolean | number;
            room.updatableEntities.forEach(e => {
                const everyEntity = e as EveryEntity;
                let heard: boolean;
                rectangleIterateBounds(everyEntity.bounds, room.bounds, (x, y) => heard = heard || tileReachability[y][x] < 0 || tileReachability[y][x] == e.eid);
                if (heard) {
                    playerHeard = playerHeard || e.entityType == ENTITY_TYPE_PLAYER;
                    if (everyEntity.instructionsHeard && e != entity && (!everyEntity.hue || everyEntity.hue == (tape && tape.hue))) {
                        everyEntity.instructionsHeard.unshift(instruction);
                    }
                }            
            });
            if (playerHeard) {
                // create a speech bubble
                const hue = tape && tape.hue;
                const speechBubble: SpeechBubble = {
                    collisionGroup: COLLISION_GROUP_SPEECH_BUBBLES, 
                    collisionMask: 0, 
                    entityType: ENTITY_TYPE_SPEECH_BUBBLE, 
                    hue, 
                    eid: world.idFactory(),
                    bounds: [...everyEntity.bounds] as Rectangle,  
                    spokenAge: worldAge, 
                    instruction, 
                    gravityMultiplier: 0, 
                    velocity: [0, 0], 
                };
                roomAddEntity(room, speechBubble);
                utterance();
                room.soundWaves.push({
                    hue, 
                    tileReachability, 
                    timeSaid: worldAge, 
                });
            }
        }
    }

    graphicalEntity.passiveAnimations = graphicalEntity.passiveAnimations || {};
    objectIterate(graphicalEntity.passiveAnimations, (passive, animationId) => {
        const animation = graphicalEntity.graphic.animations[animationId];
        const endTime = passive.animationStartTime + animation.poseDuration * animation.poseIds.length;
        if (endTime < worldAge + delta) {
            if (endTime >= worldAge) {
                passive.notifyComplete(worldAge);
            }
            if (endTime + animation.poseDuration < worldAge + delta) {
                delete graphicalEntity.passiveAnimations[animationId];
            }
        }
    });

    (entity as GrabbingEntity).grabbing = undefined;
    if (activeMovableEntity.velocity) {
        activeMovableEntity.remainingTime = delta;
        axisMap(activeMovableEntity.velocity, room.gravity, ([v]: [number], [g]: [number]) => v + g * activeMovableEntity.gravityMultiplier * delta, activeMovableEntity.velocity);
        activeMovableEntity.velocity = activeMovableEntity.velocity.map(v => Math.min(Math.max(v, -MAX_VELOCITY), MAX_VELOCITY)) as Vector;
    }        
    let [ox, oy, ow, oh] = activeMovableEntity.bounds;

    let groundAge = worldAge - activeMovableEntity.lastCollisions[EDGE_BOTTOM];
    const grabAge = worldAge - activeMovableEntity.lastCollisions[EDGE_GRAB];
    const attachedAge = Math.min(groundAge, grabAge);
    let carrierVelocity = [0, 0];
    let carrierOrientation: Orientation = orientableEntity.entityOrientation;
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
                carrierOrientation = orientableCarrier.entityOrientation != null 
                    && orientableCarrier.orientationStartTime > orientableEntity.orientationStartTime
                    ? orientableCarrier.entityOrientation 
                    : carrierOrientation;    
            }
        }
        activeMovableEntity.carryingPreviously = activeMovableEntity.carrying || [];
        activeMovableEntity.carrying = [];            
    }
    let orientation: Orientation = carrierOrientation;
    
    if (activeMovableEntity.activeInputs && !everyEntity.deathAge) {
        const inputs = activeMovableEntity.activeInputs;
        inputs.states = inputs.states || {};
        inputs.reads = inputs.reads || {};
        let jump: number;
        let up: number;
        let down: boolean | number;
        // note CC doesn't like this being undefined (may no longer be true)
        //let animationId: number = ANIMATION_ID_NONE;
        let animationId: number;

        switch(entity.entityType) {
            case ENTITY_TYPE_REPEATER: 
            case ENTITY_TYPE_ROBOT:
            case ENTITY_TYPE_PLATFORM:
            {
                
                if ((entity.nextInstructionTime || 0) <= worldAge) {
                    // do a thing
                    let nextInstructionDelta = 0;
                    let nextScriptIndex = entity.nextScriptIndex;
                    inputs.states = {};
                    let instructionId;
                    if(entity.entityType == ENTITY_TYPE_ROBOT && script && nextScriptIndex < script.length) {
                        instructionId = script[nextScriptIndex++]
                    } else {
                        instructionId = everyEntity.instructionsHeard && everyEntity.instructionsHeard.pop();
                    } 
                    if (instructionId == null) {
                        instructionId = everyEntity.rememberedInstruction;             
                    }
                    if (instructionId >= 0) {
                        let direction: Edge;
                        // everyone can count and do nothing
                        if (instructionId < 11 || everyEntity.capabilities.indexOf(instructionId) >= 0) {
                            const instruction = INSTRUCTIONS[instructionId];
                            everyEntity.rememberedInstruction = instruction.remember 
                                ? instructionId
                                : -1;
                            switch (instructionId) {
                                case INSTRUCTION_ID_RIGHT:
                                    direction = EDGE_RIGHT;
                                case INSTRUCTION_ID_UP: 
                                    if (!direction) {
                                        direction = EDGE_TOP;
                                    }
                                case INSTRUCTION_ID_DOWN:
                                    if (!direction) {
                                        direction = EDGE_BOTTOM;
                                    }
                                case INSTRUCTION_ID_LEFT:
                                    if (!direction) {
                                        direction = EDGE_LEFT;
                                    }
                                    {
                                        const pos = entity.bounds[direction%2];
                                        const dim = Math.min(1, entity.bounds[direction%2 + 2]);
                                        const delta = EDGE_OFFSETS[direction][direction%2];
                                        const targetPos = ((pos + dim/2) | 0) + delta + (1 - dim)/2;
                                        const targetDelta = Math.abs(targetPos - pos) + setInput(entity, instructionId, worldAge) - 1;
                                        // adjust the base speed so we exactly hit the point
                                        const milliseconds = targetDelta / entity.baseVelocity;
                                        const steps = (milliseconds / MAX_DELTA | 0) + 1;
                                        //nextInstructionDelta = Math.max(0, targetDelta/entity.baseVelocity - MAX_DELTA);
                                        nextInstructionDelta = steps * MAX_DELTA;
                                        entity.adjustedBaseVelocity = targetDelta / nextInstructionDelta;
                                    }
                                    break;
                                default:
                                    if (instructionId < 10) {
                                        // assume it's a count!
                                        entity.instructionRepeat = (entity.instructionRepeat || 0) * 10 + instructionId;
                                    } else {
                                        // attempt to do it as is
                                        nextInstructionDelta = setInput(entity, instructionId, worldAge) * (INSTRUCTIONS[instructionId].automatedDuration || 1);
                                    }
                                    break;
                            }    
                        } else {
                            entity.instructionRepeat = 0;
                        }
                        entity.nextInstructionTime = worldAge + nextInstructionDelta;
                        entity.nextScriptIndex = nextScriptIndex;
                    }
                }
                break;
            }
            case ENTITY_TYPE_PRESSURE_PLATE: 
                {
                    const playing = (entity.lastCollisions[entity.pressureEdge] > worldAge - MAX_DELTA) || (everyEntity.playing && (entity.nextScriptIndex || 0) < script.length);
                    if (!entity.playing && playing) {
                        // reset
                        entity.nextScriptIndex = 0;
                    }
                    inputs.states[INSTRUCTION_ID_PLAY] = playing
                        ? worldAge 
                        : 0;
                }
                break;
            // help is disabled
            // case ENTITY_TYPE_PLAYER: 
            
            //     if (readInput(entity, INSTRUCTION_ID_HELP, worldAge)) {
            //         entity.commandsVisible = !entity.commandsVisible;
            //     }
            //     break;
        }    

        const attached = attachedAge <= MAX_JUMP_AGE;
        const left = readInput(entity, INSTRUCTION_ID_LEFT, worldAge);
        const right = readInput(entity, INSTRUCTION_ID_RIGHT, worldAge);
        const mass = entityCalculateMass(activeMovableEntity) || 1;
        const canJump = mass < activeMovableEntity.mass * 2;
        const baseVelocity = activeMovableEntity.adjustedBaseVelocity || activeMovableEntity.baseVelocity;

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
        const shooting = readInput(entity, INSTRUCTION_ID_SHOOT, worldAge);
        const saving = readInput(entity, INSTRUCTION_ID_SAVE, worldAge);
        const asspulling = readInput(entity, INSTRUCTION_ID_ASSPULL, worldAge);

        recording = readInput(entity, INSTRUCTION_ID_RECORD, worldAge);
        rewinding = readInput(entity, INSTRUCTION_ID_REWIND, worldAge);
        fastForwarding = readInput(entity, INSTRUCTION_ID_FAST_FORWARD, worldAge);

        if (saving) {
            entityAddPassiveAnimation(
                entity, 
                INSTRUCTION_ID_SAVE, 
                sounds, 
                worldAge, 
                () => world.rooms[world.currentRoom[0]][world.currentRoom[1]] == room, 
                () => {
                    // write every persistent entity in the world to local storage
                    world.rooms.forEach((rooms, x) => 
                        rooms.forEach((room, y) => 
                            room && room.updatableEntities.forEach(e => {
                                if (e.persistentId) {
                                    const bounds = e.entityType == ENTITY_TYPE_PLAYER  
                                        ? [entity.bounds[0], entity.bounds[1], e.bounds[2], e.bounds[3]] as Rectangle
                                        : (e as MovableEntity).bounds;
                                    const cleanEntity = {
                                        ...e, 
                                        bounds, 
                                        carryingPreviously: [], 
                                        carrying: [], 
                                        carrier: undefined, 
                                        grabbing: undefined, 
                                        holding: {},  
                                        activeInputs: {
                                            states: {}, 
                                            reads: {}, 
                                        }, 
                                        orientationStartTime: 0, 
                                    };
                                    const roomAndEntity: RoomAndEntity = [x, y, cleanEntity];
                                    localStorage.setItem(e.persistentId as any, JSON.stringify(roomAndEntity));
                                }
                            })
                        )
                    );
                    localStorage.setItem(0 as any, worldAge as any);
                    world.lastSaved = worldAge;
                }
            );
        }

        if (script) {
            if (rewinding) {
                animationId = ANIMATION_ID_PRESSING_BUTTON;
                if (doRepeatingInput(entity, INSTRUCTION_ID_REWIND, worldAge, delta, REWIND_INTERVAL)) {
                    if (activeMovableEntity.nextScriptIndex > 0) {
                        activeMovableEntity.nextScriptIndex--;
                        entityPlaySound(entity, INSTRUCTION_ID_REWIND, sounds);
                    } else if (setRead(entity, INSTRUCTION_ID_REWIND, worldAge)) {
                        entityPlaySound(entity, INSTRUCTION_ID_STOP, sounds);
                    }    
                }
            } else if (fastForwarding) {
                animationId = ANIMATION_ID_PRESSING_BUTTON;
                if (doRepeatingInput(entity, INSTRUCTION_ID_FAST_FORWARD, worldAge, delta, REWIND_INTERVAL)) {
                    if (activeMovableEntity.nextScriptIndex < script.length) {
                        activeMovableEntity.nextScriptIndex++;
                        entityPlaySound(entity, INSTRUCTION_ID_FAST_FORWARD, sounds);    
                    } else if (setRead(entity, INSTRUCTION_ID_FAST_FORWARD, worldAge)) {
                        entityPlaySound(entity, INSTRUCTION_ID_STOP, sounds);
                    }    
                }
            } else if (recording) {
                if (everyEntity.nextScriptIndex < script.length || !everyEntity.recording) {
                    animationId = ANIMATION_ID_PRESSING_BUTTON;
                    if (!everyEntity.recording) {
                        if (!everyEntity.playbackStartTime) {
                            everyEntity.playbackStartTime = worldAge;
                        }
                        if (everyEntity.nextScriptIndex >= script.length) {
                            everyEntity.nextScriptIndex = 0;
                        }
                        room.recorder = everyEntity;
                    }
                    everyEntity.recording = 1;    
                } else if (setRead(entity, INSTRUCTION_ID_RECORD, worldAge)) {
                    entityPlaySound(entity, INSTRUCTION_ID_STOP, sounds);
                }
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

        if (jump && attached && canJump) {
            activeMovableEntity.velocity[1] = -JUMP_VELOCITY;
            activeMovableEntity.lastCollisions[EDGE_BOTTOM] = 0;
            activeMovableEntity.lastCollisions[EDGE_GRAB] = 0;
            entityPlaySound(entity, INSTRUCTION_ID_JUMP, sounds); 
            groundAge = MAX_DELTA+1;
        }
        if (up && (grabAge <= delta || !everyEntity.mass)) {
            activeMovableEntity.velocity[1] = everyEntity.mass ? -CLIMB_VELOCITY : -baseVelocity;
            activeMovableEntity.lastCollisions[EDGE_GRAB] = 0;
            groundAge = MAX_DELTA+1;
        }
        if (!everyEntity.mass) {
            if (down) {
                activeMovableEntity.velocity[1] = baseVelocity;
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
                    axisMap(activeMovableEntity.bounds, held.bounds, ([p1, l1], [_, l2], i) => p1 + l1 * everyEntity.entityOrientation * (1-i) + (l1 * i - l2)/2, held.bounds);
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
                    activeMovableEntity.nextScriptIndex = 0;
                    delete activeMovableEntity.holding[activeMovableEntity.handJointId];    
                }
            );
        }
        if (ejecting && activeMovableEntity.holding) {
            const inserted = activeMovableEntity.holding[activeMovableEntity.insertionJointId];
            if (inserted) {
                inserted.velocity = [
                    orientation != null 
                        ? (orientation - .5)*EJECT_VELOCITY
                        : 0, 
                        -EJECT_VELOCITY
                    ];
                delete activeMovableEntity.holding[activeMovableEntity.insertionJointId];
                // wipe any outstanding instructions
                activeMovableEntity.instructionsHeard = [];
                axisMap(activeMovableEntity.bounds, inserted.bounds, ([p1, l1], [_, l2]) => p1 + (l1 - l2)/2, inserted.bounds);
                (inserted as any as OrientableEntity).entityOrientation = orientableEntity.entityOrientation;
                roomAddEntity(room, inserted as Entity);
                entityPlaySound(entity, INSTRUCTION_ID_EJECT, sounds);
            }
        }
        if (asspulling) {
            entityAddPassiveAnimation(
                entity, 
                INSTRUCTION_ID_ASSPULL, 
                sounds, 
                worldAge, 
                () => !everyEntity.holding[everyEntity.handJointId] && everyEntity.asspull, 
                () => everyEntity.holding[everyEntity.handJointId] = everyEntity.asspull(ox, oy, world.idFactory)[0] as MovableEntity,
            )
        }    
        if (throwing) {
            entityAddPassiveAnimation(
                entity, 
                INSTRUCTION_ID_THROW, 
                sounds, 
                worldAge, 
                () => activeMovableEntity.holding && activeMovableEntity.holding[activeMovableEntity.handJointId], 
                (toThrow: MovableEntity) => {
                    toThrow.velocity = [((orientation * 2) - 1)*THROW_POWER, -THROW_POWER/4];
                    delete activeMovableEntity.holding[activeMovableEntity.handJointId];
                    axisMap(activeMovableEntity.bounds, toThrow.bounds, ([p1, l1], [_, l2]) => p1 + (l1 - l2)/2, toThrow.bounds);
                    (toThrow as any as OrientableEntity).entityOrientation = orientableEntity.entityOrientation;
                    roomAddEntity(room, toThrow as Entity);
                }
            );
        }
        if (everyEntity.holding) {
            const gun = everyEntity.holding[everyEntity.handJointId] as Gun;
            if (gun && gun.entityType == ENTITY_TYPE_GUN) {
                if (shooting && gun.lastFired < worldAge - gun.fireRate) {
                    // add a bullet
                    const bullet: Bullet = {
                        entityType: ENTITY_TYPE_BULLET, 
                        graphic: bulletGraphic, 
                        palette: bulletPalette, 
                        bounds: [ox + (everyEntity.entityOrientation ? ow : -BULLET_WIDTH), oy + oh/2 - BULLET_HEIGHT * Math.random(), BULLET_WIDTH, BULLET_HEIGHT], 
                        collisionGroup: COLLISION_GROUP_BULLETS, 
                        collisionMask: COLLISION_MASK_BULLETS, 
                        gravityMultiplier: 0, 
                        eid: world.idFactory(), 
                        lastCollisions: [0, 0, 0, 0, 0], 
                        mass: .1, 
                        boundsWithVelocity: [0, 0, 0, 0], 
                        velocity: [(everyEntity.entityOrientation * 2 - 1) * MAX_VELOCITY, 0], 
                        restitution: .4, 
                        entityOrientation: everyEntity.entityOrientation,
                        orientationStartTime: 0, 
                    };
                    roomAddEntity(room, bullet);
                    gun.lastFired = worldAge;
                    entityPlaySound(entity, INSTRUCTION_ID_SHOOT, sounds);
                }
                if (gun.lastFired > worldAge - gun.fireRate) {
                    animationId = ANIMATION_ID_SHOOTING;
                }
            }
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
                    if ((e.collisionMask >> (everyEntity.collisionGroup * 4)) & (everyEntity.collisionMask >> (e.collisionGroup * 4)) & 0xF) {
                        blockCount ++;
                    }
                    const [bx, by, bw] = (e as MovableEntity).bounds;
                    if (
                        (Math.abs(bx + bw * ((orientation + 1)%2) - grabX) < GRAB_DIMENSION/2 || e.collisionGroup == COLLISION_GROUP_BACKGROUNDED) 
                        && Math.abs(by - grabY) < GRAB_DIMENSION
                    ) {
                        grabbed = e as SpatialEntity;
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

        if (activeMovableEntity.airTurn || attached) {
            let targetVelocity = (right - left) * baseVelocity + carrierVelocity[0];
            activeMovableEntity.velocity[0] = targetVelocity;
            if (left) {
                if ((attached || !activeMovableEntity.mass) && !grabbed) {
                    animationId = ANIMATION_ID_WALKING;       
                    if (doRepeatingInput(entity, INSTRUCTION_ID_LEFT, worldAge, delta)) {
                        entityPlaySound(entity, INSTRUCTION_ID_LEFT, sounds);
                    }
                }
                orientation = ORIENTATION_LEFT;                    
            } else if (right) {
                orientation = ORIENTATION_RIGHT;
                if ((attached || !activeMovableEntity.mass) && !grabbed) {
                    animationId = ANIMATION_ID_WALKING;
                    if (doRepeatingInput(entity, INSTRUCTION_ID_RIGHT, worldAge, delta)) {
                        entityPlaySound(entity, INSTRUCTION_ID_RIGHT, sounds);
                    }
                }
            }    
        }

        const activeGraphicalEntity = entity as ActiveGraphicalEntity;
        activeGraphicalEntity.targetAnimationId = animationId;
    } else if (activeMovableEntity.velocity) { 
        if (entity.entityType == ENTITY_TYPE_SPEECH_BUBBLE) {
            // find anyone recording and head toward that
            entity.velocity = [0, 0];
            const recorder = room.recorder as EveryEntity;
            if (recorder && recorder.recording) {
                const [dx, dy] = axisMap(room.recorder.bounds, entity.bounds, ([rp, rl], [ep, el]) => rp - ep + (rl - el)/2);
                const a = Math.atan2(dy, dx);
                entity.velocity = [
                    Math.cos(a) * Math.min(.01, Math.abs(dx)/MAX_DELTA), 
                    Math.sin(a) * Math.min(.01, Math.abs(dy)/MAX_DELTA)
                ];    
            }
            if (entity.spokenAge + SPEECH_FADE_INTERVAL < worldAge) {
                roomRemoveEntity(room, entity);
                removedSelf = 1;
            } 
        }
        if ((groundAge <= MAX_DELTA || activeMovableEntity.airTurn) && activeMovableEntity.velocity[1] > 0) {
            activeMovableEntity.velocity[0] = carrierVelocity[0];
        }
    }

    if (orientableEntity.entityOrientation != orientation && orientation != null && orientableEntity.entityOrientation != null) {
        orientableEntity.entityOrientation = orientation;
        orientableEntity.orientationStartTime = worldAge;
    }  

    if (activeMovableEntity.playing && !fastForwarding && !rewinding) {
        // play the tape
        const diff = worldAge - activeMovableEntity.playbackStartTime;
        const index = activeMovableEntity.nextScriptIndex || 0;
        if ((diff / PLAYBACK_INTERVAL | 0) < ((diff + delta)/PLAYBACK_INTERVAL | 0)) {
            if (index < script.length) {
                const instruction = script[index];
                entityPlaySound(entity, instruction, sounds, worldAge);
                activeMovableEntity.nextScriptIndex = index + 1;
            } else {
                if (everyEntity.autoRewind) {
                    // wrap around
                    everyEntity.nextScriptIndex = 0;
                } else {
                    everyEntity.playbackStartTime = 0;
                    if (setRead(entity, INSTRUCTION_ID_PLAY, worldAge)) {
                        entityPlaySound(entity, INSTRUCTION_ID_STOP, sounds);
                    }    
                }
            }
        }
    }

    // sensors
    roomIterateEntities(room, everyEntity.bounds, e => {
        if (FLAG_CHECK_CIRCULAR_CARRYING && e == entity) {
            console.log('overlapping self!!!');
        } else if (pickingUp) {
            const check = () => e.collisionGroup == COLLISION_GROUP_ITEMS && activeMovableEntity.holding && !activeMovableEntity.holding[activeMovableEntity.handJointId];
            if (check()) {
                entityAddPassiveAnimation(
                    entity, 
                    INSTRUCTION_ID_PICK_UP, 
                    sounds, 
                    worldAge, 
                    check, 
                    () => {
                        (e as EveryEntity).entityOrientation = ORIENTATION_LEFT;
                        roomRemoveEntity(room, e);
                        activeMovableEntity.holding[activeMovableEntity.handJointId] = e as MovableEntity;    
                    }
                );
                pickingUp = 0;    
            }
        }
        if (everyEntity.entityType == ENTITY_TYPE_BULLET) {
            roomRemoveEntity(room, entity);
            removedSelf = 1;
            // can will kill the thing we hit?
            applyCollisionBehaviour(e, entity, worldAge, 0, EDGE_LEFT);
        } 
        if (everyEntity.recording && e.entityType == ENTITY_TYPE_SPEECH_BUBBLE) {
            // save the thing
            if (everyEntity.nextScriptIndex < script.length) {
                script[everyEntity.nextScriptIndex++] = e.instruction;
                e.deathAge = worldAge;
                e.velocity = [0, 0];
                entityPlaySound(entity, INSTRUCTION_ID_RECORD, sounds);
            }
        }
    });

    if (everyEntity.deathAge) {
        everyEntity.targetAnimationId = ANIMATION_ID_DEATH;
    }

    if( !removedSelf ) {
        roomAddEntityToTiles(room, entity);    
    }
}

const applyCollisionBehaviour = (entity: Entity, collidedWith: Entity, worldAge: number, dv: number, onEdge: Edge) => {
    const movableEntity = entity as MovableEntity;
    const immovableImpact = movableEntity.mass && (!(collidedWith as MovableEntity).mass || movableEntity.mass < (collidedWith as MovableEntity).mass);
    let crushed: number;
    if (immovableImpact) {
        movableEntity.crushedEdges = movableEntity.crushedEdges | (1 << onEdge);
        crushed = movableEntity.crushedEdges >> ((onEdge + 2)%4) & 1;
    }

    if (collidedWith.entityType == ENTITY_TYPE_LETHAL || collidedWith.entityType == ENTITY_TYPE_BULLET && ((1 << entity.collisionGroup) & BULLET_MASK) || crushed) {
        // die comically
        movableEntity.velocity = [0, -MAX_VELOCITY];
        movableEntity.gravityMultiplier = 1;
        (entity as MortalEntity).deathAge = worldAge;        
    } else if (entity.entityType == ENTITY_TYPE_BULLET) {
        // die immediately
        (entity as MortalEntity).deathAge = worldAge - MAX_DEATH_AGE;        
    } else {
        return 1;
    }
}