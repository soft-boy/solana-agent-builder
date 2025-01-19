import React, { useState, useEffect } from 'react';
import { ReactFlowProvider } from '@xyflow/react';
import NavBar from './components/NavBar';
import LeftNavBar from './components/LeftNavBar';
import PreviewBot from './components/PreviewBot';
import FlowEditor from './components/FlowEditor';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { DndProvider } from 'react-dnd';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  "https://hcdsvvofqpfutulgdtlj.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhjZHN2dm9mcXBmdXR1bGdkdGxqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzcwNzE5ODUsImV4cCI6MjA1MjY0Nzk4NX0.6xVK2z8Y9wNKlOnW7tk1T7hJcq8xnTAwdAo9q0-pyIo"
);

const App = () => {
  const [agents, setAgents] = useState([]);
  const [selectedAgent, setSelectedAgent] = useState(null);
  const [showDemo, setShowDemo] = useState(false);

  const fetchAgents = async () => {
    const { data, error } = await supabase.from('flowcharts').select('id, name, data');
    if (error) {
      console.error('Error fetching agents:', error);
    } else {
      setAgents(data || []);
    }
  };

  const addAgent = async (name) => {
    const { data, error } = await supabase
      .from('flowcharts')
      .insert([{ name, data: null, ownedby: 'me' }])
      .select();

    if (error) {
      console.error('Error creating agent:', error);
    } else {
      setAgents((prevAgents) => [...prevAgents, ...data]);
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
          <LeftNavBar
            agents={agents}
            onAddAgent={addAgent}
            onSelectAgent={setSelectedAgent}
          />
        </aside>
        <main className="flex-1 relative">
          <DndProvider backend={HTML5Backend}>
            <ReactFlowProvider>
              {selectedAgent ? (
                <FlowEditor agentId={selectedAgent} />
              ) : (
                <div className="flex items-center justify-center h-full text-gray-500">
                  Select an agent to start editing.
                </div>
              )}
            </ReactFlowProvider>
          </DndProvider>
        </main>
        <PreviewBot isOpen={showDemo} closeDemo={closeDemo} />
      </div>
    </div>
  );
};

export default App;
