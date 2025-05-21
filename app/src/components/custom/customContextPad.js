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
  
      function appendServiceTask(event, element) {
        if (autoPlace) {
          const shape = elementFactory.createShape({ 
            type: 'bpmn:Task',
            businessObject: elementFactory._moddle.create('bpmn:Task', {
              name: 'User Input Task',
              'custom:customType': 'userInputTask',
              'custom:customIconUrl': 'https://docs.appian.com/suite/help/24.3/images/Smart_Service_Icons/User_Input_Task.png'
            })
          });
    
          autoPlace.append(element, shape);
        } else {
          appendServiceTaskStart(event, element);
        }
      }
      
      function appendServiceTaskStart(event, element) { // Added element parameter here
        const shape = elementFactory.createShape({ 
          type: 'bpmn:Task',
          businessObject: elementFactory._moddle.create('bpmn:Task', {
            name: 'User Input Task',
            'custom:customType': 'userInputTask',
            'custom:customIconUrl': 'https://docs.appian.com/suite/help/24.3/images/Smart_Service_Icons/User_Input_Task.png'
          })
        });
    
        create.start(event, shape, element); // Pass element here
      }

      function appendWriteToDatabaseTask(event, element) {
        if (autoPlace) {
          const shape = elementFactory.createShape({ type: 'bpmn:ServiceTask' }); // Or another bpmn type
          // You might want to set a default name for this task, e.g.:
          // shape.businessObject.name = 'Write to Database';
          autoPlace.append(element, shape);
        } else {
          appendWriteToDatabaseTaskStart(event, element);
        }
      }

      function appendWriteToDatabaseTaskStart(event, element) { // Added element parameter here
        const shape = elementFactory.createShape({ 
          type: 'bpmn:ServiceTask', // Keeping as ServiceTask unless specified otherwise
          businessObject: elementFactory._moddle.create('bpmn:ServiceTask', { // Ensure moddle creates the correct type
            name: 'Write to Database Task'
            // If this also needs a custom icon, add customType and customIconUrl here
            // 'custom:customType': 'writeToDbTask', 
            // 'custom:customIconUrl': 'URL_TO_DB_ICON' 
          })
        });
        create.start(event, shape, element); // Pass element here
      }

      return {
        'append.service-task': {
          group: 'model',
          title: translate('Append User input task'),
          imageUrl: 'http://docs.appian.com/suite/help/24.3/images/Smart_Service_Icons/User_Input_Task.png',
          action: {
            click: appendServiceTask,
            dragstart: appendServiceTaskStart
          }
        },
        'append.write-to-database-task': {
          group: 'model',
          className: 'bpmn-icon-user-task', // Choose an appropriate icon
          title: translate('Append Write to Database Task'),
          action: {
            click: appendWriteToDatabaseTask,
            dragstart: appendWriteToDatabaseTaskStart
          }
        }
      };
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