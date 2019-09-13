const ANIMATION_ID_NONE = 0;
const ANIMATION_ID_RESTING = 1;
const ANIMATION_ID_WALKING = 2;
const ANIMATION_ID_JUMPING = 3;
const ANIMATION_ID_GRABBING = 4;
const ANIMATION_ID_INSERTING = 5;
const ANIMATION_ID_PICKING_UP = 6;
const ANIMATION_ID_THROWING = 7;
const ANIMATION_ID_DROPPING = 8;
const ANIMATION_ID_PRESSING_BUTTON = 9;
const ANIMATION_ID_DEATH = 10;
const ANIMATION_ID_CARRYING = 11;
const ANIMATION_ID_SHOOTING = 12;
const ANIMATION_ID_SAVING = 13;

type HSL = [number, number, number];

type RectangleWithPaletteIndex = [number, number, number, number, number, (number | [number, number?, number?, number?])?, number?];
type TriangleWithPaletteIndex = [number, number, number, number, number, number, number, number];

type Image = (RectangleWithPaletteIndex | TriangleWithPaletteIndex)[];

type Joint = {
    gid?: number, 
    imageIndex?: number;
    transformations?: Transform[];
    renderBefore?: Joint[];
    renderAfter?: Joint[];
}

type Pose = {[_:number]: Transform[]};

type AnimationSequence = {
    poseIds: number[];
    poseDuration: number;
    repeatCount?: number;
}

type Graphic = {
    imageryWidth: number;
    imageryHeight: number;
    imagery: Image[];
    joints: Joint[];
    poses?: Pose[];
    animations?: {[_:number]: AnimationSequence};
    cachedStyles?: {[_: number]: string};
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
    rAngle: number;
    aroundX?: number;
    aroundY?: number;
} | {
    transformType: 3;
    opacity: number;
};

interface PostJointRenderCallback {
    (c: CanvasRenderingContext2D, joint: Joint): void;
}

type PoseAndProgress = {
    poseId: number;
    animationProgress: number;
}

let hslToStyle = (hsl: HSL) => {
    const [h, s, l] = hsl;
    return `hsl(${h},${s}%,${l}%)`
};

let drawGraphic = (c: CanvasRenderingContext2D, g: Graphic, palette: HSL[], callback: PostJointRenderCallback, poses: PoseAndProgress[]) => {
    drawGraphicJoints(c, g, palette, g.joints, callback, poses)
};

let drawGraphicJoints = (c: CanvasRenderingContext2D, g: Graphic, palette: HSL[], joints: Joint[], callback: PostJointRenderCallback, poses: PoseAndProgress[]) => {
    if (joints) {
        joints.forEach(j => {
            c.save();
            applyGraphicTransformations(c, j.transformations, 1);
            poses.forEach(p => applyGraphicTransformations(c, g.poses[p.poseId][j.gid], p.animationProgress));
            drawGraphicJoints(c, g, palette, j.renderBefore, callback, poses);
            if (j.imageIndex != null) {
                g.imagery[j.imageIndex].forEach(image => {      
                    c.beginPath();
                    let fillPaletteIndex: number;
                    let strokePaletteIndex: number;
                    if (image.length < 8) {
                        // rect
                        let [ix, iy, iw, ih, fpi, r, spi] = image;
                        let r1: number, r2: number, r3: number, r4: number;
                        if (r) {
                            if ((r as number[]).length) {
                                [r1, r2, r3, r4] = r as number[];
                            } else {
                                r1 = r2 = r3 = r4 = r as number;
                            }
                        }
                        r1 = r1 || 0;
                        r2 = r2 || 0;
                        r3 = r3 || 0;
                        r4 = r4 || 0;
                        c.moveTo(ix + r1, iy);
                        c.arcTo(ix + iw, iy, ix + iw, iy + r2, r2);
                        c.arcTo(ix + iw, iy + ih, ix + iw - r3, iy + ih, r3);
                        c.arcTo(ix, iy + ih, ix, iy + r4, r4);
                        c.arcTo(ix, iy, ix + r1, iy, r1);                             
                        fillPaletteIndex = fpi;
                        strokePaletteIndex = spi;
                    } else {
                        // tri
                        let [x1, y1, x2, y2, x3, y3, fpi, spi] = image as number[];
                        c.moveTo(x1, y1);
                        c.lineTo(x2, y2);
                        c.lineTo(x3, y3);
                        c.lineTo(x1, y1);
                        fillPaletteIndex = fpi;
                        strokePaletteIndex = spi;
                    }      
                    c.fillStyle = hslToStyle(palette[fillPaletteIndex]);
                    c.fill();
                    if (strokePaletteIndex != null) {
                        c.strokeStyle = hslToStyle(palette[strokePaletteIndex]);
                        c.lineWidth = 1;
                        c.stroke();
                    }
                });    
            }
            drawGraphicJoints(c, g, palette, j.renderAfter, callback, poses);
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
                    c.translate(t.aroundX || 0, t.aroundY || 0);
                    c.rotate(t.rAngle * progress);
                    c.translate(-t.aroundX || 0, -t.aroundY || 0);
                    break;
                case 3:
                    c.globalAlpha = t.opacity * progress;
                    break;
            }
        });    
    }
}