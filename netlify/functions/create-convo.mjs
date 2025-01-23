import { createClient } from '@supabase/supabase-js';
import createSBConvo from '../lib/supabase/createConvo';

const supabaseUrl = "https://hcdsvvofqpfutulgdtlj.supabase.co";
const supabaseKey = process.env.SUPABASE_SERVICE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

const createConvo = async (req, context) => {
  const bodyText = await req.text()
  const body = JSON.parse(bodyText);
  const { userId, agentId } = body;

  const { convo, error } = await createSBConvo(supabase, userId, agentId)

  return new Response(
    JSON.stringify({ convo, error }),
    { status: 200, headers: { "Content-Type": "application/json" },
  });
}

export default createConvo;