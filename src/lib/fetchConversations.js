export const fetchConversations = async (supabase, agentId) => {
    try {
      const { data: conversations, error } = await supabase
        .from('conversations')
        .select('*')
        .eq('agent_id', agentId);
  
      if (error) {
        console.error('Error fetching conversations:', error.message);
        return [];
      }
  
      return conversations || [];
    } catch (error) {
      console.error('Unexpected error fetching conversations:', error.message);
      return [];
    }
  };
  