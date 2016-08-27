!function()
{"use strict";root.define("atomic.initializeViewAdapter", function(each, defineDataProperties)
{
    function cancelEvent(event)
    {
        event.preventDefault();
        event.stopPropagation();
        return false;
    }
    function notifyIfValueHasChanged(callback)
    {
        this.__lastChangingTimeout  = undefined;
        callback.call(this, this.__lastChangingValueSeen);
    }
    
    function notifyIfValueHasChangedOrDelay(callback)
    {
        if ((this.__lastChangingValueSeen||"") === this.value())  return;
        this.__lastChangingValueSeen = this.value();
        if (this.__onchangingdelay !== undefined)
        {
            if (this.__lastChangingTimeout !== undefined)   clearTimeout(this.__lastChangingTimeout);
            this.__lastChangingTimeout  = setTimeout(notifyIfValueHasChanged.bind(this, callback), this.__onchangingdelay);
        }
        else    notifyIfValueHasChanged.call(this, callback);
    }
    function bindProperty(viewAdapter, name, binding)
    {
        if(viewAdapter[name] === undefined) debugger;
        if (typeof binding === "string" || typeof binding === "function")   viewAdapter[name].bind = binding;
        else
        {
            if (binding.to !== undefined)                                   viewAdapter[name].bind      = binding.to;
            if (binding.root !== undefined)                                 viewAdapter[name].root      = binding.root;
            if (binding.onupdate !== undefined)                             viewAdapter[name].onupdate  = binding.onupdate;
            if (Array.isArray(binding.updateon))                            viewAdapter[name].onchange  = viewAdapter.getEvents(binding.updateon);
        }
    }
    function bindClassProperty(viewAdapter, name, binding)
    {
        viewAdapter.bindClass(name);
        bindProperty(viewAdapter.classes, name, binding);
    }
    function bindClassProperties(viewAdapter, classBindings)
    {
        for(var name in classBindings)  bindClassProperty(viewAdapter, name, classBindings[name]);
    }
    function bindMultipleProperties(viewAdapter, bindings)
    {
        for(var name in bindings) if (name !== "class") bindProperty(viewAdapter, name, bindings[name]);
        if (bindings.classes !== undefined)             bindClassProperties(viewAdapter, bindings.classes);
    }
    var initializers    =   {};
    Object.defineProperties(initializers,
    {
        onchangingdelay:    {enumerable: true, value: function(viewAdapter, value)    { viewAdapter.onchangingdelay(parseInt(value)); }},
        onchanging:         {enumerable: true, value: function(viewAdapter, callback) { viewAdapter.addEventsListener(["keydown", "keyup", "mouseup", "touchend", "change"], notifyIfValueHasChangedOrDelay.bind(viewAdapter, callback), false, true); }},
        onenter:            {enumerable: true, value: function(viewAdapter, callback) { viewAdapter.addEventListener("keypress", function(event){ if (event.keyCode==13) { callback.call(viewAdapter); return cancelEvent(event); } }, false, true); }},
        onescape:           {enumerable: true, value: function(viewAdapter, callback) { viewAdapter.addEventListener("keydown", function(event){ if (event.keyCode==27) { callback.call(viewAdapter); return cancelEvent(event); } }, false, true); }},
        hidden:             {enumerable: true, value: function(viewAdapter, value)    { if (value) viewAdapter.hide(); }},
        focused:            {enumerable: true, value: function(viewAdapter, value)    { if (value) viewAdapter.focus(); }},
        bind:               {enumerable: true, value: function(viewAdapter, value)
        {
            if (typeof value === "object")  bindMultipleProperties(viewAdapter, value);
            else                            {viewAdapter.value.bind  = value;}
        }},
        data:               {enumerable: true, value: function(viewAdapter, value)
        { 
            if (typeof value === "function")    viewAdapter[name] = value.call(viewAdapter);
            else                                viewAdapter[name] = value;
        }},
        updateon:           {value: function(viewAdapter, value)    {if (Array.isArray(value))  viewAdapter.updateon = value;}}
    });
    each(["value"], function(val){ initializers[val] = function(viewAdapter, value) { if (viewAdapter[val] === undefined) {console.error("property named " +val + " was not found on the view adapter of type " + typeof(viewAdapter) + ".  Skipping initializer."); return;} viewAdapter[val](value); }; });
    each(["bindData", "bindSource", "bindSourceData", "bindSourceValue", "bindSourceText","isRoot"], function(val){ initializers[val] = function(viewAdapter, value) { viewAdapter[val] = value; }; });
    each(["onbind", "onbindsource", "ondataupdate", "onsourceupdate", "onunbind"], function(val){ initializers[val] = function(viewAdapter, value) { viewAdapter["__" + val] = value; }; });
    each(["show", "hide"], function(val){ initializers["on"+val] = function(viewAdapter, callback) { viewAdapter.addEventListener(val, function(event){ callback.call(viewAdapter); }, false, true); }; });
    each(["blur", "change", "click", "contextmenu", "copy", "cut", "dblclick", "drag", "drageend", "dragenter", "dragleave", "dragover", "dragstart", "drop", "focus", "focusin", "focusout", "input", "keydown", "keypress", "keyup", "mousedown", "mouseenter", "mouseleave", "mousemove", "mouseover", "mouseout", "mouseup", "paste", "search", "select", "touchcancel", "touchend", "touchmove", "touchstart", "wheel"], function(val)
    {
        initializers["on" + val] = function(viewAdapter, callback) { viewAdapter.addEventListener(val, callback.bind(viewAdapter), false); };
    });
    function initializeViewAdapterExtension(viewAdapter, viewAdapterDefinition, extension)
    {
        for(var initializerSetKey in extension.initializers)
        if (viewAdapterDefinition.hasOwnProperty(initializerSetKey))
        {
            var initializerSet  = viewAdapterDefinition[initializerSetKey];
            for(var initializerKey in extension.initializers[initializerSetKey])
            if (initializerSet.hasOwnProperty(initializerKey))   extension.initializers[initializerSetKey][initializerKey](viewAdapter, viewAdapterDefinition[initializerSetKey][initializerKey]);
        }
    }

    return function initializeViewAdapter(viewAdapter, viewAdapterDefinition)
    {
        for(var initializerKey in initializers)
        if (viewAdapterDefinition.hasOwnProperty(initializerKey))    initializers[initializerKey](viewAdapter, viewAdapterDefinition[initializerKey]);

        if (viewAdapter.__extensions !== undefined && viewAdapter.__extensions.length !== undefined)
        for(var counter=0;counter<viewAdapter.__extensions.length;counter++)  initializeViewAdapterExtension(viewAdapter, viewAdapterDefinition, viewAdapter.__extensions[counter]);
        delete viewAdapter.__extensions;
    };
});}();