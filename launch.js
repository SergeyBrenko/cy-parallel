const shell = require('shelljs');
const concurrently = require('concurrently')

const { result } = concurrently([
  "CURRENT_NODE=1 CI_NODE_TOTAL=4 node parallelCypress.js",
  "CURRENT_NODE=2 CI_NODE_TOTAL=4 node parallelCypress.js",
  "CURRENT_NODE=3 CI_NODE_TOTAL=4 node parallelCypress.js",
  "CURRENT_NODE=4 CI_NODE_TOTAL=4 node parallelCypress.js"
])


// result.then(success, failure);
// shell.exec("concurrently \"CURRENT_NODE=1 CI_NODE_TOTAL=4 node parallelCypress.js\" \"CURRENT_NODE=2 CI_NODE_TOTAL=4 node parallelCypress.js\" \"CURRENT_NODE=3 CI_NODE_TOTAL=4 node parallelCypress.js\" \"CURRENT_NODE=4 CI_NODE_TOTAL=4 node parallelCypress.js\"")