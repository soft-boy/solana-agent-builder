export const fetchMessages = async (supabase, conversationId) => {
    try {
      const { data: messages, error } = await supabase
        .from('messages')
        .select('*')
        .eq('conversation_id', conversationId);
  
      if (error) {
        console.error('Error fetching messages:', error.message);
        return [];
      }
  
      return messages || [];
    } catch (error) {
      console.error('Unexpected error fetching messages:', error.message);
      return [];
    }
  };
  