const platformFactoryFactory = (w: number, h: number, direction: Edge) => {
    const capabilities: number[] = direction % 2
        ? [INSTRUCTION_ID_UP, INSTRUCTION_ID_DOWN]
        : [INSTRUCTION_ID_LEFT, INSTRUCTION_ID_RIGHT];
    return (x: number, y: number, id: IdFactory) => {
        const blockGraphic = blockGraphicFactory(w * 32, h * 32);
        const platform: Platform = {
            entityType: ENTITY_TYPE_PLATFORM, 
            graphic: blockGraphic, 
            palette: robotPalette, 
            bounds: [x, y, w, h],
            collisionMask: COLLISION_MASK_TERRAIN, 
            collisionGroup: COLLISION_GROUP_TERRAIN, 
            gravityMultiplier: 0, 
            id: id(), 
            lastCollisions: [0, 0, 0, 0, 0],
            mass: 0, 
            nextScriptInstructionTime: 0, 
            nextScriptIndex: 0, 
            velocity: [0, 0], 
            baseVelocity: BASE_VELOCITY/2, 
            boundsWithVelocity: [0, 0, 0, 0], 
            activeInputs: {
                reads: {}, 
                states: {}, 
            }, 
            holding: {},  
            handJointId: 0, 
            instructionsHeard: [],      
            capabilities: [...capabilities, INSTRUCTION_ID_DO_NOTHING], 
            airTurn: 1, 
            direction, 
            home: [x, y], 
        };
        return [platform];        
    };
};