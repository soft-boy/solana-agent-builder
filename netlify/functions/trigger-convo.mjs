import { createClient } from '@supabase/supabase-js';
import createConvo from '../lib/createConvo';
import getConvo from '../lib/getConvo';
import getNextNode from '../lib/getNextNode';
import runNode from '../lib/runNode';
import preprocess from '../lib/preprocessFlowchart';
import getFlowchart from '../lib/getFlowchart';

const supabaseUrl = "https://hcdsvvofqpfutulgdtlj.supabase.co";
const supabaseKey = process.env.SUPABASE_SERVICE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

const flowchart = 1
const userId = '085a1129-24c1-4f15-927a-22ff11e65295'

const triggerConvo = async (req, context) => {
  const bodyText = await req.text()
  const body = JSON.parse(bodyText);
  const { type, data: requestData } = body;

  // let convo;
  let currentNodeId;
  const { data: convo } = await getConvo(supabase, 1) // TODO make real

  switch (type) {
    case 'start': // New conversation
      // createConvo(supabase, userId, flowchart)
      currentNodeId = 'node-start'
      break;
    case 'userMessage': // User sent message
      // const { data, error } = await getConvo(supabase, 1)
      // convo = data
      currentNodeId = convo.current_node
      break;
    default:
      console.error('Unhandled type:', type);
      return new Response(
        JSON.stringify({ success: false, error: 'Invalid type' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
  }

  let { data: flowchart } = await getFlowchart(supabase, convo.flowchart)
  flowchart = preprocess(flowchart.data)
  
  const MAX_ITERS = 1000
  let iters = 0
  let currentNode = flowchart[currentNodeId]
  while (currentNode && iters < MAX_ITERS) {
    runNode(currentNode)
    currentNode = getNextNode(currentNode, flowchart)
    iters++;
  }

  return new Response(JSON.stringify({ success: true }), {
    headers: { "Content-Type": "application/json" },
  });
};

export default triggerConvo;