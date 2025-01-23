import { createClient } from '@supabase/supabase-js';
import createConvo from '../lib/supabase/createConvo';
import getConvo from '../lib/supabase/getConvo';
import preprocess from '../lib/preprocessFlowchart';
import getFlowchart from '../lib/supabase/getFlowchart';
import runFlowchart from '../lib/runFlowchart';

const supabaseUrl = "https://hcdsvvofqpfutulgdtlj.supabase.co";
const supabaseKey = process.env.SUPABASE_SERVICE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

const messageConvo = async (req, context) => {
  const bodyText = await req.text()
  const body = JSON.parse(bodyText);
  const { type: requestType, data: requestData } = body;

  const { convo, currentNodeId } = await getConvoAndCurrentNode(requestType, requestData)
  let { data: flowchart } = await getFlowchart(supabase, convo.flowchart)
  flowchart = preprocess(flowchart.data)

  try {
    runFlowchart(flowchart, currentNodeId, { convo })
  }
  catch {
    return new Response(
      JSON.stringify({ success: false, error: 'Failed to run' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }

  return new Response(
    JSON.stringify({ success: true }),
    { status: 200, headers: { "Content-Type": "application/json" },
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

export default messageConvo;