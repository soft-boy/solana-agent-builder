import { createClient } from '@supabase/supabase-js';
import createConvo from '../lib/supabase/createConvo';

const supabaseUrl = "https://hcdsvvofqpfutulgdtlj.supabase.co";
const supabaseKey = process.env.SUPABASE_SERVICE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

const userId = '085a1129-24c1-4f15-927a-22ff11e65295' // TODO generalize
const messageConvo = async (req, context) => {
  const bodyText = await req.text()
  const body = JSON.parse(bodyText);
  const { agentId } = body;

  try {
    const { data: convoData } = await createConvo(supabase, userId, agentId)
    const convo = convoData[0]

    return new Response(
      JSON.stringify({ convo }),
      { status: 200, headers: { "Content-Type": "application/json" },
    });
  }
  catch {
    return new Response(
      JSON.stringify({ success: false, error: 'Failed to run' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}

export default messageConvo;