import { createClient } from '@supabase/supabase-js';
import createConvo from '../lib/supabase/createConvo';
import getConvo from '../lib/supabase/getConvo';
import preprocess from '../lib/preprocessFlowchart';
import getFlowchart from '../lib/supabase/getFlowchart';
import runFlowchart from '../lib/runFlowchart';

const supabaseUrl = "https://hcdsvvofqpfutulgdtlj.supabase.co";
const supabaseKey = process.env.SUPABASE_SERVICE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

const messageConvo = async (req, reqContext) => {
  const bodyText = await req.text()
  const body = JSON.parse(bodyText);
  const { message, conversationId } = body;

  const { data: convo } = await getConvo(supabase, conversationId)
  const currentNodeId = convo.current_node
  let { data: agent } = await getFlowchart(supabase, convo.agent_id)
  const flowchart = preprocess(agent.flowchart)

  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 204, // No Content
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "OPTIONS, POST, GET",
        "Access-Control-Allow-Headers": "Content-Type",
      },
    });
  }

  try {
    let context = { convo, message }
    runFlowchart(flowchart, currentNodeId, context)
  }
  catch {
    return new Response(
      JSON.stringify({ success: false, error: 'Failed to run' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }

  return new Response(
    JSON.stringify({ success: true }),
    {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*", // Allow all origins
        "Access-Control-Allow-Methods": "OPTIONS, POST, GET",
        "Access-Control-Allow-Headers": "Content-Type",
      },
    }
  );  
}

export default messageConvo;