const print = (prefix, node) => {
    const {cx, cy, r} = node.properties
    console.log(prefix + `(${cx},${cy}) r=${r}`)
};
module.exports = {print};
