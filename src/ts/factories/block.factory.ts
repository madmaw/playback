const blockFactoryFactory = (hue: number, saturationMidpoint: number = 30, lightnessMidpoint: number = 60) => {
    const palette: HSL[] = [
        [hue, saturationMidpoint, lightnessMidpoint + 9], 
        [hue, saturationMidpoint - 9, lightnessMidpoint],
        [hue, saturationMidpoint, lightnessMidpoint - 9],    
    ];
    return (x: number, y: number, id: IdFactory) => {
        const block: Block = {
            id: id(),
            graphic: blockGraphic, 
            palette, 
            entityType: ENTITY_TYPE_BLOCK, 
            collisionGroup: COLLISION_GROUP_TERRAIN, 
            collisionMask: COLLISION_MASK_TERRAIN, 
            bounds: [x, y, 1, 1], 
        }
        return [block];
    }
};

