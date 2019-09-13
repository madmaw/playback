const blockFactoryFactory = ([hue, baseSaturation, baseLighting]: HSL, rounding = 4, width = 1, height = 1) => {
    const blockGraphic = blockGraphicFactory(32 * width, 32 * height, rounding);
    return (x: number, y: number, id: IdFactory) => {
        const lighting = FLAG_RANDOMIZE_BLOCK_COLORS 
            ? baseLighting + Math.random() * 5 - y 
            : baseLighting;
        const saturation = FLAG_RANDOMIZE_BLOCK_COLORS 
            ? baseSaturation - Math.random() * 5 + y 
            : baseSaturation;
        const palette: HSL[] = [            
            [hue, saturation, lighting + 9], 
            [hue, saturation - 9, lighting],
            [hue, saturation, lighting - 9],    
        ];    
        const block: Block = {
            eid: id(),
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

