import React, { useState } from 'react';
import { ReactFlowProvider } from '@xyflow/react';
import NavBar from './components/NavBar';
import LeftNavBar from './components/LeftNavBar';
import PreviewBot from './components/PreviewBot';
import FlowEditor from './components/FlowEditor';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { DndProvider } from 'react-dnd';

const App = () => {
  const [showDemo, setShowDemo] = useState(false);

  const toggleDemo = () => setShowDemo((prev) => !prev);
  const closeDemo = () => setShowDemo(false);

  return (
    <div className="flex h-screen flex-col bg-base-100">
      {/* Top Navbar */}
      <header className="h-16">
        <NavBar toggleDemo={toggleDemo} />
      </header>

      {/* Main Content Area */}
      <div className="flex flex-1">
        {/* Left Sidebar */}
        <aside className="w-64 bg-neutral text-white shadow-lg">
          <LeftNavBar />
        </aside>

        {/* Flow Editor Area */}
        <main className="flex-1 relative">
          <DndProvider backend={HTML5Backend}>
            <ReactFlowProvider>
              <FlowEditor />
            </ReactFlowProvider>
          </DndProvider>
        </main>

        {/* AI Demo Drawer */}
        <PreviewBot isOpen={showDemo} closeDemo={closeDemo} />
      </div>
    </div>
  );
};

export default App;
