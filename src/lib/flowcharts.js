export const createFlowchart = async (supabase, name) => {
  const { data, error } = await supabase
    .from('agents')
    .insert([{
      name,
      data: null,
      ownedby: 'me'
    }])
    .select();
  return { flowchart: data, error }
}

export const getFlowcharts = async (supabase) => {
  const { data: agents } = await supabase
    .from('agents')
    .select('*');
  
  return agents;
}

export const deleteFlowchart = async (supabase, agentId) => {
  const { error } = await supabase
    .from('agents')
    .delete()
    .eq('id', agentId);

  return error
}