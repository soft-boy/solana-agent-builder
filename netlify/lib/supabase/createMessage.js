const createMessage = async (supabase, conversation_id, sender, text) => {
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