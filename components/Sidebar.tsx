import React from 'react';
import { GCP_SERVICES } from '@/lib/gcp-services';
import { Search } from 'lucide-react';

export function Sidebar() {
  const [searchTerm, setSearchTerm] = React.useState('');

  const onDragStart = (event: React.DragEvent, nodeType: string, nodeName: string, nodeColor: string) => {
    event.dataTransfer.setData('application/reactflow/type', nodeType);
    event.dataTransfer.setData('application/reactflow/name', nodeName);
    event.dataTransfer.setData('application/reactflow/color', nodeColor);
    event.dataTransfer.effectAllowed = 'move';
  };

  const filteredServices = GCP_SERVICES.map(category => ({
    ...category,
    items: category.items.filter(item => 
      item.name.toLowerCase().includes(searchTerm.toLowerCase())
    )
  })).filter(category => category.items.length > 0);

  return (
    <aside className="w-72 bg-white border-r border-gray-200 h-full overflow-y-auto flex flex-col shadow-sm">
      <div className="p-4 border-b border-gray-100 bg-gray-50/50">
        <h2 className="text-lg font-bold text-gray-900">GCP Services</h2>
        <p className="text-xs text-gray-500 mt-1">Drag components to the canvas</p>
        
        <div className="mt-4 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={14} />
          <input
            type="text"
            placeholder="Search services..."
            className="w-full pl-9 pr-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="p-4 flex-1 overflow-y-auto space-y-6">
        {filteredServices.map((category) => (
          <div key={category.category}>
            <h3 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-3 px-1">
              {category.category}
            </h3>
            <div className="grid grid-cols-1 gap-2">
              {category.items.map((item) => {
                const Icon = item.icon;
                return (
                  <div
                    key={item.id}
                    className="flex items-center gap-3 p-2.5 rounded-xl border border-gray-100 bg-white cursor-grab hover:border-blue-200 hover:shadow-sm hover:bg-blue-50/30 transition-all group"
                    onDragStart={(event) => onDragStart(event, item.id, item.name, item.color)}
                    draggable
                  >
                    <div className={`p-2 rounded-lg ${item.color} text-white shadow-sm group-hover:scale-110 transition-transform`}>
                      <Icon size={16} />
                    </div>
                    <span className="text-sm font-medium text-gray-700">{item.name}</span>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
        {filteredServices.length === 0 && (
          <div className="text-center py-8 text-gray-400 text-sm italic">
            No services found
          </div>
        )}
      </div>
    </aside>
  );
}
