const deleteAgent = async (supabase, agentId) => {
  const { data, error } = await supabase
    .from('agents')
    .delete()
    .eq('id', agentId)
    .select(); // Ensure Supabase returns the deleted rows

  return { success: data && data.length > 0, error };
};

export default deleteAgent;
