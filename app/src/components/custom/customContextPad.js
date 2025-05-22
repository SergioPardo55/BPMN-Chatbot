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

        function appendAction(event, currentElement) {
          // 1. Create the main business object (e.g., ServiceTask)
          const mainBo = elementFactory._moddle.create(item.type, { name: item.name });

          // Add eventDefinitions if applicable
          if (item.eventDefinitionType) {
            mainBo.eventDefinitions = [elementFactory._moddle.create(item.eventDefinitionType)];
          }

          // 2. Create the AppianServiceData element
          const appianData = elementFactory._moddle.create('custom:AppianServiceData', {
            customType: item.customType,
            customIconUrl: iconUrl
          });

          // 3. Get or create extensionElements for the mainBo
          let extensionElements = mainBo.get('extensionElements');
          if (!extensionElements) {
            extensionElements = elementFactory._moddle.create('bpmn:ExtensionElements');
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
            type: item.type,
            businessObject: mainBo,
            ...(item.isExpanded && { isExpanded: true, width: 350, height: 200 })
          });
          
          if (autoPlace) {
            autoPlace.append(currentElement, shape);
          } else {
            startAppendAction(event, currentElement, shape);
          }
        }
        
        function startAppendAction(event, currentElement, providedShape) {
          let shapeToCreate = providedShape;
          if (!shapeToCreate) {
            // Create the main business object (e.g., ServiceTask)
            const mainBo = elementFactory._moddle.create(item.type, { name: item.name });

            // Add eventDefinitions if applicable
            if (item.eventDefinitionType) {
              mainBo.eventDefinitions = [elementFactory._moddle.create(item.eventDefinitionType)];
            }

            // Create the AppianServiceData element
            const appianData = elementFactory._moddle.create('custom:AppianServiceData', {
              customType: item.customType,
              customIconUrl: iconUrl // iconUrl needs to be defined in this scope too
            });

            // Get or create extensionElements for the mainBo
            let extensionElements = mainBo.get('extensionElements');
            if (!extensionElements) {
              extensionElements = elementFactory._moddle.create('bpmn:ExtensionElements');
              mainBo.extensionElements = extensionElements;
            }

            // Add AppianServiceData to extensionElements values
            if (!extensionElements.get('values')) {
              extensionElements.set('values', []);
            }
            extensionElements.get('values').push(appianData);
            appianData.$parent = extensionElements; // Set parent for serialization

            // Create the shape with the updated business object
            shapeToCreate = elementFactory.createShape({
              type: item.type,
              businessObject: mainBo,
              ...(item.isExpanded && { isExpanded: true, width: 350, height: 200 })
            });
          }
          create.start(event, shapeToCreate, currentElement); 
        }
        
        entries[`append.${item.customType}`] = {
          group: 'model',
          title: translate(`Append ${item.name}`),
          imageUrl: iconUrl, // Use the Appian icon for the context pad button itself
          action: {
            click: appendAction,
            dragstart: (event, currentElement) => startAppendAction(event, currentElement, null)
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