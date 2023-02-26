const fs = require("fs");
const { parse: parseSvg } = require("svg-parser");

const walkAst = require("./walk");
const { parseStyle } = require("./nodes");
const { parse: parsePath } = require("./nodes/path");
const { bjLine, bjCubic, bjCircle } = require("./nodes/path/bjs");

const ingest = (filename) => {
    const linearCommands = [];
    const svgStr = fs.readFileSync(filename, "utf-8");
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
                    linearCommands.push(...drawObjs.filter((f) => f !== "no op"));
                    ctx.draw = drawObjs;
                }
                break;
            case "circle":
                {
                    const { cx, cy, r } = properties;
                    const drawObjs = [bjCircle([cx, cy], { r }, styleParams)];

                    linearCommands.push(...drawObjs);
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

    return linearCommands
}

module.exports = { ingest }