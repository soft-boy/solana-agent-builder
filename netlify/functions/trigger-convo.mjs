import { createClient } from '@supabase/supabase-js';
import createConvo from '../lib/supabase/createConvo';
import getConvo from '../lib/supabase/getConvo';
import getNextNode from '../lib/getNextNode';
import runNode from '../lib/runNode';
import preprocess from '../lib/preprocessFlowchart';
import getFlowchart from '../lib/supabase/getFlowchart';

const supabaseUrl = "https://hcdsvvofqpfutulgdtlj.supabase.co";
const supabaseKey = process.env.SUPABASE_SERVICE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

const triggerConvo = async (req, context) => {
  const bodyText = await req.text()
  const body = JSON.parse(bodyText);
  const { type: requestType, data: requestData } = body;

  const { convo, currentNodeId } = await getConvoAndCurrentNode(requestType, requestData)
  let { data: flowchart } = await getFlowchart(supabase, convo.flowchart)
  flowchart = preprocess(flowchart.data)

  try {
    runFlowchart(flowchart, currentNodeId)
  }
  catch {
    return new Response(
      JSON.stringify({ success: false, error: 'Failed to run' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }

  return new Response(JSON.stringify({ success: true }), {
    headers: { "Content-Type": "application/json" },
  });
}

const userId = '085a1129-24c1-4f15-927a-22ff11e65295' // TODO generalize
const getConvoAndCurrentNode = async (requestType, requestData) => {
  let convo;
  let currentNodeId;
 
  switch (requestType) {
    case 'start': // New conversation
      const { flowchartId } = requestData;
      const { data: convoData } = await createConvo(supabase, userId, flowchartId)
      convo = convoData[0]
      currentNodeId = 'node-start'
      break;
    case 'userMessage': // User sent message
      const { data } = await getConvo(supabase, 1)
      convo = data;
      currentNodeId = convo.current_node
      break;
    default:
      console.error('Unhandled request type:', requestType);
  }

  return { convo, currentNodeId }
}

const MAX_ITERS = 1000;
const runFlowchart = async (flowchart, currentNodeId) => {
  let iters = 0
  let currentNode = flowchart[currentNodeId]
  while (currentNode && iters < MAX_ITERS) {
    runNode(currentNode)
    currentNode = getNextNode(currentNode, flowchart)
    iters++;
  }
};

export default triggerConvo;