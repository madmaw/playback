const mainframeFactoryFactory = () => {
    return (x: number, y: number, id: IdFactory) => {
        const mainframe: Robot = {
            entityType: ENTITY_TYPE_ROBOT, 
            graphic: mainframeGraphic, 
            palette: robotPalette, 
            bounds: rectangleCenterBounds(x, y, 1, 2),
            // only collide with robots on the bottom or top
            // don't collide with items at all
            collisionMask: COLLISION_MASK_ENEMIES, 
            collisionGroup: COLLISION_GROUP_ENEMIES, 
            gravityMultiplier: 0, 
            id: id(), 
            lastCollisions: [0, 0, 0, 0, 0],
            mass: 0, 
            nextScriptInstructionTime: 0, 
            nextScriptIndex: 0, 
            velocity: [0, 0], 
            baseVelocity: BASE_VELOCITY/3, 
            boundsWithVelocity: [0, 0, 0, 0], 
            orientation: 0, 
            orientationStartTime: 0, 
            activeInputs: {
                reads: {}, 
                states: {}, 
            }, 
            holding: {},  
            handJointId: 0, 
            instructionsHeard: [],             
            capabilities: [
                INSTRUCTION_ID_DO_NOTHING, 
                INSTRUCTION_ID_SAVE,
            ], 
        };
        return [mainframe];        
    };
}