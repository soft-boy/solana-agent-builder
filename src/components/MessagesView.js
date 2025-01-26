import { useEffect, useState } from "react";
import { useSupabase } from "../lib/SupabaseContext";

const MessagesView = () => {
  const { supabase } = useSupabase();
  const [conversations, setConversations] = useState([]);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [loadingConversations, setLoadingConversations] = useState(true);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [agentName, setAgentName] = useState(null);

  // Fetch conversations
  useEffect(() => {
    const fetchConversations = async () => {
      setLoadingConversations(true);
      try {
        const { data, error } = await supabase
          .from("conversations")
          .select("id, agent_id, created_at")
          .order("created_at", { ascending: false });

        if (error) {
          console.error("Error fetching conversations:", error.message);
        } else {
          setConversations(data);
        }
      } catch (error) {
        console.error("Unexpected error:", error.message);
      } finally {
        setLoadingConversations(false);
      }
    };

    fetchConversations();
  }, []);

  // Fetch messages for the selected conversation
  useEffect(() => {
    if (!selectedConversation) return;

    const fetchMessages = async () => {
      setLoadingMessages(true);
      try {
        const { data, error } = await supabase
          .from("messages")
          .select("*")
          .eq("conversation_id", selectedConversation.id)
          .order("created_at", { ascending: true });

        if (error) {
          console.error("Error fetching messages:", error.message);
        } else {
          setMessages(data);
        }
      } catch (error) {
        console.error("Unexpected error:", error.message);
      } finally {
        setLoadingMessages(false);
      }
    };

    const fetchAgentName = async () => {
      try {
        const { data, error } = await supabase
          .from("agents")
          .select("name")
          .eq("id", selectedConversation.agent_id)
          .single();

        if (error) {
          console.error("Error fetching agent name:", error.message);
        } else {
          setAgentName(data.name);
        }
      } catch (error) {
        console.error("Unexpected error:", error.message);
      }
    };

    fetchMessages();
    fetchAgentName();
  }, [selectedConversation]);

  return (
    <div className="flex h-screen">
      {/* Conversations List */}
      <div className="w-1/4 bg-base-200 p-4 overflow-y-auto">
        <h2 className="text-lg font-bold mb-4">Conversations</h2>
        {loadingConversations ? (
          <div className="text-center text-gray-500">Loading...</div>
        ) : conversations.length > 0 ? (
          <ul className="menu bg-base-100 rounded-box">
            {conversations.map((conversation) => (
              <li
                key={conversation.id}
                onClick={() => setSelectedConversation(conversation)}
                className={`cursor-pointer ${
                  selectedConversation?.id === conversation.id
                    ? "bg-primary text-white"
                    : "hover:bg-gray-300"
                }`}
              >
                <a>
                  Conversation {conversation.id} <br />
                  <span className="text-xs text-gray-500">
                    {new Date(conversation.created_at).toLocaleDateString()}
                  </span>
                </a>
              </li>
            ))}
          </ul>
        ) : (
          <div className="text-center text-gray-500">No conversations found</div>
        )}
      </div>

      {/* Messages View */}
      <div className="flex-1 p-4 bg-base-100">
        {selectedConversation ? (
          <>
            {/* Header with Agent Name */}
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-bold">
                Messages for Conversation {selectedConversation.id}
              </h2>
              <p className="text-sm text-gray-500">
                Agent: {agentName || "Loading..."}
              </p>
            </div>
            {loadingMessages ? (
              <div className="text-center text-gray-500">Loading messages...</div>
            ) : messages.length > 0 ? (
              <div className="space-y-4 overflow-y-auto">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`chat ${
                      message.sender === "user" ? "chat-end" : "chat-start"
                    }`}
                  >
                    <div
                      className={`chat-bubble text-white chat-bubble-lg shadow-md ${
                        message.sender === "user" ? "bg-primary" : "bg-black"
                      }`}
                    >
                      {message.text}
                      <span className="text-xs block mt-1 text-right text-gray-400">
                        {new Date(message.created_at).toLocaleTimeString()}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center text-gray-500">
                No messages in this conversation
              </div>
            )}
          </>
        ) : (
          <div className="text-center text-gray-500">
            Select a conversation to view messages
          </div>
        )}
      </div>
    </div>
  );
};

export default MessagesView;