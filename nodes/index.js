const css = require("css");

const { print: printPath } = require("./path");
const { print: printRect } = require("./rect");
const { print: printCircle } = require("./circle");
const { print: printG } = require("./g");
const { print: printRoot } = require("./root");
const { print: printSvg } = require("./svg");

const fillReg = /fill:(?<fill>[^;]*);/;
const strokeReg = /stroke-width:(?<stroke>[^;]*);/;
const fillVals = {};
const strokeVals = {};

const handlers = {
    path: printPath,
    rect: printRect,
    circle: printCircle,
    root: printRoot,
    g: printG,
    svg: printSvg,
};

const printNode = (element, ctx) => {
    const { tab, name } = ctx;

    console.log(tab + name);

    const sel = element?.tagName ?? element?.type;

    if (!(sel in handlers)) {
        console.log({ element });
        throw "unknown node type";
    }

    handlers[sel](tab, element);

    printCommon(tab, element);

    if (sel == "root") {
        console.log({ fillVals });
        console.log({ strokeVals });
    }
};

const printCommon = (prefix, node) => {
    const { transform, style } = node?.properties ?? {};

    if (transform) {
        console.log(prefix + `* xform: '${transform}'`);
    }

    if (style) {
        printStyle(prefix, style);
    }
};

const snakeToCamel = (str) =>
    str
        .toLowerCase()
        .replace(/([-_][a-z])/g, (group) =>
            group.toUpperCase().replace("-", "").replace("_", "")
        );

const rgbRe = /^rgb\(([^,]+),([^,]+),([^,]+)\)$/;
const szRe = /^(-?[\d.]+)(.*)$/;

const parseValue = (property, value) => {
    if (value === "none") {
        return null;
    }
    switch (property) {
        case "fill":
        case "stroke":
            const rgbResult = rgbRe.exec(value);
            if (rgbResult) {
                return {
                    type: "rgb",
                    params: {
                        r: rgbResult[1],
                        g: rgbResult[2],
                        b: rgbResult[3],
                    },
                };
            }
        case "stroke-width":
            const szResult = szRe.exec(value);
            if (szResult) {
                return {
                    type: "size",
                    params: {
                        val: szResult[1],
                        unit: szResult[2],
                    },
                };
            }
        default:
            console.log("unk", { property, value });
            return value;
    }
};

const parseStyle = (style) => {
    if (!style) {
        return style;
    }
    const declarations = css.parse(`.{${style}}`).stylesheet.rules[0]
        .declarations;

    const parsed = {};
    declarations.forEach(({ property, value }) => {
        parsed[snakeToCamel(property)] = parseValue(property, value);
    });

    return parsed;
};

const printStyle = (prefix, style) => {
    const fill = fillReg.exec(style)?.groups?.fill;
    const stroke = strokeReg.exec(style)?.groups?.stroke;

    console.log(prefix + `* fill: '${fill}'`);
    console.log(prefix + `* stroke: '${stroke}'`);

    fillVals[fill] = true;
    strokeVals[stroke] = true;
};

module.exports = { printNode, parseStyle };
