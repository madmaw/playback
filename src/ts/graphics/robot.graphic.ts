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
const ROBOT_GRAPHIC_JOINT_ID_LEFT_ARM = 5;
const ROBOT_GRAPHIC_JOINT_ID_RIGHT_ARM = 6;
const ROBOT_GRAPHIC_JOINT_ID_TAPE_DECK = 7;
const ROBOT_GRAPHIC_JOINT_ID_RIGHT_HAND = 8;

const ROBOT_GRAPHIC_POSE_ID_STEP_LEFT = 0;
const ROBOT_GRAPHIC_POSE_ID_STEP_RIGHT = 1;
const ROBOT_GRAPHIC_POSE_ID_SHOOT = 2;

const robotGraphic: Graphic = {
    imageryWidth: 32, 
    imageryHeight: 32, 
    imagery: [
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
        [   // arm
            [-2, -3, 4, 6, ROBOT_GRAPHIC_PALETTE_INDEX_TAPE_DECK], 
        ], 
        [   // leg
            [-2, 0, 4, 6, ROBOT_GRAPHIC_PALETTE_INDEX_TAPE_DECK], 
        ], 
    ], 
    joints: [{
        //id: ROBOT_GRAPHIC_JOINT_ID_EVERYTHING, 
        transformations: [{
            transformType: TRANSFORM_TYPE_TRANSLATE, 
            dx: -10, 
            dy: 0, 
        }],
        renderAfter: [{
            gid: ROBOT_GRAPHIC_JOINT_ID_LEFT_LEG, 
            imageIndex: ROBOT_GRAPHIC_IMAGE_INDEX_LEG, 
            transformations: [{
                transformType: TRANSFORM_TYPE_TRANSLATE, 
                dx: -4, 
                dy: 26, 
            }]
        }, {
            gid: ROBOT_GRAPHIC_JOINT_ID_RIGHT_LEG, 
            imageIndex: ROBOT_GRAPHIC_IMAGE_INDEX_LEG, 
            transformations: [{
                transformType: TRANSFORM_TYPE_TRANSLATE, 
                dx: 4, 
                dy: 26, 
            }]
        }, {
            gid: ROBOT_GRAPHIC_JOINT_ID_BODY, 
            imageIndex: ROBOT_GRAPHIC_IMAGE_INDEX_BODY, 
            transformations: [{
                transformType: TRANSFORM_TYPE_TRANSLATE, 
                dx: 4, 
                dy: 28, 
            }], 
            renderAfter: [{
                gid: ROBOT_GRAPHIC_JOINT_ID_LEFT_ARM, 
                imageIndex: ROBOT_GRAPHIC_IMAGE_INDEX_HAND,
                transformations: [{
                    transformType: TRANSFORM_TYPE_TRANSLATE, 
                    dx: 18, 
                    dy: -10, 
                }]
            }, {
                //id: ROBOT_GRAPHIC_JOINT_ID_RIGHT_ARM, 
                imageIndex: ROBOT_GRAPHIC_IMAGE_INDEX_HAND,
                transformations: [{
                    transformType: TRANSFORM_TYPE_TRANSLATE, 
                    dx: 8, 
                    dy: -10, 
                }], 
                /*renderAfter: [{
                    id: ROBOT_GRAPHIC_JOINT_ID_RIGHT_HAND, 
                    transformations: [{
                        transformType: TRANSFORM_TYPE_TRANSLATE, 
                        dx: 0, 
                        dy: 5, 
                    }]  
                }]*/
            }, {
                gid: ROBOT_GRAPHIC_JOINT_ID_HEAD, 
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
                        dx: 3, 
                        dy: -4, 
                    }]
                }, {
                    imageIndex: ROBOT_GRAPHIC_IMAGE_INDEX_EYE, 
                    transformations: [{
                        transformType: TRANSFORM_TYPE_TRANSLATE, 
                        dx: -3, 
                        dy: -4, 
                    }], 
                }/*, { unused
                    id: ROBOT_GRAPHIC_JOINT_ID_TAPE_DECK, 
                    transformations: [{
                        transformType: TRANSFORM_TYPE_TRANSLATE, 
                        dx: 0, 
                        dy: -9, 
                    }]
                }*/], 
            }], 
        }], 
    }], 
    poses: [{ // ROBOT_GRAPHIC_POSE_ID_STEP_LEFT
        [ROBOT_GRAPHIC_JOINT_ID_BODY]: [{
            transformType: TRANSFORM_TYPE_ROTATE, 
            rAngle: -LOW_P_MATH_PI/20, 
        }],
        [ROBOT_GRAPHIC_JOINT_ID_LEFT_LEG]: [{
            transformType: TRANSFORM_TYPE_TRANSLATE, 
            dx: 0, 
            dy: -3,
        }], 
        [ROBOT_GRAPHIC_JOINT_ID_HEAD]: [{
            transformType: TRANSFORM_TYPE_ROTATE, 
            rAngle: LOW_P_MATH_PI/20, 
        }], 
    }, { // ROBOT_GRAPHIC_POSE_ID_STEP_RIGHT
        [ROBOT_GRAPHIC_JOINT_ID_BODY]: [{
            transformType: TRANSFORM_TYPE_ROTATE, 
            rAngle: LOW_P_MATH_PI/20, 
        }], 
        [ROBOT_GRAPHIC_JOINT_ID_RIGHT_LEG]: [{
            transformType: TRANSFORM_TYPE_TRANSLATE, 
            dx: 0, 
            dy: -3,
        }], 
        [ROBOT_GRAPHIC_JOINT_ID_HEAD]: [{
            transformType: TRANSFORM_TYPE_ROTATE, 
            rAngle: -LOW_P_MATH_PI/20, 
        }], 
    }, { // ROBOT_GRAPHIC_POSE_ID_SHOOT
        [ROBOT_GRAPHIC_JOINT_ID_BODY]: [{
            transformType: TRANSFORM_TYPE_ROTATE, 
            rAngle: -LOW_P_MATH_PI/8, 
        }], 
    }], 
    animations: {
        [ANIMATION_ID_WALKING]: {
            poseDuration: 299, 
            poseIds: [ROBOT_GRAPHIC_POSE_ID_STEP_LEFT, ROBOT_GRAPHIC_POSE_ID_STEP_RIGHT], 
        }, 
        [ANIMATION_ID_SHOOTING]: {
            poseDuration: BULLET_INTERVAL, 
            poseIds: [ROBOT_GRAPHIC_POSE_ID_SHOOT], 
        },
    }, 
};