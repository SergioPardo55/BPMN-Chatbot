// Orders context pad entries to ensure Appian services appear last.
function CustomContextPadOrder(contextPad) {
  const originalGetEntries = contextPad.getEntries;

  contextPad.getEntries = function(element) {
    // Get all entries as produced by the original providers and their priorities
    const entries = originalGetEntries.call(this, element);

    const customAppendEntries = {}; // Entries we want to move to the end
    const otherCoreEntries = {};    // Entries that should appear first (e.g., delete, replace, connect)

    for (const key in entries) {
      // Entries from CustomContextPad (Appian services) are prefixed with 'append.'
      // Default entries like 'delete', 'replace', 'connect' do not have this prefix.
      // Standard bpmn-js append actions (e.g., 'append.task') will also be caught here and moved after core actions.
      if (key.startsWith('append.')) {
        customAppendEntries[key] = entries[key];
      } else {
        otherCoreEntries[key] = entries[key];
      }
    }

    // Return other (core) entries first, then custom append entries.
    return { ...otherCoreEntries, ...customAppendEntries };
  };
}

CustomContextPadOrder.$inject = [ 'contextPad' ];

export default {
  __init__: ['customContextPadOrder'],
  customContextPadOrder: [ 'type', CustomContextPadOrder ]
};
