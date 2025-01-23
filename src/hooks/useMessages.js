import React, { useState, useEffect } from 'react';

const useMessages = (supabase, conversationId) => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let messagesChannel;

    const fetchMessages = async () => {
      try {
        // Fetch initial messages with conversation_id = conversationId
        const { data, error } = await supabase
          .from('messages')
          .select('*')
          .eq('conversation_id', conversationId)
          .order('created_at', { ascending: true });

        if (error) {
          console.error('Error fetching messages:', error);
          setError(error.message);
          return;
        }

        setMessages(data);
      } catch (err) {
        console.error('Unexpected error:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    const subscribeToMessages = () => {
      messagesChannel = supabase
        .channel('custom-filter-channel')
        .on(
          'postgres_changes',
          {
            event: 'INSERT',
            schema: 'public',
            table: 'messages',
            filter: `conversation_id=eq.${conversationId}`,
          },
          () => {
            fetchMessages()
          }
        )
        .subscribe((status) => {
          console.log('Subscription status:', status);
        });
    };

    // Initialize fetching and subscription
    if (conversationId) {
      fetchMessages();
      subscribeToMessages();
    }

    // Cleanup on unmount
    return () => {
      if (messagesChannel) {
        supabase.removeChannel(messagesChannel);
      }
    };
  }, [supabase, conversationId]);

  return {
    messages,
    loading,
    error
  };
};

export default useMessages