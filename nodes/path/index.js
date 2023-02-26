const { spaces, numbers, factor, commands } = require("./const");

const print = (prefix, node) => {
    const { d } = node.properties;
    const commands = parse(d);
    console.log(prefix + JSON.stringify(commands, null, 1));
};

const add = (a, b) => Math.round((a + b + Number.EPSILON) * factor) / factor;

const update = ([x, y], { xEnd = null, yEnd = null, dx = 0, dy = 0 }) => [
    xEnd ?? add(x, dx),
    yEnd ?? add(y, dy),
];

const extract = (values, fields) =>
    fields.reduce(
        (acc, cur, i) => ({
            ...acc,
            [cur]: values[i],
        }),
        {}
    );

const parse = (d) => {
    const result = [];
    const sym = d.split("");
    let currPoint = [null, null];
    let firstPoint = null;

    let implicit = null;
    while (sym.length) {
        let s = sym[0];

        if (spaces.includes(s)) {
            eatSpaces(sym);
            continue;
        }

        const commandKey = numbers.includes(s) ? implicit : sym.shift();

        if (commandKey === null || !commandKey in commands) {
            throw `couldn't figure out what to do: command=${s}`;
        }

        const {
            name,
            absolute,
            n,
            implicitNext,
            fields,
            reset = false,
        } = commands[commandKey];

        implicit = implicitNext ?? s;
        const paramVals = takeNums(sym, n ?? 0);

        const params = fields ? extract(paramVals, fields) : null;
        nextPoint = fields
            ? update(currPoint, params)
            : reset // lint took away my parentheses around these last three
            ? firstPoint
            : currPoint;

        result.push({
            start: currPoint,
            end: nextPoint,
            name,
            absolute,
            params,
        });

        currPoint = nextPoint;
        if (!firstPoint) {
            firstPoint = nextPoint;
        }
    }

    return result;
};

const eatSpaces = (sym) => {
    while (sym.length > 0 && spaces.includes(sym[0])) {
        sym.shift();
    }
};

const takeNums = (sym, n) => {
    const result = [];
    for (let i = 0; i < n; i++) {
        eatSpaces(sym);
        result.push(takeNum(sym));
    }

    return result;
};

const takeNum = (sym) => {
    const result = [];

    if (sym.length === 0) {
        throw "expected a number!";
    }

    while (numbers.includes(sym[0])) {
        result.push(sym.shift());
    }

    const str = result.join("");
    return Number.parseFloat(str);
};

module.exports = { print, parse };
