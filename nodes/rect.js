const print = (prefix, node) => {
    const {x, y, width, height} = node.properties
    console.log(prefix + `(${x},${y}) ${width} x ${height}`)
};
module.exports = {print};
