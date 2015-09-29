modules.define
(
    "viewAdapterParameterInitializers",
    ["each"],
    function(each)
    {
        var initializers    = {};
        each(["bindAs", "bindSource", "bindTo", "onbind"], function(val){ initializers[val] = function(viewAdapter, value) { viewAdapter["__" + val] = value; }; });
        each(["change", "click", "focus", "keydown", "keypress", "keyup", "mousedown", "mouseup"], function(val){ initializers["on" + val] = function(viewAdapter, callback) { viewAdapter.addEventListener(val, callback.bind(viewAdapter), false); }; });

        return function(viewAdapter, viewAdapterDefinition)
        {
            for(var initializerKey in initializers)    if (viewAdapterDefinition.hasOwnProperty(initializerKey))    initializers[initializerKey](viewAdapterDefinition[initializerKey]);
        };
    }
);