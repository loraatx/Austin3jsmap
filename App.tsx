import React, { useState } from 'react';
import MapScene from './components/MapScene';
import ChatPanel from './components/ChatPanel';
import { LandmarkData } from './types';
import { Menu, X } from 'lucide-react';

const App: React.FC = () => {
  const [selectedLandmark, setSelectedLandmark] = useState<LandmarkData | null>(null);
  const [isSidebarOpen, setSidebarOpen] = useState(true);

  // Toggle sidebar on mobile
  const toggleSidebar = () => setSidebarOpen(!isSidebarOpen);

  const handleLandmarkSelect = (landmark: LandmarkData) => {
    setSelectedLandmark(landmark);
    // Ensure sidebar is open on selection (especially for mobile)
    setSidebarOpen(true);
  };

  return (
    <div className="relative w-full h-full flex overflow-hidden bg-black">
      {/* 3D Map Area */}
      <div className="flex-1 relative z-0">
        <MapScene 
          selectedLandmark={selectedLandmark} 
          onSelectLandmark={handleLandmarkSelect} 
        />
        
        {/* Mobile Toggle Button (Visible only when sidebar is closed or on small screens) */}
        <button 
          onClick={toggleSidebar}
          className={`absolute top-4 right-4 z-20 p-3 bg-gray-800/80 text-white rounded-lg backdrop-blur shadow-lg md:hidden border border-gray-600`}
        >
          {isSidebarOpen ? <X size={24} /> : <Menu size={24} />}
        </button>

        {/* Instructions Overlay (Top Left) */}
        <div className="absolute top-4 left-4 z-10 pointer-events-none">
          <h1 className="text-3xl font-black text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] tracking-tighter">
            AUSTIN<span className="text-blue-500">.3D</span>
          </h1>
          <p className="text-gray-300 text-sm drop-shadow-md font-medium max-w-[200px]">
            Interactive City Guide
          </p>
        </div>
      </div>

      {/* Sidebar / Chat Panel */}
      <div 
        className={`
          absolute inset-y-0 right-0 z-10 w-full md:static md:w-96 
          transform transition-transform duration-300 ease-in-out
          ${isSidebarOpen ? 'translate-x-0' : 'translate-x-full md:translate-x-0 md:w-0 md:opacity-0 md:overflow-hidden'}
        `}
      >
        <ChatPanel 
          selectedLandmark={selectedLandmark} 
          onCloseSelection={() => {
             setSelectedLandmark(null);
             // On mobile, maybe we want to close sidebar? 
             // For now, let's keep it open but clear selection context
          }} 
        />
      </div>
    </div>
  );
};

export default App;
