!function(){"use strict";root.define("atomic.html.control", function hmtlControl(document, removeItemFromArray, setTimeout, each, eventsSet, dataBinder)
{
    var logCounter      = 0;
    var callbackCounter = 0;
    function createWhenBinding(name, binding)
    {
        if (binding.equals          !== undefined)  return { get: function(item){return item(binding.when) == binding.equals;},                  set: function(item, value){if (binding.equals === true) item(binding.when, value); else if (binding.equals === false) item(binding.when, !value);}};
        else if (binding.notequals  !== undefined)  return { get: function(item){return item(binding.when) != binding.notequals;},               set: function(item, value){if (binding.notequals === true) item(binding.when, !value); else if (binding.notequals === false) item(binding.when, value);}};
        else if (binding["=="]      !== undefined)  return { get: function(item){return item(binding.when) == binding["=="];},                   set: function(item, value){}};
        else if (binding["!="]      !== undefined)  return { get: function(item){return item(binding.when) != binding["!="];},                   set: function(item, value){}};
        else if (binding[">"]       !== undefined)  return { get: function(item){return item(binding.when) > binding[">"];},                     set: function(item, value){}};
        else if (binding[">="]      !== undefined)  return { get: function(item){return item(binding.when) >= binding[">="];},                   set: function(item, value){}};
        else if (binding["<"]       !== undefined)  return { get: function(item){return item(binding.when) < binding["<"];},                     set: function(item, value){}};
        else if (binding["<="]      !== undefined)  return { get: function(item){return item(binding.when) <= binding["<="];},                   set: function(item, value){}};
        else if (binding["hasValue"]!== undefined)  return { get: function(item){return item.hasValue(binding.when) == binding["hasValue"];},    set: function(item, value){}};
        else if (binding["isDefined"]!==undefined)  return { get: function(item){return item.isDefined(binding.when) === binding["isDefined"];}, set: function(item, value){}};
        else                                        return { get: function(item){return !(!item(binding.when));},                                set: function(item, value){item(binding.when, value);}};
    }
    function bindProperty(name, binding)
    {
        if(this[name] === undefined) debugger;
        if (typeof binding === "string" || typeof binding === "function")   this[name].listen({bind: binding});
        else
        {
            if (binding.delay !== undefined)                                this[name].delay     = binding.delay;
            this[name].listen
            ({
                bind:       binding.to !== undefined
                            ?   binding.to
                            :   binding.when !== undefined
                                ?   createWhenBinding(name, binding)
                                :   binding.get || binding.set
                                    ?   {get: binding.get, set: binding.set}
                                    :   undefined,
                root:       binding.root,
                onupdate:   binding.onupdate,
                onchange:   Array.isArray(binding.updateon)
                            ?   this.getEvents(binding.updateon)
                            :   undefined
            });
            each(["text","value"], (function(option)
            {
                var optionName  = "option"+option.substr(0,1).toUpperCase()+option.substr(1);
                if (binding[option] !== undefined)  this[optionName] = binding[option];
            }).bind(this));
        }
    }
    function bindClassProperty(name, binding)
    {
        this.bindClass(name);
        bindProperty.call(this.classes, name, binding);
    }
    function bindClassProperties(classBindings)
    {
        for(var name in classBindings)  bindClassProperty.call(this, name, classBindings[name]);
    }
    function bindMultipleProperties(bindings)
    {
        for(var name in bindings) if (name !== "classes")   bindProperty.call(this, name, bindings[name]);
        if (bindings.classes !== undefined)                 bindClassProperties.call(this, bindings.classes);
    }
    var initializers    =   {};
    Object.defineProperties(initializers,
    {
        onchangingdelay:    {enumerable: true, value: function(viewAdapter, value)    { viewAdapter.onchangingdelay = parseInt(value); }},
        hidden:             {enumerable: true, value: function(viewAdapter, value)    { if (value) viewAdapter.hide(); }},
        focused:            {enumerable: true, value: function(viewAdapter, value)    { if (value) viewAdapter.focus(); }},
        bind:               {enumerable: true, value: function(viewAdapter, value)
        {
            if (typeof value === "object")  bindMultipleProperties.call(viewAdapter, value);
            else                            viewAdapter.value.listen({bind: value});
        }},
        updateon:           {value: function(viewAdapter, value)    {if (Array.isArray(value))  viewAdapter.updateon = value;}}
    });
    each(["alt", "autoplay", "currentTime", "loop", "muted", "nativeControls", "preload", "mediaType", "playbackRate", "value", "volume"], function(val){ initializers[val] = function(viewAdapter, value) { if (viewAdapter[val] === undefined) {console.error("property named " +val + " was not found on the view adapter of type " + viewAdapter.constructor.name + ".  Skipping initializer."); return;} viewAdapter[val](value); }; });
    each(["onchaging", "onenter", "onescape", "optionValue", "optionText", "isDataRoot"], function(val){ initializers[val] = function(viewAdapter, value) { viewAdapter[val] = value; }; });
    initializers.classes = function(viewAdapter, value) { each(value, function(val){viewAdapter.toggleClass(val, true);}); };
    each(["onbind", "ondataupdate", "onsourceupdate", "onunbind"], function(val){ initializers[val] = function(viewAdapter, value) { viewAdapter["__" + val] = value; }; });
    each(["show", "hide"], function(val)
    {
        initializers["on" + val] = function(viewAdapter, callback) { viewAdapter.addEventListener(val, callback.bind(viewAdapter), false, true); };
    });
    each(["abort", "blur", "canplay", "canplaythrough", "change", "click", "contextmenu", "copy", "cut", "dblclick", "drag", "dragend", "dragenter", "dragleave", "dragover", "dragstart", "drop", "durationchanged", "ended", "error", "focus", "focusin", "focusout", "input", "loadeddata", "loadedmetadata", "loadstart", "keydown", "keypress", "keyup", "mousedown", "mouseenter", "mouseleave", "mousemove", "mouseover", "mouseout", "mouseup", "paste", "pause", "play", "playing", "progress", "ratechange", "search", "seeked", "seeking", "select", "stalled", "suspend", "timeupdate", "touchcancel", "touchend", "touchmove", "touchstart", "volumechange", "waiting", "wheel", "transitionend", "viewupdated"], function(val)
    {
        initializers["on" + val] = function(viewAdapter, callback) { viewAdapter.addEventListener(val, callback.bind(viewAdapter), false); };
    });
    function initializeViewAdapterExtension(viewAdapterDefinition, extension)
    {
        for(var initializerSetKey in extension.initializers)
        if (viewAdapterDefinition.hasOwnProperty(initializerSetKey))
        {
            var initializerSet  = viewAdapterDefinition[initializerSetKey];
            if (typeof extension.initializers[initializerSetKey] === "function")    extension.initializers[initializerSetKey].call(this, this, viewAdapterDefinition[initializerSetKey]);
            else
            for(var initializerKey in extension.initializers[initializerSetKey])
            if (initializerSet.hasOwnProperty(initializerKey))   extension.initializers[initializerSetKey][initializerKey].call(this, this, viewAdapterDefinition[initializerSetKey][initializerKey]);
        }
    }
    function addEvents(eventNames)
    {
        if (eventNames)
        for(var eventNameCounter=0;eventNameCounter<eventNames.length;eventNameCounter++)   Object.defineProperty(this.on, eventNames[eventNameCounter], {value: this.__events.getOrAdd(eventNames[eventNameCounter])});
    }
    function addCustomMembers(members)
    {
        if (members)
        for(var memberKey in members)   Object.defineProperty(this, memberKey, {value: members[memberKey]});
    }
    function selectContents(element)
    {
        var range = document.createRange();
        range.selectNodeContents(element);
        var selection = window.getSelection();
        selection.removeAllRanges();
        selection.addRange(range);
    }
    function control(element, selector, parent, bindPath)
    {
        if (element === undefined)
        {
            element                 = this.__createNode(selector);
            parent.__element.appendChild(element);
            if (this.__addSpacing)  parent.__element.appendChild(document.createTextNode (" "));
            element[selector.substr(0,1)==="#"?"id":"className"]    = selector.substr(1);
            element.__selectorPath  = parent.getSelectorPath();
        }
        Object.defineProperties(this, 
        {
            __element:              {value: element, configurable: true},
            __elementPlaceholder:   {value: [], configurable: true},
            __events:               {value: new eventsSet(this), configurable: true},
            on:                     {value: {}, configurable: true},
            __attributes:           {value: {}, writable: true, configurable: true},
            __class:                {value: null, writable: true, configurable: true},
            __selector:             {value: selector, configurable: true},
            __selectorPath:         {value: (parent === undefined ? "" : parent.getSelectorPath()) + "-" + (selector||"root")},
            parent:                 {value: parent, configurable: true},
            __binder:               {value: new dataBinder(this), configurable: true},
            __forceRoot:            {value: false, configurable: true},
            classes:                {value: {}, configurable: true},
            __viewUpdateQueue:      {value: {}, configurable: true}
        });
        this.__element.__display    = this.__element.style.display;
        this.bindPath               = bindPath;
        this.__binder.defineDataProperties(this,
        {
            attributes:         
            {
                get:    function(){return this.__attributes;}, 
                set:    function(value)
                {
                    if (value!==undefined&&value.isObserver) value=value(); 
                    this.__attributes=value;

                    if (value!==undefined)
                    for(var key in value)   this.__element.setAttribute("data-" + key, value[key]);
                    this.getEvents("viewupdated").viewupdated(Object.keys(value));
                }
            },
            "class":            {get: function(){return this.__class;},                             set: function(value){if (this.__class != null) this.removeClass(this.__class); this.__class=value; this.addClass(value);}},
            disabled:           {get: function(){return this.__element.disabled;},                  set: function(value){this.__element.disabled=!(!value); this.getEvents("viewupdated").viewupdated(["disabled"]);}},
            display:            {get: function(){return this.__getViewData("style.display")=="";},  set: function(value){this[value?"show":"hide"]();}},
            draggable:          {get: function(){return this.__element.getAttribute("draggable");}, set: function(value){this.__element.setAttribute("draggable", value); this.getEvents("viewupdated").viewupdated(["draggable"]);}},
            enabled:            {get: function(){return !this.__element.disabled;},                 set: function(value){this.__element.disabled=!value; this.getEvents("viewupdated").viewupdated(["disabled"]);}},
            for:                {get: function(){return this.__element.getAttribute("for");},       set: function(value){this.__element.setAttribute("for", value); this.getEvents("viewupdated").viewupdated(["for"]);}},
            id:                 {get: function(){return this.__element.id;},                        set: function(value){this.__element.id=value; this.getEvents("viewupdated").viewupdated(["id"]);}},
            tooltip:            {get: function(){return this.__element.title;},                     set: function(value){this.__element.title = value||""; this.getEvents("viewupdated").viewupdated(["title"]);}}
        });
    }
    function notifyClassEvent(className, exists)
    {
        var event = this.__events.get("class-"+className);
        if (event !== undefined)    event(exists);
    }
    var viewProperties  =
    {
        className:          { reset:    true,   get: function(control){ return control.__element.className; },                                                                                  set: function(control, value){ control.__element.className = value; } },
        innerHTML:          { reset:    true,   get: function(control){ return control.__value !== undefined ? control.__value : control.__element.innerHTML; },                                set: function(control, value){ control.__value = control.__element.innerHTML = value; },                    value: function(control, value){ control.__value = value; } },
        src:                { reset:    true,   get: function(control){ return control.__element.src; },                                                                                        set: function(control, value){ control.__element.src = value; } },
        "style.display":    { reset:    true,   get: function(control){ return control.__element.__display !== undefined ? control.__element.__display : control.__element.style.display; },    set: function(control, value){ control.__element.__display = control.__element.style.display = value; },    value: function(control, value){ control.__element.__display = value; } },
        appendChild:        { reset:    false,  set: function(control, value){ control.__element.appendChild(value); } },
        removeChild:        { reset:    false,  set: function(control, value){ control.__element.removeChild(value); } },
        callback:           { reset:    false,  set: function(control, value){ value.call(control); } },
    };
    Object.defineProperty(control, "__getViewProperty", {value: function(name) { return viewProperties[name]; }});
    Object.defineProperties(control.prototype,
    {
        // fields
        constructor:        {value: control},
        // properties
        bindPath:           {get:   function(){return this.__binder.bindPath||"";},                                                             set:    function(value){this.__binder.bindPath = value;}},
        bind:               {get:   function(){return this.value.bind;}},
        data:               {get:   function(){return this.__binder.data.observe(this.bindPath);}},
        height:             {get:   function(){return this.__element.offsetHeight;},                                                            set:    function(value){console.log("setting height on " + this.getSelectorPath()); this.__element.style.height = parseInt(value)+"px"; this.getEvents("viewupdated").viewupdated(["offsetHeight"]);}},
        isDataRoot:         {get:   function(){return this.__isDataRoot;},                                                                      set:    function(value){Object.defineProperty(this, "__isDataRoot", {value: value===true, configurable: true});}},
        isRoot:             {get:   function(){return this.__forceRoot||this.parent===undefined;},                                              set:    function(value){Object.defineProperty(this, "__forceRoot", {value: value===true, configurable: true});}},
        root:               {get:   function(){return !this.isRoot && this.parent ? this.parent.root : this;}},
        updateon:           {get:   function(){var names = []; each(this.value.onchange,function(e, name){names.push(name);}); return names;},  set:    function(eventNames){ this.value.onchange = this.getEvents(eventNames); }},
        width:              {get:   function(){return this.__element.offsetWidth;},                                                             set:    function(value){console.log("setting width on " + this.getSelectorPath()); this.__element.style.width = parseInt(value)+"px"; this.getEvents("viewupdated").viewupdated(["offsetWidth"]);}},
        // methods
        __createNode:       {value: function(selector)                      { return document.createElement("div"); }, configurable: true},
        __getData:          {value: function()                              { return this.__binder.data; }},
        __getViewData:      {value: function(name)
        {
            var property    = this.constructor.__getViewProperty(name);
            return  this.__viewUpdateQueue[name] !== undefined
                    ?   property.reset
                        ?   this.__viewUpdateQueue[name]
                        :   this.__viewUpdateQueue[name][this.__viewUpdateQueue[name].length-1]
                    :   property.get(this);
        }},
        __setViewData:      {value: function(name, value)
        {
            var property    = this.constructor.__getViewProperty(name);
            if (property.reset) this.__viewUpdateQueue[name]    = value;
            else                (this.__viewUpdateQueue[name]=this.__viewUpdateQueue[name]||[]).push(value);
            if (property.value) property.value(this, value);
            (!this.isRoot ? this.parent : this).__deferViewUpdate(this);
        }},
        __updateView:       {value: function()
        {
            var queue           = this.__viewUpdateQueue;
            Object.defineProperty(this, "__viewUpdateQueue", {value: {}, configurable: true});
            var keys            = Object.keys(queue);
                    
            for(var counter=0;counter<keys.length;counter++)
            {
                var key         = keys[counter];
                var property    = this.constructor.__getViewProperty(key);
                if (property.reset) property.set(this, queue[key]);
                else
                {
                    var operations  = queue[key];
                    while(operations.length > 0)  property.set(this, operations.shift());
                }
            }
            this.getEvents("viewupdated").viewupdated(keys);
        }},
        __reattach:         {value: function()
        {
            this.__elementPlaceholder.parentNode.replaceChild(this.__element, this.__elementPlaceholder); 
            delete this.__elementPlaceholder;
            return this;
        }},
        __setData:          {value: function(data)                          { this.__binder.data = data; }},
        addClass:           {value: function(className, silent)
        {
            var classNames              = this.__getViewData("className").split(" ");
            if (classNames.indexOf(className) === -1) classNames.push(className);
            this.__setViewData("className", classNames.join(" ").trim());
            if (!silent)    notifyClassEvent.call(this, className, true);
            return this;
        }},
        bindClass:          {value: function(className)
        {
            this.__binder.defineDataProperties(this.classes, className, 
            {
                owner:      this,
                get:        function(){return this.hasClass(className);}, 
                set:        function(value){this.toggleClass(className, value===true, true);}, 
                onchange:   [this.__events.getOrAdd("class-"+className)]
            })
        }},
        destroy:            {value: function()
        {
            this.__events.destroy();
            this.__binder.destroy();
            each
            ([
                "__element",
                "__elementPlaceholder",
                "__events",
                "on",
                "__attributes",
                "__selector",
                "parent",
                "__binder",
                "__forceRoot",
                "classes"
            ],
            (function(name)
            {
                Object.defineProperty(this, name, {value: null, configurable: true});
                delete this[name];
            }).bind(this));
            Object.defineProperty(this, "isDestroyed", {value: true});
        }},
        frame:              {value: function(definition)
        {
            addEvents.call(this, definition.events);
            addCustomMembers.call(this, definition.members);

            if (definition.extensions !== undefined && definition.extensions.length !== undefined)
            for(var counter=0;counter<definition.extensions.length;counter++)
            {
                if (definition.extensions[counter] === undefined) throw new Error("Extension was undefined in view adapter with element " + this.__element.__selectorPath+"-"+this.__selector);
                if (definition.extensions[counter].extend !== undefined) definition.extensions[counter].extend.call(this);
            }
            this.__extensions   = definition.extensions;
        }},
        getEvents:          {value: function(eventNames)
        {
            if (!Array.isArray(eventNames)) eventNames  = [eventNames];
            var events  = {};
            each(eventNames, (function(eventName){events[eventName] = this.__events.getOrAdd(eventName);}).bind(this));
            return events;
        }},
        getSelectorPath:    {value: function()                              { return (this.parent === undefined ? "" : this.parent.getSelectorPath() + "-") + (this.__selector||"root"); }},
        hasClass:           {value: function(className)                     { return this.__getViewData("className").split(" ").indexOf(className) > -1; }},
        hasFocus:           {value: function(nested)                        { return document.activeElement == this.__element || (nested && this.__element.contains(document.activeElement)); }},
        hide:               {value: function()                              { this.__setViewData("style.display", "none"); this.triggerEvent("hide"); return this; }},
        initialize:         {value: function(definition)
        {
            for(var initializerKey in initializers)
            if (definition.hasOwnProperty(initializerKey))    initializers[initializerKey](this, definition[initializerKey]);

            if (this.__extensions !== undefined && this.__extensions.length !== undefined)
            for(var counter=0;counter<this.__extensions.length;counter++)   initializeViewAdapterExtension.call(this, definition, this.__extensions[counter]);
            delete this.__extensions;
        }},
        //TODO: ensure that this control is moved to the siblingControl's parent controls set
        insertBefore:       {value: function(siblingControl)                { siblingControl.__element.parentNode.insertBefore(this.__element, siblingControl.__element); return this; }},
        //TODO: ensure that this control is moved to the siblingControl's parent controls set
        insertAfter:        {value: function(siblingControl)                { siblingControl.__element.parentNode.insertBefore(this.__element, siblingControl.__element.nextSibling); return this; }},
        removeClass:        {value: function(className, silent)
        {
            if (className === undefined)
            {
                this.__setViewData("className", "");
                return;
            }
            var classNames              = this.__getViewData("className").split(" ");
            if (classNames.indexOf(className) > -1) removeItemFromArray(classNames, className);
            this.__setViewData("className", classNames.join(" "));
            if (!silent)    notifyClassEvent.call(this, className, false);
            return this;
        }},
        scrollIntoView:     {value: function()                              { this.__element.scrollTop = 0; return this; }},
        select:             {value: function()                              { selectContents(this.__element); return this; }},
        show:               {value: function()                              { this.__setViewData("style.display", ""); this.triggerEvent("show"); return this; }},
        toggleClass:        {value: function(className, condition, silent)  { if (condition === undefined) condition = !this.hasClass(className); return this[condition?"addClass":"removeClass"](className, silent); }},
        toggleEdit:         {value: function(condition)                     { if (condition === undefined) condition = this.__element.getAttribute("contentEditable")!=="true"; this.__element.setAttribute("contentEditable", condition); this.getEvents("viewupdated").viewupdated(["contentEditable"]); return this; }},
        toggleDisplay:      {value: function(condition)                     { if (condition === undefined) condition = this.__getViewData("style.display")=="none"; this[condition?"show":"hide"](); return this; }},
        triggerEvent:       {value: function(eventName)                     { var args = Array.prototype.slice(arguments, 1); this.__events.getOrAdd(eventName).invoke(args); return this; }}
    });
    each(["blur","click","focus"],function(name){Object.defineProperty(control.prototype,name,{value:function(){this.__setViewData("callback", function(){this.__setViewData("callback", function(){this.__element[name]();});}); return this;}});});
    function defineFor(on,off){Object.defineProperty(control.prototype,on+"For",{value:function()
    {
        var args            = Array.prototype.slice.call(arguments, 0, arguments.length-2),
            milliseconds    = arguments[0],
            onComplete      = arguments[1];
        this[on].apply(this, args);
        setTimeout
        (
            (function()
            {
                this[off].apply(this, args);
                if (onComplete !== undefined) onComplete();
            }).bind(this),
            milliseconds
        ); 
        return this;
    }});}
    each([["addClass","removeClass"],["show","hide"]],function(names){defineFor(names[0], names[1]);defineFor(names[1],names[0]);});
    each(["addEvent","removeEvent"],function(name)
    {
        Object.defineProperty
        (
            control.prototype,
            name+"Listener",
            {value: function(eventName, listener, withCapture, notifyEarly)
            {
                this.__events.getOrAdd(eventName, withCapture).listen(listener, notifyEarly);
                return this;
            }}
        );
        Object.defineProperty
        (
            control.prototype,
            name+"sListener",
            {value: function(eventNames, listener, withCapture, notifyEarly)
            {
                each(eventNames, (function(eventName)
                {
                    this.addEventListener(eventName, listener, withCapture, notifyEarly); 
                }).bind(this));
                return this;
            }}
        );
    });
    return control;
});}();