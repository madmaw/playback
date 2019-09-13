const MAINFRAME_GRAPHIC_PALETTE_INDEX_BODY_MEDIUM = 0;
const MAINFRAME_GRAPHIC_PALETTE_INDEX_FACEPLATE = 1;
const MAINFRAME_GRAPHIC_PALETTE_INDEX_TAPE = 2;

const MAINFRAME_GRAPHIC_TAPE_SPINNER_RADIUS = 5;
const MAINFRAME_GRAPHIC_TAPE_SPINNER_RADIUS_INNER = 1;

const MAINFRAME_GRAPHIC_IMAGE_INDEX_BODY = 0;
const MAINFRAME_GRAPHIC_IMAGE_INDEX_TAPE_SPINNER = 1;
const MAINFRAME_GRAPHIC_IMAGE_INDEX_TAPE_SPINNER_HOLE = 2;

const MAINFRAME_GRAPHIC_JOINT_ID_BODY = 0;
const MAINFRAME_GRAPHIC_JOINT_ID_LEFT_SPINNER = 1;
const MAINFRAME_GRAPHIC_JOINT_ID_RIGHT_SPINNER = 2;

const MAINFRAME_GRAPHIC_POSE_ID_SHAKE_LEFT = 0;
const MAINFRAME_GRAPHIC_POSE_ID_SHAKE_RIGHT = 1;

