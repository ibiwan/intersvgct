const { Bezier } = require("bezier-js");

const { makeDel } = require("../geom/del");
const { makePt } = require("../geom/pt");

// const b = new Bezier(...);
// http://pomax.github.io/bezierjs/
// 2d:
// coordinate: {x:#, y:#}
// new Bezier(coord, coord, coord)        (quad)
// new Bezier(#, #, #, #, #, #)           (quad)
// new Bezier(#, #, #, #, #, #, #, #)     (cub)
// new Bezier(coord, coord, coord, coord) (cub)
// curve.getLUT(n) (# intervals to precomp)
// curve.get(t) (get point at t)
// curve.split(t) (get two curves from original divided at t)
// curve.split(t1, t2) (get one curve covering an interval of orig)
// curve.bbox bounding box
// curve.intersects() (self, returns array of "#/#" string)
// curve.intersects(line), curve.intersects(curve2, *) (["#/#"])
// * optional curveIntersectionThreshold, default 0.5

const paramRE = /^(?<delta>d?)[xy](?<num>\d?)$/;
const bj = (start, params) => {
    const base = makePt(start);
    const handled = {};
    const parsed = {};
    const iPoints = [];
    const orphans = [];
    let last = null;
    Object.keys(params).forEach((key) => {
        if (key in handled) {
            return;
        }
        const result = paramRE.exec(key)?.groups;
        if (!result) {
            orphans.push(params[key]);
            return;
        }
        const { delta, num: numStr = "" } = result;
        // unnumbered means ending point and indexes should never go above 3
        const num = Number.parseInt(numStr);
        const xi = delta + "x" + numStr;
        const yi = delta + "y" + numStr;
        const obji = (delta ? "del" : "pt") + num;
        let pt;

        if (delta) {
            // dx or dy can be missing in "xto" and "yto" cases
            const del = makeDel(params[xi] ?? 0, params[yi] ?? 0);
            parsed[obji] = del;
            pt = base.add(del);
        } else {
            pt = makePt(params[xi], params[yi]);
            parsed[obji] = pt;
        }

        if (num) {
            iPoints[num] = pt;
        } else {
            last = pt;
        }

        handled[xi] = handled[yi] = true;
    });

    if (last) {
        iPoints.push(last);
    }

    if (iPoints.length == 0 && orphans.length == 2) {
        iPoints.push(makePt(orphans));
    } else {
        if (orphans.length > 0) {
            console.log("unhandled orphans", orphans);
        }
    }

    const points = [base, ...iPoints].filter((x) => x);
    return points;
};

const bjLine = (start, params, style) => {
    const [a, b] = bj(start, params);
    if (a.eq(b)) {
        return "no op";
    }
    return { type: "line", geom: { p1: a, p2: b }, ...style };
};

const bjCircle = (start, params, style) => {
    return {
        type: "circle",
        geom: { c: makePt(start), r: params.r },
        ...style,
    };
};

const bjCubic = (start, params, style) => {
    const points = bj(start, params);
    return { type: "bezier", geom: new Bezier(...points), ...style };
};

module.exports = {
    bjLine,
    bjCubic,
    bjCircle,
};
