export default class CustomPalette {
    constructor(eventBus, palette, translate) { // Injected eventBus, removed bpmnJS, create, elementFactory
      this.eventBus = eventBus;
      this.translate = translate;
  
      palette.registerProvider(this);
    }
  
    getPaletteEntries(element) {
      const {
        translate,
        eventBus
      } = this;
  
      function toggleCustomToolsPanelAction() {
        eventBus.fire('custom.togglePanel'); // Fire a custom event
      }
  
      return {
        'toggle-custom-tools': {
          group: 'tools',
          imageUrl: "/appian-seeklogo.svg",
          title: translate('Toggle Appian Smart-Services'),
          action: {
            click: toggleCustomToolsPanelAction
          }
        }
      };
    }
  }
  
  CustomPalette.$inject = [
    'eventBus',
    'palette',
    'translate'
  ];