const print = (prefix, node) => {
    const nChildren = node.children.length;
    const keys = Object.keys(node);
    console.log(
        prefix + `root: ${nChildren} children, with keys [${keys.join(",")}]`
    );
};

module.exports = { print };
