import { appianSmartServices, APPIAN_ICON_BASE_URL } from './appianServices'; // Import constants

export default class CustomContextPad {
    constructor(config, contextPad, create, elementFactory, injector, translate) {
      this.create = create;
      this.elementFactory = elementFactory;
      this.translate = translate;
  
      if (config.autoPlace !== false) {
        this.autoPlace = injector.get('autoPlace', false);
      }
  
      contextPad.registerProvider(this);
    }
  
    getContextPadEntries(element) {
      const {
        autoPlace,
        create,
        elementFactory,
        translate
      } = this;

      const entries = {};

      appianSmartServices.forEach(item => {
        const iconUrl = APPIAN_ICON_BASE_URL + item.icon;

        function appendAction(event, currentElement) { // Renamed element to currentElement to avoid conflict
          const businessObjectAttrs = {
            name: item.name,
            'custom:customType': item.customType,
            'custom:customIconUrl': iconUrl
          };

          if (item.eventDefinitionType) {
            businessObjectAttrs.eventDefinitions = [elementFactory._moddle.create(item.eventDefinitionType)];
          }

          const shape = elementFactory.createShape({
            type: item.type,
            businessObject: elementFactory._moddle.create(item.type, businessObjectAttrs),
            ...(item.isExpanded && { isExpanded: true, width: 350, height: 200 }) // Example size for subprocess
          });
          
          // Ensure custom properties are set (sometimes direct BO creation needs a little help)
          if (shape.businessObject) {
            shape.businessObject.name = item.name; // Redundant if moddle.create worked, but safe
            shape.businessObject.set('custom:customType', item.customType);
            shape.businessObject.set('custom:customIconUrl', iconUrl);
            if (item.eventDefinitionType && !shape.businessObject.eventDefinitions) {
                 shape.businessObject.eventDefinitions = [elementFactory._moddle.create(item.eventDefinitionType)];
            }
          }


          if (autoPlace) {
            autoPlace.append(currentElement, shape);
          } else {
            startAppendAction(event, currentElement, shape); // Pass shape to startAppendAction
          }
        }
        
        function startAppendAction(event, currentElement, providedShape) { // Added currentElement, providedShape
          let shapeToCreate = providedShape;
          if (!shapeToCreate) { // If not called from appendAction, create the shape
            const businessObjectAttrs = {
              name: item.name,
              'custom:customType': item.customType,
              'custom:customIconUrl': iconUrl
            };
            if (item.eventDefinitionType) {
              businessObjectAttrs.eventDefinitions = [elementFactory._moddle.create(item.eventDefinitionType)];
            }
            shapeToCreate = elementFactory.createShape({
              type: item.type,
              businessObject: elementFactory._moddle.create(item.type, businessObjectAttrs),
              ...(item.isExpanded && { isExpanded: true, width: 350, height: 200 })
            });
            // Ensure custom properties
            if (shapeToCreate.businessObject) {
                shapeToCreate.businessObject.name = item.name;
                shapeToCreate.businessObject.set('custom:customType', item.customType);
                shapeToCreate.businessObject.set('custom:customIconUrl', iconUrl);
                if (item.eventDefinitionType && !shapeToCreate.businessObject.eventDefinitions) {
                    shapeToCreate.businessObject.eventDefinitions = [elementFactory._moddle.create(item.eventDefinitionType)];
                }
            }
          }
          create.start(event, shapeToCreate, currentElement); 
        }
        
        entries[`append.${item.customType}`] = {
          group: 'model',
          title: translate(`Append ${item.name}`),
          imageUrl: iconUrl, // Use the Appian icon for the context pad button itself
          action: {
            click: appendAction,
            dragstart: (event, currentElement) => startAppendAction(event, currentElement, null) // Ensure startAppendAction creates shape
          }
        };
      });
      return entries;
    }
}
  
CustomContextPad.$inject = [
    'config',
    'contextPad',
    'create',
    'elementFactory',
    'injector',
    'translate'
];