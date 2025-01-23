import { createClient } from '@supabase/supabase-js';
import createMessage from "./supabase/createMessage";
import updateConvoNode from './supabase/updateConvoNode';

const supabaseUrl = "https://hcdsvvofqpfutulgdtlj.supabase.co";
const supabaseKey = process.env.SUPABASE_SERVICE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

const runNode = (node, context) => {
  console.log(context.convo, node.id)
  updateConvoNode(supabase, context.convo.id, node.id);

  switch (node.type) {
    case 'start':
      console.log('Running "start" node:', node);
      return;

    case 'talk':
      console.log('Running "talk" node:', node);
      return createMessage(supabase, context.convo.id, 'bot', node.data.message);

    case 'listen':
      console.log('Running "listen" node:', node);
      return; // TODO

    case 'ai':
      console.log('Running "ai" node:', node);
      return; // TODO

    case 'solana':
      console.log('Running "solana" node:', node);
      return; // TODO

    case 'api':
      console.log('Running "api" node:', node);
      return; // TODO

    default:
      console.error('Unknown node type:', node.type);
      return null;
  }
};

export default runNode;