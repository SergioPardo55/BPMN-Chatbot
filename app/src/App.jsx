import './App.css';
import Sidebar from './components/sidebar/sidebar';
import Main from './components/Main/Main';
import BPMNModeler from './components/BPMN/Modeler';
import React, { useState, useRef, useEffect, useCallback } from 'react';

const App = () => {
  const [actualChatPanelWidth, setActualChatPanelWidth] = useState(350); // Initial width in pixels
  const [isChatVisible, setIsChatVisible] = useState(true);
  const [isResizing, setIsResizing] = useState(false);
  
  const rightPaneRef = useRef(null);

  // Set initial width based on percentage once rightPaneRef is available
  useEffect(() => {
    if (rightPaneRef.current) {
      // Set initial width to 40% of the right pane or a minimum of 300px
      const initialWidth = Math.max(rightPaneRef.current.offsetWidth * 0.3, 300);
      setActualChatPanelWidth(initialWidth);
    }
  }, []); // Empty dependency array ensures this runs once on mount

  const handleMouseDownOnResizer = useCallback((e) => {
    setIsResizing(true);
    e.preventDefault(); // Prevent text selection during drag
  }, []);

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (!isResizing || !rightPaneRef.current) return;

      const rightPaneRect = rightPaneRef.current.getBoundingClientRect();
      let newWidth = e.clientX - rightPaneRect.left;

      const minWidth = 200; // Minimum width for chat panel
      const resizerWidth = 5; // Width of the resizer element
      // Max width: rightPane width - resizer - some min width for BPMN panel (e.g., 100px)
      const maxAllowedWidthForChat = rightPaneRect.width - resizerWidth - 100; 

      if (newWidth < minWidth) newWidth = minWidth;
      if (newWidth > maxAllowedWidthForChat) newWidth = maxAllowedWidthForChat;
      
      setActualChatPanelWidth(newWidth);
    };

    const handleMouseUp = () => {
      setIsResizing(false);
    };

    if (isResizing) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isResizing]);

  const toggleChatVisibility = () => {
    setIsChatVisible(prev => !prev);
  };

  const chatPanelStyle = {
    flexBasis: isChatVisible ? `${actualChatPanelWidth}px` : '0px',
    display: isChatVisible ? 'flex' : 'none', // Use 'flex' to allow Main to fill it
    flexShrink: 0,
  };

  const resizerStyle = {
    display: isChatVisible ? 'block' : 'none', // Show resizer only if chat is visible
  };

  return (
    <div className="app-container">
      <div className="sidebar"> {/* Assuming .sidebar class handles its own width */}
        <Sidebar />
      </div>

      <div className="right-pane" ref={rightPaneRef}>
        <div className="main-section" style={chatPanelStyle}>
          <Main />
        </div>
        <div 
          className="resizer" 
          style={resizerStyle}
          onMouseDown={handleMouseDownOnResizer}
        />
        <div className="bpmn-section">
          <BPMNModeler/>
        </div>
      </div>
      <button onClick={toggleChatVisibility} className="toggle-chat-btn">
        {isChatVisible ? "Hide Chat" : "Show Chat"}
      </button>
    </div>
  );
};

export default App;