const print = (prefix, node) => {
    const nChildren = node.children.length;
    const id = node.properties.id

    console.log(
        prefix + `g: "${id}" (${nChildren} children)`
    );
};

module.exports = { print };
