import { createClient } from '@supabase/supabase-js';
import createMessage from "./supabase/createMessage";
import updateConvoNode from './supabase/updateConvoNode';
import updateConvoVariable from './supabase/updateConvoVariable';
import makeFetchRequest from './supabase/makeFetchRequest';

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
      console.log('api')
      const data = await makeFetchRequest(
        node.data.requestType,
        node.data.endpoint,
        node.data.headers,
        node.data.jsonPayload,
      )
      await processCaptures(
        supabase,
        data,
        node.data.captures,
        context
      )
      return;

    default:
      console.error('Unknown node type:', node.type);
      return null;
  }
};

async function processCaptures(supabase, data, captures, context) {
  // Helper function to safely access a nested object path
  function getValueFromPath(obj, path) {
    return path.split('.').reduce((acc, key) => (acc && acc[key] !== undefined ? acc[key] : undefined), obj);
  }

  // Loop through each capture entry
  for (const capture of captures) {
    const { path, variable } = capture;

    // Safely access the path from the data object
    const accessedValue = getValueFromPath(data, path);

    if (accessedValue !== undefined) {
      // Call updateConvoVariable if the value exists
      await updateConvoVariable(
        supabase,
        variable,
        accessedValue,
        context
      );
    } else {
      console.warn(`Path "${path}" could not be accessed on data.`);
    }
  }
}

export default runNode;