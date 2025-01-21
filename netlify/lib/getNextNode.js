const getNextNode = (currentNode, flowchart) => {
  const nextNodes = flowchart[currentNode.id].nextNodes

  if (nextNodes.length === 0) {
    return null
  }
  else if (flowchart[nextNodes[0]].type === 'listen') {
    return null
  }

  return flowchart[nextNodes[0]] // TODO: handle multiple next nodes
}

export default getNextNode;