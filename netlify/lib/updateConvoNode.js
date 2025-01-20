const updateConvoNode = async (supabase, conversationId, currentNode) => {
  try {
    // Validate input
    if (!conversationId || !currentNode) {
      throw new Error('conversationId and currentNode are required');
    }

    // Update the current_node field
    const { data, error } = await supabase
      .from('conversations')
      .update({ current_node: currentNode }) // The field and value to update
      .eq('id', conversationId); // Filter by conversation ID

    if (error) {
      console.error('Error updating conversation node:', error);
      return { error: error.message };
    }

    console.log('Conversation node updated successfully:', data);
    return data;
  } catch (err) {
    console.error('Unexpected error:', err);
    return { error: err.message };
  }
};

export default updateConvoNode