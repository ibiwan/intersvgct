
// const makeStrings = (element, ctx) => {
//     const { depth, i, name: parentName } = ctx;

//     ctx.tab = " - ".repeat(depth);

//     const { tagName, type, properties: { id } = {} } = element;

//     const myName = [parentName, tagName ?? type, id, i]
//         .filter((x) => x)
//         .join(":");

//     ctx.name = myName;
// };

// walkAst(ast, makeStrings, printNode);
