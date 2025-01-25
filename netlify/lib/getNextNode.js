const getNextNode = (currentNode, flowchart, context) => {
  const nextNodes = flowchart[currentNode.id].nextNodes

  if (nextNodes.length === 0) {
    return null
  }
  // hitting a listen node
  if (currentNode.type === 'listen') {
    // if we don't have a message, block
    if (!Object.keys(context).includes('message')) {
      return null
    }
    // if we do remove it, so it isn't carried to the next listen
    else {
      delete context.message
    }
  }

  return flowchart[nextNodes[0]] // TODO: handle multiple next nodes
}

export default getNextNode;