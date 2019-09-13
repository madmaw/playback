const platformFactoryFactory = (w: number, h: number, direction: Edge, hue: number) => {
    const capabilities: number[] = direction % 2
        ? [INSTRUCTION_ID_UP, INSTRUCTION_ID_DOWN]
        : [INSTRUCTION_ID_LEFT, INSTRUCTION_ID_RIGHT];
    return (x: number, y: number, id: IdFactory, pid?: number) => {
        const lightingBoost = pid ? 30 : -30;
        const palette: HSL[] = [
            [hue, 60, 60], 
            [hue, 40, 50],
            [hue, 60, 40],
            [hue, 40, 50 - lightingBoost], 
            [hue, 40, 50 + lightingBoost], 
        ];    
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
            eid: id(), 
            velocity: [0, 0], 
            // can't be too fast or we outpace gravity and downward room transitions don't work while riding platforms
            baseVelocity: .0028, 
            activeInputs: {
            }, 
            holding: {},  
            capabilities: [...capabilities, INSTRUCTION_ID_DO_NOTHING], 
            airTurn: 1, 
            direction, 
        };
        return [platform];        
    };
};