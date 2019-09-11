const robotFactoryFactory = (orientation: Orientation, hue: number) => {
    const palette: HSL[] = [
        [hue, 40, 50], 
        [hue, 40, 40], 
        [hue, 40, 20], 
        [hue, 0, 100], 
    ]; 
    return (x: number, y: number, id: IdFactory) => {
        const robot: Robot = {
            entityType: ENTITY_TYPE_ROBOT, 
            graphic: robotGraphic, 
            palette, 
            bounds: rectangleCenterBounds(x, y, .9, .9),
            // only collide with robots on the bottom or top
            // don't collide with items at all
            collisionMask: COLLISION_MASK_ENEMIES, 
            collisionGroup: COLLISION_GROUP_ENEMIES, 
            gravityMultiplier: 1, 
            id: id(), 
            lastCollisions: [0, 0, 0, 0, 0],
            mass: 2, 
            velocity: [0, 0], 
            baseVelocity: BASE_VELOCITY/3, 
            boundsWithVelocity: [0, 0, 0, 0], 
            entityOrientation: orientation,
            orientationStartTime: 0, 
            activeInputs: {
                reads: {}, 
                states: {}, 
            }, 
            holding: {},  
            hue, 
            handJointId: ROBOT_GRAPHIC_JOINT_ID_LEFT_ARM, 
            insertionJointId: ROBOT_GRAPHIC_JOINT_ID_TAPE_DECK, 
            instructionsHeard: [],             
            strong: 1, 
            capabilities: [
                INSTRUCTION_ID_UP,
                INSTRUCTION_ID_DOWN,
                INSTRUCTION_ID_LEFT,
                INSTRUCTION_ID_RIGHT,
                INSTRUCTION_ID_REWIND,
                INSTRUCTION_ID_FAST_FORWARD,
                INSTRUCTION_ID_PICK_UP,
                INSTRUCTION_ID_DROP,
                INSTRUCTION_ID_THROW, 
                INSTRUCTION_ID_EJECT,
                INSTRUCTION_ID_PLAY,
                INSTRUCTION_ID_SHOOT, 
            ], 
        };
        return [robot];
    }
};