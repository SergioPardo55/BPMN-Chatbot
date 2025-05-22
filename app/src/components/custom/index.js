import CustomPalette from './customPalette';
import CustomRenderer from './CustomRenderer';
import CustomContextPad from './customContextPad';
import CustomContextPadOrderModule from './CustomContextPadOrder'; // Import the module definition

export default {
  __depends__: [ CustomContextPadOrderModule ], // Declare as a dependency
  __init__: [ 'customPalette', 'customRenderer', 'customContextPad' ], // customContextPadOrder is initialized by its own module
  customPalette: [ 'type', CustomPalette ],
  customRenderer: [ 'type', CustomRenderer ],
  customContextPad: [ 'type', CustomContextPad ]
  // The customContextPadOrder service is defined and initialized by CustomContextPadOrderModule
};