import React from 'react';
import './App.css';
import Sidebar from './components/Sidebar/sidebar';
import Main from './components/main/main';
import BpmnJS from 'bpmn-js';
import BPMNModeler from './components/BPMN/Modeler';

const App = () => {
  console.log(BpmnJS);
  return (
    <div className="app-container">
      <div className="sidebar">
        <Sidebar />
      </div>

      <div className="right-pane">
        <div className="main-section">
          <Main />
        </div>
        <div className="bpmn-section">
          <BPMNModeler/>
        </div>
      </div>
    </div>
  );
};

export default App;