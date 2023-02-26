const { parse: parseSvg } = require("svg-parser");
const fs = require("fs");

const walkAst = require("./walk");
const { parse: parsePath } = require("./nodes/path");
const { bjLine, bjCubic, bjCircle } = require("./nodes/path/bjs");
const { makeSvgCanvas } = require("./svgCanvas");
const { parseStyle } = require("./nodes");
const { Color } = require("@svgdotjs/svg.js");

const linear = [];
{
    const svgStr = fs.readFileSync("./overlap-tests.svg", "utf-8");
    const ast = parseSvg(svgStr);

    const preorder = (element, ctx) => {
        const {
            tagName,
            type,
            properties,
            properties: { d: pathDef, style } = {},
        } = element;

        const me = tagName ?? type;

        const { i, name: parentName } = ctx;
        ctx.name = `${parentName ?? ""}:${me}${i ? `[${i}]` : ""}`;

        const styleParams = parseStyle(style);

        switch (me) {
            case "g":
                ctx.draw = "FIXME lrn2draw group";
                // (contents are handled but sub-renders aren't)
                break;
            case "path":
                {
                    const commands = parsePath(pathDef);
                    const drawObjs = commands.map((command) => {
                        const { start, end, name, params } = command;
                        switch (name) {
                            case "moveTo":
                                return "no op";
                            case "lineTo":
                            case "xTo":
                            case "yTo":
                                return bjLine(start, params, styleParams);
                            case "cubic":
                                return bjCubic(start, params, styleParams);
                            case "close":
                                return bjLine(start, end, styleParams);
                            default:
                                throw "handle: " + name;
                        }
                    });
                    linear.push(...drawObjs.filter((f) => f !== "no op"));
                    ctx.draw = drawObjs;
                }
                break;
            case "circle":
                {
                    const { cx, cy, r } = properties;
                    const drawObjs = [bjCircle([cx, cy], { r }, styleParams)];

                    linear.push(...drawObjs);
                    ctx.draw = drawObjs;
                }
                break;
            case "root":
            case "svg":
                ctx.draw = "no op";
                break;
            default:
                throw "unhandled element: " + me;
        }
    };

    walkAst(ast, preorder);
}

const canvas = makeSvgCanvas(3601, 3602);

const formatColor = ({ type, params } = {}) => {
    switch (type) {
        case "rgb":
            const c = new Color(params);
            return c;
        default:
            throw "couldn't format color: " + type;
    }
};
const formatSize = () => {};

linear.forEach((draw) => {
    const { type, geom, fill, stroke, strokeWidth } = draw;
    const fillColor = fill ? formatColor(fill) : 'none';
    const strokeColor = stroke ? formatColor(stroke) : 'none';
    const strokeThickness = strokeWidth?.params?.val;

    switch (type) {
        case "line":
            {
                const {
                    p1: { x: x1, y: y1 },
                    p2: { x: x2, y: y2 },
                } = geom;
                const line = canvas.line(x1, y1, x2, y2);
                if (strokeThickness && strokeColor) {
                    line.stroke({
                        width: strokeThickness,
                        color: strokeColor,
                    });
                } else {
                    line.stroke("none");
                }
            }
            break;
        case "circle":
            {
                const {
                    c: { x, y },
                    r,
                } = geom;
                const circle = canvas.circle(2 * r).move(x - r, y - r);
                if (fillColor) {
                    circle.fill(fillColor);
                }
                if (strokeThickness && strokeColor) {
                    circle.stroke({
                        width: strokeThickness,
                        color: strokeColor,
                    });
                }
            }
            break;
        case "bezier":
            {
                const { x, y } = geom.points[0];
                const terms = ["M", x, y, "C"];
                for (let i = 1; i < geom.points.length; i++) {
                    const { x, y } = geom.points[i];
                    terms.push(x, y);
                }
                const path = canvas.path(terms.join(" "));
                if (strokeThickness && strokeColor) {
                    path.stroke({
                        width: strokeThickness,
                        color: strokeColor,
                    });
                }
                if (fillColor) {
                    path.fill(fillColor);
                }
            }
            break;
    }
});

canvas.save("test.svg");
