const { ingest } = require("./ingest");
const { drawCommands } = require("./drawCommands");

const linearCommands = ingest("./twopaths.svg")
console.log(linearCommands
    )
const canvas = drawCommands(linearCommands, 500, 500, null);//[1,16]
canvas.save("test.svg");
