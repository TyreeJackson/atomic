!function()
{
    root.define
    (
        "atomic.initializeViewAdapter",
        function(each)
        {
            var initializers    =
            {
                onEnter:    function(viewAdapter, callback) { viewAdapter.addEventListener("keypress", function(event){ if (event.keyCode==13) callback.call(viewAdapter); }, false); },
                hidden:     function(viewAdapter, value)    { if (value) viewAdapter.hide(); }
            };
            each(["bindAs", "bindSource", "bindTo", "onbind"], function(val){ initializers[val] = function(viewAdapter, value) { viewAdapter["__" + val] = value; }; });
            each(["change", "click", "focus", "keydown", "keypress", "keyup", "mousedown", "mouseup"], function(val){ initializers["on" + val] = function(viewAdapter, callback) { viewAdapter.addEventListener(val, callback.bind(viewAdapter), false); }; });

            return function initializeViewAdapter(viewAdapter, viewAdapterDefinition)
            {
                for(var initializerKey in initializers)    if (viewAdapterDefinition.hasOwnProperty(initializerKey))    initializers[initializerKey](viewAdapter, viewAdapterDefinition[initializerKey]);
            };
        }
    );
}();