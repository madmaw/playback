const ANIMATION_ID_RESTING = 0;
const ANIMATION_ID_WALKING = 1;
const ANIMATION_ID_JUMPING = 2;
const ANIMATION_ID_GRABBING = 3;

type HSL = [number, number, number];

type RectangleWithPaletteIndex = [number, number, number, number, number];

type Image = RectangleWithPaletteIndex[];

type Joint = {
    id?: number, 
    imageIndex?: number;
    transformations?: Transform[];
    renderBefore?: Joint[];
    renderAfter?: Joint[];
}

type Pose = {[_:number]: Transform[]};

type AnimationSequence = {
    poseIds: number[];
    poseDuration: number;
    repeat?: number;
}

type Graphic = {
    width: number;
    height: number;
    palette: HSL[];
    images: Image[];
    joints: Joint[];
    poses?: Pose[];
    animations?: {[_:number]: AnimationSequence};
}

const TRANSFORM_TYPE_SCALE = 0;
const TRANSFORM_TYPE_TRANSLATE = 1;
const TRANSFORM_TYPE_ROTATE = 2;
const TRANSFORM_TYPE_OPACITY = 3;
type Transform = {
    transformType: 0;
    scaleX: number;
    scaleY: number;
} | {
    transformType: 1;
    dx: number;
    dy: number;
} | {
    transformType: 2;
    rotation: number;
} | {
    transformType: 3;
    opacity: number;
};

interface PostJointRenderCallback {
    (c: CanvasRenderingContext2D, joint: Joint): void;
}

let drawGraphic = (c: CanvasRenderingContext2D, g: Graphic, callback: PostJointRenderCallback, toPoseId?: number, fromPoseId?: number, progress: number = 1) => {
    let toPose = g.poses && g.poses[toPoseId];
    let fromPose = g.poses && g.poses[fromPoseId];
    drawGraphicJoints(c, g, g.joints, callback, toPose, fromPose, progress)
};

let drawGraphicJoints = (c: CanvasRenderingContext2D, g: Graphic, joints: Joint[], callback: PostJointRenderCallback, toPose: Pose, fromPose: Pose | undefined, progress: number) => {
    if (joints) {
        joints.forEach(j => {
            c.save();
            applyGraphicTransformations(c, j.transformations, 1);
            if (toPose) {
                applyGraphicTransformations(c, toPose[j.id], progress);
            }
            if (fromPose && progress < 1) {
                applyGraphicTransformations(c, fromPose[j.id], 1-progress);
            }
            drawGraphicJoints(c, g, j.renderBefore, callback, toPose, fromPose, progress);
            if (j.imageIndex != null) {
                g.images[j.imageIndex].forEach(image => {                
                    const [ix, iy, iw, ih, paletteIndex] = image;
                    const [h, s, l] = g.palette[paletteIndex];
                    c.fillStyle = `hsl(${h},${s}%,${l}%)`;    
                    c.fillRect(ix, iy, iw, ih);
                });    
            }
            drawGraphicJoints(c, g, j.renderAfter, callback, toPose, fromPose, progress);
            callback(c, j);
            c.restore();        
        });    
    }
};

let applyGraphicTransformations = (c: CanvasRenderingContext2D, transforms: Transform[], progress: number) => {
    if (transforms) {
        transforms.forEach(t => {
            switch(t.transformType) {
                case 0: 
                    c.scale(1 - (1 - t.scaleX) * progress, 1 - (1 - t.scaleY) * progress);
                    break;
                case 1: 
                    c.translate(t.dx * progress, t.dy * progress);
                    break;
                case 2: 
                    c.rotate(t.rotation * progress);
                    break;
                case 3:
                    c.globalAlpha = t.opacity * progress;
                    break;
            }
        });    
    }
}