import React, { useState, useEffect } from 'react';
import { Link } from 'react-router'; // Assuming you're using React Router for navigation
import useSupabase from '../hooks/useSupabase';

const HomeView = () => {
  const { supabase } = useSupabase();
  const [agents, setAgents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch agents from Supabase
  const fetchAgents = async () => {
    setLoading(true);
    setError(null);
    const { data, error } = await supabase
      .from('agents')
      .select('*')
      .order('name', { ascending: true });;

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
    <div className="p-6 bg-base-100 min-h-screen">
      <h1 className="text-3xl font-bold mb-6">Your Agents</h1>

      {loading && <p className="text-gray-500">Loading agents...</p>}
      {error && <p className="text-error">{error}</p>}

      {!loading && agents.length === 0 && (
        <p className="text-gray-500">No agents found. Create one to get started!</p>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {agents.map((agent) => (
          <Link to={`/agent/${agent.id}`} key={agent.id}>
            <div className="card shadow-xl hover:shadow-2xl transition-all duration-300">
              <div className="card-body">
                <h2 className="card-title text-lg font-semibold">{agent.name}</h2>
                <p className="text-sm text-gray-400">
                  Created on: {new Date(agent.created_at).toLocaleDateString()}
                </p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default HomeView;