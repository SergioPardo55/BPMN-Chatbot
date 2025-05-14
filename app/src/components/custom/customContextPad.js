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
          const shape = elementFactory.createShape({ type: 'bpmn:ServiceTask' });
    
          autoPlace.append(element, shape);
        } else {
          appendServiceTaskStart(event, element);
        }
      }
      
      function appendServiceTaskStart(event) {
        const shape = elementFactory.createShape({ type: 'bpmn:ServiceTask' });
    
        create.start(event, shape, element);
      }

      function appendWriteToDatabaseTask(event, element) {
        if (autoPlace) {
          const shape = elementFactory.createShape({ type: 'bpmn:UserTask' }); // Or another bpmn type
          // You might want to set a default name for this task, e.g.:
          // shape.businessObject.name = 'Write to Database';
          autoPlace.append(element, shape);
        } else {
          appendWriteToDatabaseTaskStart(event, element);
        }
      }

      function appendWriteToDatabaseTaskStart(event) {
        const shape = elementFactory.createShape({ type: 'bpmn:UserTask' }); // Or another bpmn type
        // You might want to set a default name for this task, e.g.:
        // shape.businessObject.name = 'Write to Database';
        create.start(event, shape, element);
      }

      return {
        'append.service-task': {
          group: 'model',
          className: 'bpmn-icon-service-task',
          title: translate('Append ServiceTask'),
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