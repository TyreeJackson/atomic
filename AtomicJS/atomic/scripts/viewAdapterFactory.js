/*
outstanding issues:
add routing
*/
!function()
{"use strict";root.define("atomic.viewAdapterFactory",
function(internalFunctions)
{
    return { create: function createViewAdapter(viewAdapterDefinitionConstructor, viewElement, parent) { return internalFunctions.create(viewAdapterDefinitionConstructor, viewElement, parent); } };
});}();