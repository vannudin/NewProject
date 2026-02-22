import React, { memo } from 'react';
import { Handle, Position, NodeProps } from '@xyflow/react';
import { 
  Server, Database, HardDrive, Network, Globe, Cpu, Shield,
  Cloud, Layers, Box, Key, MessageSquare, Activity, Terminal, Lock, BarChart 
} from 'lucide-react';

const iconMap: Record<string, React.ComponentType<{ size?: number | string }>> = {
  'compute-engine': Server,
  'cloud-run': Box,
  'gke': Layers,
  'cloud-functions': Activity,
  'cloud-storage': HardDrive,
  'persistent-disk': Database,
  'filestore': HardDrive,
  'cloud-sql': Database,
  'cloud-spanner': Database,
  'firestore': Database,
  'bigtable': Database,
  'vpc': Network,
  'cloud-firewall': Shield,
  'cloud-load-balancing': Globe,
  'cloud-cdn': Globe,
  'cloud-dns': Globe,
  'cloud-armor': Shield,
  'bigquery': BarChart,
  'pubsub': MessageSquare,
  'dataflow': Activity,
  'dataproc': Cpu,
  'vertex-ai': Cpu,
  'gemini': MessageSquare,
  'cloud-iam': Key,
  'cloud-kms': Lock,
  'cloud-monitoring': BarChart,
  'cloud-logging': Terminal,
};

export const CustomNode = memo(({ data, selected }: NodeProps) => {
  const Icon = iconMap[data.type as string] || Cloud;
  const color = data.color as string || 'bg-gray-500';

  return (
    <div className={`group relative px-4 py-3 shadow-lg rounded-2xl bg-white border-2 transition-all ${selected ? 'border-blue-500 ring-4 ring-blue-500/10' : 'border-gray-100 hover:border-gray-200'} min-w-[180px]`}>
      <Handle type="target" position={Position.Top} className="w-3 h-3 !bg-blue-400 border-2 border-white shadow-sm" />
      
      <div className="flex items-center gap-3">
        <div className={`p-2.5 rounded-xl ${color} text-white shadow-sm`}>
          <Icon size={18} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="text-sm font-bold text-gray-900 truncate">{data.label as string}</div>
          {typeof data.description === 'string' && data.description && (
            <div className="text-[10px] text-gray-500 truncate mt-0.5">{data.description}</div>
          )}
        </div>
      </div>

      <Handle type="source" position={Position.Bottom} className="w-3 h-3 !bg-blue-400 border-2 border-white shadow-sm" />
      
      {selected && (
        <div className="absolute -top-2 -right-2 w-4 h-4 bg-blue-500 rounded-full border-2 border-white shadow-sm animate-pulse" />
      )}
    </div>
  );
});

CustomNode.displayName = 'CustomNode';
