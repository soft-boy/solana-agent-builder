import { useEffect, useState } from "react";
import { useSupabase } from "../lib/SupabaseContext";

const MessagesView = () => {
  const { supabase } = useSupabase()
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from("messages") // Name of your Supabase table
          .select("*")
          .order("created_at", { ascending: true }); // Sort messages by created_at

        if (error) {
          console.error("Error fetching messages:", error.message);
        } else {
          setMessages(data);
        }
      } catch (error) {
        console.error("Unexpected error:", error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchMessages();
  }, []);

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">Messages</h1>
      {loading ? (
        <div className="text-center text-gray-500">Loading...</div>
      ) : messages.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="table table-xs w-full">
            <thead>
              <tr>
                <th>ID</th>
                <th>Content</th>
                <th>Sender</th>
                <th>Created At</th>
              </tr>
            </thead>
            <tbody>
              {messages.map((message) => (
                <tr key={message.id}>
                  <td>{message.id}</td>
                  <td>{message.text}</td>
                  <td>{message.sender}</td>
                  <td>{new Date(message.created_at).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="text-center text-gray-500">No messages found</div>
      )}
    </div>
  );
};

export default MessagesView;