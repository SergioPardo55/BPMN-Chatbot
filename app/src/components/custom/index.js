import CustomPalette from './customPalette';
import CustomContextPad from './customContextPad'; // Uncomment if you still use a custom context pad
import CustomRenderer from './CustomRenderer';

export default {
  __init__: [ 'customContextPad', 'customPalette', 'customRenderer' ],
  customContextPad: [ 'type', CustomContextPad ],
  customPalette: [ 'type', CustomPalette ],
  customRenderer: [ 'type', CustomRenderer ]
};