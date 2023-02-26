const { Color } = require("@svgdotjs/svg.js");

const { makeSvgCanvas } = require("./svgCanvas");

const drawCommands = (linearCommands, width, height, doSteps) => {
    const canvas = makeSvgCanvas(width, height);

    const formatColor = ({ type, params } = {}) => {
        switch (type) {
            case "rgb":
                const c = new Color(params);
                return c;
            default:
                throw "couldn't format color: " + type;
        }
    };

    linearCommands.forEach((draw, i) => {
        console.log({i, draw:JSON.stringify(draw)})
        if(doSteps !== null && !doSteps.includes(i)){
            console.log("stopping", {i, doSteps})
            return
        }

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

    return canvas
}

module.exports = { drawCommands }