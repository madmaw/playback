const robotFactoryFactory = (script?: number[], tapeColor?: HSL) => {
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
            orientation: 0, 
            orientationStartTime: 0, 
            inputs: {
                reads: {}, 
                states: {}, 
            }, 
            holding: new Map<number, MovableEntity>([[ROBOT_GRAPHIC_JOINT_ID_TAPE_DECK, robotTape && robotTape[0]]]),  
            handJointId: ROBOT_GRAPHIC_JOINT_ID_LEFT_ARM, 
            insertionJointId: ROBOT_GRAPHIC_JOINT_ID_TAPE_DECK, 
            instructionsHeard: [],             
            strong: 1, 
        };
        return [robot];
    }
};