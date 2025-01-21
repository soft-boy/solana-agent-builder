export const createFlowchart = async (supabase, name) => {
  const { data, error } = await supabase
    .from('flowcharts')
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
    .from('flowcharts')
    .select('*');
  
  return agents;
}

export const deleteFlowchart = async (supabase, agentId) => {
  const { error } = await supabase
    .from('flowcharts')
    .delete()
    .eq('id', agentId);

  return error
}