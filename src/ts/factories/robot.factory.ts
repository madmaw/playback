const robotFactoryFactory = (orientation: Orientation, script?: number[], tapeColor?: HSL) => {
    const tapeFactory= script && tapeFactoryFactory(script, tapeColor);

    return (x: number, y: number, id: IdFactory) => {
        const robotTape = tapeFactory && tapeFactory(x, y, id);
        const robot: Robot = {
            entityType: ENTITY_TYPE_ROBOT, 
            graphic: robotGraphic, 
            palette: robotPalette, 
            bounds: rectangleCenterBounds(x, y, .9, .9),
            // only collide with robots on the bottom or top
            // don't collide with items at all
            collisionMask: COLLISION_MASK_ENEMIES, 
            collisionGroup: COLLISION_GROUP_ENEMIES, 
            gravityMultiplier: 1, 
            id: id(), 
            lastCollisions: [0, 0, 0, 0, 0],
            mass: 1, 
            nextScriptInstructionTime: 0, 
            nextScriptIndex: 0, 
            velocity: [0, 0], 
            baseVelocity: BASE_VELOCITY/3, 
            boundsWithVelocity: [0, 0, 0, 0], 
            orientation,
            orientationStartTime: 0, 
            activeInputs: {
                reads: {}, 
                states: {}, 
            }, 
            holding: {[ROBOT_GRAPHIC_JOINT_ID_TAPE_DECK]: robotTape && robotTape[0]},  
            handJointId: ROBOT_GRAPHIC_JOINT_ID_LEFT_ARM, 
            insertionJointId: ROBOT_GRAPHIC_JOINT_ID_TAPE_DECK, 
            instructionsHeard: [],             
            strong: 1, 
            capabilities: [
                INSTRUCTION_ID_COUNT_0,
                INSTRUCTION_ID_COUNT_1,
                INSTRUCTION_ID_COUNT_2,
                INSTRUCTION_ID_COUNT_3,
                INSTRUCTION_ID_COUNT_4,
                INSTRUCTION_ID_COUNT_5,
                INSTRUCTION_ID_COUNT_6,
                INSTRUCTION_ID_COUNT_7,
                INSTRUCTION_ID_COUNT_8,
                INSTRUCTION_ID_COUNT_9,
                INSTRUCTION_ID_DO_NOTHING,
                INSTRUCTION_ID_UP,
                INSTRUCTION_ID_DOWN,
                INSTRUCTION_ID_LEFT,
                INSTRUCTION_ID_RIGHT,
                INSTRUCTION_ID_SAY,
                INSTRUCTION_ID_REWIND,
                INSTRUCTION_ID_FAST_FORWARD,
                INSTRUCTION_ID_PICK_UP,
                INSTRUCTION_ID_DROP,
                INSTRUCTION_ID_EJECT,
                INSTRUCTION_ID_PLAY,
            ], 
        };
        return [robot];
    }
};