import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import useSupabase from '../hooks/useSupabase';
import useWallets from '../hooks/useWallets';

const SolanaDrawer = ({ isOpen, blockData, closeDrawer, updateBlock }) => {
  const { supabase } = useSupabase()
  const { wallets } = useWallets(supabase);
  const [actionType, setActionType] = useState('/get-sol-price');

  useEffect(() => {
    if (blockData) {
      setActionType(blockData.actionType || '');
    }
  }, [blockData]);

  const handleSave = () => {
    updateBlock({ actionType });
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
              value={actionType}
              onChange={(e) => setActionType(e.target.value)}
            >
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
              onChange={(e) => setActionType(e.target.value)}
            >
              <option value="/close-empty-accounts" disabled>Close Empty Accounts</option>
              <option value="/deploy-new-token" disabled>Deploy a New Token</option>
              <option value="/get-sol-price">Get SOL Price</option>
              <option value="/launch-pump-fun-token" disabled>Launch Token on Pump.fun</option>
              <option value="/lend-tokens" disabled>Lend Tokens</option>
              <option value="/stake-solayer" disabled>Stake SOL on Solayer</option>
              <option value="/stake" disabled>Stake SOL</option>
              <option value="/swap-tokens" disabled>Swap Tokens</option>
              <option value="/zk-airdrop" disabled>Compressed Airdrop</option>
              <option value="/nft/create-3land-collection" disabled>Create a 3Land NFT Collection</option>
              <option value="/nft/create-3land-nft" disabled>Create a 3Land NFT</option>
              <option value="/nft/create-collection" disabled>Create a New NFT Collection</option>
              <option value="/perp/close-trade" disabled>Close a Perpetual Trade</option>
              <option value="/perp/open-trade" disabled>Open a Perpetual Trade</option>
            </select>
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
