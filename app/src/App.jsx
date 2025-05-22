import './App.css';
import Sidebar from './components/Sidebar/sidebar';
import Main from './components/main/main';
import BPMNModeler from './components/BPMN/Modeler';

const App = () => {
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