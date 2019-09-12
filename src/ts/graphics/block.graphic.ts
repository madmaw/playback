const BLOCK_GRAPHIC_PALETTE_INDEX_LIGHT = 0;
const BLOCK_GRAPHIC_PALETTE_INDEX_MEDIUM = 1;
const BLOCK_GRAPHIC_PALETTE_INDEX_DARK = 2;

const BLOCK_GRAPHIC_IMAGE_INDEX_BODY = 0;

const blockGraphicFactory = (width: number, height: number, rounding: number = 4) => {
    const blockGraphic: Graphic = {
        imageryWidth: width, 
        imageryHeight: height, 
        imagery: [
            // block
            [   
                [-width/2, 0, width, height, BLOCK_GRAPHIC_PALETTE_INDEX_MEDIUM, rounding],
                [-width/2, 0, width - 2, height - 2, BLOCK_GRAPHIC_PALETTE_INDEX_LIGHT, rounding], 
                [2 - width/2, 2, width - 2, height - 2, BLOCK_GRAPHIC_PALETTE_INDEX_DARK, rounding], 
                [2 - width/2, 2, width - 4, height - 4, BLOCK_GRAPHIC_PALETTE_INDEX_MEDIUM, rounding],
            ], 
        ], 
        joints: [{
            imageIndex: BLOCK_GRAPHIC_IMAGE_INDEX_BODY, 
        }]
    }
    return blockGraphic;
};
