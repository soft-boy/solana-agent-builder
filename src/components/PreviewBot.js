import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSupabase } from '../lib/SupabaseContext';
import sendMessage from '../lib/sendMessage';
import useMessages from '../hooks/useMessages';

const BASE_URL = process.env.REACT_APP_URL || 'http://localhost:8888'

const PreviewBot = ({ isOpen, closeDemo }) => {
  const supabase = useSupabase()
  const { messages, loading, error } = useMessages(supabase, 1)
  
  const [input, setInput] = useState('');

  const handleSend = async () => {
    if (input.trim()) {
      sendMessage(supabase, 1, input, 'user')
      setInput('');

      await fetch(`${BASE_URL}/.netlify/functions/trigger-convo`)
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="absolute top-0 right-0 h-full w-80 bg-neutral text-white shadow-lg p-4 z-20"
          initial={{ x: '100%' }}
          animate={{ x: 0 }}
          exit={{ x: '100%' }}
          transition={{ duration: 0.4, ease: 'easeInOut' }}
        >
          <div className="flex gap-2">
            {/* Close Button */}
            <button className="btn btn-error text-white mb-4" onClick={closeDemo}>
              Close Demo
            </button>

            {/* Close Button */}
            <button className="btn mb-4" onClick={closeDemo}>
              Restart
            </button>
          </div>

          <h2 className="text-xl font-bold mb-4">AI Demo Conversation</h2>

          {/* Chat Window */}
          <div className="flex flex-col h-[calc(100%-96px)]">
            <div className="flex-1 overflow-y-auto space-y-3 bg-base-100 rounded-lg p-4">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`chat ${
                    msg.sender === 'bot' ? 'chat-start' : 'chat-end'
                  }`}
                >
                  {msg.sender === 'bot' && (
                    <div className="chat-bubble text-white chat-bubble-primary">
                      {msg.text}
                    </div>
                  )}
                  {msg.sender === 'user' && (
                    <div className="chat-bubble text-white chat-bubble-accent">
                      {msg.text}
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Input Area */}
            <div className="mt-4">
              <div className="flex items-center space-x-2">
                <input
                  type="text"
                  placeholder="Type your message..."
                  className="input input-bordered flex-1 bg-white text-black border-primary focus:outline-none focus:ring-2 focus:ring-primary rounded-lg"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                />
                <button
                  className="btn bg-primary text-white hover:bg-blue-700 rounded-lg"
                  onClick={handleSend}
                >
                  Send
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default PreviewBot;
