const repeaterFactoryFactory = (hue: number) => {
    const palette: HSL[] = [
        [hue, 30, 70], 
        [hue, 20, 60],
        [hue, 30, 50],
        [0, 0, 30], 
        [hue, 30, 30], 
        [0, 0, 100],     
    ];
    return (x: number, y: number, id: IdFactory) => { 
        const repeater: Repeater = {
            graphic: repeaterGraphic, 
            autoRewind: 1, 
            baseVelocity: 0, 
            bounds: rectangleCenterBounds(x, y, 1, .75), 
            boundsWithVelocity: [0, 0, 0, 0], 
            collisionGroup: COLLISION_GROUP_BACKGROUNDED, 
            collisionMask: COLLISION_MASK_BACKGROUNDED, 
            gravityMultiplier: 0, 
            holding: {},
            id: id(), 
            activeInputs: {
                reads: {}, 
                states: {}, 
            }, 
            entityType: ENTITY_TYPE_REPEATER, 
            lastCollisions: [0, 0, 0, 0, 0],
            handJointId: 0, 
            insertionJointId: REPEATER_GRAPHIC_JOINT_ID_TAPE_DECK, 
            mass: 0, 
            palette,
            velocity: [0, 0], 
            playing: 1, 
            playbackStartTime: 0, 
            toSpeak: [],         
            hue, 
            // start playing immediately
            instructionsHeard: [INSTRUCTION_ID_PLAY],
            capabilities: [INSTRUCTION_ID_PLAY, INSTRUCTION_ID_REWIND, INSTRUCTION_ID_FAST_FORWARD, INSTRUCTION_ID_INSERT, INSTRUCTION_ID_EJECT], 
        };
        return [repeater];        
    }
};