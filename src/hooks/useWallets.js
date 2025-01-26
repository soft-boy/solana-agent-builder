import React, { useState, useEffect } from 'react';

const useWallets = (supabase) => {
  const [wallets, setWallets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchWallets = async () => {
      try {
        setLoading(true);
        // Fetch wallets with owner = userId
        const { data, error } = await supabase
          .from('wallets')
          .select('*')
          .order('created_at', { ascending: true });

        if (error) {
          console.error('Error fetching wallets:', error);
          setError(error.message);
          return;
        }

        setWallets(data);
      } catch (err) {
        console.error('Unexpected error:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    // Fetch wallets
    fetchWallets();
  }, [supabase]);

  return {
    wallets,
    loading,
    error,
  };
};

export default useWallets;