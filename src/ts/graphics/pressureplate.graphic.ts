const PRESSURE_PLATE_GRAPHIC_PALETTE_INDEX_LIGHT = 0;
const PRESSURE_PLATE_GRAPHIC_PALETTE_INDEX_MEDIUM = 1;
const PRESSURE_PLATE_GRAPHIC_PALETTE_INDEX_DARK = 2;
const PRESSURE_PLATE_GRAPHIC_PALETTE_INDEX_TAPE_DECK = 3;
const PRESSURE_PLATE_GRAPHIC_PALETTE_INDEX_EYES = 4;

const PRESSURE_PLATE_GRAPHIC_IMAGE_INDEX_BODY = 0;
const PRESSURE_PLATE_GRAPHIC_IMAGE_INDEX_PLATE = 1;

const PRESSURE_PLATE_GRAPHIC_JOINT_ID_BODY = 0;
const PRESSURE_PLATE_GRAPHIC_JOINT_ID_PLATE = 1;
const PRESSURE_PLATE_GRAPHIC_JOINT_ID_TAPE = 3;

const PRESSURE_PLATE_ROUNDING = 4;
const PRESSURE_PLATE_PLATE_HEIGHT = 6;
const PRESSURE_PLATE_PLATE_GAP = 2;
const PRESSURE_PLATE_INSET = 2;
const PRESSURE_PLATE_STRUT_WIDTH = 4;

const PRESSURE_PLATE_POSE_ID_TRIGGER = 0;

const pressurePlateGraphicFactory = (width: number, height: number, edge: Edge) => {
    const blockRounding: [number, number, number, number] = [0, 0, PRESSURE_PLATE_ROUNDING, PRESSURE_PLATE_ROUNDING];
    const blockHeight = height - PRESSURE_PLATE_PLATE_HEIGHT;
    const plateRounding: [number, number] = [PRESSURE_PLATE_ROUNDING, PRESSURE_PLATE_ROUNDING];
    const struts: RectangleWithPaletteIndex[] = [];
    let strutCount = width / 16;
    const strutInterval = (width - (PRESSURE_PLATE_STRUT_WIDTH * strutCount))/(strutCount+1);
    let x = 0;
    while (strutCount--) {
        x += strutInterval;
        struts.push([x, -PRESSURE_PLATE_PLATE_GAP, PRESSURE_PLATE_STRUT_WIDTH, PRESSURE_PLATE_PLATE_GAP, PRESSURE_PLATE_GRAPHIC_PALETTE_INDEX_DARK]);
        x += PRESSURE_PLATE_STRUT_WIDTH;
    }

    const graphic: Graphic = {
        imageryWidth: width, 
        imageryHeight: height, 
        imagery: [
            // block
            [   
                ...struts,             
                [0, 0, width, blockHeight, PRESSURE_PLATE_GRAPHIC_PALETTE_INDEX_MEDIUM, blockRounding],
                [0, 0, width - PRESSURE_PLATE_INSET, blockHeight - PRESSURE_PLATE_INSET, PRESSURE_PLATE_GRAPHIC_PALETTE_INDEX_LIGHT, blockRounding], 
                [PRESSURE_PLATE_INSET, 1, width - PRESSURE_PLATE_INSET, blockHeight - 1, PRESSURE_PLATE_GRAPHIC_PALETTE_INDEX_DARK, blockRounding], 
                [PRESSURE_PLATE_INSET, 1, width - PRESSURE_PLATE_INSET*2, blockHeight - PRESSURE_PLATE_INSET - 1, PRESSURE_PLATE_GRAPHIC_PALETTE_INDEX_MEDIUM, blockRounding],
                [9, 6, 14, 9, PRESSURE_PLATE_GRAPHIC_PALETTE_INDEX_TAPE_DECK], // tape deck
                [12, 10, 1, 1, PRESSURE_PLATE_GRAPHIC_PALETTE_INDEX_EYES], 
                [18, 10, 1, 1, PRESSURE_PLATE_GRAPHIC_PALETTE_INDEX_EYES], 
            ], 
            // plate
            [ 
                [0, 0, width, PRESSURE_PLATE_PLATE_HEIGHT, PRESSURE_PLATE_GRAPHIC_PALETTE_INDEX_MEDIUM, plateRounding],
                [0, 0, width - PRESSURE_PLATE_INSET, PRESSURE_PLATE_PLATE_HEIGHT, PRESSURE_PLATE_GRAPHIC_PALETTE_INDEX_LIGHT, plateRounding], 
                [PRESSURE_PLATE_INSET, PRESSURE_PLATE_INSET, width - PRESSURE_PLATE_INSET, PRESSURE_PLATE_PLATE_HEIGHT - PRESSURE_PLATE_INSET, PRESSURE_PLATE_GRAPHIC_PALETTE_INDEX_DARK, plateRounding], 
                [PRESSURE_PLATE_INSET, PRESSURE_PLATE_INSET, width - PRESSURE_PLATE_INSET*2, PRESSURE_PLATE_PLATE_HEIGHT - PRESSURE_PLATE_INSET - 1, PRESSURE_PLATE_GRAPHIC_PALETTE_INDEX_MEDIUM, plateRounding],
            ]
        ], 
        joints: [{
            id: PRESSURE_PLATE_GRAPHIC_JOINT_ID_BODY, 
            imageIndex: PRESSURE_PLATE_GRAPHIC_IMAGE_INDEX_BODY, 
            transformations: [{
                transformType: TRANSFORM_TYPE_TRANSLATE, 
                dx: -width/2, 
                dy: PRESSURE_PLATE_PLATE_HEIGHT, 
            }], 
        }, {
            id: PRESSURE_PLATE_GRAPHIC_JOINT_ID_PLATE, 
            imageIndex: PRESSURE_PLATE_GRAPHIC_IMAGE_INDEX_PLATE, 
            transformations: [{
                transformType: TRANSFORM_TYPE_TRANSLATE, 
                dx: -width/2, 
                dy: -PRESSURE_PLATE_PLATE_GAP, 
            }], 
        }, {
            id: PRESSURE_PLATE_GRAPHIC_JOINT_ID_TAPE, 
            transformations: [{
                transformType: TRANSFORM_TYPE_TRANSLATE, 
                dx: 16 - width/2, 
                dy: PRESSURE_PLATE_PLATE_HEIGHT + 6, 
            }], 
        }], 
        poses: [
            // trigger pressure plate
            {
                [PRESSURE_PLATE_GRAPHIC_JOINT_ID_PLATE]: [{// body
                    transformType: TRANSFORM_TYPE_TRANSLATE, 
                    dx: 0, 
                    dy: PRESSURE_PLATE_PLATE_GAP, 
                }],                     
            }
        ], 
        animations: {
            [ANIMATION_ID_PRESSING_BUTTON]: {
                poseDuration: 100, 
                poseIds: [PRESSURE_PLATE_POSE_ID_TRIGGER], 
                count: 1, 
            }
        }
    };
    return graphic;
}