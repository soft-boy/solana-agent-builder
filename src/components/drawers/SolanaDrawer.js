import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import useSupabase from '../../hooks/useSupabase';
import useWallets from '../../hooks/useWallets';

const SolanaDrawer = ({ isOpen, blockData, closeDrawer, updateBlock }) => {
  const { supabase } = useSupabase()
  const { wallets } = useWallets(supabase);
  const [selectedWallet, setSelectedWallet] = useState('');
  const [actionType, setActionType] = useState('/get-sol-price');
  const [jsonPayload, setJsonPayload] = useState('');
  const [captures, setCaptures] = useState([]);

  useEffect(() => {
    if (blockData) {
      setSelectedWallet(blockData.wallet || '');
      setActionType(blockData.action || '');
      setJsonPayload(blockData.jsonPayload || '');
      setCaptures(blockData.captures || []);
    }
  }, [blockData]);

  const handleSave = () => {
    updateBlock({
      wallet: selectedWallet,
      action: actionType,
      jsonPayload,
      captures
    });
    closeDrawer();
  };

  const handleAddCapture = () => {
    setCaptures([...captures, { path: '', variable: '' }]);
  };

  const handleCaptureChange = (index, field, value) => {
    const updatedCaptures = [...captures];
    updatedCaptures[index][field] = value;
    setCaptures(updatedCaptures);
  };

  const handleRemoveCapture = (index) => {
    const updatedCaptures = captures.filter((_, i) => i !== index);
    setCaptures(updatedCaptures);
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
            <h2 className="text-lg font-bold">Edit Solana Block</h2>
            <button className="btn btn-error btn-sm text-white" onClick={closeDrawer}>
              Close
            </button>
          </div>

          {/* Wallet */}
          <div className="form-control mb-4">
            <label className="label">
              <span className="label-text">Wallet</span>
            </label>
            <select
              className="select select-bordered"
              value={selectedWallet}
              onChange={(e) => {
                console.log('wallet onChange:', e.target.value)
                setSelectedWallet(e.target.value)
              }}
            >
              <option value="" disabled>Select a wallet</option> 
              {wallets.map((wallet) => (
                <option value={wallet.id}>{wallet.wallet_name}</option>
              ))}
            </select>
          </div>

          {/* Request Type */}
          <div className="form-control mb-4">
            <label className="label">
              <span className="label-text">Solana Action</span>
            </label>
            <select
              className="select select-bordered"
              value={actionType}
              onChange={(e) => {
                console.log('action onChange:', e.target.value)
                setActionType(e.target.value)
              }}
            >
              <option value="" disabled>Select an action</option> 
              <option value="/close-empty-accounts">Close Empty Accounts</option>
              <option value="/deploy-new-token">Deploy a New Token</option>
              <option value="/get-sol-price">Get SOL Price</option>
              <option value="/launch-pump-fun-token">Launch Token on Pump.fun</option>
              <option value="/lend-tokens">Lend Tokens</option>
              <option value="/stake-solayer">Stake SOL on Solayer</option>
              <option value="/stake">Stake SOL</option>
              <option value="/swap-tokens">Swap Tokens</option>
              <option value="/zk-airdrop">Compressed Airdrop</option>
              <option value="/react-chat">ReAct Agent</option>
              <option disabled value="/nft/create-3land-collection">Create a 3Land NFT Collection</option>
              <option disabled value="/nft/create-3land-nft">Create a 3Land NFT</option>
              <option disabled value="/nft/create-collection">Create a New NFT Collection</option>
              <option disabled value="/perp/close-trade">Close a Perpetual Trade</option>
              <option disabled value="/perp/open-trade">Open a Perpetual Trade</option>
            </select>
          </div>

          {/* JSON Payload (visible only for POST) */}
          <div className="form-control mb-4">
            <label className="label">
              <span className="label-text">JSON Payload</span>
            </label>
            <textarea
              placeholder="Enter JSON payload"
              className="textarea textarea-bordered"
              rows="5"
              value={jsonPayload}
              onChange={(e) => setJsonPayload(e.target.value)}
            ></textarea>
          </div>

          {/* Capture Response */}
          <div className="form-control mb-4">
            <label className="label">
              <span className="label-text">Capture Response</span>
            </label>
            <div className="space-y-2">
              {captures.map((capture, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <input
                    type="text"
                    placeholder="path.to.value"
                    className="input input-bordered w-1/2"
                    value={capture.path}
                    onChange={(e) =>
                      handleCaptureChange(index, 'path', e.target.value)
                    }
                  />
                  <input
                    type="text"
                    placeholder="variable_name"
                    className="input input-bordered w-1/2"
                    value={capture.variable}
                    onChange={(e) =>
                      handleCaptureChange(index, 'variable', e.target.value)
                    }
                  />
                  <button
                    className="btn btn-sm btn-error text-white"
                    onClick={() => handleRemoveCapture(index)}
                  >
                    Remove
                  </button>
                </div>
              ))}
              <button
                className="btn btn-sm text-white btn-primary mt-2"
                onClick={handleAddCapture}
              >
                Add Capture
              </button>
            </div>
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

export default SolanaDrawer;
