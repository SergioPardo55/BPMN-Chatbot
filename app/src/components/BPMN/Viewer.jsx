import React, { useContext } from 'react';
import ReactBpmn from 'react-bpmn';
import './Viewer.css';  // We'll create this file next
import { Context } from "../../context/context";

function BpmnViewer() {

  const {diagram, setDiagram} = useContext(Context)
  
  function onShown() {
    console.log('diagram shown');
  }

  function onLoading() {
    console.log('diagram loading');
  }

  function onError(err) {
    console.error('failed to show diagram', err);
  }

  return (
    <div className="bpmn-viewer-container">
      <ReactBpmn
        url= {diagram}
        onShown={onShown}
        onLoading={onLoading}
        onError={onError}
        style={{ height: '100vh', width: '100vw' }}
      />
    </div>
  );
}

export default BpmnViewer;