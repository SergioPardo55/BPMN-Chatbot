import React from 'react';
import './App.css';
import Sidebar from './components/Sidebar/sidebar';
import Main from './components/main/main';
import BpmnViewer from './components/BPMN/Viewer';
import BpmnJS from 'bpmn-js';
import BPMNModeler from './components/BPMN/Modeler';

const App = () => {
  console.log(BpmnJS);

  //React.useEffect(() => {
  //  const viewer = new BpmnJS({
  //    container: '#container'
  //  });

    // viewer.importXML('/simple.bpmn').catch(err => {
    //   console.error('Error importing BPMN diagram:', err);
    // });

 //   return () => {
  //    viewer.destroy();
  //  };
  //}, []);
  // <div className="bpmn-section" id='container'>
  //   {BpmnModelerComponent}
  // </div>
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