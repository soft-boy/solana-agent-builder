import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom'; // Updated for React Router DOM v6
import useSupabase from '../../hooks/useSupabase';
import { motion } from 'framer-motion';

const HomeView = () => {
  const { email, session, supabase } = useSupabase();
  const [agents, setAgents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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

      {/* Graph Section */}
      <div className="mt-8 p-6 bg-neutral text-white rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold mb-4">Dashboard Insights</h2>
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 bg-base-100 text-neutral rounded-lg p-4 shadow-md">
            <h3 className="text-lg font-semibold">Agent Count</h3>
            <div className="relative w-full bg-gray-200 rounded-full h-4 mt-2">
              <div
                className="absolute top-0 left-0 h-4 bg-primary rounded-full"
                style={{ width: `${(agents.length / 10) * 100}%` }}
              ></div>
            </div>
            <p className="text-sm mt-2">{agents.length} agents currently active</p>
          </div>
          <div className="flex-1 bg-base-100 text-neutral rounded-lg p-4 shadow-md">
            <h3 className="text-lg font-semibold">Loading Status</h3>
            {loading ? (
              <div className="animate-pulse text-sm">Fetching data...</div>
            ) : (
              <p className="text-sm">All data is up to date!</p>
            )}
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

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {agents.map((agent) => (
          <Link to={`/agent/${agent.id}`} key={agent.id}>
            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="card shadow-xl hover:shadow-2xl transition-all duration-300"
            >
              <div className="card-body">
                <h2 className="card-title text-lg font-semibold">{agent.name}</h2>
                <p className="text-sm text-gray-400">
                  Created on: {new Date(agent.created_at).toLocaleDateString()}
                </p>
              </div>
            </motion.div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default HomeView;
