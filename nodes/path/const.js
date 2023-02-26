const xEnd = "xEnd";
const yEnd = "yEnd";
const dx = "dx";
const dy = "dy";
const x1 = "x1";
const x2 = "x2";
const y1 = "y1";
const y2 = "y2";
const dx1 = "dx1";
const dx2 = "dx2";
const dy1 = "dy1";
const dy2 = "dy2";
const rx = "rx";
const ry = "ry";
const ang = "ang";
const larc = "larc";
const swp = "swp";

const spaces = " ,\t\n";
const numbers = "0123456789-.";

const n = 4;
const factor = Math.pow(10, n);

const commands = {
    M: {
        name: "moveTo",
        absolute: true,
        n: 2,
        implicitNext: "L",
        fields: [xEnd, yEnd],
    },
    m: {
        name: "moveTo",
        absolute: false,
        n: 2,
        implicitNext: "l",
        fields: [dx, dy],
    },
    L: {
        name: "lineTo",
        absolute: true,
        n: 2,
        fields: [xEnd, yEnd],
    },
    l: {
        name: "lineTo",
        absolute: false,
        n: 2,
        fields: [dx, dy],
    },
    H: {
        name: "xTo",
        absolute: true,
        n: 1,
        fields: [xEnd],
    },
    h: {
        name: "xTo",
        absolute: false,
        n: 1,
        fields: [dx],
    },
    V: {
        name: "yTo",
        absolute: true,
        n: 1,
        fields: [yEnd],
    },
    v: {
        name: "yTo",
        absolute: false,
        n: 1,
        fields: [dy],
    },
    C: {
        name: "cubic",
        absolute: true,
        n: 6,
        fields: [x1, y1, x2, y2, xEnd, yEnd],
    },
    c: {
        name: "cubic",
        absolute: false,
        n: 6,
        fields: [dx1, dy1, dx2, dy2, dx, dy],
    },
    S: {
        name: "cubicSmooth",
        absolute: true,
        n: 4,
        fields: [x2, y2, xEnd, yEnd],
    },
    s: {
        name: "cubicSmooth",
        absolute: false,
        n: 4,
        fields: [dx2, dy2, dx, dy],
    },
    Q: {
        name: "quartic",
        absolute: true,
        n: 4,
        fields: [x1, y1, xEnd, yEnd],
    },
    q: {
        name: "quartic",
        absolute: false,
        n: 4,
        fields: [dx1, dy1, dx, dy],
    },
    T: {
        name: "quarticSmoothth",
        absolute: true,
        n: 2,
        fields: [xEnd, yEnd],
    },
    t: {
        name: "quarticSmoothth",
        absolute: false,
        n: 2,
        fields: [dx, dy],
    },
    A: {
        name: "elliptic",
        absolute: true,
        n: 7,
        fields: [rx, ry, ang, larc, swp, xEnd, yEnd],
    },
    a: {
        name: "elliptic",
        absolute: false,
        n: 7,
        fields: [rx, ry, ang, larc, swp, dx, dy],
    },
    Z: { name: "close", reset: true },
    z: { name: "close", reset: true },
};

module.exports = {
    spaces,
    numbers,
    factor,
    commands,
};
