'use client';

import React, { useState, useCallback, useRef } from 'react';
import {
  ReactFlow,
  ReactFlowProvider,
  addEdge,
  useNodesState,
  useEdgesState,
  Controls,
  Background,
  Connection,
  Edge,
  Node,
  Panel,
  ReactFlowInstance,
  OnNodesDelete
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { v4 as uuidv4 } from 'uuid';
import { Trash2, Layers, FilePlus, Download, Upload } from 'lucide-react';

import { Sidebar } from '@/components/Sidebar';
import { CustomNode } from '@/components/CustomNode';
import { PropertiesPanel } from '@/components/PropertiesPanel';
import { AIAssistant } from '@/components/AIAssistant';

const nodeTypes = {
  custom: CustomNode,
};

const initialNodes: Node[] = [];
const initialEdges: Edge[] = [];

function AppContent({ onReset }: { onReset: () => void }) {
  const reactFlowWrapper = useRef<HTMLDivElement>(null);
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [reactFlowInstance, setReactFlowInstance] = useState<ReactFlowInstance | null>(null);
  const [selectedNode, setSelectedNode] = useState<Node | null>(null);
  const [showConfirm, setShowConfirm] = useState(false);

  const onConnect = useCallback(
    (params: Connection) => setEdges((eds) => addEdge({ 
      ...params, 
      animated: true, 
      style: { stroke: '#3b82f6', strokeWidth: 2 },
      type: 'smoothstep'
    }, eds)),
    [setEdges],
  );

  const onDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  const onDrop = useCallback(
    (event: React.DragEvent) => {
      event.preventDefault();

      if (!reactFlowInstance) return;

      const type = event.dataTransfer.getData('application/reactflow/type');
      const name = event.dataTransfer.getData('application/reactflow/name');
      const color = event.dataTransfer.getData('application/reactflow/color');

      if (typeof type === 'undefined' || !type) {
        return;
      }

      const position = reactFlowInstance.screenToFlowPosition({
        x: event.clientX,
        y: event.clientY,
      });

      const newNode: Node = {
        id: uuidv4(),
        type: 'custom',
        position,
        data: { label: name, type, color, description: '' },
      };

      setNodes((nds) => nds.concat(newNode));
      setSelectedNode(newNode);
    },
    [reactFlowInstance, setNodes],
  );

  const onNodeClick = useCallback((_: React.MouseEvent, node: Node) => {
    setSelectedNode(node);
  }, []);

  const onPaneClick = useCallback(() => {
    setSelectedNode(null);
  }, []);

  const updateNodeData = useCallback((id: string, data: Record<string, unknown>) => {
    setNodes((nds) =>
      nds.map((node) => {
        if (node.id === id) {
          return { ...node, data };
        }
        return node;
      })
    );
    setSelectedNode((prev) => prev && prev.id === id ? { ...prev, data } : prev);
  }, [setNodes]);

  const onDeleteNode = useCallback((id: string) => {
    setNodes((nds) => nds.filter((node) => node.id !== id));
    setEdges((eds) => eds.filter((edge) => edge.source !== id && edge.target !== id));
    setSelectedNode(null);
  }, [setNodes, setEdges]);

  const onNodesDelete: OnNodesDelete = useCallback((deleted) => {
    if (selectedNode && deleted.some(n => n.id === selectedNode.id)) {
      setSelectedNode(null);
    }
  }, [selectedNode]);

  const onNewProject = useCallback(() => {
    setShowConfirm(true);
  }, []);

  const confirmClear = useCallback(() => {
    onReset();
    setShowConfirm(false);
  }, [onReset]);

  const onSaveProject = useCallback(() => {
    const project = {
      nodes,
      edges,
      viewport: reactFlowInstance?.getViewport(),
    };
    const blob = new Blob([JSON.stringify(project, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `gcp-architecture-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }, [nodes, edges, reactFlowInstance]);

  const onLoadProject = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const project = JSON.parse(e.target?.result as string);
        if (project.nodes && project.edges) {
          setNodes(project.nodes || []);
          setEdges(project.edges || []);
          if (project.viewport && reactFlowInstance) {
            const { x, y, zoom } = project.viewport;
            reactFlowInstance.setViewport({ x, y, zoom });
          }
        }
      } catch (err) {
        console.error('Failed to load project:', err);
        alert('Invalid project file');
      }
    };
    reader.readAsText(file);
    // Reset input
    event.target.value = '';
  }, [setNodes, setEdges, reactFlowInstance]);

  const fileInputRef = useRef<HTMLInputElement>(null);

  return (
    <div className="flex h-screen w-full bg-gray-50 overflow-hidden font-sans text-gray-900">
      <Sidebar />
      
      <div className="flex-1 h-full relative" ref={reactFlowWrapper}>
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          onInit={setReactFlowInstance}
          onDrop={onDrop}
          onDragOver={onDragOver}
          onNodeClick={onNodeClick}
          onPaneClick={onPaneClick}
          onNodesDelete={onNodesDelete}
          nodeTypes={nodeTypes}
          deleteKeyCode={['Backspace', 'Delete']}
          fitView
          className="bg-gray-50"
        >
          <Background color="#e2e8f0" gap={20} size={1} />
          <Controls />
          
          <Panel position="top-left" className="flex items-center gap-3 bg-white/80 backdrop-blur-md p-3 rounded-2xl shadow-xl border border-white/50">
            <div className="bg-blue-600 p-2 rounded-xl text-white shadow-lg shadow-blue-500/20">
              <Layers size={20} />
            </div>
            <div>
              <h1 className="text-sm font-bold text-gray-900">GCP Architect</h1>
              <p className="text-[10px] text-gray-500 font-medium uppercase tracking-wider">Simulator v2.0</p>
            </div>
          </Panel>

          <Panel position="top-right" className="flex gap-2">
            <div className="flex bg-white/80 backdrop-blur-md p-1 rounded-xl shadow-lg border border-white/50">
              <button 
                onClick={onNewProject}
                title="New Project"
                className="p-2 hover:bg-gray-100 rounded-lg transition-all text-gray-600 active:scale-95"
              >
                <FilePlus size={18} />
              </button>
              <div className="w-px h-4 bg-gray-200 self-center mx-1" />
              <button 
                onClick={onSaveProject}
                title="Save Project"
                className="p-2 hover:bg-gray-100 rounded-lg transition-all text-gray-600 active:scale-95"
              >
                <Download size={18} />
              </button>
              <button 
                onClick={() => fileInputRef.current?.click()}
                title="Load Project"
                className="p-2 hover:bg-gray-100 rounded-lg transition-all text-gray-600 active:scale-95"
              >
                <Upload size={18} />
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  onChange={onLoadProject} 
                  accept=".json" 
                  className="hidden" 
                />
              </button>
            </div>

            <button 
              onClick={onNewProject}
              className="flex items-center gap-2 bg-white/80 backdrop-blur-md px-4 py-2 rounded-xl shadow-lg border border-white/50 text-xs font-bold text-red-500 hover:bg-red-50 transition-all active:scale-95"
            >
              <Trash2 size={14} />
              Clear
            </button>
          </Panel>

          <Panel position="bottom-left" className="bg-white/80 backdrop-blur-md px-4 py-2 rounded-xl shadow-lg border border-white/50 text-[10px] font-bold text-gray-400 uppercase tracking-widest">
            Press <span className="text-gray-900 bg-gray-100 px-1.5 py-0.5 rounded border border-gray-200">DEL</span> to remove selected
          </Panel>
        </ReactFlow>
        
        <AIAssistant nodes={nodes} edges={edges} />
      </div>

      <PropertiesPanel 
        key={selectedNode?.id || 'none'}
        selectedNode={selectedNode} 
        updateNodeData={updateNodeData}
        onDelete={onDeleteNode}
      />

      {showConfirm && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/20 backdrop-blur-sm">
          <div className="bg-white p-6 rounded-2xl shadow-xl max-w-sm w-full mx-4 border border-gray-100 animate-in fade-in zoom-in duration-200">
            <h3 className="text-lg font-bold text-gray-900 mb-2">Clear Canvas?</h3>
            <p className="text-sm text-gray-500 mb-6">This will remove all components and connections. This action cannot be undone.</p>
            <div className="flex justify-end gap-3">
              <button 
                onClick={() => setShowConfirm(false)}
                className="px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100 rounded-xl transition-colors"
              >
                Cancel
              </button>
              <button 
                onClick={confirmClear}
                className="px-4 py-2 text-sm font-bold text-white bg-red-500 hover:bg-red-600 rounded-xl transition-colors shadow-md shadow-red-500/20"
              >
                Clear Project
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function App() {
  const [resetKey, setResetKey] = useState(0);
  const [isMounted, setIsMounted] = useState(false);
  
  const handleReset = useCallback(() => {
    setResetKey(prev => prev + 1);
  }, []);

  React.useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-gray-50">
        <div className="animate-pulse text-gray-400 font-medium uppercase tracking-widest text-xs">
          Loading Architect...
        </div>
      </div>
    );
  }

  return (
    <ReactFlowProvider key={resetKey}>
      <AppContent onReset={handleReset} />
    </ReactFlowProvider>
  );
}
