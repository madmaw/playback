const BLOCK_GRAPHIC_PALETTE_INDEX_LIGHT = 0;
const BLOCK_GRAPHIC_PALETTE_INDEX_MEDIUM = 1;
const BLOCK_GRAPHIC_PALETTE_INDEX_DARK = 2;

const BLOCK_GRAPHIC_IMAGE_INDEX_BODY = 0;

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
const blockGraphicFactory = (width: number, height: number) => {
    const blockGraphic: Graphic = {
        imageryWidth: width, 
        imageryHeight: height, 
        imagery: [
            // block
            [   
                [-width/2, 0, width, height, BLOCK_GRAPHIC_PALETTE_INDEX_MEDIUM, BLOCK_ROUNDING],
                [-width/2, 0, width - 2, height - 2, BLOCK_GRAPHIC_PALETTE_INDEX_LIGHT, BLOCK_ROUNDING], 
                [2 - width/2, 2, width - 2, height - 2, BLOCK_GRAPHIC_PALETTE_INDEX_DARK, BLOCK_ROUNDING], 
                [2 - width/2, 2, width - 4, height - 4, BLOCK_GRAPHIC_PALETTE_INDEX_MEDIUM, BLOCK_ROUNDING],
            ], 
        ], 
        joints: [{
            imageIndex: BLOCK_GRAPHIC_IMAGE_INDEX_BODY, 
        }]
    }
    return blockGraphic;
};
