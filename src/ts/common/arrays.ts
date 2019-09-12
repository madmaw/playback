let arrayEquals = <T>(a: T[], b: T[]) => {
    return a.length == b.length && arrayEqualsNoBoundsCheck(a, b);
};

let arrayEqualsNoBoundsCheck = <T>(a: T[], b: T[]) => {
    return a.reduce((e, v, i) => e && v == b[i], true);
};

let arrayRemoveElement = <T>(a: T[], e: T) => {
    const index = a.indexOf(e);
    if (index >= 0) {
        a.splice(index, 1);
    }
}

let array2DCreate = <T>(w: number, h: number, factory: (x: number, y: number) => T) => {
    const r: Rectangle = [0, 0, w, h];
    const result: T[][] = [];
    rectangleIterateBounds(r, r, (x, y) => {
        if (!y) {
            result.push([]);
        }
        result[x].push(factory(x, y));
    });
    return result;
};

let objectIterate = <T>(o: {[_: number]: T}, f: (t: T, k: number) => void) => {
    for(let k in o) {
        let v = o[k];
        f(v, k as any);
    }    
}