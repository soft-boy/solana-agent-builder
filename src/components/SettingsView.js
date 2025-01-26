import React, { useState, useEffect } from 'react';
import { PublicKey, Keypair } from '@solana/web3.js';
import useSupabase from '../hooks/useSupabase';
import { encryptPrivateKey } from '../lib/encryption';

const SettingsView = () => {
  const { supabase } = useSupabase();
  const [wallets, setWallets] = useState([]);
  const [newWalletName, setNewWalletName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch wallets for the logged-in user
  const fetchWallets = async () => {
    setLoading(true);
    setError(null);
    const { data, error } = await supabase.from('wallets').select('*').order('created_at');
    if (error) {
      setError('Failed to fetch wallets');
    } else {
      setWallets(data);
    }
    setLoading(false);
  };

  // Generate and add a new wallet
  const addWallet = async () => {
    setLoading(true);
    setError(null);

    try {
      // Generate a new Solana wallet
      const keypair = Keypair.generate();
      const publicKey = keypair.publicKey.toString();
      const privateKey = JSON.stringify(Array.from(keypair.secretKey));

      // Encrypt the private key
      const { encrypted, iv } = await encryptPrivateKey(privateKey);

      // Save the wallet to Supabase
      const { error } = await supabase.from('wallets').insert([
        {
          wallet_name: newWalletName || 'Unnamed Wallet',
          wallet_address: publicKey,
          private_key_encrypted: JSON.stringify({ encrypted, iv }),
        },
      ]);

      if (error) {
        setError('Failed to add wallet');
      } else {
        setNewWalletName('');
        fetchWallets(); // Refresh the wallet list
      }
    } catch (err) {
      setError('Wallet creation or encryption failed');
    }

    setLoading(false);
  };

  // Delete a wallet
  const deleteWallet = async (id) => {
    setLoading(true);
    setError(null);

    const { error } = await supabase.from('wallets').delete().eq('id', id);

    if (error) {
      setError('Failed to delete wallet');
    } else {
      fetchWallets(); // Refresh the wallet list
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchWallets();
  }, []);

  return (
    <div>
      <h1>Manage Solana Wallets</h1>
      <p style={{ color: 'red' }}>
        Warning: Private keys are stored in the database for this tech demo. This is NOT secure for production. Do not use real wallets or store sensitive private keys.
      </p>

      {loading && <p>Loading...</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}

      <div>
        <h2>Add Wallet</h2>
        <input
          type="text"
          placeholder="Wallet Name"
          value={newWalletName}
          onChange={(e) => setNewWalletName(e.target.value)}
        />
        <button onClick={addWallet} disabled={loading}>
          Generate and Add Wallet
        </button>
      </div>

      <div>
        <h2>Your Wallets</h2>
        {wallets.length === 0 && <p>No wallets found.</p>}
        <ul>
          {wallets.map((wallet) => (
            <li key={wallet.id}>
              <strong>{wallet.wallet_name}</strong> - {wallet.wallet_address}
              <button
                className="btn"
                onClick={() => deleteWallet(wallet.id)}
                disabled={loading}
              >
                Delete
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default SettingsView;