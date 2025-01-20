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
import { useSupabase } from '../lib/SupabaseContext';
import { useDrop } from 'react-dnd';
import Toolbox from './Toolbox';
import TalkDrawer from './TalkDrawer';
import ListenDrawer from './ListenDrawer';
import AiDrawer from './AiDrawer';
import ApiDrawer from './ApiDrawer';
import '@xyflow/react/dist/style.css';

const FlowEditor = ({ agentId }) => {
  const supabase = useSupabase()
  const reactFlow = useReactFlow();
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [selectedNode, setSelectedNode] = useState(null);
  const editorRef = useRef(null);

  useEffect(() => {
    const fetchFlowchart = async () => {
      let { data } = await supabase
        .from('flowcharts')
        .select('data')
        .eq('id', agentId) // Fetch flowchart by agentId
        .single();

      if (data?.data) {
        setNodes(data.data.nodes || []);
        setEdges(data.data.edges || []);
      } else {
        setNodes([]);
        setEdges([]);
      }

      reactFlow.fitView(); // Reset the view for the new agent
    };

    fetchFlowchart();
  }, [agentId, setNodes, setEdges, reactFlow]);

  const saveFlowchart = async (updatedNodes, updatedEdges) => {
    const flowchartData = {
      nodes: updatedNodes,
      edges: updatedEdges,
    };

    const { error } = await supabase
      .from('flowcharts')
      .upsert({
        id: agentId, // Save using the agentId
        data: flowchartData,
      });

    if (error) {
      console.error('Error saving flowchart:', error);
    } else {
      console.log('Flowchart saved successfully!');
    }
  };

  const onConnect = useCallback(
    (params) => {
      setEdges((eds) => addEdge(params, eds));
      saveFlowchart(nodes, edges);
    },
    [setEdges, nodes, edges]
  );

  const [{ isOver }, drop] = useDrop(() => ({
    accept: 'tool',
    drop: (item, monitor) => {
      const canvasBounds = editorRef.current.getBoundingClientRect();
      const clientOffset = monitor.getClientOffset();

      if (!clientOffset) return;

      const position = {
        x: clientOffset.x - canvasBounds.left,
        y: clientOffset.y - canvasBounds.top,
      };

      const newNode = {
        id: `node-${Date.now()}`,
        position,
        data: {
          label: item.id.charAt(0).toUpperCase() + item.id.slice(1),
          type: item.id,
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
    event.stopPropagation();
    setSelectedNode(node);
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
          key={agentId} // Force ReactFlow to reinitialize for each agent
          nodes={nodes.map((node) => ({
            ...node,
            onClick: (event) => handleNodeClick(event, node),
          }))}
          edges={edges}
          onNodesChange={(changes) => {
            onNodesChange(changes);
            saveFlowchart(nodes, edges);
          }}
          onEdgesChange={(changes) => {
            onEdgesChange(changes);
            saveFlowchart(nodes, edges);
          }}
          onConnect={onConnect}
          onNodeClick={(event, node) => {
            handleNodeClick(event, node);
          }}
        >
          <Controls />
          <MiniMap />
          <Background variant="dots" gap={12} size={1} />
        </ReactFlow>
      </div>
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
    </div>
  );
};

export default FlowEditor;
