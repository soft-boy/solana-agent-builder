import React, { useState, useEffect } from "react";
import { useSupabase } from "../../lib/SupabaseContext";
import { fetchAgents } from "../../lib/fetchAgents";
import { fetchConversations } from "../../lib/fetchConversations";
import { fetchMessages } from "../../lib/fetchMessages";
import HeroSection from "./HeroSection";

const HomeView = () => {
  const { supabase, userId, email } = useSupabase();
  const [agents, setAgents] = useState([]);
  const [selectedAgent, setSelectedAgent] = useState(null);
  const [conversations, setConversations] = useState([]);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    const loadAgents = async () => {
      const agentsData = await fetchAgents(supabase, userId);
      setAgents(agentsData);
    };

    loadAgents();
  }, [supabase, userId]);

  const handleAgentSelect = async (agent) => {
    setSelectedAgent(agent);
    const conversationsData = await fetchConversations(supabase, agent.id);
    setConversations(conversationsData);
    setMessages([]); // Reset messages when switching agents
  };

  const handleConversationSelect = async (conversation) => {
    setSelectedConversation(conversation);
    const messagesData = await fetchMessages(supabase, conversation.id);
    setMessages(messagesData);
  };

  return (
    <div className="p-6 space-y-8">
      {/* Hero Section */}
      <HeroSection />

      {/* Agents Section */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-bold mb-4">Your Agents</h2>
        {agents.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {agents.map((agent) => (
              <div
                key={agent.id}
                className={`p-4 rounded-lg cursor-pointer ${
                  selectedAgent?.id === agent.id
                    ? "bg-primary text-white"
                    : "bg-gray-100 hover:bg-gray-200"
                }`}
                onClick={() => handleAgentSelect(agent)}
              >
                <h3 className="font-bold text-lg truncate">{agent.name}</h3>
                <p className="text-sm text-gray-500">
                  Created: {new Date(agent.created_at).toLocaleDateString()}
                </p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500">No agents found. Create one to get started.</p>
        )}
      </div>

      {/* Conversations Section */}
      {selectedAgent && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-bold mb-4">
            Conversations for Agent: {selectedAgent.name}
          </h2>
          {conversations.length > 0 ? (
            <div className="space-y-4">
              {conversations.map((conversation) => (
                <div
                  key={conversation.id}
                  className={`p-4 rounded-lg cursor-pointer ${
                    selectedConversation?.id === conversation.id
                      ? "bg-primary text-white"
                      : "bg-gray-100 hover:bg-gray-200"
                  }`}
                  onClick={() => handleConversationSelect(conversation)}
                >
                  <p className="font-medium">Conversation ID: {conversation.id}</p>
                  <p className="text-sm text-gray-500">
                    Started: {new Date(conversation.created_at).toLocaleString()}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500">
              No conversations found for this agent.
            </p>
          )}
        </div>
      )}

      {/* Messages Section */}
      {selectedConversation && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-bold mb-4">
            Messages for Conversation: {selectedConversation.id}
          </h2>
          {messages.length > 0 ? (
            <div className="space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className="p-4 rounded-lg bg-gray-100 border border-gray-300"
                >
                  <p className="font-medium">
                    <span className="text-primary">{message.sender}:</span>{" "}
                    {message.text}
                  </p>
                  <p className="text-sm text-gray-500">
                    Sent: {new Date(message.created_at).toLocaleString()}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500">No messages found for this conversation.</p>
          )}
        </div>
      )}
    </div>
  );
};

export default HomeView;
