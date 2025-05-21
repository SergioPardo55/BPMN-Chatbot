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
    // Only render tasks that have our customType 'userInputTask'
    return element.type === 'bpmn:Task' && 
           element.businessObject && 
           element.businessObject.get('custom:customType') === 'userInputTask';
  }

  drawShape(parentNode, element) {
    // Draw the default task shape first
    const shape = this.bpmnRenderer.drawShape(parentNode, element);

    const customIconUrl = element.businessObject.get('custom:customIconUrl');

    if (customIconUrl) {
      const iconSize = 20; // Desired icon size (width and height)
      const padding = 5;   // Padding from the top-left corner of the task

      const img = svgCreate('image');
      svgAttr(img, {
        href: customIconUrl,
        x: padding,
        y: padding,
        width: iconSize,
        height: iconSize
      });
      svgAppend(parentNode, img);
    }

    return shape;
  }
}

CustomRenderer.$inject = ['eventBus', 'bpmnRenderer'];
