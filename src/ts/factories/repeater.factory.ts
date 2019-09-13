const repeaterFactoryFactory = (hue: number) => {
    const palette: HSL[] = [
        [hue, 30, 60],
        [hue, 40, 50],
        [0, 0, 30], 
        [hue, 30, 30], 
        [0, 0, 99],     
    ];
    return (x: number, y: number, id: IdFactory) => { 
        const repeater: Repeater = {
            graphic: repeaterGraphic, 
            autoRewind: 1, 
            baseVelocity: 0, 
            bounds: rectangleCenterBounds(x, y, 1, .75), 
            collisionGroup: COLLISION_GROUP_BACKGROUNDED, 
            collisionMask: COLLISION_MASK_BACKGROUNDED, 
            gravityMultiplier: 0, 
            holding: {},
            eid: id(), 
            activeInputs: {
            }, 
            entityType: ENTITY_TYPE_REPEATER, 
            insertionJointId: REPEATER_GRAPHIC_JOINT_ID_TAPE_DECK, 
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