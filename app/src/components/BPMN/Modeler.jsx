import { useEffect, useRef, useState, useContext } from 'react';
import BpmnModeler from 'bpmn-js/lib/Modeler';
import 'bpmn-js/dist/assets/bpmn-js.css';
import 'bpmn-js/dist/assets/diagram-js.css';
import 'bpmn-js/dist/assets/bpmn-font/css/bpmn.css';
import './Modeler.css';
import customControlsModule from '../custom';
import customModdleDescriptor from '../custom/custom.json'; // Import the custom Moddle descriptor
import { Context } from '../../context/AppContext'; // Corrected path for Context
import { appianSmartServices, APPIAN_ICON_BASE_URL } from '../custom/appianServices'; // Import Appian services

function BPMNModeler() {
    const bpmnModelerRef = useRef(null);
    const [isCustomPanelVisible, setIsCustomPanelVisible] = useState(false);

    const { diagramXML, reportRenderAttempt } = useContext(Context);

    // Effect for initializing and destroying the modeler instance
    useEffect(() => {
        const modeler = new BpmnModeler({
            container: '#canvas',
            additionalModules: [
                customControlsModule
            ],
            moddleExtensions: { // Add this section
                custom: customModdleDescriptor
            }
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
            const { xml } = await bpmnModelerRef.current.saveXML({ format: true });
            const blob = new Blob([xml], { type: 'application/bpmn20-xml;charset=utf-8' });
            const link = document.createElement('a');
            link.href = URL.createObjectURL(blob);
            link.download = 'diagram.bpmn';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(link.href);
        } catch (err) {
            console.error('could not save BPMN 2.0 diagram', err);
            alert('Could not export diagram. See console for details.');
        }
    };

    // Generalized function to create shapes for Appian Smart Services
    const handleCreateShape = (service, event) => {
        const modelerInstance = bpmnModelerRef.current;
        if (modelerInstance) {
            const moddle = modelerInstance.get('moddle');
            const elementFactory = modelerInstance.get('elementFactory');
            const create = modelerInstance.get('create');
            const modeling = modelerInstance.get('modeling'); // Get modeling for subprocess expansion

            const customProperties = {
                name: service.name,
                'custom:customType': service.customType,
                'custom:customIconUrl': `${APPIAN_ICON_BASE_URL}${service.icon}`
            };

            let businessObjectProperties = { ...customProperties };

            if (service.eventDefinitionType) {
                const eventDefinition = moddle.create(service.eventDefinitionType);
                businessObjectProperties.eventDefinitions = [eventDefinition];
            }
            
            // For SubProcess, set isExpanded if defined
            if (service.type === 'bpmn:SubProcess' && service.isExpanded !== undefined) {
                // isExpanded is a DI property, not directly on businessObject for creation in this manner
                // It's typically handled by modeling.createShape or by setting it after creation
                // For now, we'll create it and then expand if necessary, though direct creation as expanded is preferred if API allows
            }


            const businessObject = moddle.create(service.type, businessObjectProperties);
            
            const shapeProperties = { 
                type: service.type, 
                businessObject: businessObject 
            };

            // If it's a SubProcess and should be expanded, set appropriate dimensions
            if (service.type === 'bpmn:SubProcess' && service.isExpanded) {
                shapeProperties.isExpanded = true; // This might be used by elementFactory or create
                // Default expanded size, can be adjusted
                shapeProperties.width = 350; 
                shapeProperties.height = 200;
            }


            const shape = elementFactory.createShape(shapeProperties);
            
            create.start(event.nativeEvent || event, shape);

            // If it was a subprocess that needed to be expanded and create.start doesn't handle it directly
            // We might need to call modeling.updateProperties or a specific expand command if available
            // For now, relying on elementFactory and create.start to handle `isExpanded` if possible.
            // If not, this would be the place to add:
            // if (service.type === 'bpmn:SubProcess' && service.isExpanded && shape.id) {
            //     modeling.updateProperties(shape, { isExpanded: true });
            // }

        } else {
            console.error('Modeler instance not initialized');
        }
    };

    return (
        <div style={{ height: '100%', width: '100%', position: 'relative' }}> {/* Added width and position relative for button positioning */}
            <div id="canvas" style={{ height: '100%', width: '100%' }}></div>
            {/* Export Diagram Button */}
            <button 
                id="export-diagram-button" 
                onClick={exportDiagram} 
                title="Export BPMN Diagram"
            >
                Export Diagram
            </button>

            {/* Custom Tools Panel */}
            {isCustomPanelVisible && (
                <div className="custom-tools-panel">
                    {appianSmartServices.map((service) => (
                        <button 
                            key={service.customType} 
                            title={service.name} 
                            onMouseDown={(event) => handleCreateShape(service, event)} 
                            className="custom-tool-button"
                        >
                            <img 
                                src={`${APPIAN_ICON_BASE_URL}${service.icon}`} 
                                alt={service.name} 
                                onError={(e) => { e.target.style.display='none'; e.target.nextSibling.style.display='inline'; }}
                            />
                            <span style={{display: 'none'}}>{service.name.substring(0,3)}</span> {/* Fallback text */}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}

export default BPMNModeler;