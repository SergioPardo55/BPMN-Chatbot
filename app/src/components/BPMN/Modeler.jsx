import { useEffect, useRef, useState, useContext, forwardRef, useImperativeHandle } from 'react'; // Added forwardRef, useImperativeHandle
import BpmnModeler from 'bpmn-js/lib/Modeler';
import 'bpmn-js/dist/assets/bpmn-js.css';
import 'bpmn-js/dist/assets/diagram-js.css';
import 'bpmn-js/dist/assets/bpmn-font/css/bpmn.css';
import './Modeler.css';
import customControlsModule from '../custom';
import customModdleDescriptor from '../custom/custom.json'; // Import the custom Moddle descriptor
import { Context } from '../../context/AppContext'; // Corrected path for Context
import { appianSmartServices, APPIAN_ICON_BASE_URL } from '../custom/appianServices'; // Import Appian services
import AppianElementDetailsPanel from './AppianElementDetailsPanel'; // Import the new panel

const BPMNModeler = forwardRef((props, ref) => { // Wrapped with forwardRef
    const bpmnModelerRef = useRef(null);
    const [isCustomPanelVisible, setIsCustomPanelVisible] = useState(false);
    const [selectedAppianElementDetails, setSelectedAppianElementDetails] = useState(null); // New state

    const { diagramXML, reportRenderAttempt, setSelectedBPMNElements } = useContext(Context);

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

        // Listen for selection changes
        const selectionChangedHandler = (event) => {
            const { newSelection } = event;
            setSelectedBPMNElements(newSelection.map(element => element.businessObject));

            if (newSelection.length === 1) {
                const selectedElement = newSelection[0];
                const bo = selectedElement.businessObject;
                let appianDataFromElement = null;
                let customIconUrl = null;
                let documentationUrl = '';
                let customType = null;

                // Try to get Appian info from extensionElements if present
                if (bo.extensionElements && bo.extensionElements.values) {
                    appianDataFromElement = bo.extensionElements.values.find(
                        extElem => extElem.$type === 'custom:AppianServiceData'
                    );
                    if (appianDataFromElement) {
                        customType = appianDataFromElement.customType;
                        customIconUrl = appianDataFromElement.customIconUrl;
                        if (customType) {
                            const serviceDefinition = appianSmartServices.find(
                                service => service.customType === customType
                            );
                            documentationUrl = serviceDefinition ? serviceDefinition.documentationUrl : '';
                        }
                    }
                }

                setSelectedAppianElementDetails({
                    id: bo.id,
                    name: bo.name || 'Unnamed Element',
                    type: bo.$type,
                    customType,
                    customIconUrl,
                    documentationUrl,
                    explanation: bo.explanation || ''
                });
            } else {
                setSelectedAppianElementDetails(null);
            }
        };

        eventBus.on('selection.changed', selectionChangedHandler);

        return () => {
            eventBus.off('custom.togglePanel', togglePanelHandler);
            eventBus.off('selection.changed', selectionChangedHandler); // Unsubscribe from selection changes
            if (bpmnModelerRef.current) {
                bpmnModelerRef.current.destroy();
                bpmnModelerRef.current = null;
            }
        };
    }, [setSelectedBPMNElements]); // Added setSelectedBPMNElements to dependency array

    // Effect for loading diagramXML when it changes
    useEffect(() => {
        const modeler = bpmnModelerRef.current;
        // Ensure reportRenderAttempt is defined before proceeding
        if (!modeler || diagramXML === null || diagramXML === undefined ) { // Check for null or undefined explicitly
            // If modeler exists but diagramXML is null/undefined, it might mean we want to clear or do nothing.
            // If diagramXML is explicitly set to empty string, it's handled below.
            // If no reportRenderAttempt, we can't report, so exit.
            if (!reportRenderAttempt && (diagramXML === null || diagramXML === undefined)) {
                console.warn("reportRenderAttempt is not available, cannot report render status for null/undefined XML.");
                return;
            }
            // If diagramXML is null or undefined, and we have reportRenderAttempt, what to do?
            // For now, let's assume an explicit empty string means "clear", and null/undefined means "no change from current state" or "initial load pending".
            // If it's truly an attempt to set a null/undefined diagram, it should probably be an error or a specific state.
            // Let's assume for now that if diagramXML is null/undefined, we don't attempt an import.
            // If it was an intentional clear, diagramXML should be ''.
            return;
        }

        const currentAttemptXml = diagramXML; // Capture the XML for this attempt

        if (diagramXML === "") { // If diagramXML is an empty string, treat as a successful clear or initial empty state
            modeler.createDiagram().then(() => {
                if (reportRenderAttempt) {
                    reportRenderAttempt(currentAttemptXml, 'success', null );
                }
            }).catch(err => {
                console.error('Error creating blank diagram:', err);
                if (reportRenderAttempt) {
                    reportRenderAttempt(currentAttemptXml, 'failure', err.message || 'Failed to create blank diagram' );
                }
            });
            return;
        }

        modeler.importXML(currentAttemptXml)
            .then(({ warnings }) => {
                if (warnings && warnings.length) {
                    console.warn('BPMN Import Warnings:', warnings);
                }
                if (reportRenderAttempt) {
                    reportRenderAttempt(currentAttemptXml, 'success', null);
                }
                const canvas = modeler.get('canvas');
                canvas.zoom('fit-viewport');
            })
            .catch(err => {
                console.error('BPMN Import Error in Modeler.jsx:', err); 
                if (reportRenderAttempt) {
                    // Pass currentAttemptXml to link the error to the specific XML
                    reportRenderAttempt(currentAttemptXml, 'failure', err.message || 'Unknown import error');
                }
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

    // Expose exportDiagram function via ref
    useImperativeHandle(ref, () => ({
        exportDiagram
    }));

    // Generalized function to create shapes for Appian Smart Services
    const handleCreateShape = (service, event) => {
        const modelerInstance = bpmnModelerRef.current;
        if (modelerInstance) {
            const elementFactory = modelerInstance.get('elementFactory');
            const create = modelerInstance.get('create');
            const moddle = modelerInstance.get('moddle');

            const iconUrl = APPIAN_ICON_BASE_URL + service.icon;
            // console.log(`[Modeler.jsx] Creating shape for ${service.name}. Service object:`, service); 
            // console.log("[Modeler.jsx] Service documentationUrl from appianServices.js:", service.documentationUrl, "Type:", typeof service.documentationUrl); 

            const mainBo = moddle.create(service.type, { name: service.name });

            if (service.eventDefinitionType) {
                mainBo.eventDefinitions = [moddle.create(service.eventDefinitionType)];
            }

            const appianData = moddle.create('custom:AppianServiceData', {
                customType: service.customType,
                customIconUrl: iconUrl
                // documentationUrl is no longer set here
            });
            // console.log("[Modeler.jsx] AppianData created by moddle.create (without documentationUrl):", appianData); 
            
            let extensionElements = mainBo.get('extensionElements');
            if (!extensionElements) {
                extensionElements = moddle.create('bpmn:ExtensionElements');
                mainBo.extensionElements = extensionElements;
            }

            // 4. Add AppianServiceData to extensionElements values
            if (!extensionElements.get('values')) {
                extensionElements.set('values', []);
            }
            extensionElements.get('values').push(appianData);
            appianData.$parent = extensionElements; // Set parent for serialization

            // 5. Create the shape with the updated business object
            const shape = elementFactory.createShape({
                type: service.type,
                businessObject: mainBo,
                ...(service.isExpanded && { width: 350, height: 200 })
            });
            
            if (event) {
                create.start(event, shape);
            }

        } else {
            console.error("BPMN Modeler instance not available.");
        }
    };

    return (
        <div className="modeler-container-flex" style={{ position: 'relative', height: '100%', width: '100%' }}>
            <div id="canvas" className="canvas-flex-item"></div>
            {/* Move AppianElementDetailsPanel to the bottom */}
            <div className="appian-details-panel-container">
                <AppianElementDetailsPanel details={selectedAppianElementDetails} />
            </div>
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
}); // Closing forwardRef

export default BPMNModeler;