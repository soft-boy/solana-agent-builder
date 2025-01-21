import { createClient } from '@supabase/supabase-js';
import createMessage from "./supabase/createMessage";
import updateConvoNode from './supabase/updateConvoNode';

const supabaseUrl = "https://hcdsvvofqpfutulgdtlj.supabase.co";
const supabaseKey = process.env.SUPABASE_SERVICE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);
const conversation_id = 1

const runNode = (node) => {
  updateConvoNode(supabase, conversation_id, node.id);

  switch (node.type) {
    case 'start':
      console.log('Running "start" node:', node);
      return;

    case 'talk':
      console.log('Running "talk" node:', node);
      return createMessage(supabase, conversation_id, 'bot', node.data.message);

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