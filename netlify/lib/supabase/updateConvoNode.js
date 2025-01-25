const updateConvoNode = async (supabase, currentNodeId, context) => {
  try {
    // Validate input
    const conversationId = context.convo.id
    if (!conversationId || !currentNodeId) {
      throw new Error('conversationId and currentNodeId are required');
    }

    // Update the current_node field
    const { data, error } = await supabase
      .from('conversations')
      .update({ current_node: currentNodeId }) // The field and value to update
      .eq('id', conversationId); // Filter by conversation ID

    if (error) {
      console.error('Error updating conversation node:', error);
      return { error: error.message };
    }

    console.log('Conversation node updated successfully:', conversationId, currentNodeId);
    return data;
  } catch (err) {
    console.error('Unexpected error:', err);
    return { error: err.message };
  }
};

export default updateConvoNode