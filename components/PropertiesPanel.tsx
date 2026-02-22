import React, { useState } from 'react';
import { Node } from '@xyflow/react';
import { Trash2, Info, Settings2, Tag, Shield } from 'lucide-react';

interface PropertiesPanelProps {
  selectedNode: Node | null;
  updateNodeData: (id: string, data: Record<string, unknown>) => void;
  onDelete: (id: string) => void;
}

export function PropertiesPanel({ selectedNode, updateNodeData, onDelete }: PropertiesPanelProps) {
  const [label, setLabel] = useState((selectedNode?.data?.label as string) || '');
  const [description, setDescription] = useState((selectedNode?.data?.description as string) || '');

  if (!selectedNode) {
    return (
      <aside className="w-80 bg-white border-l border-gray-200 h-full p-6 flex flex-col shadow-sm">
        <div className="flex items-center gap-2 text-gray-400 mb-6">
          <Settings2 size={18} />
          <h2 className="text-lg font-bold">Properties</h2>
        </div>
        <div className="flex-1 flex flex-col items-center justify-center text-center space-y-4">
          <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center text-gray-300">
            <Info size={32} />
          </div>
          <p className="text-sm text-gray-400 max-w-[200px]">
            Select a component on the canvas to view and edit its properties.
          </p>
        </div>
      </aside>
    );
  }

  const handleLabelChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLabel(e.target.value);
    updateNodeData(selectedNode.id, { ...selectedNode.data, label: e.target.value });
  };

  const handleDescriptionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setDescription(e.target.value);
    updateNodeData(selectedNode.id, { ...selectedNode.data, description: e.target.value });
  };

  const isFirewall = selectedNode.data.type === 'cloud-firewall' || selectedNode.data.type === 'cloud-armor';

  return (
    <aside className="w-80 bg-white border-l border-gray-200 h-full p-6 flex flex-col overflow-y-auto shadow-sm">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-2 text-gray-900">
          <Settings2 size={18} className="text-blue-500" />
          <h2 className="text-lg font-bold">Properties</h2>
        </div>
        <button
          onClick={() => onDelete(selectedNode.id)}
          className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all group"
          title="Delete component"
        >
          <Trash2 size={18} className="group-hover:scale-110 transition-transform" />
        </button>
      </div>
      
      <div className="space-y-6">
        <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100">
          <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Service Type</label>
          <div className="text-sm font-semibold text-gray-700 flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full ${selectedNode.data.color as string || 'bg-gray-400'}`} />
            {selectedNode.data.type as string}
          </div>
        </div>

        <div className="space-y-2">
          <label className="flex items-center gap-2 text-xs font-bold text-gray-600">
            <Tag size={14} className="text-blue-500" />
            Component Name
          </label>
          <input
            type="text"
            value={label}
            onChange={handleLabelChange}
            className="w-full text-sm border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all bg-white"
            placeholder="e.g., Web Server"
          />
        </div>

        {isFirewall && (
          <div className="space-y-2 p-4 bg-blue-50/50 rounded-2xl border border-blue-100">
            <label className="flex items-center gap-2 text-xs font-bold text-blue-700">
              <Shield size={14} />
              Firewall Rules
            </label>
            <p className="text-[10px] text-blue-600 mb-2">Specify allow/deny rules (e.g., allow tcp:80,443 from 0.0.0.0/0)</p>
            <textarea
              value={selectedNode.data.rules as string || ''}
              onChange={(e) => updateNodeData(selectedNode.id, { ...selectedNode.data, rules: e.target.value })}
              rows={3}
              className="w-full text-xs border border-blue-200 rounded-xl px-3 py-2 focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all bg-white resize-none"
              placeholder="allow tcp:80..."
            />
          </div>
        )}

        <div className="space-y-2">
          <label className="flex items-center gap-2 text-xs font-bold text-gray-600">
            <Info size={14} className="text-blue-500" />
            {isFirewall ? 'Additional Notes' : 'Configuration / Notes'}
          </label>
          <textarea
            value={description}
            onChange={handleDescriptionChange}
            rows={isFirewall ? 4 : 6}
            className="w-full text-sm border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all bg-white resize-none"
            placeholder={isFirewall ? "e.g., Applied to: web-servers tag" : "e.g., Machine type: e2-micro, Region: us-central1, Tags: production"}
          />
        </div>

        <div className="pt-6 border-t border-gray-100">
          <div className="text-[10px] text-gray-400 italic">
            ID: {selectedNode.id}
          </div>
        </div>
      </div>
    </aside>
  );
}
