import React, { useCallback } from 'react';
import PreviewBot from './components/PreviewBot.js';
import LeftNavBar from './components/LeftNavBar.js';
import NavBar from './components/NavBar.js';
import {
  ReactFlow,
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  addEdge,
} from '@xyflow/react';

import '@xyflow/react/dist/style.css';

const initialNodes = [
  { id: '1', position: { x: 0, y: 0 }, data: { label: '1' } },
  { id: '2', position: { x: 0, y: 100 }, data: { label: '2' } },
];
const initialEdges = [{ id: 'e1-2', source: '1', target: '2' }];

export default function App() {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  const onConnect = useCallback(
    (params) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  );

  return (
    <div className="flex h-screen flex-col">
      {/* Top Navbar */}
      <div className="h-16 bg-primary text-white flex items-center px-4">
        <NavBar />
      </div>

      {/* Main Content Area */}
      <div className="flex flex-1">
        {/* Left Sidebar */}
        <div className="w-64 bg-base-200 text-base-content h-full">
          <LeftNavBar />
        </div>

        {/* Main Editor Area */}
        <div className="flex-1 relative" style={{ marginRight: '20rem' }}>
          <div style={{ width: '100%', height: '100%' }}>
            <ReactFlow
              nodes={nodes}
              edges={edges}
              onNodesChange={onNodesChange}
              onEdgesChange={onEdgesChange}
              onConnect={onConnect}
            >
              <Controls />
              <MiniMap />
              <Background variant="dots" gap={12} size={1} />
            </ReactFlow>
          </div>
        </div>

        {/* Right Sidebar Drawer */}
        <div className="w-80 bg-base-200 text-base-content fixed right-0 h-full">
          <PreviewBot />
        </div>
      </div>
    </div>
  );
}
