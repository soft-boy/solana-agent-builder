import React, { useCallback, useRef, useState, useEffect } from 'react';
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
import { createClient } from "@supabase/supabase-js";
import { useDrop } from 'react-dnd';
import Toolbox from './Toolbox';
import TalkDrawer from './TalkDrawer';
import ListenDrawer from './ListenDrawer'; // Add similar for other block types
import AiDrawer from './AiDrawer';
import ApiDrawer from './ApiDrawer';
import '@xyflow/react/dist/style.css';

const supabase = createClient(
  "https://hcdsvvofqpfutulgdtlj.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhjZHN2dm9mcXBmdXR1bGdkdGxqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzcwNzE5ODUsImV4cCI6MjA1MjY0Nzk4NX0.6xVK2z8Y9wNKlOnW7tk1T7hJcq8xnTAwdAo9q0-pyIo"
);

window.supabase = supabase;

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
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [selectedNode, setSelectedNode] = useState(null); // Track the selected node
  const editorRef = useRef(null);

  window.reactFlow = reactFlow

  useEffect(() => {
    const fetchFlowchart = async () => {
      let { data: flowchart } = await supabase
        .from('flowcharts')
        .select('*')
        .eq('id', 1)
        .single();

      if (flowchart.data) {
        setNodes(flowchart.data.nodes)
        setEdges(flowchart.data.edges)
      }
    }

    fetchFlowchart() 
  }, [])

  const saveFlowchart = async (updatedNodes, updatedEdges) => {
    const flowchartData = {
      nodes: updatedNodes,
      edges: updatedEdges,
    };

    const { error } = await supabase
      .from('flowcharts')
      .update({
        data: flowchartData,
      })
      .eq('id', 1)
      .select();

    if (error) {
      console.error('Error saving flowchart:', error);
    } else {
      console.log('Flowchart saved successfully!');
    }
  }

  const handleFlowchartChange = () => {
    saveFlowchart(nodes, edges);
  };

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
          onNodesChange={(changes) => {
            onNodesChange(changes);
            handleFlowchartChange(); // Save on node changes
          }}
          onEdgesChange={(changes) => {
            onEdgesChange(changes);
            handleFlowchartChange(); // Save on edge changes
          }}
          onConnect={(connection) => {
            onConnect(connection);
            handleFlowchartChange(); // Save on new connections
          }}
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
      {selectedNode && selectedNode.data.type === 'api' && (
        <ApiDrawer
          isOpen={!!selectedNode}
          blockData={selectedNode.data}
          closeDrawer={() => setSelectedNode(null)}
          updateBlock={(updatedData) => updateNodeData(selectedNode.id, updatedData)}
        />
      )}
      {selectedNode && selectedNode.data.type === 'ai' && (
        <AiDrawer
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
