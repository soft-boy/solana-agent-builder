import React, { useCallback, useRef, useState } from 'react';
import {
  ReactFlow,
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  useReactFlow,
  addEdge,
} from '@xyflow/react';
import { useDrop } from 'react-dnd';
import Toolbox from './Toolbox';
import TalkDrawer from './TalkDrawer';
import ListenDrawer from './ListenDrawer'; // Add similar for other block types
import '@xyflow/react/dist/style.css';

const startNode = {
  id: `node-start`,
  position: { x: 200, y: 400 },
  data: {
    label: 'start',
    type: 'start', // Store the block type
  },
  style: { width: 200 },
  sourcePosition: 'right',
  targetPosition: 'left',
}

const FlowEditor = () => {
  const reactFlow = useReactFlow();
  const [nodes, setNodes, onNodesChange] = useNodesState([startNode]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [selectedNode, setSelectedNode] = useState(null); // Track the selected node
  const editorRef = useRef(null);

  window.reactFlow = reactFlow

  const onConnect = useCallback(
    (params) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  );

  const [{ isOver }, drop] = useDrop(() => ({
    accept: 'tool',
    drop: (item, monitor) => {
      const canvasBounds = editorRef.current.getBoundingClientRect();
      const clientOffset = monitor.getClientOffset();

      if (!clientOffset) return; // Ensure the offset is valid

      const position = {
        x: clientOffset.x - canvasBounds.left,
        y: clientOffset.y - canvasBounds.top,
      };

      const newNode = {
        id: `node-${Date.now()}`,
        position,
        data: {
          label: item.id.charAt(0).toUpperCase() + item.id.slice(1),
          type: item.id, // Store the block type
        },
        style: { width: 200 },
        sourcePosition: 'right',
        targetPosition: 'left',
      };

      setNodes((nds) => [...nds, newNode]);
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
    }),
  }));

  const handleNodeClick = (event, node) => {
    event.stopPropagation(); // Prevent ReactFlow from intercepting the click
    setSelectedNode(node); // Set the selected node
  };

  const updateNodeData = (id, updatedData) => {
    setNodes((nds) =>
      nds.map((node) =>
        node.id === id ? { ...node, data: { ...node.data, ...updatedData } } : node
      )
    );
  };

  return (
    <div className="flex h-full relative">
      <Toolbox />
      <div
        ref={(node) => {
          drop(node);
          editorRef.current = node;
        }}
        className={`flex-1 ${isOver ? 'bg-gray-200' : 'bg-white'}`}
      >
        <ReactFlow
          nodes={nodes.map((node) => ({
            ...node,
            onClick: (event) => handleNodeClick(event, node), // Attach click handler to each node
          }))}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          onNodeClick={(event, node) => {
            handleNodeClick(event, node); // Pass to custom handler
          }}
        >
          <Controls />
          <MiniMap />
          <Background variant="dots" gap={12} size={1} />
        </ReactFlow>
      </div>
      {/* Render corresponding drawer based on block type */}
      {selectedNode && selectedNode.data.type === 'talk' && (
        <TalkDrawer
          isOpen={!!selectedNode}
          blockData={selectedNode.data}
          closeDrawer={() => setSelectedNode(null)}
          updateBlock={(updatedData) => updateNodeData(selectedNode.id, updatedData)}
        />
      )}
      {selectedNode && selectedNode.data.type === 'listen' && (
        <ListenDrawer
          isOpen={!!selectedNode}
          blockData={selectedNode.data}
          closeDrawer={() => setSelectedNode(null)}
          updateBlock={(updatedData) => updateNodeData(selectedNode.id, updatedData)}
        />
      )}
      {/* Add other drawers like AiDrawer, SolanaDrawer here */}
    </div>
  );
};

export default FlowEditor;
