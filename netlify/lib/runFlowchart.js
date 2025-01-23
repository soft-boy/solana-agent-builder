import getNextNode from './getNextNode';
import runNode from './runNode';

const MAX_ITERS = 1000;
const runFlowchart = async (flowchart, currentNodeId, context) => {
  let iters = 0
  let currentNode = flowchart[currentNodeId]
  while (currentNode && iters < MAX_ITERS) {
    runNode(currentNode, context)
    currentNode = getNextNode(currentNode, flowchart)
    iters++;
  }
};

export default runFlowchart;