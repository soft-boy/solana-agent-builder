import React, { useState, useEffect } from 'react';
import { PublicKey, Keypair } from '@solana/web3.js';
import useSupabase from '../../hooks/useSupabase';
import { encryptPrivateKey } from '../../lib/encryption';
import bs58 from 'bs58';

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
      const publicKey = keypair.publicKey.toBase58();
      const privateKey = bs58.encode(keypair.secretKey)
      // console.log(privateKey)

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
      console.log(err)
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
    <div className="p-6 bg-base-100 text-base-content">
      <h1 className="text-2xl font-bold mb-4">Manage Solana Wallets</h1>
      <div className="alert alert-warning mb-4">
         Warning: Private keys are stored in the database for this tech demo. This is NOT secure for production. Do not use real wallets or store sensitive private keys.
      </div>

      {loading && <p className="text-info mb-4">Loading...</p>}
      {error && <p className="text-error mb-4">{error}</p>}

      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-2">Add Wallet</h2>
        <div className="flex gap-4">
          <input
            type="text"
            placeholder="Wallet Name"
            value={newWalletName}
            onChange={(e) => setNewWalletName(e.target.value)}
            className="input input-bordered w-full"
          />
          <button
            onClick={addWallet}
            disabled={loading}
            className={`btn text-white btn-primary ${loading ? 'loading' : ''}`}
          >
            Generate & Add Wallet
          </button>
        </div>
      </div>

      <div>
        <h2 className="text-xl font-semibold mb-2">Your Wallets</h2>
        {wallets.length === 0 ? (
          <p className="text-gray-500">No wallets found.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="table w-full">
              <thead>
                <tr>
                  <th>Wallet Name</th>
                  <th>Wallet Address</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {wallets.map((wallet) => (
                  <tr key={wallet.id}>
                    <td>{wallet.wallet_name}</td>
                    <td className="truncate w-64">{wallet.wallet_address}</td>
                    <td>
                      <button
                        onClick={() => deleteWallet(wallet.id)}
                        disabled={loading}
                        className={`btn text-white btn-error btn-sm ${loading ? 'loading' : ''}`}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default SettingsView;