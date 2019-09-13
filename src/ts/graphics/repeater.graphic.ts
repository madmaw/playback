const REPEATER_GRAPHIC_PALETTE_INDEX_MEDIUM = 0;
const REPEATER_GRAPHIC_PALETTE_INDEX_DARK = 1;
const REPEATER_GRAPHIC_PALETTE_INDEX_SPEAKER = 2;
const REPEATER_GRAPHIC_PALETTE_INDEX_TAPE_DECK = 3;
const REPEATER_GRAPHIC_PALETTE_INDEX_EYES = 4;

const REPEATER_GRAPHIC_IMAGE_INDEX_BODY = 0;

const REPEATER_GRAPHIC_JOINT_ID_BODY = 0;
const REPEATER_GRAPHIC_JOINT_ID_TAPE_DECK = 1;

const REPEATER_ROUNDING = 5;

const repeaterPaletteCyan: HSL[] = [
    [210, 30, 70], 
    [210, 20, 60],
    [210, 30, 50],
    [0, 0, 30], 
    [210, 30, 30], 
    [0, 0, 99], 
];

const repeaterGraphic: Graphic = {
    imageryWidth: 32, 
    imageryHeight: 24, 
    imagery: [
        // body
        [   
            [-16, -12, 32, 24, REPEATER_GRAPHIC_PALETTE_INDEX_DARK, REPEATER_ROUNDING],
            [-15, -11, 30, 22, REPEATER_GRAPHIC_PALETTE_INDEX_MEDIUM, REPEATER_ROUNDING - 1],
            [1.5, -6.5, 12, 12, REPEATER_GRAPHIC_PALETTE_INDEX_DARK, 6], 
            [2, -6, 12, 12, REPEATER_GRAPHIC_PALETTE_INDEX_SPEAKER, 6], 
            [-13.5, -6, 13, 8, REPEATER_GRAPHIC_PALETTE_INDEX_TAPE_DECK], 
            [-5, -3, 2, 2, REPEATER_GRAPHIC_PALETTE_INDEX_EYES, 1],
            [-11, -3, 2, 2, REPEATER_GRAPHIC_PALETTE_INDEX_EYES, 1], 
        ], 
    ], 
    joints: [{
        //id: REPEATER_GRAPHIC_JOINT_ID_BODY, 
        imageIndex: REPEATER_GRAPHIC_IMAGE_INDEX_BODY, 
        transformations: [{
            transformType: TRANSFORM_TYPE_TRANSLATE, 
            dx: 0, 
            dy: 12, 
        }], 
    }, {
        gid: REPEATER_GRAPHIC_JOINT_ID_TAPE_DECK, 
        transformations: [{
            transformType: TRANSFORM_TYPE_TRANSLATE, 
            dx: -7.5, 
            dy: 5.5,
        }]
    }]
}