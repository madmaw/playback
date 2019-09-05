const PLAYER_GRAPHIC_PALETTE_INDEX_FRONT_BODY = 0;
const PLAYER_GRAPHIC_PALETTE_INDEX_SIDE_BODY = 1;
const PLAYER_GRAPHIC_PALETTE_INDEX_FACE_PLATE = 2;
const PLAYER_GRAPHIC_PALETTE_INDEX_LEGS = 3;
const PLAYER_GRAPHIC_PALETTE_INDEX_RECORD_BUTTON = 4;

const PLAYER_GRAPHIC_IMAGE_INDEX_FRONT_PANEL = 0;
const PLAYER_GRAPHIC_IMAGE_INDEX_SIDE_PANEL = 1;
const PLAYER_GRAPHIC_IMAGE_INDEX_LEG = 2;
const PLAYER_GRAPHIC_IMAGE_INDEX_ARM = 3;
const PLAYER_GRAPHIC_IMAGE_INDEX_EYE = 4;
const PLAYER_GRAPHIC_IMAGE_INDEX_HANDLE = 5;

const PLAYER_GRAPHIC_JOINT_ID_BODY = 0;
const PLAYER_GRAPHIC_JOINT_ID_FRONT_PANEL = 1;
const PLAYER_GRAPHIC_JOINT_ID_SIDE_PANEL = 2;
const PLAYER_GRAPHIC_JOINT_ID_LEFT_LEG = 3;
const PLAYER_GRAPHIC_JOINT_ID_RIGHT_LEG = 4;
const PLAYER_GRAPHIC_JOINT_ID_RIGHT_ARM = 5;
const PLAYER_GRAPHIC_JOINT_ID_LEFT_ARM = 6;
const PLAYER_GRAPHIC_JOINT_ID_TORSO = 7;
const PLAYER_GRAPHIC_JOINT_ID_LEFT_EYE = 8;
const PLAYER_GRAPHIC_JOINT_ID_RIGHT_EYE = 9;
const PLAYER_GRAPHIC_JOINT_ID_HANDLE = 10;
const PLAYER_GRAPHIC_JOINT_ID_RIGHT_HAND = 11;
const PLAYER_GRAPHIC_JOINT_ID_TAPE_DECK = 12;

const PLAYER_GRAPHIC_POSE_ID_STEP_LEFT = 0;
const PLAYER_GRAPHIC_POSE_ID_STEP_RIGHT = 1;
const PLAYER_GRAPHIC_POSE_ID_JUMP = 2;
const PLAYER_GRAPHIC_POSE_ID_REST_UP = 3;
const PLAYER_GRAPHIC_POSE_ID_REST_DOWN = 4;
const PLAYER_GRAPHIC_POSE_ID_GRAB = 5;
const PLAYER_GRAPHIC_POSE_ID_INSERT = 6;
const PLAYER_GRAPHIC_POSE_ID_PICK_UP = 7;
const PLAYER_GRAPHIC_POSE_ID_THROW_WIND_UP = 8;
const PLAYER_GRAPHIC_POSE_ID_THROW_PITCH = 9;
const PLAYER_GRAPHIC_POSE_ID_DROP = 10;
const PLAYER_GRAPHIC_POSE_ID_PUSH_BUTTON = 11;

const playerPalette: HSL[] = [
    [40, 5, 60], // font body colour
    [40, 5, 40], // side body colour
    [120, 40, 30], // face plate colour
    [40, 5, 10], // legs/arms/buttons
    [0, 100, 40], // red
];

