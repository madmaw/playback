const GUN_GRAPHIC_PALETTE_INDEX_BODY = 0;
const GUN_GRAPHIC_PALETTE_INDEX_GRIP = 1;
const GUN_GRAPHIC_IMAGE_INDEX_BODY = 0;

const gunGraphic: Graphic = {
    imageryWidth: 24, 
    imageryHeight: 10, 
    imagery: [
        // block
        [   
            [-2, 0, 5, 8, GUN_GRAPHIC_PALETTE_INDEX_GRIP], 
            [7, 2, 5, 8, GUN_GRAPHIC_PALETTE_INDEX_GRIP], 
            [-12, 0, 4, 4, GUN_GRAPHIC_PALETTE_INDEX_BODY],
            [-12, 1, 22, 2, GUN_GRAPHIC_PALETTE_INDEX_BODY], 
            [-5, 0, 15, 4, GUN_GRAPHIC_PALETTE_INDEX_BODY], 
        ], 
    ], 
    joints: [{
        imageIndex: GUN_GRAPHIC_IMAGE_INDEX_BODY, 
    }]
}
