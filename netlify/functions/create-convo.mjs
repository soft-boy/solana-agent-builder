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
    { status: 200, headers: { "Content-Type": "application/json" },
  });
}

export default createConvo;