const deleteAgent = async (supabase, agentId) => {
  // Delete rows from the conversations table
  const { error: conversationsError } = await supabase
    .from('conversations')
    .delete()
    .eq('agent_id', agentId);

  if (conversationsError) {
    console.error('Error deleting conversations:', conversationsError);
    return { success: false, error: conversationsError };
  }

  // Delete the agent itself
  const { data, error } = await supabase
    .from('agents')
    .delete()
    .eq('id', agentId)
    .select(); // Ensure Supabase returns the deleted rows

  return { success: data && data.length > 0, error };
};

export default deleteAgent;