const playerGraphic: Graphic = {
    imageryWidth: 22, 
    imageryHeight: 30, 
    imagery: [
        // front panel
        [
            [0, 0, 20, 26, PLAYER_GRAPHIC_PALETTE_INDEX_FRONT_BODY], // panel
            [2, 6, 16, 8, PLAYER_GRAPHIC_PALETTE_INDEX_SIDE_BODY], // tape area
            [3, 0, 14, 4, PLAYER_GRAPHIC_PALETTE_INDEX_LEGS], // button area
            [3, 0, 3, 4, PLAYER_GRAPHIC_PALETTE_INDEX_RECORD_BUTTON], // record button
            [3, 16, 2, 2, PLAYER_GRAPHIC_PALETTE_INDEX_SIDE_BODY], // speaker hole
            [9, 16, 2, 2, PLAYER_GRAPHIC_PALETTE_INDEX_SIDE_BODY], // speaker hole
            [15, 16, 2, 2, PLAYER_GRAPHIC_PALETTE_INDEX_SIDE_BODY], // speaker hole
            [3, 21, 2, 2, PLAYER_GRAPHIC_PALETTE_INDEX_SIDE_BODY], // speaker hole
            [9, 21, 2, 2, PLAYER_GRAPHIC_PALETTE_INDEX_SIDE_BODY], // speaker hole
            [15, 21, 2, 2, PLAYER_GRAPHIC_PALETTE_INDEX_SIDE_BODY], // speaker hole
        ],
        // side panel
        [
            [-8, 0, 8, 26, PLAYER_GRAPHIC_PALETTE_INDEX_SIDE_BODY], 
        ],
        // leg + foot
        [
            [-2, 0, 4, 2, PLAYER_GRAPHIC_PALETTE_INDEX_LEGS], 
            [-3, 2, 8, 2, PLAYER_GRAPHIC_PALETTE_INDEX_LEGS], 
        ],
        // arm
        [
            [-2, 0, 4, 8, PLAYER_GRAPHIC_PALETTE_INDEX_LEGS], 
        ], 
        // eye
        [
            [-.5, -1, 1, 2, PLAYER_GRAPHIC_PALETTE_INDEX_LEGS],
            [-1, -.5, 2, 1, PLAYER_GRAPHIC_PALETTE_INDEX_LEGS],  
        ], 
        // handle
        [
            [-5, -4, 2, 4, PLAYER_GRAPHIC_PALETTE_INDEX_SIDE_BODY], // handle left
            [15, -4, 2, 4, PLAYER_GRAPHIC_PALETTE_INDEX_SIDE_BODY], // handle right
            [-5, -4, 22, 2, PLAYER_GRAPHIC_PALETTE_INDEX_SIDE_BODY], // handle top
        ],
    ], 
    joints: [{
        id: PLAYER_GRAPHIC_JOINT_ID_BODY, // body
        transformations: [{
            transformType: TRANSFORM_TYPE_TRANSLATE, 
            dx: -6, 
            dy: 0, 
        }], 
        renderAfter: [{
            id: PLAYER_GRAPHIC_JOINT_ID_LEFT_LEG, // left leg
            imageIndex: PLAYER_GRAPHIC_IMAGE_INDEX_LEG, // leg 
            transformations: [{
                transformType: TRANSFORM_TYPE_TRANSLATE, 
                dx: 0, 
                dy: 26, 
            }], 
        }, {
            id: PLAYER_GRAPHIC_JOINT_ID_RIGHT_LEG, // right leg
            imageIndex: PLAYER_GRAPHIC_IMAGE_INDEX_LEG, // leg 
            transformations: [{
                transformType: TRANSFORM_TYPE_TRANSLATE, 
                dx: 14, 
                dy: 26, 
            }], 
        }, {
            id: PLAYER_GRAPHIC_JOINT_ID_TORSO, // torso
            renderAfter: [{
                id: PLAYER_GRAPHIC_JOINT_ID_FRONT_PANEL, // front panel
                imageIndex: PLAYER_GRAPHIC_IMAGE_INDEX_FRONT_PANEL, // font panel
                renderBefore: [{
                    id: PLAYER_GRAPHIC_JOINT_ID_LEFT_ARM, // left arm
                    imageIndex: PLAYER_GRAPHIC_IMAGE_INDEX_ARM, // arm
                    transformations: [{
                        transformType: TRANSFORM_TYPE_TRANSLATE, 
                        dx: 18, 
                        dy: 8, 
                    }], 
                }, { // handle
                    id: PLAYER_GRAPHIC_JOINT_ID_HANDLE, // handle
                    imageIndex: PLAYER_GRAPHIC_IMAGE_INDEX_HANDLE, // handle
                }], 
                renderAfter: [{
                    id: PLAYER_GRAPHIC_JOINT_ID_LEFT_EYE, // left eye
                    imageIndex: PLAYER_GRAPHIC_IMAGE_INDEX_EYE, // eye
                    transformations: [{
                        transformType: TRANSFORM_TYPE_TRANSLATE, 
                        dx: 7, 
                        dy: 10, 
                    }], 
                }, {
                    id: PLAYER_GRAPHIC_JOINT_ID_RIGHT_EYE, // right eye
                    imageIndex: PLAYER_GRAPHIC_IMAGE_INDEX_EYE, // eye
                    transformations: [{
                        transformType: TRANSFORM_TYPE_TRANSLATE, 
                        dx: 14, 
                        dy: 10, 
                    }],
                }, {
                    id: PLAYER_GRAPHIC_JOINT_ID_TAPE_DECK, 
                    transformations: [{
                        transformType: TRANSFORM_TYPE_TRANSLATE, 
                        dx: 10.5, 
                        dy: 6,                         
                    }]
                }], 
            }, {
                id: PLAYER_GRAPHIC_JOINT_ID_SIDE_PANEL, // side panel
                imageIndex: PLAYER_GRAPHIC_IMAGE_INDEX_SIDE_PANEL, // side panel
                renderAfter: [{
                    id: PLAYER_GRAPHIC_JOINT_ID_RIGHT_ARM, // right arm
                    imageIndex: PLAYER_GRAPHIC_IMAGE_INDEX_ARM, // arm
                    transformations: [{
                        transformType: TRANSFORM_TYPE_TRANSLATE, 
                        dx: -5, 
                        dy: 8, 
                    }],
                    renderAfter: [{
                        id: PLAYER_GRAPHIC_JOINT_ID_RIGHT_HAND, 
                        transformations: [{
                            transformType: TRANSFORM_TYPE_TRANSLATE, 
                            dx: 0, 
                            dy: 6,                                 
                        }]
                    }] 
                }], 
            }], 
        }], 
    }], 
    poses: [
        // step left (0)
        {
            [PLAYER_GRAPHIC_JOINT_ID_BODY]: [{// body
                transformType: TRANSFORM_TYPE_TRANSLATE, 
                dx: -6, 
                dy: 0, 
            }, {
                transformType: TRANSFORM_TYPE_ROTATE, 
                angle: Math.PI/20, 
            }], 
            [PLAYER_GRAPHIC_JOINT_ID_FRONT_PANEL]: [{ // front panel
                transformType: TRANSFORM_TYPE_SCALE, 
                scaleX: 1.2,
                scaleY: 1, 
            }],
            [PLAYER_GRAPHIC_JOINT_ID_SIDE_PANEL]: [{ // side panel
                transformType: TRANSFORM_TYPE_SCALE, 
                scaleX: .6, 
                scaleY: 1, 
            }], 
            [PLAYER_GRAPHIC_JOINT_ID_LEFT_LEG]: [{ // left leg
                transformType: TRANSFORM_TYPE_TRANSLATE, 
                dx: 0, 
                dy: -6, 
            }, {
                transformType: TRANSFORM_TYPE_ROTATE, 
                angle: Math.PI/5, 
            }], 
            [PLAYER_GRAPHIC_JOINT_ID_RIGHT_ARM]: [{ // right arm
                transformType: TRANSFORM_TYPE_ROTATE, 
                angle: -Math.PI/3, 
            }], 
            [PLAYER_GRAPHIC_JOINT_ID_LEFT_ARM]: [{ // left arm
                transformType: TRANSFORM_TYPE_ROTATE, 
                angle: Math.PI/3, 
            }], 
            [PLAYER_GRAPHIC_JOINT_ID_HANDLE]: [{ // handle
                transformType: TRANSFORM_TYPE_SCALE, 
                scaleX: .8, 
                scaleY: 1, 
            }, {
                transformType: TRANSFORM_TYPE_TRANSLATE, 
                dx: 3, 
                dy: 0, 
            }],
        }, 
        // step right (1)
        {
            [PLAYER_GRAPHIC_JOINT_ID_BODY]: [{ // body
                transformType: TRANSFORM_TYPE_TRANSLATE, 
                dx: 6, 
                dy: 0, 
            }, {
                transformType: TRANSFORM_TYPE_ROTATE, 
                angle: -Math.PI/20, 
            }], 
            [PLAYER_GRAPHIC_JOINT_ID_FRONT_PANEL]: [{ // front panel
                transformType: TRANSFORM_TYPE_SCALE, 
                scaleX: .6,
                scaleY: 1, 
            }],
            [PLAYER_GRAPHIC_JOINT_ID_SIDE_PANEL]: [{ // side panel
                transformType: TRANSFORM_TYPE_SCALE, 
                scaleX: 1.2, 
                scaleY: 1, 
            }], 
            [PLAYER_GRAPHIC_JOINT_ID_LEFT_LEG]: [{ // left leg
                transformType: TRANSFORM_TYPE_TRANSLATE, 
                dx: -4, 
                dy: 0, 
            }], 
            [PLAYER_GRAPHIC_JOINT_ID_RIGHT_LEG]: [{ // right leg
                transformType: TRANSFORM_TYPE_TRANSLATE, 
                dx: -4, 
                dy: -6, 
            }, {
                transformType: TRANSFORM_TYPE_ROTATE, 
                angle: Math.PI/5, 
            }], 
            [PLAYER_GRAPHIC_JOINT_ID_RIGHT_ARM]: [{ // right arm
                transformType: TRANSFORM_TYPE_ROTATE, 
                angle: Math.PI/3, 
            }], 
            [PLAYER_GRAPHIC_JOINT_ID_LEFT_ARM]: [{ // left arm
                transformType: TRANSFORM_TYPE_ROTATE, 
                angle: -Math.PI/3, 
            }],
            [PLAYER_GRAPHIC_JOINT_ID_HANDLE]: [{ // handle
                transformType: TRANSFORM_TYPE_SCALE, 
                scaleX: .7, 
                scaleY: 1, 
            }] 
        },
        // jump (2)
        {  
            [PLAYER_GRAPHIC_JOINT_ID_LEFT_LEG]: [{ // left leg
                transformType: TRANSFORM_TYPE_ROTATE, 
                angle: Math.PI/8
            }], 
            [PLAYER_GRAPHIC_JOINT_ID_RIGHT_LEG]: [{ // right leg
                transformType: TRANSFORM_TYPE_ROTATE, 
                angle: -Math.PI/8
            }], 
            [PLAYER_GRAPHIC_JOINT_ID_RIGHT_ARM]: [{ // right arm
                transformType: TRANSFORM_TYPE_ROTATE, 
                angle: Math.PI*2/3, 
            }], 
            [PLAYER_GRAPHIC_JOINT_ID_LEFT_ARM]: [{ // left arm
                transformType: TRANSFORM_TYPE_ROTATE, 
                angle: -Math.PI*2/3, 
            }], 
        }, 
        // rest up (3)
        {
            [PLAYER_GRAPHIC_JOINT_ID_TORSO]: [{ // torso
                transformType: TRANSFORM_TYPE_TRANSLATE, 
                dx: 0, 
                dy: -2, 
            }, {
                transformType: TRANSFORM_TYPE_SCALE, 
                scaleX: .95,
                scaleY: 1.1, 
            }]
        }, 
        // rest down (4)
        {
            // defaults
        }, 
        // grab (5)
        {
            [PLAYER_GRAPHIC_JOINT_ID_BODY]: [{ // body
                transformType: TRANSFORM_TYPE_TRANSLATE, 
                dx: -6, 
                dy: 0, 
            }, {
                transformType: TRANSFORM_TYPE_ROTATE, 
                angle: -Math.PI/10, 
            }], 
            [PLAYER_GRAPHIC_JOINT_ID_RIGHT_ARM]: [{ // right arm
                transformType: TRANSFORM_TYPE_ROTATE, 
                angle: Math.PI/10
            }],
            [PLAYER_GRAPHIC_JOINT_ID_LEFT_ARM]: [{ // left arm
                transformType: TRANSFORM_TYPE_ROTATE, 
                angle: -Math.PI/3
            }]
        },
        // insert
        {
            [PLAYER_GRAPHIC_JOINT_ID_RIGHT_ARM]: [{
                transformType: TRANSFORM_TYPE_ROTATE, 
                angle: -Math.PI/2
            }], 
            [PLAYER_GRAPHIC_JOINT_ID_RIGHT_HAND]: [{
                transformType: TRANSFORM_TYPE_ROTATE, 
                angle: Math.PI/2
            }], 
        },
        // pick up
        {
            [PLAYER_GRAPHIC_JOINT_ID_TORSO]: [, {
                transformType: TRANSFORM_TYPE_SCALE, 
                scaleX: 1.1, 
                scaleY: 0.8, 
            }, {
                transformType: TRANSFORM_TYPE_TRANSLATE, 
                dx: 0, 
                dy: 10, 
            }], 
            [PLAYER_GRAPHIC_JOINT_ID_RIGHT_ARM]: [{
                transformType: TRANSFORM_TYPE_ROTATE, 
                angle: -Math.PI/4, 
            }],
        }, 
        // throw wind up
        {
            [PLAYER_GRAPHIC_JOINT_ID_BODY]: [, {
                transformType: TRANSFORM_TYPE_ROTATE, 
                angle: -Math.PI/4, 
                aroundX: 3, 
                aroundY: 26, 
            }], 
            [PLAYER_GRAPHIC_JOINT_ID_TORSO]: [{
                transformType: TRANSFORM_TYPE_SCALE, 
                scaleX: 1.2, 
                scaleY: 0.8, 
            }, {
                transformType: TRANSFORM_TYPE_TRANSLATE, 
                dx: 0, 
                dy: 10, 
            }],            
            [PLAYER_GRAPHIC_JOINT_ID_RIGHT_ARM]: [{
                transformType: TRANSFORM_TYPE_ROTATE, 
                angle: Math.PI*3/4, 
            }],
            [PLAYER_GRAPHIC_JOINT_ID_RIGHT_LEG]: [{
                transformType: TRANSFORM_TYPE_ROTATE, 
                angle: Math.PI/4, 
            }],
        }, 
        // throw pitch
        {
            [PLAYER_GRAPHIC_JOINT_ID_BODY]: [{
                transformType: TRANSFORM_TYPE_ROTATE, 
                angle: Math.PI/4, 
                aroundX: 10, 
                aroundY: 26, 
            }], 
            [PLAYER_GRAPHIC_JOINT_ID_TORSO]: [{
                transformType: TRANSFORM_TYPE_SCALE, 
                scaleX: .9, 
                scaleY: 1.2, 
            }, {
                transformType: TRANSFORM_TYPE_TRANSLATE, 
                dx: 0, 
                dy: -4, 
            }],            
            [PLAYER_GRAPHIC_JOINT_ID_RIGHT_ARM]: [{
                transformType: TRANSFORM_TYPE_ROTATE, 
                angle: 3*Math.PI/2, 
            }],
            [PLAYER_GRAPHIC_JOINT_ID_RIGHT_LEG]: [{
                transformType: TRANSFORM_TYPE_ROTATE, 
                angle: -Math.PI/4, 
            }],
        }, 
        // drop 
        {            
            [PLAYER_GRAPHIC_JOINT_ID_RIGHT_ARM]: [{
                transformType: TRANSFORM_TYPE_ROTATE, 
                angle: -Math.PI/3, 
            }],    
        }, 
        // push a button 
        {
            [PLAYER_GRAPHIC_JOINT_ID_RIGHT_ARM]: [{
                transformType: TRANSFORM_TYPE_ROTATE, 
                angle: -Math.PI*3/4, 
            }, {
                transformType: TRANSFORM_TYPE_TRANSLATE, 
                dx: 0, 
                dy: 4, 
            }],    
        }
    ],
    animations: {
        [ANIMATION_ID_WALKING]: { // walk (0)
            poseDuration: 300, 
            poseIds: [PLAYER_GRAPHIC_POSE_ID_STEP_LEFT, PLAYER_GRAPHIC_POSE_ID_STEP_RIGHT], // step left, step right
        }, 
        [ANIMATION_ID_JUMPING]: { // jump (1)
            poseDuration: 400, 
            poseIds: [PLAYER_GRAPHIC_POSE_ID_JUMP], // jump
            count: 1, 
        },
        [ANIMATION_ID_RESTING]: {
            poseDuration: 1000, 
            poseIds: [PLAYER_GRAPHIC_POSE_ID_REST_UP, PLAYER_GRAPHIC_POSE_ID_REST_DOWN], 
        }, 
        [ANIMATION_ID_GRABBING]: {
            poseDuration: 100, 
            poseIds: [PLAYER_GRAPHIC_POSE_ID_GRAB], 
            count: 1, 
        }, 
        [ANIMATION_ID_INSERTING]: {
            poseDuration: 300, 
            poseIds: [PLAYER_GRAPHIC_POSE_ID_INSERT], 
        }, 
        [ANIMATION_ID_PICKING_UP]: {
            poseDuration: 200, 
            poseIds: [PLAYER_GRAPHIC_POSE_ID_PICK_UP], 
        }, 
        [ANIMATION_ID_THROWING]: { 
            poseDuration: 180, 
            poseIds: [PLAYER_GRAPHIC_POSE_ID_THROW_WIND_UP, PLAYER_GRAPHIC_POSE_ID_THROW_PITCH],
        }, 
        [ANIMATION_ID_DROPPING]: {
            poseDuration: 200, 
            poseIds: [PLAYER_GRAPHIC_POSE_ID_DROP], 
        }, 
        [ANIMATION_ID_PRESSING_BUTTON]: {
            poseDuration: 300, 
            poseIds: [PLAYER_GRAPHIC_POSE_ID_PUSH_BUTTON], 
            count: 1, 
        }, 
        [ANIMATION_ID_DEATH]: {
            poseDuration: 100, 
            poseIds: [PLAYER_GRAPHIC_POSE_ID_JUMP], 
        }
    }, 
};
