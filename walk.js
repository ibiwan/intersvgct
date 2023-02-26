const walkAst = (ast, pre = null, post = null, ctx_arg = { depth: 0 }) => {
    const ctx = { ...ctx_arg };

    if (pre) {
        pre(ast, ctx);
    }

    if (!ast.children.length) {
        ctx.subTree = null; // avoids circular tree for some reason
    } else {
        ctx.subTree = [];
        ast.children.forEach((element, i) => {
            const child_ctx = { ...ctx, i, depth: ctx.depth + 1 };
            const result = walkAst(element, pre, post, child_ctx);
            ctx.subTree.push(result);
        });
    }

    if (post) {
        post(ast, ctx);
    }

    return ctx;
};

module.exports = walkAst;
