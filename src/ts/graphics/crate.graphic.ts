const CRATE_GRAPHIC_PALETTE_INDEX_LIGHT = 0;
const CRATE_GRAPHIC_PALETTE_INDEX_MEDIUM = 1;
const CRATE_GRAPHIC_PALETTE_INDEX_DARK = 2;

const CRATE_GRAPHIC_IMAGE_INDEX_BOARD = 0;

const CRATE_GRAPHIC_JOINT_ID_BODY = 0;

const cratePalette: HSL[] = [
    [30, 30, 60], 
    [30, 30, 50],
    [30, 30, 40],
];

const crateGraphic: Graphic = {
    width: 16, 
    height: 16, 
    images: [
        // board
        [   
            [-7.5, -1.5, 15, 3, CRATE_GRAPHIC_PALETTE_INDEX_MEDIUM],
            [-8, -1, 1, 2, CRATE_GRAPHIC_PALETTE_INDEX_LIGHT], 
            [-7, -2, 14, 1, CRATE_GRAPHIC_PALETTE_INDEX_LIGHT],
            [7, -1, 1, 2, CRATE_GRAPHIC_PALETTE_INDEX_DARK], 
            [-7, 1, 14, 1, CRATE_GRAPHIC_PALETTE_INDEX_DARK], 
        ], 
    ], 
    joints: [{
        id: CRATE_GRAPHIC_JOINT_ID_BODY, 
        transformations: [{
            transformType: TRANSFORM_TYPE_TRANSLATE, 
            dx: 0, 
            dy: 2, 
        }], 
        renderAfter: [{
            imageIndex: CRATE_GRAPHIC_IMAGE_INDEX_BOARD, 
            transformations: [{
                transformType: TRANSFORM_TYPE_TRANSLATE, 
                dx: 0, 
                dy: 4, 
            }], 
        }, {
            imageIndex: CRATE_GRAPHIC_IMAGE_INDEX_BOARD, 
            transformations: [{
                transformType: TRANSFORM_TYPE_TRANSLATE, 
                dx: 0, 
                dy: 8, 
            }], 
        }, {
            imageIndex: CRATE_GRAPHIC_IMAGE_INDEX_BOARD, 
            transformations: [{
                transformType: TRANSFORM_TYPE_TRANSLATE, 
                dx: -6, 
                dy: 6, 
            }, {
                transformType: TRANSFORM_TYPE_SCALE, 
                scaleX: 1, 
                scaleY:-1, 
            }, {
                transformType: TRANSFORM_TYPE_ROTATE, 
                rotation: -Math.PI/2, 
            }], 
        }, {
            imageIndex: CRATE_GRAPHIC_IMAGE_INDEX_BOARD, 
            transformations: [{
                transformType: TRANSFORM_TYPE_TRANSLATE, 
                dx: 6, 
                dy: 6, 
            }, {
                transformType: TRANSFORM_TYPE_SCALE, 
                scaleX: 1, 
                scaleY:-1, 
            }, {
                transformType: TRANSFORM_TYPE_ROTATE, 
                rotation: -Math.PI/2, 
            }], 
        }, {
            imageIndex: CRATE_GRAPHIC_IMAGE_INDEX_BOARD, 
        }, {
            imageIndex: CRATE_GRAPHIC_IMAGE_INDEX_BOARD, 
            transformations: [{
                transformType: TRANSFORM_TYPE_TRANSLATE, 
                dx: 0, 
                dy: 12, 
            }], 
        }]
    }]
}