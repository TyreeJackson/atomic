!function()
{
    root.define
    (
        "atomic.initializeViewAdapter",
        function(each)
        {
            var initializers    =
            {
                onenter:    function(viewAdapter, callback) { viewAdapter.addEventListener("keypress", function(event){ if (event.keyCode==13) callback.call(viewAdapter); }, false); },
                onescape:   function(viewAdapter, callback) { viewAdapter.addEventListener("keydown", function(event){ if (event.keyCode==27) callback.call(viewAdapter); }, false); },
                hidden:     function(viewAdapter, value)    { if (value) viewAdapter.hide(); }
            };
            each(["bindAs", "bindSource", "bindTo", "onbind", "onunbind", "updateon"], function(val){ initializers[val] = function(viewAdapter, value) { viewAdapter["__" + val] = value; }; });
            each(["blur", "change", "click", "contextmenu", "copy", "cut", "dblclick", "drag", "drageend", "dragenter", "dragleave", "dragover", "dragstart", "drop", "focus", "focusin", "focusout", "input", "keydown", "keypress", "keyup", "mousedown", "mouseenter", "mouseleave", "mousemove", "mouseover", "mouseout", "mouseup", "paste", "search", "select", "touchcancel", "touchend", "touchmove", "touchstart", "wheel"], function(val){ initializers["on" + val] = function(viewAdapter, callback) { viewAdapter.addEventListener(val, callback.bind(viewAdapter), false); }; });

            return function initializeViewAdapter(viewAdapter, viewAdapterDefinition)
            {
                for(var initializerKey in initializers)    if (viewAdapterDefinition.hasOwnProperty(initializerKey))    initializers[initializerKey](viewAdapter, viewAdapterDefinition[initializerKey]);
            };
        }
    );
}();