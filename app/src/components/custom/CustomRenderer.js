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

  _getCustomProperty(businessObject, propertyName) {
    if (!businessObject) {
      return undefined;
    }

    const extensionElements = businessObject.get('extensionElements');
    if (extensionElements && extensionElements.values) {
      const appianDataElement = extensionElements.values.find(
        extEl => extEl.$type === 'custom:AppianServiceData'
      );
      if (appianDataElement) {
        return appianDataElement[propertyName];
      }
    }
    return undefined;
  }

  canRender(element) {
    // Render if the element has customType and customIconUrl via AppianServiceData
    const customType = this._getCustomProperty(element.businessObject, 'customType');
    const customIconUrl = this._getCustomProperty(element.businessObject, 'customIconUrl');
    return !!(customType && customIconUrl);
  }

  drawShape(parentNode, element) {
    // Draw the default shape first (e.g., task, event, gateway)
    const shape = this.bpmnRenderer.drawShape(parentNode, element);

    const customIconUrl = this._getCustomProperty(element.businessObject, 'customIconUrl');

    // Check again, though canRender should have ensured this
    if (customIconUrl) {
      const iconSize = 20; // Desired icon size (width and height)
      const padding = 5;   // Padding from the top-left corner

      let xPosition = padding;
      let yPosition = padding;

      if (element.type.includes('Gateway') || element.type.includes('Event')) {
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
