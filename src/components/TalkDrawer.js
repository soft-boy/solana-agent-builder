import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const TalkDrawer = ({ isOpen, blockData, closeDrawer, updateBlock }) => {
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (blockData) {
      setMessage(blockData.message || '');
    }
  }, [blockData]);

  const handleSave = () => {
    updateBlock({ message }); // Save changes to the block
    closeDrawer();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed top-16 right-0 h-[calc(100%-4rem)] w-80 bg-white shadow-lg p-4 z-50 border-l border-gray-300"
          initial={{ x: '100%' }}
          animate={{ x: 0 }}
          exit={{ x: '100%' }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
        >
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-bold">Edit Talk Block</h2>
            <button className="btn btn-error btn-sm" onClick={closeDrawer}>
              Close
            </button>
          </div>
          <div className="form-control">
            <label className="label">
              <span className="label-text">Agent Message</span>
            </label>
            <input
              type="text"
              placeholder="Enter message"
              className="input input-bordered"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />
          </div>
          <div className="mt-4">
            <button className="btn btn-primary w-full" onClick={handleSave}>
              Save
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default TalkDrawer;
