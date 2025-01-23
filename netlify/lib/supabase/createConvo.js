const createConvo = async (supabase, user_id, flowchart) => {
  const { data: convo, error } = await supabase
    .from('conversations')
    .insert([{
      user_id,
      is_open: true,
      variable_context: {},
      flowchart,
      current_node: 'node-start'
    }])
    .select();

  return { convo, error }
}

export default createConvo;