import { useEffect, useRef, useState, useContext } from 'react';
import BpmnModeler from 'bpmn-js/lib/Modeler';
import 'bpmn-js/dist/assets/bpmn-js.css';
import 'bpmn-js/dist/assets/diagram-js.css';
import 'bpmn-js/dist/assets/bpmn-font/css/bpmn.css';
import './Modeler.css';
import customControlsModule from '../custom';
import { Context } from '../../context/context'; // Corrected path for Context

function BPMNModeler() {
    const bpmnModelerRef = useRef(null);
    // const elementFactoryRef = useRef(null); // Not strictly needed if accessed via modelerRef
    // const createRef = useRef(null); // Not strictly needed if accessed via modelerRef
    const [isCustomPanelVisible, setIsCustomPanelVisible] = useState(false);

    const { diagramXML, reportRenderAttempt } = useContext(Context); // Consume diagramXML and reportRenderAttempt

    // Effect for initializing and destroying the modeler instance
    useEffect(() => {
        const modeler = new BpmnModeler({
            container: '#canvas',
            additionalModules: [
                customControlsModule
            ]
            // keyboard: { bindTo: document } // Optional: bind keyboard shortcuts - REMOVED
        });
        bpmnModelerRef.current = modeler;

        const eventBus = modeler.get('eventBus');
        const togglePanelHandler = () => {
            setIsCustomPanelVisible(prev => !prev);
        };
        eventBus.on('custom.togglePanel', togglePanelHandler);

        return () => {
            eventBus.off('custom.togglePanel', togglePanelHandler);
            if (bpmnModelerRef.current) {
                bpmnModelerRef.current.destroy();
                bpmnModelerRef.current = null;
            }
        };
    }, []); // Empty dependency array: runs once on mount and cleans up on unmount

    // Effect for loading diagramXML when it changes
    useEffect(() => {
        const modeler = bpmnModelerRef.current;
        // Ensure reportRenderAttempt is defined before proceeding
        if (!modeler || diagramXML === null || diagramXML === undefined || !reportRenderAttempt) { // Check for null or undefined explicitly
            // Consider clearing the diagram if diagramXML is explicitly set to empty or null
            // if (modeler && (diagramXML === null || diagramXML === '')) {
            // modeler.clear(); // Be cautious with clear(), might need re-init for some modules
            // reportRenderAttempt({ xml: diagramXML, status: 'success', error: null }); // Report success for empty/cleared state
            // }
            return;
        }
        if (diagramXML === "") { // If diagramXML is an empty string, treat as a successful clear or initial empty state
            if (modeler.getDefinitions()) { // Check if there are existing definitions
                 // modeler.clear(); // Or create a new blank diagram
                 modeler.createDiagram().then(() => {
                    if (reportRenderAttempt) {
                        reportRenderAttempt({ xml: diagramXML, status: 'success', error: null });
                    }
                 }).catch(err => {
                    console.error('Error creating blank diagram:', err);
                    if (reportRenderAttempt) {
                        reportRenderAttempt({ xml: diagramXML, status: 'failure', error: err });
                    }
                 });
            } else {
                 // Already blank or no definitions, report success
                if (reportRenderAttempt) {
                    reportRenderAttempt({ xml: diagramXML, status: 'success', error: null });
                }
            }
            return;
        }

        const currentAttemptXml = diagramXML;

        modeler.importXML(currentAttemptXml)
            .then(({ warnings }) => {
                if (warnings && warnings.length) {
                    console.warn('BPMN Import Warnings:', warnings);
                }
                // reportRenderAttempt is already checked for existence above
                reportRenderAttempt({ xml: currentAttemptXml, status: 'success', error: null });
                const canvas = modeler.get('canvas');
                canvas.zoom('fit-viewport');
                // Example overlay, adjust as needed
                // const overlays = modeler.get('overlays');
                // overlays.add('SCAN_OK', 'note', {
                // position: { bottom: 0, right: 0 },
                // html: '<div class="diagram-note">Diagram Loaded</div>'
                // });
            })
            .catch(err => {
                console.error('BPMN Import Error in Modeler.jsx:', err);
                // reportRenderAttempt is already checked for existence above
                reportRenderAttempt({ xml: currentAttemptXml, status: 'failure', error: err });
            });
    }, [diagramXML, reportRenderAttempt]); // reportRenderAttempt is now memoized

    const exportDiagram = async () => {
        if (!bpmnModelerRef.current) {
            console.error("Modeler not initialized yet.");
            return;
        }
        try {
            const result = await bpmnModelerRef.current.saveXML({ format: true });
            alert('Diagram exported. Check the developer tools!');
            console.log('DIAGRAM', result.xml);
        } catch (err) {
            console.error('could not save BPMN 2.0 diagram', err);
        }
    };

    // Functions to create shapes (to be called by buttons in the custom panel)
    const handleCreateServiceTask = (event) => {
        const modelerInstance = bpmnModelerRef.current;
        if (modelerInstance) {
            const moddle = modelerInstance.get('moddle');
            const elementFactory = modelerInstance.get('elementFactory');
            const create = modelerInstance.get('create');

            const businessObject = moddle.create('bpmn:Task', {
                name: 'User Input Task',
                'custom:customType': 'userInputTask',
                'custom:customIconUrl': 'https://docs.appian.com/suite/help/24.3/images/Smart_Service_Icons/User_Input_Task.png'
            });

            const shape = elementFactory.createShape({ 
                type: 'bpmn:Task', 
                businessObject: businessObject 
            });
            
            create.start(event.nativeEvent || event, shape); // event.nativeEvent for React synthetic events
        } else {
            console.error('Modeler, Create or ElementFactory not initialized');
        }
    };

    const handleCreateWriteToDatabaseTask = (event) => {
        const modelerInstance = bpmnModelerRef.current;
        if (modelerInstance) {
            const elementFactory = modelerInstance.get('elementFactory');
            const create = modelerInstance.get('create');
            const shape = elementFactory.createShape({ type: 'bpmn:ServiceTask' }); // Or bpmn:ServiceTask
            // shape.businessObject.name = 'Write to Database'; // Optional: set default name
            create.start(event.nativeEvent || event, shape);
        } else {
            console.error('Create or ElementFactory not initialized');
        }
    };

    return (
        <div style={{ height: '100%', width: '100%', position: 'relative' }}> {/* Added width and position relative for button positioning */}
            <div id="canvas" style={{ height: '100%', width: '100%' }}></div>
            <button id="save-button" onClick={exportDiagram}>
                Export Diagram
            </button>

            {/* Custom Tools Panel */}
            {isCustomPanelVisible && (
                <div className="custom-tools-panel">
                    <button title="User Input Task" onMouseDown={handleCreateServiceTask} className="custom-tool-button">
                        <img src="https://docs.appian.com/suite/help/24.3/images/Smart_Service_Icons/User_Input_Task.png" alt="User Input Task" />
                    </button>
                    <button title="Write to DataStore Entity Smart Service" onMouseDown={handleCreateWriteToDatabaseTask} className="custom-tool-button bpmn-icon-data-store">
                        {/* Write to DB (using data store icon) */}
                    </button>
                    {/* Add more custom tools here */}
                </div>
            )}
        </div>
    );
}

export default BPMNModeler;