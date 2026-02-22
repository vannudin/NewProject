import React, { useState } from 'react';
import { Node, Edge } from '@xyflow/react';
import { Bot, Loader2, Sparkles, Code, DollarSign, X, Trash2 } from 'lucide-react';
import { GoogleGenAI } from '@google/genai';
import ReactMarkdown from 'react-markdown';
import { motion, AnimatePresence } from 'motion/react';

interface AIAssistantProps {
  nodes: Node[];
  edges: Edge[];
  onClear?: () => void;
}

export function AIAssistant({ nodes, edges, onClear }: AIAssistantProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'analyze' | 'terraform' | 'cost'>('analyze');

  const analyzeArchitecture = async (type: 'analyze' | 'terraform' | 'cost') => {
    if (nodes.length === 0) {
      setResponse("Your canvas is empty. Add some GCP services to get started!");
      return;
    }

    setLoading(true);
    setResponse(null);
    setActiveTab(type);

    try {
      const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY;
      if (!apiKey) {
        throw new Error("Gemini API Key is missing. Please check your environment variables.");
      }

      const ai = new GoogleGenAI({ apiKey });

      const architectureData = {
        components: nodes.map(n => ({
          id: n.id,
          type: n.data.type,
          name: n.data.label,
          description: n.data.description || '',
          rules: n.data.rules || ''
        })),
        connections: edges.map(e => ({
          source: nodes.find(n => n.id === e.source)?.data.label || 'Unknown Source',
          target: nodes.find(n => n.id === e.target)?.data.label || 'Unknown Target',
        }))
      };

      let prompt = "";
      if (type === 'analyze') {
        prompt = `You are a Senior Google Cloud Solutions Architect. Analyze the following architecture design. 
        Provide a professional review including:
        1. Architecture Overview
        2. Best Practices & Optimization (Performance, Reliability)
        3. Security Recommendations (IAM, Networking)
        4. Potential Bottlenecks or Risks
        
        Architecture Data:
        ${JSON.stringify(architectureData, null, 2)}`;
      } else if (type === 'terraform') {
        prompt = `You are a DevOps Engineer specializing in Google Cloud. Generate high-quality Terraform (HCL) code for the following architecture.
        Include:
        1. Provider configuration
        2. Resource definitions for all components
        3. Basic networking if applicable
        4. Variables for flexibility
        
        Architecture Data:
        ${JSON.stringify(architectureData, null, 2)}`;
      } else if (type === 'cost') {
        prompt = `You are a Cloud FinOps specialist. Provide a detailed monthly cost estimation for this Google Cloud architecture.
        Include:
        1. Breakdown by service
        2. Estimated monthly range (USD)
        3. Cost optimization tips
        4. Assumptions made for the estimate
        
        Architecture Data:
        ${JSON.stringify(architectureData, null, 2)}`;
      }

      const result = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: prompt,
      });

      setResponse(result.text || "I couldn't generate a response. Please try again.");
    } catch (error: unknown) {
      console.error("AI Assistant Error:", error);
      const errorMessage = error instanceof Error ? error.message : String(error);
      setResponse(`### Error\n${errorMessage}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, y: 40, scale: 0.9, filter: 'blur(10px)' }}
            animate={{ opacity: 1, y: 0, scale: 1, filter: 'blur(0px)' }}
            exit={{ opacity: 0, y: 40, scale: 0.9, filter: 'blur(10px)' }}
            className="bg-white rounded-3xl shadow-2xl border border-gray-200 w-[550px] mb-6 overflow-hidden flex flex-col h-[650px]"
          >
            <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white p-5 flex justify-between items-center">
              <div className="flex items-center gap-3">
                <div className="bg-white/20 p-2 rounded-xl backdrop-blur-sm">
                  <Bot size={24} />
                </div>
                <div>
                  <h3 className="font-bold text-lg leading-tight">AI Cloud Architect</h3>
                  <p className="text-[10px] text-blue-100 uppercase tracking-widest font-medium">Powered by Gemini AI</p>
                </div>
              </div>
              <button 
                onClick={() => setIsOpen(false)} 
                className="p-2 hover:bg-white/10 rounded-full transition-colors"
              >
                <X size={20} />
              </button>
            </div>
            
            <div className="flex bg-gray-50/80 backdrop-blur-sm border-b border-gray-100 p-1">
              {[
                { id: 'analyze', label: 'Analyze', icon: Sparkles },
                { id: 'terraform', label: 'Terraform', icon: Code },
                { id: 'cost', label: 'Cost Est.', icon: DollarSign }
              ].map((tab) => (
                <button 
                  key={tab.id}
                  onClick={() => analyzeArchitecture(tab.id as 'analyze' | 'terraform' | 'cost')}
                  className={`flex-1 py-3 text-xs font-bold flex items-center justify-center gap-2 rounded-xl transition-all ${
                    activeTab === tab.id 
                      ? 'bg-white text-blue-600 shadow-sm ring-1 ring-gray-200' 
                      : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100/50'
                  }`}
                >
                  <tab.icon size={14} />
                  {tab.label}
                </button>
              ))}
            </div>

            <div className="flex-1 p-6 overflow-y-auto bg-white custom-scrollbar">
              {loading ? (
                <div className="flex flex-col items-center justify-center h-full text-gray-400">
                  <div className="relative mb-6">
                    <Loader2 className="animate-spin text-blue-500" size={48} />
                    <Sparkles className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-indigo-400" size={20} />
                  </div>
                  <p className="text-sm font-medium animate-pulse">Architecting your solution...</p>
                </div>
              ) : response ? (
                <div className="prose prose-sm max-w-none prose-blue prose-headings:font-bold prose-p:text-gray-600 prose-code:bg-gray-50 prose-code:p-1 prose-code:rounded prose-pre:bg-gray-900 prose-pre:text-gray-100">
                  <ReactMarkdown>{response}</ReactMarkdown>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-full text-gray-400 text-center space-y-6">
                  <div className="w-24 h-24 bg-blue-50 rounded-full flex items-center justify-center text-blue-200">
                    <Bot size={64} />
                  </div>
                  <div className="space-y-2">
                    <p className="text-lg font-bold text-gray-800">Ready to assist you</p>
                    <p className="text-sm max-w-[300px]">
                      Select a task above to analyze your architecture, generate code, or estimate costs.
                    </p>
                  </div>
                </div>
              )}
            </div>
            
            <div className="p-4 bg-gray-50 border-t border-gray-100 flex items-center justify-between">
              <div className="flex items-center gap-3 text-[10px] text-gray-400 font-medium">
                <div className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-green-500 rounded-full" />
                  AI Model: Gemini 3 Flash
                </div>
                {response && (
                  <button 
                    onClick={() => {
                      setResponse(null);
                      if (onClear) onClear();
                    }}
                    className="flex items-center gap-1 px-2 py-1 hover:bg-red-50 text-red-500 rounded-md transition-all text-[10px] font-bold"
                  >
                    <Trash2 size={10} />
                    Clear
                  </button>
                )}
              </div>
              <div className="text-[10px] text-gray-400">
                {nodes.length} Components • {edges.length} Connections
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {!isOpen && (
        <motion.button
          layoutId="ai-button"
          onClick={() => setIsOpen(true)}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white rounded-2xl p-4 shadow-2xl flex items-center gap-3 border border-white/20"
        >
          <div className="bg-white/20 p-2 rounded-xl backdrop-blur-sm">
            <Bot size={24} />
          </div>
          <span className="font-bold pr-2 tracking-tight">AI Architect</span>
        </motion.button>
      )}
    </div>
  );
}
