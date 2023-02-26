const makePt = (a, b) => {
    if (b !== undefined) {
        return pairToPt(a, b);
    }
    if (Array.isArray(a)) {
        return arrToPt(a);
    }
    if (a instanceof Pt) {
        return clonePt(a);
    }
    return objToPt(a);
};

module.exports.makePt = makePt;

const pairToPt = (a, b) => new Pt(a, b);
const arrToPt = (a) => new Pt(...a);
const clonePt = (a) => new Pt(a.x, a.y);
const objToPt = (a) => new Pt(a.x, a.y);

const { Del } = require("./del");

class Pt {
    x;
    y;
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
    add(del) {
        if (!del instanceof Del) {
            throw "Can only add deltas (Del) to points";
        }
        return new Pt(this.x + del.dx, this.y + del.dy);
    }
    eq(pt) {
        return this.x == pt.x && this.y == pt.y;
    }
}

module.exports.Pt = Pt;
