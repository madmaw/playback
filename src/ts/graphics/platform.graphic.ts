const PLATFORM_GRAPHIC_PALETTE_INDEX_LIGHT = 0;
const PLATFORM_GRAPHIC_PALETTE_INDEX_MEDIUM = 1;
const PLATFORM_GRAPHIC_PALETTE_INDEX_DARK = 2;
const PLATFORM_GRAPHIC_PALETTE_INDEX_ARROW_FILL = 3;
const PLATFORM_GRAPHIC_PALETTE_INDEX_ARROW_STROKE = 4;

const PLATFORM_GRAPHIC_IMAGE_INDEX_BODY = 0;
const PLATFORM_GRAPHIC_IMAGE_INDEX_ARROW = 1;

const PLATFORM_GRAPHIC_ROUNDINGS: [number, number, number, number] = [0, 0, 10, 10];

const platformGraphicFactory = (width: number, height: number, edge: Edge) => {
    const vertical = edge % 2;
    const roundings = height > width ? 0 : PLATFORM_GRAPHIC_ROUNDINGS;
    const blockGraphic: Graphic = {
        imageryWidth: width, 
        imageryHeight: height, 
        imagery: [
            // block
            [   
                [-width/2, 0, width, height, BLOCK_GRAPHIC_PALETTE_INDEX_MEDIUM, roundings],
                [-width/2, 0, width - 2, height - 2, BLOCK_GRAPHIC_PALETTE_INDEX_LIGHT, roundings], 
                [2 - width/2, 2, width - 2, height - 2, BLOCK_GRAPHIC_PALETTE_INDEX_DARK, roundings], 
                [2 - width/2, 2, width - 4, height - 4, BLOCK_GRAPHIC_PALETTE_INDEX_MEDIUM, roundings],
            ], 
            // arrow
            [
                [0, 0, -8, -4, -8, 4, PLATFORM_GRAPHIC_PALETTE_INDEX_ARROW_FILL, PLATFORM_GRAPHIC_PALETTE_INDEX_ARROW_STROKE], 
            ], 
        ], 
        joints: [{
            imageIndex: PLATFORM_GRAPHIC_IMAGE_INDEX_BODY, 
            renderAfter: [{
                imageIndex: PLATFORM_GRAPHIC_IMAGE_INDEX_ARROW, 
                transformations: [{
                    transformType: TRANSFORM_TYPE_TRANSLATE, 
                    dx: vertical ? 0 : width/2 - 4, 
                    dy: vertical ? height - 4 : height/2,  
                }, {
                    transformType: TRANSFORM_TYPE_ROTATE, 
                    rAngle: vertical ? MATH_PI_ON_2 : 0, 
                }]
            }, {
                imageIndex: PLATFORM_GRAPHIC_IMAGE_INDEX_ARROW, 
                transformations: [{
                    transformType: TRANSFORM_TYPE_TRANSLATE, 
                    dx: vertical ? 0 : -width/2 + 4, 
                    dy: vertical ? 4 : height/2,  
                }, {
                    transformType: TRANSFORM_TYPE_ROTATE, 
                    rAngle: vertical ? -MED_P_MATH_PI_ON_2 : MED_P_MATH_PI, 
                }]
            }]
        }]
    }
    return blockGraphic;
};
