import './App.css';
import Sidebar from './components/sidebar/sidebar';
import Main from './components/Main/Main';
import BPMNModeler from './components/BPMN/Modeler';
import React, { useState, useRef, useEffect, useCallback, useContext } from 'react';
import { Context } from './context/AppContext';

const App = () => {
  const [actualChatPanelWidth, setActualChatPanelWidth] = useState(350); // Initial width in pixels
  const [isChatVisible, setIsChatVisible] = useState(true);
  const [isResizing, setIsResizing] = useState(false);
  
  const rightPaneRef = useRef(null);
  const modelerRef = useRef(null); // Ref for BPMNModeler
  const fileInputRef = useRef(null); // Ref for the file input
  const { incrementTotalClicks, totalClicks, bpmnPanelClicks, promptLogs, promptCount, docLinkClicks, setDiagramXML } = useContext(Context);

  // Set initial width based on percentage once rightPaneRef is available
  useEffect(() => {
    if (rightPaneRef.current) {
      // Set initial width to 40% of the right pane or a minimum of 300px
      const initialWidth = Math.max(rightPaneRef.current.offsetWidth * 0.3, 300);
      setActualChatPanelWidth(initialWidth);
    }
  }, []); // Empty dependency array ensures this runs once on mount

  useEffect(() => {
    const handleClick = () => {
      incrementTotalClicks();
    };
    window.addEventListener('click', handleClick);
    return () => {
      window.removeEventListener('click', handleClick);
    };
  }, [incrementTotalClicks]);

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

  const handleExportDiagramClick = () => {
    if (modelerRef.current) {
      modelerRef.current.exportDiagram();
    }

    // Create and download log file
    let logContent = `Total Clicks: ${totalClicks}\nBPMN Panel Clicks: ${bpmnPanelClicks}\nDocumentation Link Clicks: ${docLinkClicks}\n\n`;
    logContent += `Prompts Sent: ${promptCount}\n\n`;
    promptLogs.forEach((log, index) => {
      logContent += `--- Prompt ${index + 1} ---\n`;
      logContent += `Word Count: ${log.wordCount}\n`;
      logContent += `Text: ${log.text}\n\n`;
    });

    const blob = new Blob([logContent], { type: 'text/plain;charset=utf-8' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'log.txt';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(link.href);
  };

  const handleLoadDiagramClick = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file && file.name.endsWith('.bpmn')) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const xml = e.target.result;
        setDiagramXML(xml);
      };
      reader.onerror = (e) => {
        console.error("Error reading file:", e);
        alert("Error reading the BPMN file.");
      };
      reader.readAsText(file);
    } else if (file) {
      alert("Please select a valid .bpmn file.");
    }
    event.target.value = null; // Reset file input to allow re-uploading the same file
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
          <BPMNModeler ref={modelerRef} /> {/* Pass the ref to BPMNModeler */}
        </div>
      </div>
      
      {/* Container for top buttons */}
      <div style={{
        position: 'absolute',
        top: '10px',
        right: '10px',
        zIndex: 100,
        display: 'flex',
        gap: '10px'
      }}>
        <button onClick={toggleChatVisibility} className="bottom-control-btn">
          {isChatVisible ? "Hide Chat" : "Show Chat"}
        </button>
        <button onClick={handleExportDiagramClick} className="bottom-control-btn">
          Export Diagram
        </button>
        <button onClick={handleLoadDiagramClick} className="bottom-control-btn">
          Load Diagram
        </button>
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          style={{ display: 'none' }}
          accept=".bpmn"
        />
      </div>
    </div>
  );
};

export default App;