import { useEffect, useRef } from 'react';
import BpmnModeler from 'bpmn-js/lib/Modeler'; // Changed this line
import 'bpmn-js/dist/assets/bpmn-js.css';
import 'bpmn-js/dist/assets/diagram-js.css';
import 'bpmn-js/dist/assets/bpmn-font/css/bpmn.css';
import './Modeler.css';
import customControlsModule from '../custom'

function BPMNModeler() {
    const bpmnModelerRef = useRef(null); // Declare bpmnModelerRef
    const diagramUrl = 'https://cdn.statically.io/gh/bpmn-io/bpmn-js-examples/dfceecba/starter/diagram.bpmn';

    useEffect(() => {
        // Initialize the modeler
        const modeler = new BpmnModeler({ // Changed this line
            container: '#canvas',
            additionalModules: [
                customControlsModule // Custom module for controls
            ],
            // Consider adding keyboard bindings if needed later:
            // keyboard: { bindTo: document }
        });
        bpmnModelerRef.current = modeler;

        // Function to open diagram
        async function openDiagram(bpmnXML) {
            if (!bpmnModelerRef.current) return; // Guard clause
            try {
                await bpmnModelerRef.current.importXML(bpmnXML);
                const canvas = bpmnModelerRef.current.get('canvas');
                const overlays = bpmnModelerRef.current.get('overlays');

                // zoom to fit full viewport
                canvas.zoom('fit-viewport');

                // attach an overlay to a node
                overlays.add('SCAN_OK', 'note', {
                    position: {
                        bottom: 0,
                        right: 0
                    },
                    html: '<div class="diagram-note">Mixed up the labels?</div>'
                });

                // add marker
                canvas.addMarker('SCAN_OK', 'needs-discussion');
            } catch (err) {
                console.error('could not import BPMN 2.0 diagram', err);
            }
        }

        // Load initial diagram
        fetch(diagramUrl)
            .then(response => response.text())
            .then(xml => openDiagram(xml))
            .catch(err => console.error('could not load diagram', err));

        // Cleanup function
        return () => {
            if (bpmnModelerRef.current) {
                bpmnModelerRef.current.destroy();
                bpmnModelerRef.current = null;
            }
        };
    }, []); // Empty dependency array ensures this runs once on mount and cleans up on unmount

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

    return (
        <div style={{ height: '100%', width: '100%', position: 'relative' }}> {/* Added width and position relative for button positioning */}
            <div id="canvas" style={{ height: '100%', width: '100%' }}></div>
            <button id="save-button" onClick={exportDiagram}>
                Export Diagram
            </button>
        </div>
    );
}

export default BPMNModeler;