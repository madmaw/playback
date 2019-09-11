const platformFactoryFactory = (w: number, h: number, direction: Edge, hue: number) => {
    const palette: HSL[] = [
        [hue, 30, 60], 
        [hue, 20, 50],
        [hue, 30, 40],
        [hue, 40, 80], 
        [hue, 30, 30], 
    ];
    const capabilities: number[] = direction % 2
        ? [INSTRUCTION_ID_UP, INSTRUCTION_ID_DOWN]
        : [INSTRUCTION_ID_LEFT, INSTRUCTION_ID_RIGHT];
    return (x: number, y: number, id: IdFactory) => {
        const graphic = platformGraphicFactory(w * 32, h * 32, direction);
        const platform: Platform = {
            entityType: ENTITY_TYPE_PLATFORM, 
            graphic, 
            palette, 
            hue, 
            bounds: [x, y, w, h],
            collisionMask: COLLISION_MASK_TERRAIN, 
            collisionGroup: COLLISION_GROUP_TERRAIN, 
            gravityMultiplier: 0, 
            id: id(), 
            lastCollisions: [0, 0, 0, 0, 0],
            mass: 0, 
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