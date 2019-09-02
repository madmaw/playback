const BLOCK_GRAPHIC_PALETTE_INDEX_LIGHT = 0;
const BLOCK_GRAPHIC_PALETTE_INDEX_MEDIUM = 1;
const BLOCK_GRAPHIC_PALETTE_INDEX_DARK = 2;

const BLOCK_GRAPHIC_IMAGE_INDEX_BODY = 0;

const BLOCK_GRAPHIC_JOINT_ID_BODY = 0;

const BLOCK_ROUNDING = 4;

const blockPaletteCyan: HSL[] = [
    [210, 30, 60], 
    [210, 20, 50],
    [210, 30, 40],
];

const blockPaletteRed: HSL[] = [
    [0, 30, 60], 
    [0, 20, 50],
    [0, 30, 40],    
]

const blockGraphic: Graphic = {
    width: 32, 
    height: 32, 
    images: [
        // block
        [   
            [-16, -16, 32, 32, BLOCK_GRAPHIC_PALETTE_INDEX_MEDIUM, BLOCK_ROUNDING],
            [-16, -16, 30, 30, BLOCK_GRAPHIC_PALETTE_INDEX_LIGHT, BLOCK_ROUNDING], 
            [-14, -14, 30, 30, BLOCK_GRAPHIC_PALETTE_INDEX_DARK, BLOCK_ROUNDING], 
            [-14, -14, 28, 28, BLOCK_GRAPHIC_PALETTE_INDEX_MEDIUM, BLOCK_ROUNDING],
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