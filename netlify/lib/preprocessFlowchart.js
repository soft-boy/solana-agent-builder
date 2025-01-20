function preprocess(json) {
  const flowchart = {};

  // Initialize the flowchart with node data
  json.nodes.forEach((node) => {
    flowchart[node.id] = {
      id: node.id,
      type: node.data.type,
      data: node.data, // Carry over the data field
      nextNodes: [],   // Initialize with an empty array for next nodes
    };
  });

  // Populate the nextNodes field using edges
  json.edges.forEach((edge) => {
    if (flowchart[edge.source]) {
      flowchart[edge.source].nextNodes.push(edge.target);
    }
  });

  return flowchart;
}

export default preprocess