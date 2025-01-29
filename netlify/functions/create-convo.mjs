import { createClient } from '@supabase/supabase-js';
import createSBConvo from '../lib/supabase/createConvo';
import runFlowchart from '../lib/runFlowchart';
import preprocess from '../lib/preprocessFlowchart';
import getFlowchart from '../lib/supabase/getFlowchart';

const supabaseUrl = "https://hcdsvvofqpfutulgdtlj.supabase.co";
const supabaseKey = process.env.SUPABASE_SERVICE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

const startNodeId = 'node-start'

const createConvo = async (req, reqContext) => {
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

  const bodyText = await req.text()
  const body = JSON.parse(bodyText);
  const { participantId, agentId } = body;

  const { convo, error } = await createSBConvo(supabase, participantId, agentId)
  let { data: agent } = await getFlowchart(supabase, agentId)
  const flowchart = preprocess(agent.flowchart)
  let context = { convo }
  runFlowchart(flowchart, startNodeId, context)

  return new Response(
    JSON.stringify({ convo, error }),
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

export default createConvo;