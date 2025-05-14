export default class CustomPalette {
    constructor(create, elementFactory, palette, translate) {
      this.create = create;
      this.elementFactory = elementFactory;
      this.translate = translate;
  
      palette.registerProvider(this);
    }
  
    getPaletteEntries(element) {
      const {
        create,
        elementFactory,
        translate
      } = this;
  
      function createServiceTask(event) {
        const shape = elementFactory.createShape({ type: 'bpmn:ServiceTask' });
  
        create.start(event, shape);
      }

      function createWriteToDatabaseTask(event) {
        const shape = elementFactory.createShape({ type: 'bpmn:UserTask' }); // Or bpmn:ServiceTask or your custom type
        // You can set a default name if desired:
        // shape.businessObject.name = 'Write to Database';
        create.start(event, shape);
      }
  
      return {
        'create.service-task': {
          group: 'custom', // Changed from 'activity' to 'custom'
          className: 'bpmn-icon-service-task',
          title: translate('Create ServiceTask'),
          action: {
            dragstart: createServiceTask,
            click: createServiceTask
          }
        },
        'create.write-to-database-task': {
          group: 'custom', // Changed from 'activity' to 'custom'
          className: 'bpmn-icon-data-store', // Using data store icon, can be changed
          title: translate('Create Write to Database Task'),
          action: {
            dragstart: createWriteToDatabaseTask,
            click: createWriteToDatabaseTask
          }
        }
      }
    }
  }
  
  CustomPalette.$inject = [
    'create',
    'elementFactory',
    'palette',
    'translate'
  ];