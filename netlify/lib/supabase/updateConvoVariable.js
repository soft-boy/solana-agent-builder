// supabase, conversationId, currentContext, varName, varValue
const updateConvoVariable = async (supabase, varName, varValue, context) => {
  try {
    const conversationId = context.convo.id
    const currentContext = context.convo.variable_context
    const updatedContext = { ...currentContext, [varName]: varValue}

    const { data, error } = await supabase
      .from('conversations')
      .update({ variable_context: updatedContext })
      .eq('id', conversationId) // Filter by conversation ID
      .select()
      .single()

    // overwrite context data
    Object.assign(context.convo, data)

    if (error) {
      console.error('Error updating conversation var:', error);
      return { error: error.message };
    }

    return data;
  } catch (err) {
    console.error('Unexpected error:', err);
    return { error: err.message };
  }
};

export default updateConvoVariable