const blockFactoryFactory = (hue: number, saturationMidpoint: number = 30, lightnessMidpoint: number = 30, width = 1, height = 1) => {
    const palette: HSL[] = [
        [hue, saturationMidpoint, lightnessMidpoint + 9], 
        [hue, saturationMidpoint - 9, lightnessMidpoint],
        [hue, saturationMidpoint, lightnessMidpoint - 9],    
    ];
    const blockGraphic = blockGraphicFactory(32 * width, 32 * height);
    return (x: number, y: number, id: IdFactory) => {
        const block: Block = {
            id: id(),
            graphic: blockGraphic, 
            palette, 
            entityType: ENTITY_TYPE_BLOCK, 
            collisionGroup: COLLISION_GROUP_TERRAIN, 
            collisionMask: COLLISION_MASK_TERRAIN, 
            bounds: [x, y, width, height], 
        }
        return [block];
    }
};

