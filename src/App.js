import React, { useState, useEffect } from 'react';
import NavBar from './components/NavBar';
import LeftNavBar from './components/LeftNavBar';
import PreviewBot from './components/PreviewBot';
import FlowEditor from './components/FlowEditor';
import { useSupabase } from './lib/SupabaseContext';

const App = () => {
  const supabase = useSupabase();
  const [agents, setAgents] = useState([]);
  const [selectedAgent, setSelectedAgent] = useState(null);
  const [showDemo, setShowDemo] = useState(false);

  // Fetch Agents
  const fetchAgents = async () => {
    const { data, error } = await supabase
      .from('flowcharts')
      .select('id, name, data');
    if (error) {
      console.error('Error fetching agents:', error);
    } else {
      setAgents(data || []);
    }
  };

  // Add Agent
  const addAgent = async (name) => {
    const { data, error } = await supabase
      .from('flowcharts')
      .insert([{ name, data: null, ownedby: 'me' }])
      .select();
    if (error) {
      console.error('Error creating agent:', error);
    } else {
      // data will contain the newly-created row(s)
      setAgents((prevAgents) => [...prevAgents, ...data]);
    }
  };

  // **Delete Agent** (new function)
  const deleteAgent = async (agentId) => {
    const { error } = await supabase
      .from('flowcharts')
      .delete()
      .eq('id', agentId);

    if (error) {
      console.error('Error deleting agent:', error);
      return;
    }
    // Remove from our local state
    setAgents((prevAgents) => prevAgents.filter((a) => a.id !== agentId));
    // If we were viewing the deleted agent, reset to "no selection"
    if (selectedAgent === agentId) {
      setSelectedAgent(null);
    }
  };

  const toggleDemo = () => setShowDemo((prev) => !prev);
  const closeDemo = () => setShowDemo(false);

  useEffect(() => {
    fetchAgents();
  }, []);

  return (
    <div className="flex h-screen flex-col bg-base-100">
      <header className="h-16">
        <NavBar toggleDemo={toggleDemo} />
      </header>
      <div className="flex flex-1">
        <aside className="w-64 bg-neutral text-white shadow-lg">
          {/* Pass in onDeleteAgent to LeftNavBar */}
          <LeftNavBar
            agents={agents}
            onAddAgent={addAgent}
            onSelectAgent={setSelectedAgent}
            onDeleteAgent={deleteAgent}
          />
        </aside>
        <main className="flex-1 relative">
          {selectedAgent ? (
            <FlowEditor agentId={selectedAgent} />
          ) : (
            <div className="flex items-center justify-center h-full text-gray-500">
              Select an agent to start editing.
            </div>
          )}
        </main>
        <PreviewBot isOpen={showDemo} closeDemo={closeDemo} />
      </div>
    </div>
  );
};

export default App;
