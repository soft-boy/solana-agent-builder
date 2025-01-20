import { createClient } from '@supabase/supabase-js';

const supabaseUrl = "https://hcdsvvofqpfutulgdtlj.supabase.co";
const supabaseKey = process.env.SUPABASE_SERVICE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

const insertMessage = async (conversation_id, sender, text) => {
  const { data, error } = await supabase
    .from('messages')
    .insert([
      {
        conversation_id,
        sender,
        text,
        created_at: new Date().toISOString(),
      },
    ]);

  return { data, error }
}

const triggerConvo = async (req, context) => {
  const { type, data } = JSON.parse(req.body);

  // insertMessage(1, 'bot', 'hello')

  return new Response(JSON.stringify({ success: true }), {
    headers: { "Content-Type": "application/json" },
  });
};

export default triggerConvo;