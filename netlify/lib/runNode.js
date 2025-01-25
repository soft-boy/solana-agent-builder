import { createClient } from '@supabase/supabase-js';
import createMessage from "./supabase/createMessage";
import updateConvoNode from './supabase/updateConvoNode';
import updateConvoVariable from './supabase/updateConvoVariable';

const supabaseUrl = "https://hcdsvvofqpfutulgdtlj.supabase.co";
const supabaseKey = process.env.SUPABASE_SERVICE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

function replacePlaceholders(data, template) { return template.replace(/{(.*?)}/g, (_, key) => data[key] || `{${key}}`); }

const runNode = async (node, context) => {
  console.log('runNode')
  await sleep(100);
  await updateConvoNode(supabase, node.id, context);

  switch (node.type) {
    case 'start':
      return;

    case 'talk':
      console.log('talk')
      const variableContext = context.convo.variable_context || {}
      const messageTemplate = node.data.message
      const message = replacePlaceholders(variableContext, messageTemplate)
      createMessage(supabase, 'bot', message, context);
      return;

    case 'listen':
      console.log('listen')
      if (Object.keys(context).includes('message')) {
        updateConvoVariable(
          supabase,
          node.data.listenVariable,
          context.message,
          context
        )
      }
      return;

    case 'ai':
      return; // TODO

    case 'solana':
      return; // TODO

    case 'api':
      return; // TODO

    default:
      console.error('Unknown node type:', node.type);
      return null;
  }
};

export default runNode;