const TAPE_GRAPHIC_PALETTE_INDEX_LABEL_COLOR = 0;
const TAPE_GRAPHIC_PALETTE_INDEX_BODY_COLOR = 1;
const TAPE_GRAPHIC_PALETTE_INDEX_EYE_COLOR = 2;

const TAPE_GRAPHIC_IMAGE_INDEX_BODY = 0;
const TAPE_GRAPHIC_IMAGE_INDEX_EYE = 1;

const TAPE_GRAPHIC_JOINT_ID_BODY = 0;

const tapePaletteRed: HSL[] = [
    [0, 80, 70], 
    [0, 0, 25],
    [0, 0, 100],
];

const tapePaletteBlue: HSL[] = [
    [240, 80, 70], 
    [240, 0, 25],
    [240, 0, 100],
];

const tapePaletteGreen: HSL[] = [
    [120, 80, 70], 
    [120, 0, 25],
    [120, 0, 100],
];

const tapeGraphic: Graphic = {
    width: 18, 
    height: 12, 
    images: [
        // tape body
        [   
            [-9, -6, 18, 12, TAPE_GRAPHIC_PALETTE_INDEX_BODY_COLOR, [2, 2]],
            [-8, -5, 16, 8, TAPE_GRAPHIC_PALETTE_INDEX_LABEL_COLOR], 
            [-6, -3, 12, 4, TAPE_GRAPHIC_PALETTE_INDEX_BODY_COLOR, 2], 
        ], 
        // eye
        [
            [-1, -1, 2, 2, TAPE_GRAPHIC_PALETTE_INDEX_EYE_COLOR, 1], 
        ]
    ], 
    joints: [{
        id: TAPE_GRAPHIC_JOINT_ID_BODY, 
        imageIndex: TAPE_GRAPHIC_IMAGE_INDEX_BODY, 
        transformations: [{
            transformType: TRANSFORM_TYPE_TRANSLATE, 
            dx: 0, 
            dy: 6, 
        }], 
        renderAfter: [{
            imageIndex: TAPE_GRAPHIC_IMAGE_INDEX_EYE, 
            transformations: [{
                transformType: TRANSFORM_TYPE_TRANSLATE, 
                dx: -4, 
                dy: -1, 
            }]
        }, {
            imageIndex: TAPE_GRAPHIC_IMAGE_INDEX_EYE, 
            transformations: [{
                transformType: TRANSFORM_TYPE_TRANSLATE, 
                dx: 4, 
                dy: -1, 
            }]
        }], 
    }]
}