const createMessage = async (supabase, sender, text, context) => {
  const conversation_id = context.convo.id
  const { data, error } = await supabase
    .from('messages')
    .insert([{
      conversation_id,
      sender,
      text,
      created_at: new Date().toISOString(),
    }]);

  return { data, error }
}

export default createMessage;