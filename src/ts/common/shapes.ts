const EDGE_LEFT = 0;
const EDGE_TOP = 1;
const EDGE_RIGHT = 2;
const EDGE_BOTTOM = 3;

type Edge = 0 | 1 | 2 | 3;

const EDGE_OFFSETS: Vector[] = [
    [-1, 0], 
    [0, -1], 
    [1, 0],
    [0, 1], 
];

type Rectangle = [number, number, number, number];

type Vector = [number, number];

const rectangleCenterBounds = (x: number, y: number, w: number, h: number) => [x + (1 - w)/2, y + 1 - h, w, h] as Rectangle;

// let rectangleLineOverlaps = (r1: Rectangle, r2: Rectangle) => 
//     axisMap(r1, r2, ([scalar1, length1]: number[], [scalar2, length2]: number[]) => {
//         const min1 = scalar1;
//         const min2 = scalar2;
//         const max1 = scalar1 + length1;
//         const max2 = scalar2 + length2;
//         return min1 >= min2 && min1 < max2 || min2 >= min1 && min2 < max1;
//     });

// let rectangleOverlaps = (r1: Rectangle, r2: Rectangle) => {
//     const overlap = rectangleLineOverlap(r1, r2);
//     return overlap[0] && overlap[1];
// };

let rectangleLineOverlap = (r1: Rectangle, r2: Rectangle) => 
    axisMap(r1, r2, ([scalar1, length1]: number[], [scalar2, length2]: number[]) => {
        const min1 = scalar1;
        const min2 = scalar2;
        const max1 = scalar1 + length1;
        const max2 = scalar2 + length2;
        return Math.max(0, Math.min(max1, max2) - Math.max(min1, min2));
    });

let rectangleOverlap = (r1: Rectangle, r2: Rectangle) => {
    const overlap = rectangleLineOverlap(r1, r2);
    return overlap[0] * overlap[1];
}

let rectangleRoundInBounds = (r: Rectangle, roomBounds: Rectangle) => {
    return axisMap(r, roomBounds, ([s, l]: [number, number], [_, max]: [number, number]) => {
        let maxRounded = Math.min(Math.floor(s + l), max - 1);
        let minRounded = Math.max(0, Math.floor(s));
        return [minRounded, maxRounded];
    });
}

let rectangleIterateBounds = (bounds: Rectangle | undefined, roomBounds: Rectangle, i: (x: number, y: number) => void) => {
    if (bounds) {
        const [[minx, maxx], [miny, maxy]] = rectangleRoundInBounds(bounds, roomBounds);
        for (let tx=minx; tx<=maxx; tx++) {
            for (let ty=miny; ty<=maxy; ty++) {
                i(tx, ty);
            }
        }    
    }
}

const axisFilter1 = (_: any, i: number) => i % 2 == 0;
const axisFilter2 = (_: any, i: number) => i % 2 > 0;

let axisMap = <T>(r1: number[], r2: number[], t: (values: number[], values2: number[], i: number) => T, into: T[] = [], intoOffset = 0): T[] => {
    into[intoOffset] = t(r1.filter(axisFilter1), r2.filter(axisFilter1), 0);
    into[intoOffset+1] = t(r1.filter(axisFilter2), r2.filter(axisFilter2), 1);
    return into as [T, T];
}