const mainframeGraphic: Graphic = {
    imageryWidth: 32, 
    imageryHeight: 48, 
    imagery: [
        // body
        [   
            [-16, 0, 32, 48, MAINFRAME_GRAPHIC_PALETTE_INDEX_BODY_MEDIUM],
            //[-16, 0, 32, 46, MAINFRAME_GRAPHIC_PALETTE_INDEX_BODY_LIGHT], 
            //[-16, 2, 32, 46, MAINFRAME_GRAPHIC_PALETTE_INDEX_BODY_DARK], 
            [-16, 2, 32, 44, MAINFRAME_GRAPHIC_PALETTE_INDEX_BODY_MEDIUM],
            //[-12, 5, 26, 36, MAINFRAME_GRAPHIC_PALETTE_INDEX_BODY_LIGHT], 
            //[-14, 3, 26, 36, MAINFRAME_GRAPHIC_PALETTE_INDEX_BODY_DARK], 
            [-13, 4, 26, 36, MAINFRAME_GRAPHIC_PALETTE_INDEX_FACEPLATE], 
            [-5, 12, 10, 10, MAINFRAME_GRAPHIC_PALETTE_INDEX_TAPE], 
            [-10, 30, 5, 10, MAINFRAME_GRAPHIC_PALETTE_INDEX_TAPE], 
            [5, 30, 5, 10, MAINFRAME_GRAPHIC_PALETTE_INDEX_TAPE], 
            [-5, 8, 10, 1, MAINFRAME_GRAPHIC_PALETTE_INDEX_TAPE], 
            [-16, 22, 32, 8, MAINFRAME_GRAPHIC_PALETTE_INDEX_BODY_MEDIUM],
        ], 
        // tape spinners
        [
            [-MAINFRAME_GRAPHIC_TAPE_SPINNER_RADIUS, -MAINFRAME_GRAPHIC_TAPE_SPINNER_RADIUS, MAINFRAME_GRAPHIC_TAPE_SPINNER_RADIUS * 2, MAINFRAME_GRAPHIC_TAPE_SPINNER_RADIUS * 2, MAINFRAME_GRAPHIC_PALETTE_INDEX_BODY_MEDIUM, MAINFRAME_GRAPHIC_TAPE_SPINNER_RADIUS], 
            [-MAINFRAME_GRAPHIC_TAPE_SPINNER_RADIUS_INNER, -MAINFRAME_GRAPHIC_TAPE_SPINNER_RADIUS_INNER, MAINFRAME_GRAPHIC_TAPE_SPINNER_RADIUS_INNER * 2, MAINFRAME_GRAPHIC_TAPE_SPINNER_RADIUS_INNER * 2, MAINFRAME_GRAPHIC_PALETTE_INDEX_TAPE, MAINFRAME_GRAPHIC_TAPE_SPINNER_RADIUS_INNER], 
        ],
        // tape spinner hole
        [
            [2, -.5, 2, 1, MAINFRAME_GRAPHIC_PALETTE_INDEX_TAPE, .5], 
        ],         
    ], 
    joints: [{
        gid: MAINFRAME_GRAPHIC_JOINT_ID_BODY, 
        imageIndex: BLOCK_GRAPHIC_IMAGE_INDEX_BODY, 
        renderAfter: [{
            gid: MAINFRAME_GRAPHIC_JOINT_ID_LEFT_SPINNER, 
            imageIndex: MAINFRAME_GRAPHIC_IMAGE_INDEX_TAPE_SPINNER, 
            transformations: [{
                transformType: TRANSFORM_TYPE_TRANSLATE, 
                dx: -6, 
                dy: 13, 
            }, {
                transformType: TRANSFORM_TYPE_ROTATE, 
                rAngle: LOW_P_MATH_PI/6, 
            }],
            renderAfter: [{
                imageIndex: MAINFRAME_GRAPHIC_IMAGE_INDEX_TAPE_SPINNER_HOLE, 
            }, {
                imageIndex: MAINFRAME_GRAPHIC_IMAGE_INDEX_TAPE_SPINNER_HOLE, 
                transformations: [{
                    transformType: TRANSFORM_TYPE_ROTATE, 
                    rAngle: LOW_P_MATH_PI_2/3
                }]
            }, {
                imageIndex: MAINFRAME_GRAPHIC_IMAGE_INDEX_TAPE_SPINNER_HOLE, 
                transformations: [{
                    transformType: TRANSFORM_TYPE_ROTATE, 
                    rAngle: LOW_P_MATH_PI_ON_3*4
                }]
            }]
        },{
            gid: MAINFRAME_GRAPHIC_JOINT_ID_RIGHT_SPINNER, 
            imageIndex: MAINFRAME_GRAPHIC_IMAGE_INDEX_TAPE_SPINNER, 
            transformations: [{
                transformType: TRANSFORM_TYPE_TRANSLATE, 
                dx: 6, 
                dy: 13, 
            }, {
                transformType: TRANSFORM_TYPE_ROTATE, 
                rAngle: LOW_P_MATH_PI/6, 
            }],
            renderAfter: [{
                imageIndex: MAINFRAME_GRAPHIC_IMAGE_INDEX_TAPE_SPINNER_HOLE, 
            }, {
                imageIndex: MAINFRAME_GRAPHIC_IMAGE_INDEX_TAPE_SPINNER_HOLE, 
                transformations: [{
                    transformType: TRANSFORM_TYPE_ROTATE, 
                    rAngle: LOW_P_MATH_PI_2/3
                }]
            }, {
                imageIndex: MAINFRAME_GRAPHIC_IMAGE_INDEX_TAPE_SPINNER_HOLE, 
                transformations: [{
                    transformType: TRANSFORM_TYPE_ROTATE, 
                    rAngle: LOW_P_MATH_PI*4/3
                }]
            }]
        }]
    }], 
    poses: [{ // MAINFRAME_GRAPHIC_POSE_ID_SHAKE_LEFT
        [MAINFRAME_GRAPHIC_JOINT_ID_BODY]: [{
            transformType: TRANSFORM_TYPE_ROTATE, 
            rAngle: -LOW_P_MATH_PI/30, 
            aroundX: 16, 
            aroundY: 48, 
        }, {
            transformType: TRANSFORM_TYPE_TRANSLATE, 
            dx: 0, 
            dy: -3,
        }],
        [MAINFRAME_GRAPHIC_JOINT_ID_LEFT_SPINNER]: [{
            transformType: TRANSFORM_TYPE_ROTATE, 
            rAngle: LOW_P_MATH_PI_2, 
        }],
        [MAINFRAME_GRAPHIC_JOINT_ID_RIGHT_SPINNER]: [{
            transformType: TRANSFORM_TYPE_ROTATE, 
            rAngle: LOW_P_MATH_PI_2, 
        }],
    }, { // MAINFRAME_GRAPHIC_POSE_ID_SHAKE_RIGHT
        [MAINFRAME_GRAPHIC_JOINT_ID_BODY]: [{
            transformType: TRANSFORM_TYPE_ROTATE, 
            rAngle: LOW_P_MATH_PI/30, 
            aroundX: 0, 
            aroundY: 48, 
        }],
        [MAINFRAME_GRAPHIC_JOINT_ID_LEFT_SPINNER]: [{
            transformType: TRANSFORM_TYPE_ROTATE, 
            rAngle: 9, 
        }],
        [MAINFRAME_GRAPHIC_JOINT_ID_RIGHT_SPINNER]: [{
            transformType: TRANSFORM_TYPE_ROTATE, 
            rAngle: 9, 
        }],
    }], 
    animations: {
        [ANIMATION_ID_SAVING]: {
            poseDuration: 150, 
            poseIds: [MAINFRAME_GRAPHIC_POSE_ID_SHAKE_LEFT, MAINFRAME_GRAPHIC_POSE_ID_SHAKE_RIGHT, MAINFRAME_GRAPHIC_POSE_ID_SHAKE_LEFT, MAINFRAME_GRAPHIC_POSE_ID_SHAKE_RIGHT], 
        }        
    }, 
};
