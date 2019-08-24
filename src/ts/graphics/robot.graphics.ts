const ROBOT_GRAPHIC_PALETTE_INDEX_BODY = 0;
const ROBOT_GRAPHIC_PALETTE_INDEX_HEAD = 1;
const ROBOT_GRAPHIC_PALETTE_INDEX_TAPE_DECK = 2;
const ROBOT_GRAPHIC_PALETTE_INDEX_EYE = 3;

const ROBOT_GRAPHIC_IMAGE_INDEX_BODY = 0;
const ROBOT_GRAPHIC_IMAGE_INDEX_HEAD = 1;
const ROBOT_GRAPHIC_IMAGE_INDEX_EYE = 2;
const ROBOT_GRAPHIC_IMAGE_INDEX_HAND = 3;
const ROBOT_GRAPHIC_IMAGE_INDEX_LEG = 4;

const ROBOT_GRAPHIC_JOINT_ID_EVERYTHING = 0;
const ROBOT_GRAPHIC_JOINT_ID_BODY = 1;
const ROBOT_GRAPHIC_JOINT_ID_HEAD = 2;
const ROBOT_GRAPHIC_JOINT_ID_LEFT_LEG = 3;
const ROBOT_GRAPHIC_JOINT_ID_RIGHT_LEG = 4;
const ROBOT_GRAPHIC_JOINT_ID_LEFT_HAND = 5;
const ROBOT_GRAPHIC_JOINT_ID_RIGHT_HAND = 6;

const ROBOT_GRAPHIC_POSE_ID_STEP_LEFT = 0;
const ROBOT_GRAPHIC_POSE_ID_STEP_RIGHT = 1;


const robotGraphic: Graphic = {
    width: 32, 
    height: 32, 
    palette: [
        [0, 40, 50], 
        [0, 40, 40], 
        [0, 40, 20], 
        [0, 0, 100], 
    ], 
    images: [
        [   // body
            [-12, -28, 32, 16, ROBOT_GRAPHIC_PALETTE_INDEX_BODY],
            [-12, -28, 16, 28, ROBOT_GRAPHIC_PALETTE_INDEX_BODY]
        ], 
        [   // head
            [-9, -10, 18, 12, ROBOT_GRAPHIC_PALETTE_INDEX_HEAD], // frame
            [-7, -8, 14, 8, ROBOT_GRAPHIC_PALETTE_INDEX_TAPE_DECK], // tape deck
        ], 
        [   // eye
            [-1, -.5, 2, 1, ROBOT_GRAPHIC_PALETTE_INDEX_EYE], 
            [-.5, -1, 1, 2, ROBOT_GRAPHIC_PALETTE_INDEX_EYE], 
        ], 
        [   // hand
            [-2, -3, 4, 6, ROBOT_GRAPHIC_PALETTE_INDEX_TAPE_DECK], 
        ], 
        [   // leg
            [-2, 0, 4, 6, ROBOT_GRAPHIC_PALETTE_INDEX_TAPE_DECK], 
        ], 
    ], 
    joints: [{
        id: ROBOT_GRAPHIC_JOINT_ID_EVERYTHING, 
        transformations: [{
            transformType: TRANSFORM_TYPE_TRANSLATE, 
            dx: -10, 
            dy: 0, 
        }],
        renderAfter: [{
            id: ROBOT_GRAPHIC_JOINT_ID_LEFT_LEG, 
            imageIndex: ROBOT_GRAPHIC_IMAGE_INDEX_LEG, 
            transformations: [{
                transformType: TRANSFORM_TYPE_TRANSLATE, 
                dx: -4, 
                dy: 26, 
            }]
        }, {
            id: ROBOT_GRAPHIC_JOINT_ID_RIGHT_LEG, 
            imageIndex: ROBOT_GRAPHIC_IMAGE_INDEX_LEG, 
            transformations: [{
                transformType: TRANSFORM_TYPE_TRANSLATE, 
                dx: 4, 
                dy: 26, 
            }]
        }, {
            id: ROBOT_GRAPHIC_JOINT_ID_BODY, 
            imageIndex: ROBOT_GRAPHIC_IMAGE_INDEX_BODY, 
            transformations: [{
                transformType: TRANSFORM_TYPE_TRANSLATE, 
                dx: 4, 
                dy: 28, 
            }], 
            renderAfter: [{
                id: ROBOT_GRAPHIC_JOINT_ID_LEFT_HAND, 
                imageIndex: ROBOT_GRAPHIC_IMAGE_INDEX_HAND,
                transformations: [{
                    transformType: TRANSFORM_TYPE_TRANSLATE, 
                    dx: 18, 
                    dy: -10, 
                }]
            }, {
                id: ROBOT_GRAPHIC_JOINT_ID_RIGHT_HAND, 
                imageIndex: ROBOT_GRAPHIC_IMAGE_INDEX_HAND,
                transformations: [{
                    transformType: TRANSFORM_TYPE_TRANSLATE, 
                    dx: 8, 
                    dy: -10, 
                }]
            }, {
                id: ROBOT_GRAPHIC_JOINT_ID_HEAD, 
                imageIndex: ROBOT_GRAPHIC_IMAGE_INDEX_HEAD, 
                transformations: [{
                    transformType: TRANSFORM_TYPE_TRANSLATE, 
                    dx: 15, 
                    dy: -12, 
                }], 
                renderAfter: [{
                    imageIndex: ROBOT_GRAPHIC_IMAGE_INDEX_EYE, 
                    transformations: [{
                        transformType: TRANSFORM_TYPE_TRANSLATE, 
                        dx: 4, 
                        dy: -4, 
                    }]
                }, {
                    imageIndex: ROBOT_GRAPHIC_IMAGE_INDEX_EYE, 
                    transformations: [{
                        transformType: TRANSFORM_TYPE_TRANSLATE, 
                        dx: -4, 
                        dy: -4, 
                    }], 
                }], 
            }], 
        }], 
    }], 
    poses: [{ // ROBOT_GRAPHIC_POSE_ID_STEP_LEFT
        [ROBOT_GRAPHIC_JOINT_ID_BODY]: [{
            transformType: TRANSFORM_TYPE_ROTATE, 
            rotation: -Math.PI/20, 
        }],
        [ROBOT_GRAPHIC_JOINT_ID_LEFT_LEG]: [{
            transformType: TRANSFORM_TYPE_TRANSLATE, 
            dx: 0, 
            dy: -3,
        }], 
        [ROBOT_GRAPHIC_JOINT_ID_HEAD]: [{
            transformType: TRANSFORM_TYPE_ROTATE, 
            rotation: Math.PI/20, 
        }], 
    }, { // ROBOT_GRAPHIC_POSE_ID_STEP_RIGHT
        [ROBOT_GRAPHIC_JOINT_ID_BODY]: [{
            transformType: TRANSFORM_TYPE_ROTATE, 
            rotation: Math.PI/20, 
        }], 
        [ROBOT_GRAPHIC_JOINT_ID_RIGHT_LEG]: [{
            transformType: TRANSFORM_TYPE_TRANSLATE, 
            dx: 0, 
            dy: -3,
        }], 
        [ROBOT_GRAPHIC_JOINT_ID_HEAD]: [{
            transformType: TRANSFORM_TYPE_ROTATE, 
            rotation: -Math.PI/20, 
        }], 
    }], 
    animations: {
        [ANIMATION_ID_WALKING]: {
            poseDuration: 300, 
            poseIds: [ROBOT_GRAPHIC_POSE_ID_STEP_LEFT, ROBOT_GRAPHIC_POSE_ID_STEP_RIGHT], 
        }
    }, 
};