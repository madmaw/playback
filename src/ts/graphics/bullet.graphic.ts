const BULLET_GRAPHIC_PALETTE_INDEX_START = 0;
const BULLET_GRAPHIC_PALETTE_INDEX_MIDDLE = 1;
const BULLET_GRAPHIC_PALETTE_INDEX_END = 2;

const BULLET_GRAPHIC_IMAGE_INDEX_BODY = 0;

const bulletPalette: HSL[] = [
    [60, 99, 80],
    [30, 99, 70],
    [0, 99, 60],
];

const bulletGraphic: Graphic = {
    imageryWidth: 6, 
    imageryHeight: 2, 
    imagery: [
        // block
        [   
            [0, 0, 2, 2, BULLET_GRAPHIC_PALETTE_INDEX_END], 
            [2, 0, 2, 2, BULLET_GRAPHIC_PALETTE_INDEX_MIDDLE], 
            [4, 0, 2, 2, BULLET_GRAPHIC_PALETTE_INDEX_START], 
        ], 
    ], 
    joints: [{
        imageIndex: BULLET_GRAPHIC_IMAGE_INDEX_BODY, 
    }]
}
