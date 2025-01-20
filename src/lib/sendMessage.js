const sendMessage = async (supabase, conversationId, text, sender) => {
  try {
    // Insert the new message into the messages table
    const { data, error } = await supabase
      .from('messages')
      .insert([
        {
          conversation_id: conversationId, // Reference the conversation
          sender, // Sender's user ID
          text, // Message content
          created_at: new Date().toISOString(), // Optional: set the timestamp explicitly
        },
      ])
      .select(); // Optionally return the inserted row(s)

    if (error) {
      console.error('Error inserting message:', error);
      return null;
    }

    console.log('Message sent successfully:', data);
    return data; // Return the inserted message
  } catch (err) {
    console.error('Unexpected error sending message:', err);
    return null;
  }
};

export default sendMessage