const mainframeGraphic: Graphic = {
    imageryWidth: 32, 
    imageryHeight: 48, 
    imagery: [
        // body
        [   
            [-16, -16, 32, 32, BLOCK_GRAPHIC_PALETTE_INDEX_MEDIUM, BLOCK_ROUNDING],
            [-16, -16, 30, 30, BLOCK_GRAPHIC_PALETTE_INDEX_LIGHT, BLOCK_ROUNDING], 
            [-14, -14, 30, 30, BLOCK_GRAPHIC_PALETTE_INDEX_DARK, BLOCK_ROUNDING], 
            [-14, -14, 28, 28, BLOCK_GRAPHIC_PALETTE_INDEX_MEDIUM, BLOCK_ROUNDING],
        ], 
        // tape
        [

        ],
    ], 
    joints: [{
        imageIndex: BLOCK_GRAPHIC_IMAGE_INDEX_BODY, 
        transformations: [{
            transformType: TRANSFORM_TYPE_TRANSLATE, 
            dx: 0, 
            dy: 16, 
        }], 
    }]
};
