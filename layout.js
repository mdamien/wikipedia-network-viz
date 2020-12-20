var graph = require('ngraph.graph')();


const fs = require('fs');
const file = fs.readFileSync(process.argv[2], 'utf-8');
const data = file.split('\n');
var edges = {}
data.forEach(function (line) {
    if (!line.trim()) return
    const [src, dst] = line.trim().split(';');
    if (!graph.hasLink(src, dst)) {
        graph.addLink(src, dst);
    }
});

var createLayout = require('ngraph.forcelayout');
var layout = createLayout(graph);
var ITERATIONS_COUNT = 10000;
for (var i = 0; i < ITERATIONS_COUNT; ++i) {
  console.log('step', i)
  layout.step();
}

var detectClusters = require('ngraph.louvain');
var clusters = detectClusters(graph);

var toJSON = require('ngraph.tojson');


var json = toJSON(graph,
  node => {
    return {
        label: node.id,
        id: node.id,
        x: layout.getNodePosition(node.id).x,
        y: layout.getNodePosition(node.id).y,
        attributes: {
            cluster: clusters.getClass(node.id),
        },
        color: "rgb("+ (clusters.getClass(node.id)*50 % 255) + ",192,192)",
    };
  },
  link => {
    return {
        source: link.fromId,
        target: link.toId,
        id: link.fromId+';'+link.toId,
        attributes: {},
        color: "rgb("+ (clusters.getClass(link.fromId)*50 % 255) + ",192,192)"
    };
  });

fs.writeFileSync('data/graph.json', json);