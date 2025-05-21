// c:\Users\chech\OneDrive\Documentos\GitHub\BPMN Chat\app\src\components\custom\CustomRenderer.js
import BaseRenderer from 'diagram-js/lib/draw/BaseRenderer';
import {
  append as svgAppend,
  attr as svgAttr,
  create as svgCreate
} from 'tiny-svg';

const HIGH_PRIORITY = 1500; // Ensure it overrides default renderers

export default class CustomRenderer extends BaseRenderer {
  constructor(eventBus, bpmnRenderer) {
    super(eventBus, HIGH_PRIORITY);
    this.bpmnRenderer = bpmnRenderer;
  }

  canRender(element) {
    // Render if the element has customType and customIconUrl
    return element.businessObject && 
           element.businessObject.get('custom:customType') && 
           element.businessObject.get('custom:customIconUrl');
  }

  drawShape(parentNode, element) {
    // Draw the default shape first (e.g., task, event, gateway)
    const shape = this.bpmnRenderer.drawShape(parentNode, element);

    const customIconUrl = element.businessObject.get('custom:customIconUrl');

    // Check again, though canRender should have ensured this
    if (customIconUrl) {
      const iconSize = 20; // Desired icon size (width and height)
      const padding = 5;   // Padding from the top-left corner

      // For gateways, icons might look better centered or scaled differently.
      // For now, using a generic approach.
      let xPosition = padding;
      let yPosition = padding;

      // Potentially adjust icon position based on element type for better aesthetics
      // For example, center it in small elements like gateways or events
      if (element.type.includes('Gateway') || element.type.includes('Event')) { // Simplified check for Gateway or Event
        // Center icon for smaller elements like gateways and events
        xPosition = (element.width - iconSize) / 2;
        yPosition = (element.height - iconSize) / 2;
      }

      const img = svgCreate('image');
      svgAttr(img, {
        href: customIconUrl,
        x: xPosition,
        y: yPosition,
        width: iconSize,
        height: iconSize
      });
      svgAppend(parentNode, img);
    }

    return shape;
  }
}

CustomRenderer.$inject = ['eventBus', 'bpmnRenderer'];
