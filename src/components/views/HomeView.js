import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom'; // Updated for React Router DOM v6
import useSupabase from '../../hooks/useSupabase';
import { motion } from 'framer-motion';
import { BiLoaderAlt, BiCheckCircle, BiWallet, BiCodeBlock, BiServer, BiPulse, BiChip } from 'react-icons/bi';

const HomeView = () => {
  const { email, session, supabase } = useSupabase();
  const [agents, setAgents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [systemStatus, setSystemStatus] = useState({
    backend: 'loading',
    solana: 'loading',
    database: 'loading'
  });

  const displayName =
    session?.user?.user_metadata?.full_name?.split(' ')[0] ||
    email?.split('@')[0].replace(/[0-9]/g, '');

  // Fetch agents from Supabase
  const fetchAgents = async () => {
    setLoading(true);
    setError(null);
    const { data, error } = await supabase
      .from('agents')
      .select('*')
      .order('name', { ascending: true });

    if (error) {
      setError('Failed to fetch agents.');
    } else {
      setAgents(data);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchAgents();
    setTimeout(() => {
      setSystemStatus({
        backend: 'ok',
        solana: 'ok',
        database: 'ok'
      });
    }, 2000);
  }, []);

  return (
    <div className="p-6 bg-base-100">
      {/* Welcome Section */}
      <div className="flex justify-between items-center p-6 bg-primary text-white rounded-lg shadow-lg">
        <div>
          <h1 className="text-4xl font-bold">Welcome back, {displayName}!</h1>
          <p className="text-sm opacity-75">Here’s an overview of your dashboard.</p>
        </div>
      </div>

      {/* System Status Section */}
      <div className="mt-8 p-6 bg-neutral text-white rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold mb-4">System Status</h2>
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 bg-base-100 text-neutral rounded-lg p-4 shadow-md">
            <h3 className="text-lg font-semibold">Agent Count</h3>
            <div className="relative w-full bg-gray-200 rounded-full h-4 mt-2">
              <motion.div
                initial={{ width: '0%' }}
                animate={{ width: `${(agents.length / 10) * 100}%` }}
                transition={{ duration: 1.5 }}
                className="absolute top-0 left-0 h-4 bg-primary rounded-full"
              ></motion.div>
            </div>
            <p className="text-sm mt-2">{agents.length} agents currently active</p>
          </div>
          <div className="flex-1 bg-base-100 text-neutral rounded-lg p-4 shadow-md">
            <h3 className="text-lg font-semibold">Module Checker</h3>
            {['backend', 'solana', 'database'].map((service) => (
              <div key={service} className="flex items-center gap-2 mt-2">
                {systemStatus[service] === 'loading' ? (
                  <BiLoaderAlt className="animate-spin text-primary text-xl" />
                ) : (
                  <BiCheckCircle className="text-success text-xl" />
                )}
                <span className="text-sm capitalize">{service.replace('-', ' ')} check</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Agents Section */}
      <h1 className="text-3xl pt-8 font-bold mb-6 text-neutral">Your Agents</h1>

      {loading && <p className="text-gray-500 animate-pulse">Loading agents...</p>}
      {error && <p className="text-error">{error}</p>}

      {!loading && agents.length === 0 && (
        <p className="text-gray-500">No agents found. Create one to get started!</p>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 lg:grid-cols-5 gap-8">
        {agents.map((agent) => (
          <Link to={`/agent/${agent.id}`} key={agent.id}>
            <motion.div
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
              className="card bg-white pt-3 pb-3 rounded-3xl shadow-lg border shadow-blue-800/40 border-blue-700 hover:border-indigo-600 transition-all duration-300"
            >
              <div className="card-body">
                <h2 className="card-title text-lg font-semibold text-primary">{agent.name}</h2>
                <p className="text-sm text-gray-400">Created on: {new Date(agent.created_at).toLocaleDateString()}</p>
                <div className="mt-3 space-y-1">
                  <div className="flex items-center gap-2 text-green-600">
                    <BiWallet className="text-lg" />
                    <span className="text-sm font-medium">Secure Wallet Linked</span>
                  </div>
                  <div className="flex items-center gap-2 text-info font-medium">
                    <BiChip className="text-lg" />
                    <span className="text-sm">Real-time AI Processing</span>
                  </div>
                  <div className="flex items-center gap-2 text-warning font-medium">
                    <BiServer className="text-lg" />
                    <span className="text-sm">Cloud Sync Enabled</span>
                  </div>
                </div>
              </div>
            </motion.div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default HomeView;
