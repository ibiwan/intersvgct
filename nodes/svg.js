const print = (prefix, node) => {
    const nChildren = node.children.length;
    const keys = Object.keys(node.properties);
    console.log(
        prefix + `svg: ${nChildren} children, with property keys [${keys.join(",")}]`
    );
};

module.exports = { print };
