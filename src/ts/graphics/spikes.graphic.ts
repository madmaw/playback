const SPIKES_GRAPHIC_PALETTE_INDEX_LIGHT = 0;
const SPIKES_GRAPHIC_PALETTE_INDEX_DARK = 1;

const SPIKES_GRAPHIC_IMAGE_INDEX_SPIKE = 0;

const spikesPalette: HSL[] = [
    [0, 0, 99], 
    [0, 0, 40], 
]

const randomSpikeGraphic = () => {
    const height = 8;
    const width = 32;
    const joints: Joint[] = [];
    const jointCount = Math.random() * 4 | 0 + 8;
    for (let i=0; i<=jointCount; i++) {
        const p = i / jointCount - .5;
        joints.push({
            imageIndex: SPIKES_GRAPHIC_IMAGE_INDEX_SPIKE, 
            transformations: [{
                transformType: TRANSFORM_TYPE_TRANSLATE, 
                dx: (i + (Math.random() * 2 - 1)) * width/jointCount - width/2 - p * 3, 
                dy: 14, 
            }, {
                transformType: TRANSFORM_TYPE_SCALE, 
                scaleX: (Math.random() + 2) / 3, 
                scaleY: (Math.random() + 2.5 - Math.abs(p)) / 2, 
            }, {
                transformType: TRANSFORM_TYPE_ROTATE, 
                rAngle: LOW_P_MATH_PI * (Math.random() - .5)/9 + p * LOW_P_MATH_PI/9, 
            }]
        });
    }
    const spikeGraphic: Graphic = {
        imageryWidth: width, 
        imageryHeight: height, 
        imagery: [
            // spike
            [   
                [0, -12, 4, 0, -4, 0, SPIKES_GRAPHIC_PALETTE_INDEX_LIGHT, SPIKES_GRAPHIC_PALETTE_INDEX_DARK], 
            ], 
        ], 
        joints, 
    };
    return spikeGraphic;
}

