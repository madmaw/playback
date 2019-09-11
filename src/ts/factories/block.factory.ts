const blockFactoryFactory = ([hue, baseSaturation, baseLighting]: HSL, rounding = 4, width = 1, height = 1) => {
    const palette: HSL[] = [
        [hue, baseSaturation, baseLighting + 9], 
        [hue, baseSaturation - 9, baseLighting],
        [hue, baseSaturation, baseLighting - 9],    
    ];
    const blockGraphic = blockGraphicFactory(32 * width, 32 * height, rounding);
    return (x: number, y: number, id: IdFactory) => {
        const block: Block = {
            id: id(),
            graphic: blockGraphic, 
            palette, 
            entityType: ENTITY_TYPE_BLOCK, 
            collisionGroup: COLLISION_GROUP_TERRAIN, 
            collisionMask: COLLISION_MASK_TERRAIN, 
            bounds: [x + (1 - width)/2, y, width, height], 
        }
        return [block];
    }
};

