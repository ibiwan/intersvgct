class Del {
    dx;
    dy;
    constructor(dx, dy) {
        this.dx = dx;
        this.dy = dy;
    }
}

module.exports.Del = Del;

const { makePt } = require("./pt");

const makeDel = (a, b) => {
    if (a instanceof Object && "dx" in a && "dy" in a) {
        return new Del(a.dx, a.dy);
    }
    const pt = makePt(a, b);
    return new Del(pt.x, pt.y);
};

module.exports.makeDel = makeDel;
