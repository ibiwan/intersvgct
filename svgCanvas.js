const { createSVGWindow } = require("svgdom");
const { SVG, registerWindow } = require("@svgdotjs/svg.js");
const xmlFormat = require("xml-formatter");
const fs = require("fs");

const makeSvgCanvas = (width, height) => {
    const window = createSVGWindow();
    const document = window.document;
    registerWindow(window, document);
    const canvas = SVG(document.documentElement);
    canvas.size(width, height);

    canvas.save = (fileName) => {
        const svg = xmlFormat(canvas.svg());
        fs.writeFileSync(fileName, svg);
    };

    return canvas;
};

module.exports = { makeSvgCanvas };
