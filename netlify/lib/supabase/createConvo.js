const createConvo = async (supabase, participant_id, agent_id) => {
  const { data, error } = await supabase
    .from('conversations')
    .insert([{
      participant_id,
      is_open: true,
      variable_context: {},
      agent_id,
      current_node: 'node-start'
    }])
    .select();

  return { convo: data[0], error }
}

export default createConvo;