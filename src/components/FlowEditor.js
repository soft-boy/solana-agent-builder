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
import TalkDrawer from './drawers/TalkDrawer';
import ListenDrawer from './drawers/ListenDrawer';
import AiDrawer from './drawers/AiDrawer';
import ApiDrawer from './drawers/ApiDrawer';
import SolanaDrawer from './drawers/SolanaDrawer';
import { useParams } from 'react-router';
import '@xyflow/react/dist/style.css';
import { toast } from 'react-toastify';

const FlowEditor = () => {
  const { agentId } = useParams();
  const { supabase } = useSupabase();
  const reactFlow = useReactFlow();

  // Node + Edge state
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);

  // For opening side drawers
  const [selectedNode, setSelectedNode] = useState(null);

  // Grab ref to the editor to compute drop coords
  const editorRef = useRef(null);

  /**
   * Right-click context menu info.
   * We store whether we're deleting a node or an edge, plus the IDs and
   * the mouse (x, y) position to show the menu.
   */
  const [contextMenu, setContextMenu] = useState({
    visible: false,
    x: 0,
    y: 0,
    type: null, // 'node' or 'edge'
    nodeId: null,
    edgeId: null,
  });

  // Fetch existing flowchart from supabase
  useEffect(() => {
    const fetchFlowchart = async () => {
      const { data: agent } = await supabase
        .from('agents')
        .select('*')
        .eq('id', agentId)
        .single();

      if (agent?.flowchart) {
        setNodes(agent.flowchart.nodes || []);
        setEdges(agent.flowchart.edges || []);
      } else {
        setNodes([]);
        setEdges([]);
      }

      reactFlow.fitView();
    };

    fetchFlowchart();
  }, [agentId, supabase, reactFlow, setNodes, setEdges]);

  // Save to supabase
  const saveFlowchart = async (updatedNodes, updatedEdges) => {
    const flowchartData = {
      nodes: updatedNodes,
      edges: updatedEdges,
    };

    const { error } = await supabase
      .from('agents')
      .upsert({
        id: agentId,
        flowchart: flowchartData,
      });

    if (error) {
      console.error('Error saving flowchart:', error);
    } else {
      console.log('Flowchart saved successfully!');
    }
  };

  // Connect edges
  const onConnect = useCallback(
    (params) => {
      setEdges((eds) => addEdge(params, eds));
      saveFlowchart(nodes, edges);
    },
    [edges, nodes, saveFlowchart, setEdges]
  );

  // Drag & drop from Toolbox
  const [{ isOver }, drop] = useDrop(() => ({
    accept: 'tool',
    drop: (item, monitor) => {
      const canvasBounds = editorRef.current?.getBoundingClientRect();
      const clientOffset = monitor.getClientOffset();

      if (!canvasBounds || !clientOffset) return;

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
        style: {
          width: 200,
          backgroundColor: item.id === 'start' ? 'green' : undefined,
        },
        sourcePosition: 'right',
        targetPosition: 'left',
      };

      setNodes((nds) => [...nds, newNode]);
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
    }),
  }));

  // Left-click: select node (open the correct drawer)
  const handleNodeClick = (event, node) => {
    event.stopPropagation();
    setSelectedNode(node);
  };

  /**
   * Right-click on node: show context menu to remove node.
   * We also .preventDefault() so the browser menu won't appear.
   */
  const handleNodeContextMenu = (event, node) => {
    event.preventDefault(); // stop default browser menu
    setContextMenu({
      visible: true,
      x: event.clientX,
      y: event.clientY,
      type: 'node',
      nodeId: node.id,
      edgeId: null,
    });
  };

  /**
   * Right-click on edge: show context menu to remove edge.
   */
  const handleEdgeContextMenu = (event, edge) => {
    event.preventDefault();
    setContextMenu({
      visible: true,
      x: event.clientX,
      y: event.clientY,
      type: 'edge',
      nodeId: null,
      edgeId: edge.id,
    });
  };

  /**
   * Actually delete node or edge, depending on contextMenu.type
   */
  const handleDelete = () => {
    if (!contextMenu.type) return;
  
    if (contextMenu.type === 'node' && contextMenu.nodeId) {
      // Prevent deletion of the start node
      if (contextMenu.nodeId === 'node-start') {
        toast.error("You can't delete the start node");
        return;
      }
  
      setNodes((currNodes) => {
        const newNodes = currNodes.filter((n) => n.id !== contextMenu.nodeId);
        const newEdges = edges.filter(
          (e) => e.source !== contextMenu.nodeId && e.target !== contextMenu.nodeId
        );
        setEdges(newEdges);
        saveFlowchart(newNodes, newEdges);
        return newNodes;
      });
    } else if (contextMenu.type === 'edge' && contextMenu.edgeId) {
      setEdges((currEdges) => {
        const newEdges = currEdges.filter((e) => e.id !== contextMenu.edgeId);
        saveFlowchart(nodes, newEdges);
        return newEdges;
      });
    }
  
    // hide menu afterwards
    setContextMenu({
      visible: false,
      x: 0,
      y: 0,
      type: null,
      nodeId: null,
      edgeId: null,
    });
  };

  // Hide the context menu if user clicks elsewhere
  const handleClickCanvas = () => {
    if (contextMenu.visible) {
      setContextMenu({
        visible: false,
        x: 0,
        y: 0,
        type: null,
        nodeId: null,
        edgeId: null,
      });
    }
  };

  // Drawer updates
  const updateNodeData = (id, updatedData) => {
    console.log('updateNodeData:', id, updatedData)
    setNodes((nds) =>
      nds.map((node) =>
        node.id === id ? { ...node, data: { ...node.data, ...updatedData } } : node
      )
    );
  };

  return (
    <div className="flex h-full relative">
      <Toolbox />

      {/**
       * Inline style override to make the node "dots" bigger,
       * so it's easier to click and connect them.
       */}
      <style>
        {`
          .react-flow__handle {
            width: 10px !important;
            height: 10px !important;
          }
        `}
      </style>

      <div
        ref={(node) => {
          drop(node);
          editorRef.current = node;
        }}
        onClick={handleClickCanvas}
        className={`flex-1 ${isOver ? 'bg-gray-200' : 'bg-white'}`}
      >
        <ReactFlow
          key={agentId} // re-initialize for each agent
          nodes={nodes}
          edges={edges}
          defaultEdgeOptions={{ type: 'smoothstep' }} // Default to smoothstep
          connectionLineType="smoothstep"
          onNodesChange={(changes) => {
            console.log('changes:', changes)
            onNodesChange(changes);
            saveFlowchart(nodes, edges);
          }}
          onEdgesChange={(changes) => {
            onEdgesChange(changes);
            saveFlowchart(nodes, edges);
          }}
          onConnect={onConnect}
          onNodeClick={handleNodeClick}
          onNodeContextMenu={handleNodeContextMenu}
          onEdgeContextMenu={handleEdgeContextMenu}
        >
          <Controls />
          <MiniMap />
          <Background variant="dots" gap={12} size={1} />
        </ReactFlow>
      </div>

      {/* Right-click context menu */}
      {contextMenu.visible && (
        <div
          style={{
            position: 'fixed',
            top: contextMenu.y,
            left: contextMenu.x,
            background: 'white',
            border: '1px solid #ddd',
            padding: '6px',
            zIndex: 9999,
          }}
        >
          <button
            onClick={handleDelete}
            style={{ display: 'block', minWidth: '100px' }}
          >
            {contextMenu.type === 'node' ? 'Delete Node' : 'Delete Edge'}
          </button>
        </div>
      )}

      {/* Drawers */}
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
      {selectedNode && selectedNode.data.type === 'solana' && (
        <SolanaDrawer
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
