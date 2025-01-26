import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const AiDrawer = ({ isOpen, blockData, closeDrawer, updateBlock }) => {
  const [systemPrompt, setSystemPrompt] = useState('');
  const [userPrompt, setUserPrompt] = useState('');
  const [temperature, setTemperature] = useState(0.7);

  useEffect(() => {
    if (blockData) {
      setSystemPrompt(blockData.systemPrompt || '');
      setUserPrompt(blockData.userPrompt || '');
      setTemperature(blockData.temperature || 0.7);
    }
  }, [blockData]);

  const handleSave = () => {
    updateBlock({ systemPrompt, userPrompt, temperature });
    closeDrawer();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed top-16 right-0 h-[calc(100%-4rem)] w-96 bg-white shadow-lg p-4 z-50 border-l border-gray-300"
          initial={{ x: '100%' }}
          animate={{ x: 0 }}
          exit={{ x: '100%' }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
        >
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-bold">Edit AI Block</h2>
            <button className="btn btn-error btn-sm text-white" onClick={closeDrawer}>
              Close
            </button>
          </div>

          <div className="form-control mb-4">
            <label className="label">
              <span className="label-text">System Prompt</span>
            </label>
            <textarea
              placeholder="Enter the system prompt"
              className="textarea textarea-bordered"
              rows="3"
              value={systemPrompt}
              onChange={(e) => setSystemPrompt(e.target.value)}
            ></textarea>
          </div>

          <div className="form-control mb-4">
            <label className="label">
              <span className="label-text">User Prompt</span>
            </label>
            <textarea
              placeholder="Enter the user prompt"
              className="textarea textarea-bordered"
              rows="3"
              value={userPrompt}
              onChange={(e) => setUserPrompt(e.target.value)}
            ></textarea>
          </div>

          <div className="form-control mb-4">
            <label className="label">
              <span className="label-text">Temperature</span>
            </label>
            <input
              type="range"
              min="0"
              max="1"
              step="0.1"
              value={temperature}
              onChange={(e) => setTemperature(parseFloat(e.target.value))}
              className="range range-primary"
            />
            <div className="text-sm text-gray-500 mt-1">Value: {temperature}</div>
          </div>

          <div className="mt-4">
            <button className="btn btn-primary text-white w-full" onClick={handleSave}>
              Save
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default AiDrawer;
