import React, { useState, useEffect, useRef } from 'react';
import { Send, MapPin, X, Info, ExternalLink } from 'lucide-react';
import { LandmarkData, ChatMessage } from '../types';
import { sendMessageToGemini } from '../services/geminiService';
import ReactMarkdown from 'react-markdown';

interface ChatPanelProps {
  selectedLandmark: LandmarkData | null;
  onCloseSelection: () => void;
}

const ChatPanel: React.FC<ChatPanelProps> = ({ selectedLandmark, onCloseSelection }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: 'model', text: "Welcome to Austin! Click on a landmark to learn more, or ask me anything about the city." }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom on new message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // When a landmark is selected, automatically ask Gemini about it
  useEffect(() => {
    if (selectedLandmark) {
      handleLandmarkSelection(selectedLandmark);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedLandmark]);

  const handleLandmarkSelection = async (landmark: LandmarkData) => {
    // Add a UI message indicating selection
    const selectionMsg: ChatMessage = { 
        role: 'user', 
        text: `Tell me about ${landmark.name}` 
    };
    
    setMessages(prev => [...prev, selectionMsg]);
    setIsLoading(true);

    const context = `The user has clicked on ${landmark.name} (${landmark.type}) in the 3D map. ${landmark.description}`;
    const response = await sendMessageToGemini(context);
    
    setMessages(prev => [...prev, { role: 'model', text: response }]);
    setIsLoading(false);
  };

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMsg: ChatMessage = { role: 'user', text: input };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    // Prepare history for context
    const history = messages.map(m => ({
      role: m.role === 'user' ? 'user' : 'model',
      parts: [{ text: m.text }]
    }));

    const response = await sendMessageToGemini(input, history);
    
    setMessages(prev => [...prev, { role: 'model', text: response }]);
    setIsLoading(false);
  };

  return (
    <div className="flex flex-col h-full bg-gray-900/90 border-l border-gray-700 text-gray-100 w-full md:w-96 shadow-2xl backdrop-blur-md">
      {/* Header */}
      <div className="p-4 border-b border-gray-700 flex justify-between items-center bg-gray-800/50">
        <h2 className="text-xl font-bold flex items-center gap-2 text-blue-400">
          <MapPin size={20} />
          {selectedLandmark ? selectedLandmark.name : 'Austin Explorer'}
        </h2>
        {selectedLandmark && (
          <button 
            onClick={onCloseSelection}
            className="p-1 hover:bg-gray-700 rounded-full transition-colors"
          >
            <X size={20} />
          </button>
        )}
      </div>

      {/* Info Card (Visible if landmark selected) */}
      {selectedLandmark && (
        <div className="bg-gray-800/50 p-4 border-b border-gray-700">
           <div className="text-sm text-gray-400 mb-2 uppercase tracking-wider font-semibold">
              {selectedLandmark.type}
           </div>
           <p className="text-sm text-gray-300 italic">{selectedLandmark.description}</p>
        </div>
      )}

      {/* Chat Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg, idx) => (
          <div 
            key={idx} 
            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div 
              className={`max-w-[85%] p-3 rounded-lg text-sm ${
                msg.role === 'user' 
                  ? 'bg-blue-600 text-white rounded-tr-none' 
                  : 'bg-gray-700 text-gray-200 rounded-tl-none'
              }`}
            >
              <ReactMarkdown 
                className="prose prose-invert prose-sm"
                components={{
                    a: ({node, ...props}) => <a {...props} className="text-blue-300 underline" target="_blank" rel="noopener noreferrer" />
                }}
              >
                {msg.text}
              </ReactMarkdown>
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-gray-700 p-3 rounded-lg rounded-tl-none flex items-center gap-2">
               <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
               <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
               <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-4 border-t border-gray-700 bg-gray-800/30">
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder={selectedLandmark ? `Ask about ${selectedLandmark.name}...` : "Ask about Austin..."}
            className="flex-1 bg-gray-800 border border-gray-600 rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-blue-500 transition-colors"
            disabled={isLoading}
          />
          <button 
            onClick={handleSend}
            disabled={isLoading || !input.trim()}
            className="bg-blue-600 hover:bg-blue-500 disabled:bg-gray-600 disabled:cursor-not-allowed p-2 rounded-lg transition-colors"
          >
            <Send size={18} />
          </button>
        </div>
        <div className="mt-2 text-xs text-gray-500 flex items-center justify-center gap-1">
           <Info size={12} />
           <span>Powered by Gemini 2.5 Flash & Google Search</span>
        </div>
      </div>
    </div>
  );
};

export default ChatPanel;
