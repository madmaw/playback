const BLOCK_GRAPHIC_PALETTE_INDEX_LIGHT = 0;
const BLOCK_GRAPHIC_PALETTE_INDEX_MEDIUM = 1;
const BLOCK_GRAPHIC_PALETTE_INDEX_DARK = 2;

const BLOCK_GRAPHIC_IMAGE_INDEX_BODY = 0;

const BLOCK_GRAPHIC_JOINT_ID_BODY = 0;

const blockGraphic: Graphic = {
    width: 32, 
    height: 32, 
    palette: [
        [210, 30, 60], 
        [210, 20, 50],
        [210, 30, 40],
    ], 
    images: [
        // block
        [   
            [-15, -15, 30, 30, BLOCK_GRAPHIC_PALETTE_INDEX_MEDIUM],
            [-16, -14, 2, 28, BLOCK_GRAPHIC_PALETTE_INDEX_LIGHT], 
            [-14, -16, 28, 2, BLOCK_GRAPHIC_PALETTE_INDEX_LIGHT],
            [14, -14, 3, 28, BLOCK_GRAPHIC_PALETTE_INDEX_DARK], 
            [-14, 14, 28, 2, BLOCK_GRAPHIC_PALETTE_INDEX_DARK], 
        ], 
    ], 
    joints: [{
        id: BLOCK_GRAPHIC_JOINT_ID_BODY, 
        imageIndex: BLOCK_GRAPHIC_IMAGE_INDEX_BODY, 
        transformations: [{
            transformType: TRANSFORM_TYPE_TRANSLATE, 
            dx: 0, 
            dy: 16, 
        }], 
    }]
}