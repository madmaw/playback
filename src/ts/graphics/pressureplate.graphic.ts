const PRESSURE_PLATE_GRAPHIC_PALETTE_INDEX_LIGHT = 0;
const PRESSURE_PLATE_GRAPHIC_PALETTE_INDEX_MEDIUM = 1;
const PRESSURE_PLATE_GRAPHIC_PALETTE_INDEX_DARK = 2;
const PRESSURE_PLATE_GRAPHIC_PALETTE_INDEX_TAPE_DECK = 3;
const PRESSURE_PLATE_GRAPHIC_PALETTE_INDEX_EYES = 4;

const PRESSURE_PLATE_GRAPHIC_IMAGE_INDEX_BODY = 0;
const PRESSURE_PLATE_GRAPHIC_IMAGE_INDEX_PLATE = 1;
const PRESSURE_PLATE_GRAPHIC_IMAGE_INDEX_TAPE_DECK = 2;

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
    const rAngle = (edge - 1) * MED_P_MATH_PI_ON_2;
    const imageryWidth = width;
    const imageryHeight = height;
    if (!(edge % 2)) {
        width = height;
        height = imageryWidth;
    }
    const ly = (edge/2) | 0;
    const lx = (edge + ly + 1) % 2;
    // switch (edge) {
    //     case EDGE_TOP: //1, 0, sin 0, cos 1
    //         lx = 0;
    //         ly = 0;
    //         break;
    //     case EDGE_BOTTOM: //3, 180, sin 0, cos -1
    //         lx = 1;
    //         ly = 1;
    //         break;
    //     case EDGE_RIGHT: // 2, 90, sin 1, cos 0
    //         lx = 0;
    //         ly = 1;
    //         break;
    //     case EDGE_LEFT: // 0, 270, sin -1, cos 0
    //         lx = 1;
    //         ly = 0;
    //         break;
    // }
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
        imageryWidth, 
        imageryHeight, 
        imagery: [
            // block
            [   
                ...struts,             
                [0, 0, width, blockHeight, PRESSURE_PLATE_GRAPHIC_PALETTE_INDEX_MEDIUM, blockRounding],
                [PRESSURE_PLATE_INSET * lx, PRESSURE_PLATE_INSET * ly, width - PRESSURE_PLATE_INSET, blockHeight - PRESSURE_PLATE_INSET, PRESSURE_PLATE_GRAPHIC_PALETTE_INDEX_LIGHT, blockRounding], 
                [PRESSURE_PLATE_INSET * ((lx+1)%2), PRESSURE_PLATE_INSET * ((ly+1)%2), width - PRESSURE_PLATE_INSET, blockHeight - PRESSURE_PLATE_INSET, PRESSURE_PLATE_GRAPHIC_PALETTE_INDEX_DARK, blockRounding], 
                [PRESSURE_PLATE_INSET, 1, width - PRESSURE_PLATE_INSET*2, blockHeight - PRESSURE_PLATE_INSET - 1, PRESSURE_PLATE_GRAPHIC_PALETTE_INDEX_MEDIUM, blockRounding],
            ], 
            // plate 
            [ 
                [0, 0, width, PRESSURE_PLATE_PLATE_HEIGHT, PRESSURE_PLATE_GRAPHIC_PALETTE_INDEX_MEDIUM, plateRounding],
                [PRESSURE_PLATE_INSET * lx, PRESSURE_PLATE_INSET * ly, width - PRESSURE_PLATE_INSET, PRESSURE_PLATE_PLATE_HEIGHT - PRESSURE_PLATE_INSET, PRESSURE_PLATE_GRAPHIC_PALETTE_INDEX_LIGHT, plateRounding], 
                [PRESSURE_PLATE_INSET * ((lx+1)%2), PRESSURE_PLATE_INSET * ((ly+1)%2), width - PRESSURE_PLATE_INSET, PRESSURE_PLATE_PLATE_HEIGHT - PRESSURE_PLATE_INSET, PRESSURE_PLATE_GRAPHIC_PALETTE_INDEX_DARK, plateRounding], 
                [PRESSURE_PLATE_INSET, PRESSURE_PLATE_INSET, width - PRESSURE_PLATE_INSET*2, PRESSURE_PLATE_PLATE_HEIGHT - PRESSURE_PLATE_INSET - 1, PRESSURE_PLATE_GRAPHIC_PALETTE_INDEX_MEDIUM, plateRounding],
            ], 
            // tape deck
            [
                [-7, 0, 14, 9, PRESSURE_PLATE_GRAPHIC_PALETTE_INDEX_TAPE_DECK],
                [-3, 4, 1, 1, PRESSURE_PLATE_GRAPHIC_PALETTE_INDEX_EYES], 
                [3, 4, 1, 1, PRESSURE_PLATE_GRAPHIC_PALETTE_INDEX_EYES], 
            ]
        ], 
        joints: [{
            gid: PRESSURE_PLATE_GRAPHIC_JOINT_ID_BODY, 
            imageIndex: PRESSURE_PLATE_GRAPHIC_IMAGE_INDEX_BODY, 
            transformations: [{
                transformType: TRANSFORM_TYPE_ROTATE, 
                rAngle, 
                aroundX: 0, 
                aroundY: height/2, 
            }, {
                transformType: TRANSFORM_TYPE_TRANSLATE, 
                dx: -width/2, 
                dy: PRESSURE_PLATE_PLATE_HEIGHT, 
            }], 
        }, {
            gid: PRESSURE_PLATE_GRAPHIC_JOINT_ID_PLATE, 
            imageIndex: PRESSURE_PLATE_GRAPHIC_IMAGE_INDEX_PLATE, 
            transformations: [{
                transformType: TRANSFORM_TYPE_ROTATE, 
                rAngle, 
                aroundX: 0, 
                aroundY: height/2, 
            }, {
                transformType: TRANSFORM_TYPE_TRANSLATE, 
                dx: -width/2, 
                dy: -PRESSURE_PLATE_PLATE_GAP, 
            }], 
        }, {
            gid: PRESSURE_PLATE_GRAPHIC_JOINT_ID_TAPE, 
            imageIndex: PRESSURE_PLATE_GRAPHIC_IMAGE_INDEX_TAPE_DECK, 
            transformations: [{
                transformType: TRANSFORM_TYPE_TRANSLATE, 
                dx: 16 - width/2, 
                dy: PRESSURE_PLATE_PLATE_HEIGHT + 4, 
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
                poseDuration: 99, 
                poseIds: [PRESSURE_PLATE_POSE_ID_TRIGGER], 
                repeatCount: 1, 
            }
        }
    };
    return graphic;
}