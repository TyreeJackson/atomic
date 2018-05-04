!function()
{"use strict";
    function __namespace() {}
    function define(fullName, item) { namespace(this, fullName, item); }
    Object.defineProperty(__namespace.prototype, "define", {value:define});
    var __root  = new __namespace();
    function getNamespace(root, paths)
    {
        var current     = root;
        for(var pathCounter=0;pathCounter<paths.length-1;pathCounter++)
        {
            var path    = paths[pathCounter];
            if (current[path] === undefined)    Object.defineProperty(current, path, {value: new __namespace()});
            current     = current[path];
        }
        return current;
    }
    function namespace(root, fullName, value)
    {
        var paths                   = fullName.split(".");
        var namespace               = getNamespace(root, paths);
        if (value === undefined)    return namespace[paths[paths.length-1]];
        Object.defineProperty(namespace, [paths[paths.length-1]], {value: value});
    }
    Object.defineProperty(__namespace.prototype, "$isNamespace", {value: true});
    window.root = window.root || __root;
}();
!function()
{"use strict";
    root.define("utilities.each", function each(array, callback)
    {
        if      (Array.isArray(array))  for(var arrayCounter=0;arrayCounter<array.length;arrayCounter++)    callback(array[arrayCounter], arrayCounter);
        else if (array !== undefined)
        {
            var keys    = Object.keys(array);
            for(var keyCounter=0;keyCounter<keys.length;keyCounter++)
            {
                var key = keys[keyCounter];
                callback(array[key], key);
            }
        }
    });
    root.define("utilities.removeFromArray", function removeFromArray(array, from, to)
    {
        if (from == -1) return;
        var rest        = array.slice((to || from) + 1 || array.length);
        array.length    = from < 0 ? array.length + from : from;
        return array.push.apply(array, rest);
    });
    (function pubSubContext()
    {
        var pubSub;
        function buildConstructor(isolatedFunctionFactory, removeItemFromArray)
        {
            var functionFactory = new isolatedFunctionFactory();
            var pubSub          =
            functionFactory.create
            (function pubSub(listenersChanged)
            {
                Object.defineProperties(this, 
                {
                    "__listenersChanged":   {value: listenersChanged, configurable: true},
                    "__listeners":          {value: [], configurable: true},
                    "__lastPublished":      {writable: true, value: null},
                    "__publishTimeoutId":   {writable: true, value: null},
                    "limit":                {writable: true, value: null}
                });
                return this;
            });
            Object.defineProperties(functionFactory.root.prototype,
            {
                ___invoke:                  {value: function()
                {
                    var publish = (function(args)
                    {
                        this.__publishTimeoutId = null;
                        this.__lastPublished    = new Number(new Date());
                        if (this.__listeners === undefined) debugger;
                        for(var listenerCounter=0;listenerCounter<this.__listeners.length;listenerCounter++) this.__listeners[listenerCounter].apply(null, args);
                    }).bind(this, arguments);

                    if (this.__publishTimeoutId != null)
                    {
                        clearTimeout(this.__publishTimeoutId);
                        this.__publishTimeoutId = null;
                    }
                    var now         = new Number(new Date());
                    var limitOffset = (this.__lastPublished||0) + (this.limit||0);

                    if (now>=limitOffset)   publish();
                    else                    this.__publishTimeoutId = setTimeout(publish, limitOffset-now);
                }},
                destroy:
                {value: function()
                {
                    this.pubsub.destroy();
                    each
                    ([
                        "__listenersChanged",
                        "__listeners"
                    ],
                    (function(name)
                    {
                        Object.defineProperty(this, name, {value: null, configurable: true});
                        delete this[name];
                    }).bind(this));
                }},
                "__notifyListenersChanged": {value: function(){if (typeof this.__listenersChanged === "function") this.__listenersChanged(this.__listeners.length);}},
                listen:                     {value: function(listener, notifyEarly) { this.__listeners[notifyEarly?"unshift":"push"](listener); this.__notifyListenersChanged(); }},
                ignore:                     {value: function(listener)              { removeItemFromArray(this.__listeners, listener); this.__notifyListenersChanged(); }},
                invoke:                     {value: function(){this.apply(this, arguments);}}
            });
            return pubSub;
        }
        root.define("utilities.pubSub", function(isolatedFunctionFactory, removeItemFromArray)
        {
            if (pubSub === undefined)   pubSub = buildConstructor(isolatedFunctionFactory, removeItemFromArray);
            return pubSub;
        });
    })();
    root.define("utilities.removeItemFromArray", function removeItemFromArray(array, item){ root.utilities.removeFromArray(array, array.indexOf(item)); });
}();
!function(){"use strict";root.define("atomic.html.eventsSet", function eventsSet(pubSub, each)
{
    function listenerList(target, eventName, withCapture)
    {
        Object.defineProperties(this,
        {
            "__eventName":      {value: eventName},
            "__target":         {value: target},
            "__withCapture":    {value: withCapture},
            pubSub:             {value: new pubSub((this.__listenersChanged).bind(this))}
        });
    }
    Object.defineProperties(listenerList.prototype,
    {
        "__listenersChanged":   {value: function(listenerCount)
        {
            if (listenerCount > 0 && !this.__isAttached)
            {
                this.__target.__element.addEventListener(this.__eventName, this.pubSub, this.__withCapture);
                Object.defineProperty(this, "__isAttached", {value: true, configurable: true});
            }
            else    if(listenerCount == 0 && this.__isAttached)
            {
                this.__target.__element.removeEventListener(this.__eventName, this.pubSub, this.__withCapture);
                Object.defineProperty(this, "__isAttached", {value: false, configurable: true});
            }
        }},
        destroy:
        {value: function()
        {
            this.__target.__element.removeEventListener(this.__eventName, this.pubSub, this.__withCapture);
            this.pubSub.destroy();
            each
            ([
                "pubsub",
                "__target"
            ],
            (function(name)
            {
                Object.defineProperty(this, name, {value: null, configurable: true});
                delete this[name];
            }).bind(this));
        }}
    });
    function eventsSet(target)
    {
        Object.defineProperties(this,
        {
            "__target":                     {value: target, configurable: true}, 
            "__listenersUsingCapture":      {value:{}, configurable: true}, 
            "__listenersNotUsingCapture":   {value:{}, configurable: true}
        });
    }
    function getListener(name, withCapture, add)
    {
        var listeners       = withCapture ? this.__listenersUsingCapture : this.__listenersNotUsingCapture;
        var eventListeners  = listeners[name];
        if (add && eventListeners === undefined)    Object.defineProperty(listeners, name, {value: eventListeners=new listenerList(this.__target, name, withCapture)});
        return eventListeners&&eventListeners.pubSub;
    }
    Object.defineProperties(eventsSet.prototype,
    {
        getOrAdd:   {value: function(name, withCapture){ return getListener.call(this, name, withCapture, true); }},
        get:        {value: function(name, withCapture){ return getListener.call(this, name, withCapture, false); }},
        destroy:
        {value: function()
        {
            each
            ([
                "__listenersUsingCapture",
                "__listenersNotUsingCapture"
            ],
            (function(listener)
            {
                each
                (this[listener],
                (function(name)
                {
                    this[listener][name].destroy();
                    Object.defineProperty(this[listener], name, {value: null, configurable: true});
                    delete this[listener][name];
                }).bind(this));
            }).bind(this));

            each
            ([
                "__target",
                "__listenersUsingCapture",
                "__listenersNotUsingCapture"
            ],
            (function(name)
            {
                Object.defineProperty(this, name, {value: null, configurable: true});
                delete this[name];
            }).bind(this));
        }}
    });
    return eventsSet;
});}();
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
            //__observer:             {value: new MutationObserver((function(mutations){ mutations.forEach((function(mutation){ console.log(callbackCounter + " - " + (logCounter++) + ". " + this.__selectorPath + ": " + mutation.type + "[" + (mutation.type == "childList" ? (mutation.addedNodes.length + "/" + mutation.removedNodes.length) : mutation.attributeName) + "]", mutation); }).bind(this)); callbackCounter++; }).bind(this)), configurable: true},
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
            //bindPath:               {value: bindPath, configurable: true} //parent == null || parent.basePath == null ? "" : parent.basePath + (parent.basePath.length>0 && parentBind.length>0 ? "." : "") + parentBind
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

        //this.__observer.observe(this.__element, { attributes: false, childList: true, characterData: true });
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
            //this.__observer.disconnect();
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
                //"__observer"
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
!function(){"use strict";root.define("atomic.html.readonly", function htmlReadOnly(control, each)
{
    function readonly(elements, selector, parent, bindPath)
    {
        control.call(this, elements, selector, parent, bindPath);
        Object.defineProperty(this, "__elements", {value: Array.prototype.slice.call(parent.__element.querySelectorAll(selector)), configurable: true});
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
                    {
                        for(var key in value)
                        {
                            for(var counter=0;counter<this.__elements.length;counter++) this.__elements[counter].setAttribute("data-"+key, value[key]);
                        }
                        this.getEvents("viewupdated").viewupdated(Object.keys(value));
                    }
                }
            },
            disabled:           {get: function(){return this.__element.disabled;},                  set: function(value){each(this.__elements, function(element){element.disabled = !(!value);}); this.__element.disabled=!(!value); this.getEvents("viewupdated").viewupdated(["disabled"]);}},
            display:            {get: function(){return this.__getViewData("styles.display")=="";}, set: function(value){this[value?"show":"hide"]();}},
            enabled:            {get: function(){return !this.__element.disabled;},                 set: function(value){each(this.__elements, function(element){element.disabled = !value;}); this.__element.disabled=!value; this.getEvents("viewupdated").viewupdated(["disabled"]);}},
            tooltip:            {get: function(){return this.__element.title;},                     set: function(value){var val = value&&value.isObserver?value():(value||""); each(this.__elements, function(element){element.title = val;}); this.__element.title = val; this.getEvents("viewupdated").viewupdated(["title"]);}},
            value:              {get: function(){return this.__getViewData("innerHTMLs");},         set: function(value){this.__setViewData("innerHTMLs", value);}}
        });
    }
    Object.defineProperty(readonly, "prototype", {value: Object.create(control.prototype)});
    var viewProperties  =
    {
        innerHTMLs:         { reset:    false,  get: function(control){ return control.__value !== undefined ? control.__value : control.__element.innerHTML; },                                set: function(control, value){ var val = value&&value.isObserver?value():value; control.__value=val; for(var counter=0;counter<control.__elements.length;counter++) control.__elements[counter].innerHTML = val; control.__value = control.__element.innerHTML = val;}, value: function(control, value){ control.__value = value; } },
        "styles.display":   { reset:    true,   get: function(control){ return control.__element.__display !== undefined ? control.__element.__display : control.__element.style.display; },    set: function(control, value){ for(var counter=0;counter<control.__elements.length;counter++) control.__elements[counter].style.display=value; control.__element.__display = control.__element.style.display=value; },                                                  value: function(control, value){ control.__element.__display = value; } }
    };
    Object.defineProperty(readonly, "__getViewProperty", {value: function(name) { return viewProperties[name]||control.__getViewProperty(name); }});
    Object.defineProperties(readonly.prototype,
    {
        constructor:    {value: readonly},
        __createNode:   {value: function(){return document.createElement("span");}, configurable: true},
        hide:           {value: function(){this.__setViewData("styles.display", "none"); this.triggerEvent("hide"); return this;}},
        show:           {value: function(){this.__setViewData("styles.display", ""); this.triggerEvent("show"); return this;}},
        toggleDisplay:  {value: function(condition) { if (condition === undefined) condition = this.__getViewData("styles.display")=="none"; this[condition?"show":"hide"](); return this; }},
    });
    return readonly;
});}();
!function(){"use strict";root.define("atomic.html.label", function htmlLabel(control, each)
{
    function label(elements, selector, parent, bindPath)
    {
        control.call(this, elements, selector, parent, bindPath);
        Object.defineProperty(this, "__elements", {value: Array.prototype.slice.call(parent.__element.querySelectorAll(selector)), configurable: true});
        this.__binder.defineDataProperties(this,
        {
            for:                {get: function(){return this.__element.getAttribute("for");},   set: function(value){each(this.__elements, function(element){element.setAttribute("for", value);}); this.__element.setAttribute("for", value); this.getEvents("viewupdated").viewupdated(["for"]);}}
        });
    }
    Object.defineProperty(label, "prototype", {value: Object.create(control.prototype)});
    Object.defineProperty(label, "__getViewProperty", {value: function(name) { return control.__getViewProperty(name); }});
    Object.defineProperties(label.prototype,
    {
        constructor:    {value: label},
        __createNode:   {value: function(){return document.createElement("label");}, configurable: true},
        __addSpacing:   {value: true}
    });
    return label;
});}();
!function(){"use strict";root.define("atomic.html.link", function htmlLink(base, each)
{
    function link(elements, selector, parent, bindPath)
    {
        base.call(this, elements, selector, parent, bindPath);
        this.__binder.defineDataProperties(this,
        {
            href: {get: function(){return this.__element.href;}, set: function(value){var val = value&&value.isObserver?value():value; each(this.__elements, function(element){element.href = val;}); this.__element.href = val; this.getEvents("viewupdated").viewupdated(["href"]);}}
        });
    }
    Object.defineProperty(link, "prototype", {value: Object.create(base.prototype)});
    Object.defineProperty(link, "__getViewProperty", {value: function(name) { return base.__getViewProperty(name); }});
    Object.defineProperties(link.prototype,
    {
        constructor:    {value: link},
        __createNode:   {value: function(){return document.createElement("a");}, configurable: true}
    });
    return link;
});}();
!function(){"use strict";root.define("atomic.html.container", function htmlContainer(control, observer, each, viewAdapterFactory, removeItemFromArray)
{
    var elementControlTypes =
    {
        "input":                    "input",
        "input:checkbox":           "checkbox",
        "textarea":                 "input",
        "img":                      "image",
        "audio":                    "audio",
        "video":                    "video",
        "select:select-multiple":   "multiselect",
        "select:select-one":        "select",
        "radiogroup":               "radiogroup",
        "checkboxgroup":            "checkboxgroup",
        "a":                        "link",
        "label":                    "label"
    };
    each(["default","abbr","address","article","aside","b","bdi","blockquote","body","caption","cite","code","col","colgroup","dd","del","details","dfn","dialog","div","dl","dt","em","fieldset","figcaption","figure","footer","h1","h2","h3","h4","h5","h6","header","i","ins","kbd","legend","li","menu","main","mark","menuitem","meter","nav","ol","optgroup","p","pre","q","rp","rt","ruby","section","s","samp","small","span","strong","sub","summary","sup","table","tbody","td","tfoot","th","thead","time","title","tr","u","ul","wbr"],
    function(name)
    {
        elementControlTypes[name]   = "readonly";
    });
    function getControlTypeForElement(definition, element, multipleElements)
    {
        return  definition.type
                ||
                (definition.controls || definition.adapter
                ?   element !== undefined && element.nodeName.toLowerCase() == "a"
                    ?   "linkPanel"
                    :   "panel"
                :   definition.repeat
                    ?   "repeater"
                    :   element !== undefined
                        ?   multipleElements
                            ?   element.nodeName.toLowerCase() == "a"
                                ?   "link"
                                :   "readonly"
                            :   elementControlTypes[element.nodeName.toLowerCase() + (element.type ? ":" + element.type.toLowerCase() : "")]||elementControlTypes[element.nodeName.toLowerCase()]||elementControlTypes.default
                        :   elementControlTypes.default);
    }
    function container(elements, selector, parent, bindPath)
    {
        control.call(this, elements, selector, parent, bindPath);
        Object.defineProperties(this,
        {
            __controlKeys:      {value: [], configurable: true},
            controlData:        {value: new observer({}), configurable: true},
            controls:           {value: {}, configurable: true},
            __bindPath:         {value: bindPath, configurable: true},
            __extendedBindPath: {value: "", configurable: true},
            __controlsToUpdate: {value: {}, configurable: true}
        });
    }
    function forwardProperty(propertyKey, property)
    {
        var propertyValue   = property.call(this);
        if (this.__customBind && propertyValue.isDataProperty)  this.__binder.defineDataProperties(this, propertyKey, {get: function(){return propertyValue();}, set: function(value){propertyValue(value);}, onchange: propertyValue.onchange});
        else                                                    Object.defineProperty(this, propertyKey, {value: propertyValue});
    }
    function buildGet(property)                     { return function(){return this.controlData(property);} }
    function buildSet(property)                     { return function(value){this.controlData(property, value);} }
    Object.defineProperty(container, "prototype", {value: Object.create(control.prototype)});
    Object.defineProperty(container, "__getViewProperty", {value: function(name) { return control.__getViewProperty(name); }});
    Object.defineProperties(container.prototype,
    {
        __cancelViewUpdate:     {value: function()
        {
            if (this.__updateViewTimerId !== undefined)
            {
                clearTimeout(this.__updateViewTimerId);
                delete this.__updateViewTimerId;
            }
        }},
        __deferViewUpdate:      {value: function(control)
        {
            if (this.isDestroyed)   return;
            if (control !== this)   this.__controlsToUpdate[control.__childKey] = control;
            if (control !== this && control.__childKey === undefined)   debugger;

            if (!this.isRoot)       this.parent.__deferViewUpdate(this);
            else
            {
                this.__cancelViewUpdate();
                this.__updateViewTimerId    = setTimeout((function(){ this.__updateView(true); }).bind(this), 0);
            }
        }},
        __updateView:           {value: function(detach)
        {
            this.__cancelViewUpdate();
            if (this.isDestroyed)   return;
            var queue           = this.__controlsToUpdate;
            Object.defineProperty(this, "__controlsToUpdate", {value: {}, configurable: true});
            var keys            = Object.keys(queue);
            var detachLocally   = detach && keys.length > 1;
            if (detachLocally)  {this.__element.style.display    = "none";}
                    
            control.prototype.__updateView.call(this);
            for(var counter=0;counter<keys.length;counter++)    queue[keys[counter]].__updateView(detach && !detachLocally);

            if (detachLocally)  this.__element.style.display    = this.__getViewData("style.display");
        }},
        __getData:              {value: function()
        {
            return this.__customBind ? this.controlData : this.__binder.data;
        }},
        __setData:              {value: function(data)
        {
            this.__binder.data = data; 
            var childControls   = this.children;
            var childData       = this.__getData();
            if (childControls != null)  each(childControls, function(child){child.__setData(childData);});
        }},
        __setExtendedBindPath:  {value: function(path)
        {
            Object.defineProperty(this, "__extendedBindPath", {value: path||"", configurable: true});
        }},
        bind:                   {get:   function(){var bind = this.value.bind; if (bind !== undefined && typeof bind !== "string") throw new Error("You may only use simple bindings on containers.  Please consider using a computed property on the observer instead."); return bind;}},
        constructor:            {value: container},
        appendControl:          {value: function(key, childControl)
        {
            this.__element.appendChild(childControl.__element); 
            this.__controlKeys.push(key);
            this.controls[key] = childControl;
            this.getEvents("viewupdated").viewupdated(["innerHTML"]);
            return this;
        }},
        addControl:             {value: function(controlKey, controlDeclaration)
        {console.warn("The `addControl` method maybe deprecated soon.");
            if (controlDeclaration === undefined)  return;
            var control;
            // hack: This feels hacky.  Think this through and see if there is a better way to do incorporate the controlDeclaration.bind into the bind path.
            var bindPath    = this.bindPath + (this.bindPath.length > 0 && this.__extendedBindPath.length > 0 ? "." : "") + this.__extendedBindPath;
            this.appendControl(controlKey, control = this.createControl(controlDeclaration, undefined, "#" + controlKey, controlKey, bindPath + (bindPath.length > 0 && controlDeclaration.bind.length > 0 ? "." : "") + controlDeclaration.bind));
            if (this.data !== undefined)    this.controls[controlKey].__setData(this.__getData());
            return control;
        }},
        attachControls:         {value: function(controlDeclarations)
        {
            if (controlDeclarations === undefined)  return;
            var selectorPath    = this.getSelectorPath();
            for(var controlKey in controlDeclarations)
            {
                this.__controlKeys.push(controlKey);
                var declaration = controlDeclarations[controlKey];
                var selector    = (declaration.selector||("#"+controlKey));
                var elements    = viewAdapterFactory.selectAll(this.__element, selector, selectorPath);
                var control     = this.controls[controlKey] = this.createControl(declaration, elements&&elements[0], selector, controlKey, this.bindPath + (this.bindPath.length > 0 && this.__extendedBindPath.length > 0 ? "." : "") + this.__extendedBindPath, elements && elements.length > 1);
            }
            var data            = this.__getData();
            if (data !== undefined) for(var controlKey in controlDeclarations)  this.controls[controlKey].__setData(data);
        }},
        attachProperties:       {value: function(propertyDeclarations)
        {
            if (propertyDeclarations === undefined) return;
            for(var propertyKey in propertyDeclarations)
            {
                var property    = propertyDeclarations[propertyKey];
                if (typeof property === "function")         forwardProperty.call(this, propertyKey, property);
                else    if (typeof property === "string")   this.__binder.defineDataProperties(this, propertyKey, { get: buildGet(property),   set: buildSet(property) });
                else    if (property.bound === true)        this.__binder.defineDataProperties(this, propertyKey, {get: typeof property.get === "string" ? buildGet(property) : property.get, set: typeof property.set === "string" ? buildSet(property) : property.set, onchange: this.getEvents(property.onchange||"change"), onupdate: property.onupdate, delay: property.delay});
                else                                        Object.defineProperty(this, propertyKey, {get: property.get, set: property.set});
            }
        }},
        children:               {get: function(){return this.controls || null;}},
        createControl:          {value: function(controlDeclaration, controlElement, selector, controlKey, bindPath, multipleElements, preConstruct)
        {
            var control;
            if (controlDeclaration.factory !== undefined)
            {
                control = controlDeclaration.factory(this, controlElement, selector, controlKey, bindPath);
            }
            else    control = viewAdapterFactory.create
            ({
                definitionConstructor:  controlDeclaration.adapter||function(){ return controlDeclaration; },
                viewElement:            controlElement,
                parent:                 this,
                selector:               selector,
                controlKey:             controlKey,
                controlType:            getControlTypeForElement(controlDeclaration, controlElement, multipleElements),
                preConstruct:           preConstruct,
                bindPath:               bindPath
            });
            control.initialize(controlDeclaration);
            return control;
        }},
        destroy:                {value: function()
        {
            each(this.controls, function(control){control.destroy();});
            each
            ([
                "__controlKeys",
                "controls"
            ],
            (function(name)
            {
                Object.defineProperty(this, name, {value: null, configurable: true});
                delete this[name];
            }).bind(this));
            control.prototype.destroy.call(this);
        }},
        frame:                  {value: function(definition)
        {
            Object.defineProperty(this, "__customBind", {value: definition.customBind === true, configurable: true});
            control.prototype.frame.call(this, definition);
            var binding =   definition.bind !== undefined && definition.bind !== null
                            ?   typeof definition.bind === "object" && definition.bind.value !== undefined && definition.bind.value !== null
                                ?   typeof definition.bind.value === "object" && definition.bind.value.to !== undefined && definition.bind.value.to !== null
                                    ?   definition.bind.value.to
                                    :   definition.bind.value
                                :   definition.bind
                            :   null;
            if (typeof binding === "function")      throw new Error("Function based value bindings are no longer supported on containers.  Please switch to binding to a computed property on the observer.  Path: "+ this.getSelectorPath());
            else if (typeof binding === "string")   {this.__setExtendedBindPath(binding);}

            this.attachControls(definition.controls, this.__element);
            this.attachProperties(definition.properties);
        }},
        removeControl:          {value: function(key)
        {console.warn("The `removeControl` method maybe deprecated soon.");
            var childControl    = this.controls[key];
            if (childControl !== undefined)
            {
                this.__element.removeChild(childControl.__element);
                delete this.controls[key];
            }
            removeItemFromArray(this.__controlKeys, key);
            this.getEvents("viewupdated").viewupdated(["innerHTML"]);
            return this;
        }},
        value:                  {value: {listen: function(){}}, configurable: true}
    });
    return container;
});}();
!function(){"use strict";root.define("atomic.html.panel", function htmlPanel(container, each)
{
    function panel(elements, selector, parent, bindPath)
    {
        container.call(this, elements, selector, parent, bindPath);
    }
    Object.defineProperty(panel, "prototype", {value: Object.create(container.prototype)});
    Object.defineProperty(panel, "__getViewProperty", {value: function(name) { return container.__getViewProperty(name); }});
    Object.defineProperties(panel.prototype,
    {
        constructor:        {value: panel},
        frame:              {value: function(definition)
        {
            container.prototype.frame.call(this, definition);
        }}
    });
    return panel;
});}();
!function(){"use strict";root.define("atomic.html.screen", function htmlScreen(panel, observer)
{
    function screen(elements, selector, parent, bindPath)
    {
        panel.call(this, elements, selector, parent, bindPath);
        this.__setData(new observer({}));
    }
    Object.defineProperty(screen, "prototype", {value: Object.create(panel.prototype)});
    Object.defineProperty(screen, "__getViewProperty", {value: function(name) { return panel.__getViewProperty(name); }});
    Object.defineProperties(screen.prototype,
    {
        constructor:        {value: screen}
    });
    return screen;
});}();
!function(){"use strict";root.define("atomic.html.composite", function htmlComposite(base, each, observer)
{
    function composite(elements, selector, parent, bindPath)
    {
        base.call(this, elements, selector, parent, bindPath);
    }
    Object.defineProperty(composite, "prototype", {value: Object.create(base.prototype)});
    Object.defineProperty(composite, "__getViewProperty", {value: function(name) { return base.__getViewProperty(name); }});
    Object.defineProperties(composite.prototype,
    {
        constructor:        {value: composite},
        frame:              {value: function(definition)
        {
            base.prototype.frame.call(this, definition);
        }}
    });
    return composite;
});}();
!function(){"use strict";root.define("atomic.html.repeater", function htmlRepeater(control, removeFromArray)
{
    var querySelector       =
    function(uiElement, selector, selectorPath, typeHint)
    {
        return uiElement.querySelector(selector)||document.createElement("div");
    };
    function removeAllElementChildren(element)
    {
        while(element.lastChild)    element.removeChild(element.lastChild);
    }
    function extractDeferredControls(templateDeclarations, viewElement)
    {
        if (templateDeclarations === undefined) return;
        for(var templateKey in templateDeclarations)
        {
            this.__templateKeys.push(templateKey);
            var templateDeclaration                         = templateDeclarations[templateKey];
            if (templateDeclaration.getKey === undefined)   templateDeclaration.getKey = function(data){return this.parent.__selector+"-"+this.__selector+"-"+this.index;}
            var templateElement                             = querySelector(viewElement, (templateDeclaration.selector||("#"+templateKey)), this.getSelectorPath());
            var templateElementParent                       = templateElement.parentNode;
            if (templateElementParent !== null)             templateElementParent.removeChild(templateElement);
            this.__templateContainers[templateKey]          = templateElementParent;
            this.__templates[templateKey]                   =
            {
                parent:         templateElementParent||viewElement,
                declaration:    templateDeclaration,
                element:        templateElement
            };
        }
        for(var templateKey in templateDeclarations)
        {
            removeAllElementChildren(this.__templates[templateKey].parent);
        }
    }
    function removeListItem(itemIndex)
    {
        for(var templateKeyCounter=0;templateKeyCounter<this.__templateKeys.length;templateKeyCounter++)
        {
            var templateKey     = this.__templateKeys[templateKeyCounter] + "_" + itemIndex;
            var repeatedControl = this.__repeatedControls[templateKey];
            if (repeatedControl !== undefined)
            {
                this.__retained[templateKey]    = repeatedControl;
                repeatedControl.__element.parentNode.removeChild(repeatedControl.__element);
                repeatedControl.__setData(null);
            }
        }
        this.getEvents("viewupdated").viewupdated(["innerHTML"]);
    }
    function collectGarbage()
    {
        var garbage     = this.__retained;
        Object.defineProperty(this, "__retained", {});
        var keys        = Object.keys(garbage);
        var keyCounter  = keys.length-1;
        function collectGarbagePage()
        {
            var lowerBound  = keyCounter-10 > -1 ? keyCounter - 10 : -1;
            for(var counter=keyCounter;counter>lowerBound;counter--)
            {
                var key = keys[counter];
                //console.log("Collected: " + garbage[key].__selector);
                garbage[key].destroy();
                delete  garbage[key];
            }
            keyCounter      = lowerBound;
            if (keyCounter > 0) setTimeout(collectGarbagePage, 10);
        }
        collectGarbagePage();
    }
    function resetGarbageCollector()
    {
        if (this.__gcID !== undefined)
        {
            clearTimeout(this.__gcID);
            Object.defineProperty(this, "__gcID", {writable: true, configurable: true});
            delete this.__gcID;
        }
        Object.defineProperty(this, "__gcID", {value: setTimeout(collectGarbage.bind(this), 180000), configurable: true});
    }
    function addListItem(itemIndex, documentFragments)
    {
        for(var templateKeyCounter=0;templateKeyCounter<this.__templateKeys.length;templateKeyCounter++)
        {
            var templateKey = this.__templateKeys[templateKeyCounter];
            var clone       = getTemplateCopy.call(this, templateKey, itemIndex);
            if (clone !== undefined)
            {
                this.__repeatedControls[templateKey + "_" + itemIndex]  = clone.control;
                documentFragments[templateKey].appendChild(clone.control.__element);
                parent                              = clone.parent;
            }
        }
        this.getEvents("viewupdated").viewupdated(["innerHTML"]);
    }
    function getRetainedTemplateCopy(itemKey)
    {
        if (this.__retained[itemKey])
        {
            var item    = this.__retained[itemKey];
            delete this.__retained[itemKey];
            //console.log("recycled: " + item.__selector)
            return item;
        }
        return null;
    }
    function createTemplateCopy(templateKey, template, itemIndex, itemKey)
    {
        var elementCopy = template.element.cloneNode(true);
        elementCopy.setAttribute("id", itemKey);
        var bindPath    = this.bindPath + (this.bindPath.length > 0 && this.__extendedBindPath.length > 0 ? "." : "") + this.__extendedBindPath;
        var clone       = { key: itemKey, parent: template.parent, control: this.createControl(template.declaration, elementCopy, "#" + itemKey, itemKey, bindPath + (bindPath.length > 0 ? "." : "") + itemIndex) };
        Object.defineProperty(clone.control, "__templateKey", {value: templateKey});
        //console.log("created: " + clone.control.__selector)
        return clone;
    }
    function getTemplateCopy(templateKey, itemIndex)
    {
        var itemKey         = templateKey+"_"+itemIndex;
        var template        = this.__templates[templateKey];
        if (template.declaration.skipItem !== undefined && template.declaration.skipItem(subDataItem))    return;

        var retainedControl = getRetainedTemplateCopy.call(this, itemKey);
        var clone           = retainedControl !== null ? { key: itemKey, parent: template.parent, control: retainedControl } : createTemplateCopy.call(this, templateKey, template, itemIndex, itemKey);
        var data            = this.__getData();
        if (data !== undefined) clone.control.__setData(data);
        return clone;
    };
    function refreshList(itemCount)
    {
        itemCount   = itemCount||0;
        if (isNaN(itemCount) || itemCount === (this.__itemCount))    return;
        if (this.__itemCount > itemCount)
        {
            for(var counter=this.__itemCount-1;counter>=itemCount;counter--)   removeListItem.call(this, counter);
            resetGarbageCollector.call(this);
        }
        else if (this.__itemCount < itemCount)
        {
            var documentFragments   = createTemplateContainerDocumentFragments.call(this);
            for(var counter=this.__itemCount;counter<itemCount;counter++)   addListItem.call(this, counter, documentFragments.byKey);
            attachTemplateContainerDocumentFragments.call(this, documentFragments);
        }
        Object.defineProperty(this, "__itemCount", {value: itemCount, configurable: true});
    }
    function getSharedTemplateContainerKey(templateKey)
    {
        var templateContainer   = this.__templateContainers[templateKey];
        for(var counter=0;counter<this.__templateKeys.length;counter++)
        {
            var compareKey  = this.__templateKeys[counter];
            if (compareKey == templateKey)                                  return null;
            if (this.__templateContainers[compareKey] == templateContainer) return compareKey;
        }
    }
    function createTemplateContainerDocumentFragments()
    {
        var documentFragments                           = {byKey: {}, unique: {}};
        for(var counter=0;counter<this.__templateKeys.length;counter++)
        {
            var templateKey                             = this.__templateKeys[counter];
            var sharedContainerKey                      = getSharedTemplateContainerKey.call(this, templateKey);
            if (sharedContainerKey == null)
            {
                var documentFragment                    = document.createDocumentFragment();
                documentFragments.byKey[templateKey]    = documentFragment;
                documentFragments.unique[templateKey]   = documentFragment;
            }
            else
            {
                documentFragments.byKey[templateKey]    = documentFragments.byKey[sharedContainerKey];
            }
        }
        return documentFragments;
    }
    function attachTemplateContainerDocumentFragments(documentFragments)
    {
        this.__setViewData("callback", function()
        {for(var counter=0;counter<this.__templateKeys.length;counter++)
        {
            var templateKey = this.__templateKeys[counter];
            delete documentFragments.byKey[templateKey];
            if(documentFragments.unique[templateKey])
            {
                this.__templateContainers[templateKey].appendChild(documentFragments.unique[templateKey]);
                delete documentFragments.unique[templateKey];
            }
        }});
    }
    function repeater(elements, selector, parent, bindPath)
    {
        control.call(this, elements, selector, parent, bindPath);
        Object.defineProperties(this,
        {
            __templateKeys:         {value: [], configurable: true},
            __templates:            {value: {}, configurable: true},
            __templateContainers:   {value: {}, configurable: true},
            __retained:             {value: {}, configurable: true},
            __itemCount:            {value: 0, configurable: true},
            __repeatedControls:     {value: {}, configurable: true}
        });
        this.__binder.defineDataProperties(this,
        {
            value:  {get: function(){return this.__value;}, set: function(value){this.__value = value; refreshList.call(this, value!=undefined&&value.isObserver?value().length:0);}, simpleBindingsOnly: true}
        });
        this.value.listen({bind: ""});
    }
    Object.defineProperty(repeater, "prototype", {value: Object.create(control.prototype)});
    Object.defineProperty(repeater, "__getViewProperty", {value: function(name) { return control.__getViewProperty(name); }});
    Object.defineProperties(repeater.prototype,
    {
        constructor:                {value: repeater},
        frame:                      {value: function(definition)
        {
            extractDeferredControls.call(this, definition.repeat, this.__element);
            control.prototype.frame.call(this, definition);
        }},
        children:   {get: function(){return this.__repeatedControls || null;}},
        pageSize:   {get: function(){return this.__pageSize;}, set: function(value){this.__pageSize = value;}}
    });
    return repeater;
});}();
!function(){"use strict";root.define("atomic.html.input", function htmlInput(control)
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
        if (this.onchangingdelay !== undefined)
        {
            if (this.__lastChangingTimeout !== undefined)   clearTimeout(this.__lastChangingTimeout);
            this.__lastChangingTimeout  = setTimeout(notifyIfValueHasChanged.bind(this, callback), this.onchangingdelay);
        }
        else    notifyIfValueHasChanged.call(this, callback);
    }
    function input(elements, selector, parent, bindPath)
    {
        control.call(this, elements, selector, parent, bindPath);
        this.__binder.defineDataProperties(this,
        {
            value:  {get: function(){return this.__element.value;}, set: function(value){this.__element.value = value||""; this.getEvents("viewupdated").viewupdated(["value"]);},    onchange: this.getEvents("change")}
        });
    }
    Object.defineProperty(input, "prototype", {value: Object.create(control.prototype)});
    Object.defineProperty(input, "__getViewProperty", {value: function(name) { return control.__getViewProperty(name); }});
    Object.defineProperties(input.prototype,
    {
        constructor:        {value: input},
        __createNode:       {value: function(){var element = document.createElement("input"); element.type="textbox"; return element;}, configurable: true},
        select:             {value: function(){this.__element.select(); return this;}},
        onchangingdelay:    {get:   function(){return this.__onchangingdelay;}, set: function(value){Object.defineProperty(this, "__onchangingdelay", {value: value, configurable: true});}},
        onchanging:         {set:   function(callback) { this.addEventsListener(["keydown", "keyup", "mouseup", "touchend", "change"], notifyIfValueHasChangedOrDelay.bind(this, callback), false, true); }},
        onenter:            {set:   function(callback) { this.addEventListener("keypress", (function(event){ if (event.keyCode==13) { callback.call(this); return cancelEvent(event); } }).bind(this), false, true); }},
        onescape:           {set:   function(callback) { this.addEventListener("keydown", (function(event){ if (event.keyCode==27) { callback.call(this); return cancelEvent(event); } }).bind(this), false, true); }},
    });
    return input;
});}();
!function(){"use strict";root.define("atomic.html.checkbox", function htmlCheckbox(control)
{
    function checkbox(elements, selector, parent, bindPath)
    {
        control.call(this, elements, selector, parent, bindPath);
        this.__binder.defineDataProperties(this,
        {
            value:  {get: function(){return this.__element.checked;}, set: function(value){this.__element.checked = value===true; this.getEvents("viewupdated").viewupdated(["value"]);},  onchange: this.getEvents("change")}
        });
    }
    Object.defineProperty(checkbox, "prototype", {value: Object.create(control.prototype)});
    Object.defineProperty(checkbox, "__getViewProperty", {value: function(name) { return control.__getViewProperty(name); }});
    Object.defineProperties(checkbox.prototype,
    {
        constructor:    {value: checkbox},
        __createNode:   {value: function(){var element = document.createElement("input"); element.type="checkbox"; return element;}, configurable: true}
    });
    return checkbox;
});}();
!function(){"use strict";root.define("atomic.html.select", function htmlSelect(input, dataBinder, each)
{
    function getSelectListValue()
    {
        if (this.__element.options.length > 0)
        for(var counter=0;counter<this.__element.options.length;counter++)  if (this.__element.options[counter].selected)
        {
            return this.__rawValue = this.__element.options[counter].rawValue;
        }
        return this.__rawValue;
    }
    function setSelectListValue(value)
    {
        this.__rawValue = value;
        var bound       = this.items.bind != undefined;
        if (this.__element.options.length > 0) for(var counter=0;counter<this.__element.options.length;counter++) this.__element.options[counter].selected = (bound ? this.__element.options[counter].rawValue : this.__element.options[counter].value) == value;
        this.getEvents("viewupdated").viewupdated(["value"]);
    }
    function selectoption(element, selector, parent, bindPath)
    {
        Object.defineProperties(this, 
        {
            "__element":        {value: element},
            "__sourceBinder":   {value: new dataBinder()}
        });
        this.__sourceBinder.defineDataProperties(this,
        {
            text:   {get: function(){return this.__element.text;}, set: function(value){this.__element.text = value&&value.isObserver?value():value;}},
            value:  {get: function(){return this.__element.rawValue;}, set: function(value){this.__element.value = this.__element.rawValue = value&&value.isObserver?value():value;}}
        });
    }
    Object.defineProperties(selectoption.prototype,
    {
        source:     {get: function(){return this.__sourceBinder.data;}, set: function(value){this.__sourceBinder.data = value;}},
        selected:   {get: function(){return this.__element.selected;}, set: function(value){this.__element.selected = !(!value);}}
    });
    function createOption(sourceItem, index)
    {
        var option          = new selectoption(document.createElement('option'), this.selector+"-"+index, this);
        option.text.listen({bind: this.optionText||""});
        option.value.listen({bind: this.optionValue||""});
        option.source       = sourceItem;
        return option;
    }
    function select(element, selector, parent, bindPath)
    {
        input.call(this, element, selector, parent, bindPath);
        Object.defineProperties(this, 
        {
            "__items":      {value: null, configurable: true},
            "__options":    {value: [], configurable: true}
        });
        this.__binder.defineDataProperties(this,
        {
            value:  {get: function(){return this.items.bind != undefined ? getSelectListValue.call(this) : this.__element.value;}, set: function(value) {setSelectListValue.call(this, value===undefined?null:value);}, onchange: this.getEvents("change")},
            items:
            {
                get:        function() {return this.__items;},
                set:        function(value)
                {
                    Object.defineProperty(this, "__items", {value: value!==undefined&&value.isObserver?value():value, configurable: true});

                    bindSelectListSource.call(this, value);
                }
            }
        });
    }
    Object.defineProperty(select, "prototype", {value: Object.create(input.prototype)});
    Object.defineProperty(select, "__getViewProperty", {value: function(name) { return input.__getViewProperty(name); }});
    Object.defineProperties(select.prototype,
    {
        constructor:        {value: select},
        __createNode:       {value: function(){var element = document.createElement("select"); return element;}, configurable: true},
        count:              {get:   function(){ return this.__element.options.length; }},
        selectedIndex:      {get:   function(){ return this.__element.selectedIndex; },   set: function(value){ this.__element.selectedIndex=value; this.getEvents("viewupdated").viewupdated(["selectedIndex"]); }},
        __isValueSelected:  {value: function(value){return this.__rawValue === value;}}
    });
    each(["text","value"], function(name)
    {
        var thisName    = name.substr(0,1).toUpperCase()+name.substr(1);
        Object.defineProperty(select.prototype, "option"+thisName, 
        {
            get: function(){ return this["__option"+thisName]; },
            set: function(value)
            {
                Object.defineProperty(this,"__option"+thisName, {value: value, configurable: true});
                each(this.__options, function(option){option[name].bind = value;});
            }
        });
    });
    function clearOptions(){ for(var counter=this.__element.options.length-1;counter>=0;counter--) this.__element.remove(counter); }
    function bindSelectListSource(items)
    {
        var selectedValue   = this.__rawValue;
        clearOptions.call(this);
        if (items === undefined)   return;

        for(var counter=0;counter<items.count;counter++)
        {
            var sourceItem  = items.observe(counter);
            var option      = createOption.call(this, sourceItem, counter);
            this.__options.push(option);
            this.__element.appendChild(option.__element);
            option.selected = this.__isValueSelected(option.value());
        }
    }
    return select;
});}();
!function(){"use strict";root.define("atomic.html.radiogroup", function htmlRadioGroup(input, dataBinder, each)
{
    function setOptionNames()
    {
        var options = this.__element.querySelectorAll("input[type='radio']");
        for(var counter=0;counter<options.length;counter++) options[counter].name = this.__name;
    }
    function setRadioGroupValue(value)
    {
        Object.defineProperty(this, "__rawValue", {value: value, configurable: true});
        if (this.__options.length > 0) for(var counter=0;counter<this.__options.length;counter++) this.__options[counter].selected = this.__options[counter].value() == value;
        else
        {
            var options = this.__element.querySelectorAll("input[name='" + this.__name + "']");
            for(var counter=0;counter<options.length;counter++) options[counter].checked = options[counter].value == value;
        }
    }
    function getRadioGroupValue()
    {
        if (this.__options.length > 0)
        {
            for(var counter=0;counter<this.__options.length;counter++) if (this.__options[counter].selected)
            {
                Object.defineProperty(this, "__rawValue", {value: this.__options[counter].value(), configurable: true});
                break;
            }
        }
        else
        {
            var selectedOption  = this.__element.querySelector("input[name='" + this.__name + "']:checked");
            if (selectedOption) Object.defineProperty(this, "__rawValue", {value: selectedOption.value, configurable: true});
        }
        return this.__rawValue;
    }
    function captureTemplateIfNeeded()
    {
        if (this.__templateElement === undefined)
        {
            this.__radioButtonSelector	= this.__element.getAttribute("data-atomic-radiobutton")||"input[type='radio']";
            this.__radioLabelSelector   = this.__element.getAttribute("data-atomic-radiolabel")||"label";
            this.__templateElement      = this.__element.querySelector("radiogroupitem");
            this.__templateElement.parentNode.removeChild(this.__templateElement);
            clearRadioGroup(this.__element);
        }
    }
    function radiooption(element, selector, name, parent, index)
    {
        Object.defineProperties(this, 
        {
            "parent":           {value: parent},
            "__element":        {value: element},
            "__sourceBinder":   {value: new dataBinder()},
            "__parent":         {value: parent},
            "__radioElement":   {value: element.querySelector(parent.__radioButtonSelector)},
            "__radioLabel":     {value: element.querySelector(parent.__radioLabelSelector)},
            "__text":           {value: null, configurable: true},
            "__value":          {value: null, configurable: true}
        });
        this.__sourceBinder.defineDataProperties(this,
        {
            text:   {get: function(){return this.__text;}, set: function(value){Object.defineProperty(this,"__text",{value: value}); if (this.__radioLabel != null) this.__radioLabel.innerHTML = value&&value.isObserver?value():value;}},
            value:  {get: function(){return this.__value;}, set: function(value){Object.defineProperty(this, "__value", {value: value}); if (this.__radioElement != null) this.__radioElement.value = value&&value.isObserver?value():value;}}
        });
        this.__radioElement.name    = name;
        this.__radioElement.id      = name+"-"+index;
        this.__radioLabel.setAttribute("for", this.__radioElement.id);
    }
    Object.defineProperties(radiooption.prototype,
    {
        source:     {get: function(){return this.__sourceBinder.data;}, set: function(value){this.__sourceBinder.data = value;}},
        selected:   {get: function(){return this.__radioElement.checked;}, set: function(value){this.__radioElement.checked = !(!value);}}
    });
    function createOption(sourceItem, index)
    {
        var option          = new radiooption(this.__templateElement.cloneNode(true), this.selector+"-"+index, this.__name, this, index);
        option.text.listen({bind: this.optionText||""});
        option.value.listen({bind: this.optionValue||""});
        option.source       = sourceItem;
        return option;
    }
    function radiogroup(elements, selector, parent, bindPath)
    {
        input.call(this, elements, selector, parent, bindPath);
        Object.defineProperties(this, 
        {
            "__items":      {value: null, configurable: true},
            "__options":    {value: []},
            "__name":       {value: this.getSelectorPath()}
        });
        setOptionNames.call(this);
        this.__binder.defineDataProperties(this,
        {
            value:  {get: function(){return getRadioGroupValue.call(this);}, set: function(value){setRadioGroupValue.call(this, value===undefined?null:value);},  onchange: this.getEvents("change")},
            items:
            {
                get:        function() {return this.__items;},
                set:        function(value)
                {
                    Object.defineProperty(this, "__items", {value: value!==undefined&&value.isObserver?value():value, configurable: true});
                    captureTemplateIfNeeded.call(this);

                    bindRadioGroupSource.call(this, value);
                }
            }
        });
    }
    Object.defineProperty(radiogroup, "prototype", {value: Object.create(input.prototype)});
    Object.defineProperty(radiogroup, "__getViewProperty", {value: function(name) { return input.__getViewProperty(name); }});
    Object.defineProperties(radiogroup.prototype,
    {
        constructor:        {value: radiogroup},
        __createNode:       {value: function(){var element = document.createElement("radiogroup"); return element;}, configurable: true},
        count:              {get:   function(){ return this.__elements[0].options.length; }},
        selectedIndex:      {get:   function(){ return this.__elements[0].selectedIndex; },   set: function(value){ this.__element.selectedIndex=value; this.getEvents("viewupdated").viewupdated(["selectedIndex"]); }},
        __isValueSelected:  {value: function(value){return this.__rawValue === value;}}
    });
    each(["text","value"], function(name)
    {
        var thisName    = name.substr(0,1).toUpperCase()+name.substr(1);
        Object.defineProperty(radiogroup.prototype, "option"+thisName, 
        {
            get: function(){ return this["__option"+thisName]; },
            set: function(value)
            {
                Object.defineProperty(this,"__option"+thisName, {value: value, configurable: true});
                each(this.__options, function(option){option[name].bind = value;});
            }
        });
    });
    function clearRadioGroup(radioGroup){ for(var counter=radioGroup.childNodes.length-1;counter>=0;counter--) radioGroup.removeChild(radioGroup.childNodes[counter]); }
    function clearRadioOptions(radioGroup){ for(var counter=radioGroup.__options.length-1;counter>=0;counter--) radioGroup.__setViewData("removeChild", radioGroup.__options[counter].__element); }
    function rebindRadioGroupSource(){bindRadioGroupSource.call(this, this.__boundItems);}
    function bindRadioGroupSource(items)
    {
        var selectedValue   = this.value();
        clearRadioOptions(this);
        this.__options.splice(0, this.__options.length);
        Object.defineProperty(this, "__boundItems", {value: items, configurable: true});
        if (items === undefined)   return;
        for(var counter=0;counter<items.count;counter++)
        {
            var sourceItem  = items.observe(counter);
            var option      = createOption.call(this, sourceItem, counter);
            this.__options.push(option);
            this.__setViewData("appendChild", option.__element);
            option.selected = this.__isValueSelected(option.value());
        }
    }
    return radiogroup;
});}();
!function(){"use strict";root.define("atomic.html.multiselect", function htmlMultiSelect(base)
{
    function setSelectListValues(values)
    {
        if (typeof values === "function")   values = values();
        if ( !Array.isArray(values)) values  = [values];
        this.__rawValue = values;
        if (this.__element.options.length > 0) for(var counter=0;counter<this.__element.options.length;counter++) this.__element.options[counter].selected = values.indexOf(this.__element.options[counter].rawValue) > -1;
        this.getEvents("viewupdated").viewupdated(["value"]);
    }
    function getSelectListValues()
    {
        if (this.__element.options.length == 0) return this.__rawValue;
        var values  = [];
        if (this.__element.options.length > 0) for(var counter=0;counter<this.__element.options.length;counter++) if (this.__element.options[counter].selected)   values.push(this.__element.options[counter].rawValue);
        return this.__rawValue = values;
    }
    function multiselect(elements, selector, parent, bindPath)
    {
        base.call(this, elements, selector, parent, bindPath);
        this.__binder.defineDataProperties(this,
        {
            value:  {get: function(){return getSelectListValues.call(this);}, set: function(value){setSelectListValues.call(this, value===undefined?null:value);},  onchange: this.getEvents("change")}
        });
    }
    Object.defineProperty(multiselect, "prototype", {value: Object.create(base.prototype)});
    Object.defineProperty(multiselect, "__getViewProperty", {value: function(name) { return base.__getViewProperty(name); }});
    Object.defineProperties(multiselect.prototype,
    {
        constructor:        {value: multiselect},
        __createNode:       {value: function(){var element = document.createElement("select"); element.multiple="multiple"; return element;}, configurable: true},
        count:              {get:   function(){ return this.__element.options.length; }},
        selectedIndexes:    {get:   function(){ return this.__element.selectedIndex; },   set: function(value){ this.__element.selectedIndex=value; this.getEvents("viewupdated").viewupdated(["selectedIndex"]); }},
        size:               {get:   function(){ return this.__element.size; },            set: function(value){ this.__elements[0].size=value; this.getEvents("viewupdated").viewupdated(["size"]); }},
        __isValueSelected:  {value: function(value){return Array.isArray(this.__rawValue) && this.__rawValue.indexOf(value) > -1;}}
    });
    return multiselect;
});}();
!function(){"use strict";root.define("atomic.html.checkboxgroup", function htmlCheckboxGroup(input, dataBinder, each)
{
    function setCheckboxGroupValues(values)
    {
        if (typeof values === "function")   values = values();
        if ( !Array.isArray(values)) values  = [values];
        Object.defineProperty(this, "__rawValues", {value: values, configurable: true});
        if (this.__options.length > 0)
        {
            for(var counter=0;counter<this.__options.length;counter++) this.__options[counter].__checkboxElement.checked = values.indexOf(this.__options[counter].value()) > -1;
        }
        else
        {
            var options = this.__element.querySelectorAll("input[name='" + this.__name + "']");
            for(var counter=0;counter<options.length;counter++) options[counter].__checkboxElement.checked = values.indexOf(options[counter].value()) > -1;
        }
    }
    function getCheckboxGroupValues()
    {
        if (this.__options.length == 0) return this.__rawValues;
        var values  = [];
        if (this.__options.length > 0) 
        {
            for(var counter=0;counter<this.__options.length;counter++) if (this.__options[counter].__checkboxElement.checked) values.push(this.__options[counter].value());
        }
        else
        {
            var selectedOptions = this.__element.querySelectorAll("input[name='" + this.__name + "']:checked");
            if (selectedOptions && selectedOptions.length > 0)  for(var counter=0;counter<selectedOptions.length;counter++) values.push(selectedOptions.value);
        }

        Object.defineProperty(this, "__rawValues", {value: values, configurable: true});
        return values;
    }
    function captureTemplateIfNeeded()
    {
        if (this.__templateElement === undefined)
        {
            this.__checkboxButtonSelector	= this.__element.getAttribute("data-atomic-checkboxbutton")||"input[type='checkbox']";
            this.__checkboxLabelSelector    = this.__element.getAttribute("data-atomic-checkboxlabel")||"label";
            this.__templateElement          = this.__element.querySelector("checkboxgroupitem");
            this.__templateElement.parentNode.removeChild(this.__templateElement);
            clearCheckboxGroup(this.__element);
        }
    }
    function checkboxoption(element, selector, name, parent, index)
    {
        Object.defineProperties(this, 
        {
            "parent":               {value: parent},
            "__element":            {value: element},
            "__sourceBinder":       {value: new dataBinder()},
            "__parent":             {value: parent},
            "__checkboxElement":    {value: element.querySelector(parent.__checkboxButtonSelector)},
            "__checkboxLabel":      {value: element.querySelector(parent.__checkboxLabelSelector)},
            "__text":               {value: null, configurable: true},
            "__value":              {value: null, configurable: true}
        });
        this.__sourceBinder.defineDataProperties(this,
        {
            text:   {get: function(){return this.__text;}, set: function(value){Object.defineProperty(this,"__text",{value: value}); if (this.__checkboxLabel != null) this.__checkboxLabel.innerHTML = value&&value.isObserver?value():value;}},
            value:  {get: function(){return this.__value;}, set: function(value){Object.defineProperty(this, "__value", {value: value}); if (this.__checkboxElement != null) this.__checkboxElement.value = value&&value.isObserver?value():value;}}
        });
        this.__checkboxElement.name = name;
        this.__checkboxElement.id   = name+"-"+index;
        this.__checkboxLabel.setAttribute("for", this.__checkboxElement.id);
    }
    Object.defineProperties(checkboxoption.prototype,
    {
        source:     {get: function(){return this.__sourceBinder.data;}, set: function(value){this.__sourceBinder.data = value;}},
        selected:   {get: function(){return this.__checkboxElement.checked;}, set: function(value){this.__checkboxElement.checked = !(!value);}}
    });
    function createOption(sourceItem, index)
    {
        var option          = new checkboxoption(this.__templateElement.cloneNode(true), this.selector+"-"+index, this.__name, this, index);
        option.text.listen({bind: this.optionText||""});
        option.value.listen({bind: this.optionValue||""});
        option.source       = sourceItem;
        return option;
    }
    function checkboxgroup(elements, selector, parent, bindPath)
    {
        input.call(this, elements, selector, parent, bindPath);
        Object.defineProperties(this, 
        {
            "__items":      {value: null, configurable: true},
            "__options":    {value: []},
            "__name":       {value: (this.__element.__selectorPath||"") + (this.__element.id||"unknown")}
        });
        this.__binder.defineDataProperties(this,
        {
            value:  {get: function(){return getCheckboxGroupValues.call(this);}, set: function(value){setCheckboxGroupValues.call(this, value===undefined?null:value);},  onchange: this.getEvents("change")},
            items:
            {
                get:        function() {return this.__items;},
                set:        function(value)
                {
                    Object.defineProperty(this, "__items", {value: value!==undefined&&value.isObserver?value():value, configurable: true});
                    captureTemplateIfNeeded.call(this);

                    bindCheckboxGroupSource.call(this, value);
                }
            }
        });
    }
    Object.defineProperty(checkboxgroup, "prototype", {value: Object.create(input.prototype)});
    Object.defineProperty(checkboxgroup, "__getViewProperty", {value: function(name) { return input.__getViewProperty(name); }});
    Object.defineProperties(checkboxgroup.prototype,
    {
        constructor:        {value: checkboxgroup},
        __createNode:       {value: function(){var element = document.createElement("checkboxgroup"); return element;}, configurable: true},
        count:              {get:   function(){ return this.__elements[0].options.length; }},
        selectedIndex:      {get:   function(){ return this.__elements[0].selectedIndex; },   set: function(value){ this.__element.selectedIndex=value; this.getEvents("viewupdated").viewupdated(["selectedIndex"]); }},
        __isValueSelected:  {value: function(value){return Array.isArray(this.__rawValues) && this.__rawValues.indexOf(value) > -1;}}
    });
    each(["text","value"], function(name)
    {
        var thisName    = name.substr(0,1).toUpperCase()+name.substr(1);
        Object.defineProperty(checkboxgroup.prototype, "option"+thisName, 
        {
            get: function(){ return this["__option"+thisName]; },
            set: function(value)
            {
                Object.defineProperty(this,"__option"+thisName, {value: value, configurable: true});
                each(this.__options, function(option){option[name].bind = value;});
            }
        });
    });
    function clearCheckboxGroup(checkboxGroup){ for(var counter=checkboxGroup.childNodes.length-1;counter>=0;counter--) checkboxGroup.removeChild(checkboxGroup.childNodes[counter]); }
    function rebindCheckboxGroupSource(){bindCheckboxGroupSource.call(this, this.__boundItems);}
    function bindCheckboxGroupSource(items)
    {
        var selectedValue   = this.value();
        clearCheckboxGroup(this.__element);
        this.__options.splice(0, this.__options.length);
        Object.defineProperty(this, "__boundItems", {value: items, configurable: true});
        if (items === undefined)   return;
        for(var counter=0;counter<items.count;counter++)
        {
            var sourceItem  = items.observe(counter);
            var option      = createOption.call(this, sourceItem, counter);
            this.__options.push(option);
            this.__setViewData("appendChild", option.__element);
            option.selected = this.__isValueSelected(option.value());
        }
    }
    return checkboxgroup;
});}();
!function(){"use strict";root.define("atomic.html.image", function htmlImage(control)
{
    function image(elements, selector, parent, bindPath)
    {
        control.call(this, elements, selector, parent, bindPath);
        this.__binder.defineDataProperties(this,
        {
            alt:    {get: function(){return this.__element.alt;},           set: function(value){this.__element.alt = value||""; this.getEvents("viewupdated").viewupdated(["alt"]);}},
            value:  {get: function(){return this.__getViewData("src");},    set: function(value){this.__setViewData("src", value||"");}}
        });
    }
    Object.defineProperty(image, "prototype", {value: Object.create(control.prototype)});
    Object.defineProperty(image, "__getViewProperty", {value: function(name) { return control.__getViewProperty(name); }});
    Object.defineProperties(image.prototype,
    {
        constructor:    {value: image},
        __createNode:   {value: function(){return document.createElement("image");}, configurable: true}
    });
    return image;
});}();
!function(){"use strict";root.define("atomic.html.audio", function htmlAudio(control)
{
    function audio(elements, selector, parent, bindPath)
    {
        control.call(this, elements, selector, parent, bindPath);
        this.__binder.defineDataProperties(this,
        {
            autoplay:       {get: function(){return this.__element.autoplay},       set: function(value){this.__element.autoplay = value===true; this.getEvents("viewupdated").viewupdated(["autoplay"]);}},
            loop:           {get: function(){return this.__element.loop;},          set: function(value){this.__element.loop = value===true; this.getEvents("viewupdated").viewupdated(["loop"]);}},
            muted:          {get: function(){return this.__element.muted},          set: function(value){this.__element.muted = value===true; this.getEvents("viewupdated").viewupdated(["muted"]);}},
            nativeControls: {get: function(){return this.__element.controls;},      set: function(value){this.__element.controls = value===true; this.getEvents("viewupdated").viewupdated(["controls"]);}},
            preload:        {get: function(){return this.__element.preload;},       set: function(value){this.__element.preload = value===true; this.getEvents("viewupdated").viewupdated(["preload"]);}},
            alt:            {get: function(){return this.__element.alt;},           set: function(value){this.__element.alt = value||""; this.getEvents("viewupdated").viewupdated(["alt"]);}},
            mediaType:      {get: function(){return this.__element.type;},          set: function(value){this.__element.type = value||""; this.getEvents("viewupdated").viewupdated(["type"]);}},
            value:          {get: function(){return this.__getViewData("src");},    set: function(value){this.pause(); this.__setViewData("src", value||""); this.triggerEvent("timeupdate"); }},
            currentTime:    {get: function(){return this.__element.currentTime;},   set: function(value){this.__element.currentTime = value||0; this.getEvents("viewupdated").viewupdated(["currentTime"]);},   onchange: this.getEvents("timeupdate")},
            playbackRate:   {get: function(){return this.__element.playbackRate;},  set: function(value){this.__element.playbackRate = value||0; this.getEvents("viewupdated").viewupdated(["playbackRate"]);}, onchange: this.getEvents("ratechange")},
            volume:         {get: function(){return this.__element.volume;},        set: function(value){this.__element.volume = value||0; this.getEvents("viewupdated").viewupdated(["volume"]);},             onchange: this.getEvents("volumechange")}
        });
    }
    Object.defineProperty(audio, "prototype", {value: Object.create(control.prototype)});
    Object.defineProperty(audio, "__getViewProperty", {value: function(name) { return control.__getViewProperty(name); }});
    Object.defineProperties(audio.prototype,
    {
        constructor:    {value: audio},
        __createNode:   {value: function(){return document.createElement("audio");}, configurable: true},
        duration:       {value: function(){return this.__element.duration;}},
        ended:          {value: function(){return this.__element.ended;}},
        paused:         {value: function(){return this.__element.paused;}},
        seeking:        {value: function(){return this.__element.seeking;}},
        load:           {value: function(){this.__element.load();}},
        play:           {value: function(){this.__element.play();}},
        pause:          {value: function(){this.__element.pause();}}
    });
    return audio;
});}();
!function(){"use strict";root.define("atomic.html.video", function htmlVideo(audio)
{
    function video(elements, selector, parent, bindPath)
    {
        audio.call(this, elements, selector, parent, bindPath);
    }
    Object.defineProperty(video, "prototype", {value: Object.create(audio.prototype)});
    Object.defineProperty(video, "__getViewProperty", {value: function(name) { return audio.__getViewProperty(name); }});
    Object.defineProperties(video.prototype,
    {
        constructor:    {value: video},
        __createNode:   {value: function(){return document.createElement("video");}, configurable: true}
    });
    return video;
});}();
!function(){"use strict";root.define("atomic.html.button", function htmlButton(control)
{
    function button(element, selector, parent, bindPath)
    {
        control.call(this, element, selector, parent, bindPath);
        this.__binder.defineDataProperties(this,
        {
            value:  {get: function(){return this.__getViewData("innerHTML");},   set: function(value){this.__setViewData("innerHTML", value||"");}}
        });
    }
    Object.defineProperty(button, "prototype", {value: Object.create(control.prototype)});
    Object.defineProperty(button, "__getViewProperty", {value: function(name) { return control.__getViewProperty(name); }});
    Object.defineProperties(button.prototype,
    {
        constructor:    {value: button},
        __createNode:   {value: function(selector){var element = document.createElement("button"); element.innerHTML = selector; return element;}, configurable: true}
    });
    return button;
});}();
!function(){"use strict";root.define("atomic.html.isolatedFunctionFactory", function isolatedFunctionFactory(document)
{
    return function()
    {
        var iframe              = document.createElement("iframe");
        iframe.style.display    = "none";
        document.body.appendChild(iframe);
        var isolatedDocument    = frames[frames.length - 1].document;
        isolatedDocument.write("<script>parent.__isolatedFunction = Function;<\/script>");
        var isolatedFunction    = window.__isolatedFunction;
        delete window.__isolatedFunction;
 return {
            create:
            function(constructor)
            {
                //isolatedDocument.write("<script>parent.__isolatedSubFunction = " + functionToIsolate.toString() + ";<\/script>");
                isolatedDocument.write("<script>parent.__isolatedSubFunction = function "+constructor.name+"(){function "+constructor.name+"(){return "+constructor.name+".___invoke.apply("+constructor.name+", arguments);}; this.___construct.apply("+constructor.name+", arguments); return "+constructor.name+";};<\/script>");
                var __isolatedSubFunction  = window.__isolatedSubFunction;
                delete window.__isolatedSubFunction;
                __isolatedSubFunction.prototype.___construct = constructor;
                return __isolatedSubFunction;
            },
            root:   isolatedFunction
        };
    }
});}();
!function(){"use strict";root.define("atomic.html.viewAdapterFactory", function htmlViewAdapterFactory(document, controlTypes, pubSub, logger, each)
{
    var viewAdapterFactory  =
    {
        create:         function create(options)
        {
            var selector                = options.selector || (options.viewElement.id?("#"+options.viewElement.id):("."+options.viewElement.className));
            if (controlTypes[options.controlType] === undefined)    debugger;

            var viewAdapter             = new controlTypes[options.controlType](options.viewElement, selector, options.parent, options.bindPath);
            Object.defineProperty(viewAdapter, "__childKey", {value: options.controlKey, configurable: true});

            viewAdapter.frame(new options.definitionConstructor(viewAdapter));
            if (typeof options.preConstruct === "function") options.preConstruct.call(viewAdapter);
            if(viewAdapter.construct)   viewAdapter.construct.call(viewAdapter);
            return viewAdapter;
        },
        createView:     function createView(definitionConstructor, viewElement)
        {
            var adapter = this.create
            ({
                definitionConstructor:  typeof definitionConstructor !== "function" ? function(appViewAdapter){return {controls: definitionConstructor}; } : definitionConstructor,
                viewElement:            viewElement,
                parent:                 undefined,
                selector:               undefined,
                controlKey:             undefined,
                controlType:            "screen",
                bindPath:               ""
            });
            return adapter;
        },
        createFactory:  function createFactory(definitionConstructor, viewElementTemplate)
        {
            if (typeof viewElementTemplate === "string")    viewElementTemplate = document.querySelector(viewElementTemplate);
            viewElementTemplate.parentNode.removeChild(viewElementTemplate);
            var factory = (function(parent, containerElement, selector, controlKey, bindPath)
            {
                var container                       = parent;
                var viewElement                     = viewElementTemplate.cloneNode(true);
                if (containerElement !== undefined)
                {
                    container                       = this.create
                    ({
                        definitionConstructor:  function(){return {};}, 
                        viewElement:            containerElement,
                        parent:                 parent,
                        selector:               selector,
                        controlKey:             controlKey,
                        controlType:            "panel",
                        bindPath:               bindPath
                    });
                    container.__setViewData("callback", function()
                    {
                        this.__element.innerHTML   = "";
                        this.__element.appendChild(viewElement);
                    });
                }
                else                                parent.__setViewData("appendChild", viewElement);

                var view                            = this.create
                ({
                    definitionConstructor:  typeof definitionConstructor !== "function" ? function(control){return definitionConstructor} : function(control){return definitionConstructor(control, factory);},
                    viewElement:            viewElement,
                    parent:                 container,
                    selector:               selector,
                    controlKey:             controlKey,
                    controlType:            "composite",
                    bindPath:               bindPath
                });
                return view;
            }).bind(this);
            return factory;
        },
        launch:         function(viewElement, controlsOrAdapter, callback)
        {
            var argsLength  = callback === undefined ? controlsOrAdapter === undefined ? viewElement === undefined ? 0 : 1 : 2 : 3;
            if (argsLength === 0) return;
            if (argsLength === 1 || (argsLength === 2 && (typeof controlsOrAdapter === "function"||(typeof viewElement === "object" && typeof controlsOrAdapter === "object"))))
            {
                callback            = controlsOrAdapter;
                controlsOrAdapter   = viewElement;
                viewElement         = document.body;
            }
            if (callback === undefined)             callback    = function(adapter){adapter.__getData()("", {});};
            else if(typeof callback === "object")   callback    = (function(data){return function(adapter){adapter.data("", data);};})(callback);
            var adapter =
            this.createView
            (
                controlsOrAdapter, 
                typeof viewElement === "string" ? document.querySelector(viewElement) : viewElement||document.body
            );
            if (typeof callback === "function") callback(adapter);
            return adapter;
        },
        select:         function(uiElement, selector, selectorPath)
        {
            var element = uiElement.querySelector(selector)||undefined;
            element.__selectorPath  = selectorPath;
            return element;
        },
        selectAll:      function(uiElement, selector, selectorPath, typeHint)
        {
            return uiElement.querySelectorAll(selector);
        }
    };
    return viewAdapterFactory;
});}();
!function(){"use strict";root.define("atomic.scanner", function scanner()
{
    var priv    =
    {
        input:              "",
        currentByteIndex:   -1,
        currentColumnIndex: 0,
        currentLineNumber:  0,
        currentChar:        ""
    };
    var scanner = Object.create({},
    {
        read:   {value:
        function(input)
        {
            priv.input              = input;
            priv.currentByteIndex   = -1;
            priv.currentColumnIndex = 0;
            priv.currentLineNumber  = 0;
        }},
        scan:   {value:
        function()
        {
            priv.currentByteIndex++;
            if (priv.currentByteIndex < priv.input.length)
            {
                priv.currentChar    = priv.input[priv.currentByteIndex];
                if
                (
                    priv.currentByteIndex > 0
                    &&
                    priv.input[priv.currentByteIndex-1] == '\n'
                )
                {
                    priv.currentLineNumber++;
                    priv.currentColumnIndex = -1;
                }
                priv.currentColumnIndex++;
            }
            return priv.currentByteIndex < priv.input.length;
        }},
        stepBack:   {value:
        function()
        {
            if (priv.currentByteIndex <= 0) throw new Error("Scanner is already at position 0.")
            priv.currentByteIndex--;
            if (priv.input[priv.currentByteIndex] == '\n')  priv.currentLineNumber--;
        }},
        currentByteIndex:   { get: function(){ return priv.currentByteIndex; } },
        currentColumnIndex: { get: function(){ return priv.currentColumnIndex; } },
        currentLineNumber:  { get: function(){ return priv.currentLineNumber; } },
        current:            { get: function(){ return priv.currentChar; } },
        eof:                { get: function(){ return priv.input === undefined || priv.input === null || priv.currentByteIndex >= priv.input.length-1; } },
        input:              { get: function(){ return priv.input; } }
    });
    return scanner;
});}();
!function(){"use strict";root.define("atomic.lexer", function lexer(scanner, tokenizers, removeFromArray)
{
    var whiteSpaceCharacters    = /\s/;
    var priv    =
    {
        currentToken:   null
    };

    function resetTokenizers()
    {
        for(var counter=0, tokenizer;tokenizer=tokenizers[counter];counter++)   tokenizer.reset();
    }
    var lexer   = Object.create({},
    {
        read:           {value:
        function(input)
        {
            if (!tokenizers || tokenizers.length === 0) throw new Error("No tokenizers were supplied");
            scanner.read(input);
            return this;
        }},
        getNextToken:   {value:
        function()
        {
            if (!tokenizers || tokenizers.length === 0) throw new Error("No tokenizers were supplied");
            if (scanner.eof)    return true;
            var previousTokenizers  = [],
                activeTokenizers    = [],
                currentChar;

            while(scanner.scan())
            {
                currentChar = scanner.current;
                if (activeTokenizers.length > 0)
                {
                    previousTokenizers  = activeTokenizers.slice();
                    for(var counter=previousTokenizers.length-1, activeTokenizer;activeTokenizer=previousTokenizers[counter];counter--) if (!activeTokenizer.read(currentChar)) removeFromArray(activeTokenizers, counter);

                    if (activeTokenizers.length > 0)    continue;

                    if (!whiteSpaceCharacters.test(currentChar))    scanner.stepBack();

                    activeTokenizers    = previousTokenizers;
                    break;
                }
                activeTokenizers    = [];
                for(var counter=0, tokenizer;tokenizer=tokenizers[counter];counter++)   {if (tokenizer.read(currentChar))    activeTokenizers.push(tokenizer); }

                if (activeTokenizers.length == 0 && !whiteSpaceCharacters.test(currentChar))    throw new Error ("Invalid syntax.  Unable to tokenize statement.");
            }
            if (activeTokenizers.length == 0)   throw new Error ("Invalid syntax.  Unable to tokenize statement {" + (scanner.input===undefined||scanner.input===null?"":scanner.input) + "}.");
            
            priv.currentToken   = activeTokenizers[0].getToken();
            resetTokenizers();
            return false;
        }},
        eof:                { get: function(){return scanner.eof;}},
        currentByteIndex:   { get: function(){return scanner.currentByteIndex;}},
        currentColumnIndex: { get: function(){return scanner.currentColumnIndex;}},
        currentLineNumber:  { get: function(){return scanner.currentLineNumber;}},
        current:            { get: function(){return priv.currentToken;}}
    });
    return lexer;
});}();
!function(){"use strict";root.define("atomic.tokenizer", function tokenizer()
{
    return function(prot, reset, read, getToken)
    {
        Object.defineProperties(prot,
        {
            isClosed:   {value: true, writable: true}
        });
        Object.defineProperties(this,
        {
            reset:      {value: function()
            {
                prot.isClosed   = true;
                reset.call(this);
                return this;
            }},
            read:       {value: read},
            getToken:   {value: getToken}
        });
    }
});}();
!function(){"use strict";root.define("atomic.pathParserFactory", function pathParserFactory(tokenizer)
{
    var LITERAL                     = 'literal';
    var WORD                        = 'word';
    var NUMERAL                     = 'numeral';
    var openKeyDelimiter            = 'openKeyDelimiter';
    var closeKeyDelimiter           = 'closeKeyDelimiter';
    var propertyDelimiter           = 'propertyDelimiter';
    var ROOTDIRECTIVE               = 'rootDirective';
    var EOF                         = 'EOF';
    function token(value, type) { return Object.create({},{value: {value: value}, type: {value: type} }); }
    function stringLiteralTokenizer(delimiter, failOnCarriageReturnOrLineBreak)
    {
        // This tokenizer allows for slash delimiter escaping but not double delimiter escaping
        var priv    =
        {
            value:  ""
        };
        var prot    = {};
        function reset(){ priv.value = ""; }
        function read(currentChar)
        {
            var handled = false;
            if (prot.isClosed && currentChar==delimiter && priv.value.length == 0)
            {
                prot.isClosed   = false;
                handled         = true;
            }
            else if(!prot.isClosed && (!failOnCarriageReturnOrLineBreak || (currentChar != "\r" && currentChar != "\n")))
            {
                if (currentChar==delimiter && (priv.value.length == 0 || priv.value.slice(-1) != "\\")) prot.isClosed   = true;
                else                                                                                    priv.value      += currentChar;

                handled         = true;
            }
            return handled;
        }
        function getToken()
        {
            return new token(priv.value, LITERAL);
        }
        tokenizer.call(this, prot, reset, read, getToken);
    }
    Object.defineProperty(stringLiteralTokenizer, "prototype", {value: Object.create(tokenizer.prototype)});
    function wordTokenizer()
    {
        var firstLetterCharacters   = /[a-zA-Z_$]/;
        var wordCharacters          = /[a-zA-Z0-9_$]/;
        var priv                    =
        {
            value:  ""
        };
        var prot                    = {};
        function reset(){ priv.value = ""; }
        function read(currentChar)
        {
            var handled = false;
            if (!prot.isClosed && wordCharacters.test(currentChar))
            {
                priv.value  += currentChar;
                handled     = true;
            }
            else if (prot.isClosed && firstLetterCharacters.test(currentChar))
            {
                prot.isClosed   = false;
                priv.value      = currentChar;
                handled         = true;
            }
            return handled;
        }
        function getToken()
        {
            return new token(priv.value, WORD);
        }
        tokenizer.call(this, prot, reset, read, getToken);
    }
    Object.defineProperty(wordTokenizer, "prototype", {value: Object.create(tokenizer.prototype)});
    function numeralTokenizer()
    {
        var numerals    = /[0-9]/;
        var priv        =
        {
            value:  ""
        };
        var prot        = {};
        function reset(){ priv.value = ""; }
        function read(currentChar)
        {
            var handled = false;
            if (numerals.test(currentChar))
            {
                if (prot.isClosed)  prot.isClosed   = false;
                priv.value  += currentChar;
                handled     = true;
            }
            return handled;
        }
        function getToken()
        {
            return new token(priv.value, NUMERAL);
        }
        tokenizer.call(this, prot, reset, read, getToken);
    }
    Object.defineProperty(numeralTokenizer, "prototype", {value: Object.create(tokenizer.prototype)});
    function delimiterTokenizer(delimiter, type)
    {
        var priv    =
        {
            value:  ""
        };
        var prot    = {};
        function reset(){ priv.value = ""; }
        function read(currentChar)
        {
            var handled = false;
            if (currentChar === delimiter && prot.isClosed)
            {
                priv.value      = currentChar;
                prot.isClosed   = false;
                handled         = true;
            }
            return handled;
        }
        function getToken()
        {
            return new token(priv.value, type);
        }
        tokenizer.call(this, prot, reset, read, getToken);
    }
    Object.defineProperty(delimiterTokenizer, "prototype", {value: Object.create(tokenizer.prototype)});
    function operatorTokenizer(operatorToken, type)
    {
        var priv    =
        {
            currentIndex:   0
        };
        var prot    = {};
        function reset(){ priv.currentIndex = 0; }
        function read(currentChar)
        {
            var handled = false;
            if (priv.currentIndex < operatorToken.length && currentChar === operatorToken[priv.currentIndex])
            {
                prot.isClosed   = false;
                priv.currentIndex++;
                handled         = true;
            }
            return handled;
        }
        function getToken()
        {
            return new token(operatorToken, type);
        }
        tokenizer.call(this, prot, reset, read, getToken);
    }
    Object.defineProperty(operatorTokenizer, "prototype", {value: Object.create(tokenizer.prototype)});

    function stringToSegment(segment){return typeof segment === "string" ? {value: segment, type: 0} : segment;}

    var unresolvedSegmentType   = 0;
    var resolvedSegmentType     = 1;
    var virtualSegmentType      = 2;

    function getNextVirtuals(segment, newBasePath, constructPath, currentVirtuals)
    {
        var nextVirtuals    = [];
        var virtualProperty = undefined;
        for(var virtualCounter=0;virtualCounter<currentVirtuals.length;virtualCounter++)
        {
            var currentVirtual  = currentVirtuals[virtualCounter];
            if (currentVirtual !== undefined)
            {
                if (currentVirtual.paths[segment.value] !== undefined)
                {
                    var nextVirtual = currentVirtual.paths[segment.value];
                    if (nextVirtual.property !== undefined)
                    {
                        if (nextVirtual.property.get === undefined) throw new Error("Computed property is write only at path '" + newBasePath.join(".") + "'.");
                        if (virtualProperty !== undefined)          throw new Error("A Computed property was already found at the path '" + newBasePath.join(".")+ "'.");

                        virtualProperty = {type: virtualSegmentType, virtualProperty: nextVirtual.property, target: nextVirtual.property.get(newBasePath.slice(0,-1).join("."), newBasePath[newBasePath.length-1]), newBasePath: newBasePath, currentVirtuals: nextVirtuals};
                    }
                    nextVirtuals.push(nextVirtual);
                }
                if(currentVirtual.matchers !== undefined)
                {
                    for(var counter=0;counter<currentVirtual.matchers.length;counter++)
                    {
                        var matcher = currentVirtual.matchers[counter];
                        if (matcher.test(segment.value))
                        {
                            if (matcher.property !== undefined)
                            {
                                if (matcher.property.get === undefined) throw new Error("Computed property is write only at path '" + newBasePath.join(".") + "'.");
                                if (virtualProperty !== undefined)      throw new Error("A Computed property was already found at the path '" + newBasePath.join(".")+ "'.");
                                virtualProperty = {type: virtualSegmentType, target: matcher.property.get(newBasePath.slice(0,-1).join("."), newBasePath[newBasePath.length-1]), newBasePath: newBasePath, currentVirtuals: nextVirtuals};
                            }
                            nextVirtuals.push(matcher);
                        }
                    }
                }
            }
        }
        return virtualProperty === undefined ? nextVirtuals : virtualProperty;
    }

    function resolvePathSegment(root, segment, current, newBasePath, constructPath, notify, currentVirtuals, ignoreVirtuals)
    {
        if (typeof segment.value === "object")  segment = {type: unresolvedSegmentType, value: segment.value.get({bag: root.bag, basePath: root.basePath}, notify).value};

        if      (segment.value === "$root" || segment.value === "...")
        {
            return {type: unresolvedSegmentType, target: root.bag.item, newBasePath: [], currentVirtuals: [root.bag.virtualProperties]};
        }
        else if (segment.value === "$home")
        {
            var resolvedPath    = resolvePath({bag: root.bag, basePath: root.basePath}, {segments: [], prependBasePath: true}, false);
            newBasePath         = root.basePath.split(".");
            return {type: unresolvedSegmentType, target: resolvedPath.value, newBasePath: newBasePath, currentVirtuals: resolvedPath.virtuals};
        }
        else if (segment.value === "$parent")
        {
            newBasePath.pop();
            var resolvedPath    = resolvePath({bag: root.bag, basePath: newBasePath.join(".")}, {segments: [], prependBasePath: true}, false);
            return {type: unresolvedSegmentType, target: resolvedPath.value, newBasePath: newBasePath, currentVirtuals: resolvedPath.virtuals};
        }
        else if (segment.value === "$shadow")
        {
            var shadowPath  = newBasePath.join(".");
            newBasePath.push(segment.value);
            if (root.bag.shadows[shadowPath] === undefined) root.bag.shadows[shadowPath]    = {};
            return {type: unresolvedSegmentType, target: root.bag.shadows[shadowPath], newBasePath: newBasePath, currentVirtuals: getNextVirtuals(segment, newBasePath, constructPath, currentVirtuals)};
        }
        else if (segment.value === "$key")
        {
            return {type: resolvedSegmentType , value: newBasePath.length > 0 ? newBasePath[newBasePath.length-1] : "$root", newBasePath: newBasePath};
        }
        else if (segment.value === "$path")
        {
            return {type: resolvedSegmentType, value: newBasePath.length > 0 ? newBasePath.join(".") : "$root", newBasePath: newBasePath};
        }
        else
        {
            newBasePath.push(segment.value);
            var nextVirtuals;
            if (!ignoreVirtuals)
            {
                nextVirtuals    = getNextVirtuals(segment, newBasePath, constructPath, currentVirtuals);
                if (!Array.isArray(nextVirtuals))   return nextVirtuals;
            }

            // virtual only
            if (current === undefined)  return {type: resolvedSegmentType, value: undefined, newBasePath: newBasePath, currentVirtuals: nextVirtuals};

            if (current[segment.value] === undefined)
            {
                if (constructPath)  current[segment.value]   = segment.type===0?{}:[];
                else                return {type: resolvedSegmentType, value: undefined, newBasePath: newBasePath, currentVirtuals: nextVirtuals};
            }
            return {type: unresolvedSegmentType, target: current[segment.value], newBasePath: newBasePath, currentVirtuals: nextVirtuals};
        }
    }

    function resolvePath(root, paths, constructPath, notify, ignoreVirtuals)
    {
        var segments            = paths.prependBasePath ? root.basePath.split(".").filter(function(segment){return segment.length>0;}).concat(paths.segments) : paths.segments;
        var current             = root.bag.item;
        var currentVirtuals     = [root.bag.virtualProperties];
        var newBasePath         = [];
        var segmentsLength      = segments.length-(constructPath?1:0);

        for(var segmentCounter=0;segmentCounter<segmentsLength;segmentCounter++)
        {
            var resolvedSegment = resolvePathSegment(root, stringToSegment(segments[segmentCounter]), current, newBasePath, constructPath, notify, currentVirtuals, ignoreVirtuals);

            if (resolvedSegment.type === resolvedSegmentType && resolvedSegment.currentVirtuals === undefined)
            {
                return {value: resolvedSegment.value, pathSegments: resolvedSegment.newBasePath};
            }
            if (resolvedSegment.type === virtualSegmentType && resolvedSegment.target !== undefined && resolvedSegment.target !== null && resolvedSegment.target.isObserver)
            {
                if (typeof notify === "function")   notify(newBasePath);
                return resolvePath({bag: resolvedSegment.target.__bag, basePath: resolvedSegment.target.__basePath}, {prependBasePath: true, segments: segments.slice(segmentCounter+1)}, constructPath, notify);
            }

            current         = resolvedSegment.target==undefined && segmentCounter<segmentsLength-1 ? {} : resolvedSegment.target;
            newBasePath     = resolvedSegment.newBasePath;
            currentVirtuals = resolvedSegment.currentVirtuals;
        }
        if (constructPath && segmentsLength > -1 && (ignoreVirtuals || currentVirtuals.length > 0))
        {
            var finalSegment    = resolvePathSegment(root, stringToSegment(segments[segmentsLength]), current, newBasePath.slice(), true, notify, currentVirtuals, ignoreVirtuals);
            if (finalSegment.type === 2) return {isVirtual: true, property: finalSegment.virtualProperty, basePath: finalSegment.newBasePath.slice(0, -1).join("."), key: finalSegment.newBasePath[finalSegment.newBasePath.length-1]};
        }
        return  constructPath
                ?   segmentsLength === -1
                    ?   {isRoot: true}
                    :   {target: current, segment: stringToSegment(segments[segments.length-1]), basePath: newBasePath.join(".")}
                :   {value: current, pathSegments: newBasePath, virtuals: currentVirtuals};
    }

    function getDataPath(root, paths, notify, ignoreVirtuals)
    {
        var result  = resolvePath(root, paths, false, notify, ignoreVirtuals);
        if (typeof notify === "function")   notify(result.pathSegments);
        return result;
    }

    function setDataPath(root, paths, value, notify, ignoreVirtuals)
    {
        var resolved    = resolvePath(root, paths, true, undefined, ignoreVirtuals);
        var newValue    = value&&value.isObserver ? value.unwrap() : value;

        if      (resolved.isRoot)
        {
            root.bag.item   = value;
            if (typeof notify === "function")   notify("");
        }
        else if (resolved.isVirtual)
        {
            if (resolved.property.set === undefined)    throw new Error("Computed property is read-only.");
            resolved.property.set(resolved.basePath, resolved.key, newValue);
        }
        else if (typeof resolved.segment.value === "object")
        {debugger;
            resolved.segment.value.set({bag: root.bag, basePath: resolved.basePath}, newValue);
            debugger;
        }
        else
        {
            resolved.target[resolved.segment.value]  = newValue;
            if (typeof notify === "function")   notify((resolved.basePath.length>0?resolved.basePath+".":"")+resolved.segment.value);
        }
    }

    function accessor(path) { return {get: function(root, notify, ignoreVirtuals){return getDataPath(root, path, notify, ignoreVirtuals);}, set: function(root, value, notify, ignoreVirtuals){return setDataPath(root, path, value, notify, ignoreVirtuals);}}; }

    function parse(lexer)
    {
        function parse(depth)
        {
            var handled     = false;
            var nextType    = 0;
            var currentPath = {segments: [], prependBasePath: true};
            var needWord    = false;
            while(!lexer.getNextToken())
            {
                var token       = lexer.current.value;
                if (lexer.current.type === WORD || lexer.current.type === ROOTDIRECTIVE)
                {
                    currentPath.segments.push({value: token, type: 0});
                    handled     = true;
                    needWord    = false;
                }
                else if (lexer.current.type === NUMERAL)
                {
                    handled     = true;
                    needWord    = false;
                    currentPath.segments.push({value: lexer.current.value, type: 1});
                }
                else if (!needWord)
                {
                    if (lexer.current.type === propertyDelimiter && currentPath.segments.length > 0)
                    {
                        handled     = true;
                        nextType    = 0;
                        needWord    = true;
                    }
                    else if (lexer.current.type === openKeyDelimiter && currentPath.segments.length > 0)
                    {
                        handled     = true;
                        currentPath.segments.push({value: parse(depth+1), type: 1});
                    }
                    else if (lexer.current.type === closeKeyDelimiter && currentPath.segments.length > 0 && depth > 0)
                    {
                        handled = true;
                        return currentPath.segments.length === 1 && currentPath.segments[0].type === 1 ? currentPath.segments[0].value : accessor(currentPath);
                    }
                    else if (currentPath.segments.length == 0 && depth > 0 && lexer.current.type === LITERAL)
                    {
                        var segment = lexer.current.value;
                        if (lexer.getNextToken() || lexer.current.type !== closeKeyDelimiter)   throw new Error ("Syntax error: Expected ']' but encountered " + (lexer.eof?"EOF":lexer.current.value) + " at position " + lexer.currentByteIndex + ".");
                        return segment;
                    }
                }

                if (handled == false)   {debugger; throw new Error("Syntax error: An unexpected token " + token + " was encountered at position " + lexer.currentByteIndex + ".");}
            }
            if (depth>0)    throw new Error("Syntax error: Unexpected EOF encountered");
            return accessor(currentPath);
        }
        return parse(0);
    }

    return Object.create({},
    {
        getTokenizers:  { value: function()
        {
            var tokenizers  =
            [
                new stringLiteralTokenizer("'", true),
                new stringLiteralTokenizer("\"", true),
                new stringLiteralTokenizer("`", false),
                new wordTokenizer(),
                new numeralTokenizer(),
                new delimiterTokenizer('.', propertyDelimiter),
                new operatorTokenizer("...", ROOTDIRECTIVE),
                new delimiterTokenizer('[', openKeyDelimiter),
                new delimiterTokenizer(']', closeKeyDelimiter)
            ];
            return tokenizers;
        }},
        parser: { value: 
        function parser(lexer)
        {
            Object.defineProperties(this,
            {
                parse:  {value: function(input)
                {
                    lexer.read(input!==undefined&&input!==null&&typeof input !== "string"?input.toString():input);
                    return parse(lexer);
                }}
            });
        }}
    });
});}();
!function()
{"use strict";
    var createObserver;
    function buildConstructor(removeFromArray, isolatedFunctionFactory, each, pathParser)
    {
        var getObserverEnum                             = {auto: 0, no: -1, yes: 1};
        var objectObserverFunctionFactory               = new isolatedFunctionFactory();
        var objectObserver                              =
        objectObserverFunctionFactory.create
        (function objectObserver(basePath, bag)
        {if (basePath==undefined) debugger;
            Object.defineProperties(this,
            {
                ___invoke:  {value: function(path, value){return this.__invoke(path, value, getObserverEnum.auto, false);}},
                __basePath: {get:   function(){return basePath;}},
                __bag:      {get:   function(){return bag;}},
                isDefined:  {value: function(propertyName){return this(propertyName)!==undefined;}},
                hasValue:   {value: function(propertyName){var value=this(propertyName); return value!==undefined && value!==null && value!=="";}}
            });
            return this;
        });
        var arrayObserverFunctionFactory                = new isolatedFunctionFactory();
        var arrayObserver                               =
        arrayObserverFunctionFactory.create
        (function arrayObserver(basePath, bag)
        {
            Object.defineProperties(this,
            {
                ___invoke:  {value: function(path, value){return this.__invoke(path, value, getObserverEnum.auto, false);}},
                __basePath: {get:   function(){return basePath;}},
                __bag:      {get:   function(){return bag;}}
            });
            return this;
        });
        function createObserver(revisedPath, bag, isArray)
        {
            return new (isArray?arrayObserver:objectObserver)(revisedPath, bag);
        }
        function getFullPath(paths)
        {
            if (paths.length == 0) return "";
            var path    = paths[0];
            for(var pathCounter=1;pathCounter<paths.length;pathCounter++)   path    += "." + paths[pathCounter];
            return path;
        }
        function addPropertyPath(bag, path, listener, direct)
        {
            if (bag.listenersByPath[path] === undefined)    bag.listenersByPath[path]   = {}
            bag.listenersByPath[path][listener.id]          = {listener: listener, direct: direct};
            listener.properties[path]                       = true;
        }
        function addProperties(bag, pathSegments)
        {
            var listener    = bag.updating[bag.updating.length-1];
            if (listener.ignore)    return;

            addPropertyPath(bag, "", listener, false);
            if (pathSegments.length === 0)  return;

            var path        = pathSegments[0];
            addPropertyPath(bag, path, listener, false);
            for(var segmentCounter=1;segmentCounter<pathSegments.length;segmentCounter++)
            {
                path        += "." + pathSegments[segmentCounter];
                addPropertyPath(bag, path, listener, segmentCounter == pathSegments.length - 1);
            }
        }
        function unregisterListenerFromProperties(bag, listener)
        {
            var propertyPaths   = Object.keys(listener.properties);
            for(var propertyPathCounter=0,propertyPath;(propertyPath=propertyPaths[propertyPathCounter++]) !== undefined;)
            {
                delete bag.listenersByPath[propertyPath][listener.id];
                delete listener.properties[propertyPath];
            }
if (Object.keys(listener.properties).length > 0) {debugger; throw new Error("Invalid operation: the properties bag should be empty.");}
        }
        function notifyPropertyListener(listener, bag, value)
        {
            bag.updating.push(listener);
            // useful for debugging.  I should consider a hook that allows debuggers to report on why re-evaluation of bound properties occur: var oldProperties   = listener.properties;

            unregisterListenerFromProperties(bag, listener);
            var postCallback    = listener.callback
            (
                value, 
                function(callback)
                {
                    listener.ignore =true;
                    try     {callback();}
                    catch(e){}
                    listener.ignore = false;
                }
            );
            bag.updating.pop();
            if (postCallback !== undefined) postCallback();
        }

        function notifyPropertyListeners(propertyKey, value, bag, directOnly)
        {
            var listenersToNotify   = {};

            var propertyPaths       = Object.keys(bag.listenersByPath);
            for(var propertyPathCounter=0,propertyPath;(propertyPath=propertyPaths[propertyPathCounter++]) !== undefined;)
            if (propertyPath == propertyKey || (!directOnly && propertyPath.startsWith(propertyKey+".")))
            {
                var listeners       = bag.listenersByPath[propertyPath];
                var listenerIds     = Object.keys(listeners);
                for(var listenerIdCounter=0,listener;(listener=listeners[listenerIds[listenerIdCounter++]]) !== undefined;)
                    if (listener.listener.callback !== undefined && !listener.listener.callback.ignore && (!directOnly||listener.direct)) listenersToNotify[listener.listener.id]  = listener.listener;
            }

            for(var rootPath in bag.listenersByRootPath)
            if ((propertyKey == rootPath || propertyKey.startsWith(rootPath+".")) && propertyKey.indexOf(".$shadow", rootPath.length) == -1)
            {
                listeners           = bag.listenersByRootPath[rootPath];
                listenerIds         = Object.keys(listeners);
                for(var listenerIdCounter=0,listener;(listener=listeners[listenerIds[listenerIdCounter++]]) !== undefined;)
                    if (listener.callback !== undefined && !listener.callback.ignore)   listenersToNotify[listener.id]  = listener;
            }

            listenerIds             = Object.keys(listenersToNotify);
            console.log("Notifying " + listenerIds.length + " listeners for changes to property located at `" + propertyKey + "`.");
            for(var listenerIdCounter=0,listener;(listener=listenersToNotify[listenerIds[listenerIdCounter++]]) !== undefined;)
            if(listener.callback !== undefined && !listener.callback.ignore)
                notifyPropertyListener.call(this, listener, bag, value);
        }
        function getItemChanges(oldItems, newItems)
        {
            var changes = {changed: [], items: newItems};
            for(var counter=0;counter<newItems.length;counter++)
            {
                if (oldItems.length<=counter||oldItems[counter]!==newItems[counter])    changes.changed.push(counter);
            }
            return changes;
        }
        function swap(index, toIndex)
        {
            var item    = this[index];
            removeFromArray(this, index);
            this.splice(toIndex, 0, item);
        }
        function filterMatchedByMatcher(paths, counter, matcher)
        {
            for(var pathCounter=paths.length-1,path;(path=paths[pathCounter--]) !== undefined;)
            if (!matcher.test(path))    paths.splice(pathCounter, 1);
        }
        function filterMatchedByPathSegment(paths, counter, pathSegment)
        {
            for(var pathCounter=paths.length-1,path;(path=paths[pathCounter--]) !== undefined;)
            if (path !== pathSegment)   paths.splice(pathCounter, 1);
        }
        var regExMatch  = /^\/.*\/$/;
        each([objectObserverFunctionFactory,arrayObserverFunctionFactory],function(functionFactory){Object.defineProperties(functionFactory.root.prototype,
        {
            __invoke:           {value: function(path, value, getObserver, peek, forceSet)
            {
                var accessor        = pathParser.parse(path);

                if (value === undefined && !forceSet)
                {
                    var result      = accessor.get({bag: this.__bag, basePath: this.__basePath}, (!peek && this.__bag.updating.length > 0 ? (function(pathSegments){addProperties(this.__bag, pathSegments);}).bind(this) : undefined));
                    var revisedPath = result.pathSegments !== undefined ? result.pathSegments.join(".") : undefined;
                    return getObserver !== getObserverEnum.no && (getObserver===getObserverEnum.yes||(path !== undefined && revisedPath !== undefined && result.value !== null && typeof result.value == "object"))
                    ?   createObserver(revisedPath, this.__bag, Array.isArray(result.value))
                    :   getObserver === getObserverEnum.no && result.value && result.value.isObserver ? result.value() : result.value;
                }

                if (this.__bag.rollingback) return;
                var currentValue    = accessor.get({bag: this.__bag, basePath: this.__basePath});
                if (value !== currentValue.value)
                {
                    accessor.set({bag: this.__bag, basePath: this.__basePath}, value, (function(revisedPath){notifyPropertyListeners.call(this, revisedPath, value, this.__bag, false);}).bind(this));
                }
            }},
            __notify:           {value: function(path, changes, directOnly)
            {
                for(var counter=0;counter<changes.changed.length;counter++) notifyPropertyListeners.call(this, path+"."+changes.changed[counter], changes.items[changes.changed[counter]], this.__bag, directOnly);
                notifyPropertyListeners.call(this, path, changes.items, this.__bag, true);
            }},
            delete:             {value: function(path){this.__invoke(path, undefined, undefined, undefined, true);}},
            equals:             {value: function(other){return other !== undefined && other !== null && this.__bag === other.__bag && this.__basePath === other.__basePath;}},
            observe:            {value: function(path){return this.__invoke(path, undefined, getObserverEnum.yes, false);}},
            peek:               {value: function(path, unwrap){return this.__invoke(path, undefined, unwrap === true ? getObserverEnum.no : getObserverEnum.auto, true);}},
            read:               {value: function(path, peek){return this.__invoke(path, undefined, getObserverEnum.auto, peek);}},
            unwrap:             {value: function(path){return this.__invoke(path, undefined, getObserverEnum.no, false);}},
            basePath:           {value: function(){return this.__basePath;}},
            shadows:            {get: function(){return this.__bag.shadows;}},
            beginTransaction:   {value: function(){this.__bag.backup   = JSON.parse(JSON.stringify(this.__bag.item));}},
            commit:             {value: function(){delete this.__bag.backup;}},
            define:             {value: function(path, property)
            {
                var current = this.__bag.virtualProperties;
                if (property && typeof property.get === "function"||typeof property.set === "function")
                {
                    var virtualProperty = {cachedValues: {}};
                    if (property.get !== undefined) virtualProperty.get = (function(basePath, key)
                    {
                        var path = basePath + ((basePath||"").length > 0 && (key||"").length > 0 ? "." : "") + key;
                        if (virtualProperty.cachedValues[path] === undefined)
                        {
                            virtualProperty.cachedValues[path]  = { listener: (function()
                            {
                                var oldValue                                = virtualProperty.cachedValues[path].value;
                                virtualProperty.cachedValues[path].value    = property.get.call(createObserver(basePath, this.__bag, false), key);
                                if (virtualProperty.cachedValues[path].value === oldValue)  return;
                                notifyPropertyListeners.call(this, path, virtualProperty.cachedValues[path].value, this.__bag, false);
                            }).bind(this)};
                            this.listen(virtualProperty.cachedValues[path].listener);
                        }
                        return virtualProperty.cachedValues[path].value;
                    }).bind(this);
                    if (property.set !== undefined) virtualProperty.set = (function(basePath, key, value){return property.set.call(createObserver(basePath, this.__bag, false), key, value);}).bind(this);

                    var pathSegments    = this.__basePath.split(".").concat((path||"").split(/\.|(\/.*?\/)/g)).filter(function(s){return s!=null&&s.length>0;});
                    var currentMatched  = Object.keys(this.__bag.listenersByPath).map(function(path){return path.split(".");});
                    for(var counter=0;counter<pathSegments.length;counter++)
                    {
                        var pathSegment = pathSegments[counter];
                        if (regExMatch.test(pathSegment))
                        {
                            var matcher = undefined;
                            for(var matcherCounter=0;matcherCounter<current.matchers.length;matcherCounter++)
                            if (current.matchers[matcherCounter].key === pathSegment)
                            {
                                matcher = current.matchers[matcherCounter];
                                break;
                            }

                            if (counter==pathSegments.length-1)
                            {
                                if (matcher !== undefined)
                                {
                                    console.warn("Redefining virtualProperty located at " + (this.__basePath + (this.__basePath.length > 0 ? "." : "") + path) + ".");
                                    matcher.property    = virtualProperty;
                                    filterMatchedByMatcher(currentMatched, counter, matcher);
                                }
                                else
                                {
                                    current.matchers.push
                                    ({
                                        key:        pathSegment,
                                        test:       (function(criteria){return function(path){return criteria.test(path);}})(new RegExp(pathSegment.substring(1,pathSegment.length-1))),
                                        property:   virtualProperty,
                                        paths:      {},
                                        matchers:   []
                                    });
                                    filterMatchedByMatcher(currentMatched, counter, current.matchers[current.matchers.length-1]);
                                    break;
                                }
                            }
                            else
                            {
                                if (matcher === undefined)
                                {
                                    matcher     =
                                    {
                                        key:        pathSegment,
                                        test:       (function(criteria){return function(path){return criteria.test(path);}})(new RegExp(pathSegment.substring(1,pathSegment.length-1))),
                                        paths:      {}, 
                                        matchers:   []
                                    };
                                    current.matchers.push(matcher);
                                }

                                current         = matcher;
                                filterMatchedByMatcher(currentMatched, counter, matcher);
                            }
                        }
                        else
                        {
                            if (current.paths[pathSegment] === undefined)   current.paths[pathSegment]    = {paths:{}, matchers:[]};
                            if (counter==pathSegments.length-1)
                            {
                                current.paths[pathSegment].property = virtualProperty;
                                filterMatchedByPathSegment(currentMatched, counter, pathSegment);
                                break;
                            }
                            else
                            {
                                current = current.paths[pathSegment];
                                filterMatchedByPathSegment(currentMatched, counter, pathSegment);
                            }
                        }
                    }
                    for(var pathCounter=0,path;(path=currentMatched[pathCounter++]) !== undefined;) notifyPropertyListeners.call(this, path, this.__bag.item, this.__bag, false);
                }
            }},
            ignore:             {value: function(callback)
            {
                var callbackFound   = false;
                for(var listenerCounter=this.__bag.listeners.length-1;listenerCounter>=0;listenerCounter--)
                {
                    var listener    = this.__bag.listeners[listenerCounter];
                    if (listener.callback === callback)
                    {
                        removeFromArray(this.__bag.listeners, listenerCounter);
                        unregisterListenerFromProperties(this.__bag, listener);
                        if (listener.nestedUpdatesRootPath !== undefined)
                        {
                            var listenersByRootPath = this.__bag.listenersByRootPath[listener.nestedUpdatesRootPath];
                            for(var listenerByRootPathCounter=listenersByRootPath.length-1;listenerByRootPathCounter>=0;listenerByRootPathCounter--)
                            if(listenersByRootPath[listenerByRootPathCounter] == listener)  removeFromArray(listenersByRootPath, listenerByRootPathCounter);
                        }
                        callbackFound   = true;
                    }
               }
                if (!callbackFound) debugger;
            }},
            isObserver:         {value: true},
            listen:             {value: function(callback, nestedUpdatesRootPath)
            {
                var listener    =
                {
                    id:                     this.__bag.listenerId++,
                    callback:               callback, 
                    properties:             {},
                    nestedUpdatesRootPath:  nestedUpdatesRootPath !== undefined
                                            ?   ((this.__basePath||"")+(this.__basePath && this.__basePath.length>0&&nestedUpdatesRootPath.length>0&&nestedUpdatesRootPath.substr(0,1)!=="."?".":"")+nestedUpdatesRootPath)
                                            :   undefined
                };
                this.__bag.listeners.push(listener);
                if (listener.nestedUpdatesRootPath !== undefined)
                {
                    if (this.__bag.listenersByRootPath[listener.nestedUpdatesRootPath] === undefined)   this.__bag.listenersByRootPath[listener.nestedUpdatesRootPath]  = [listener];
                    else                                                                                this.__bag.listenersByRootPath[listener.nestedUpdatesRootPath].push(listener);
                }
                notifyPropertyListener.call(this, listener, this.__bag);
            }},
            rollback:           {value: function()
            {
                this.__bag.rollingback  = true;
                this.__bag.item         = this.__bag.backup;
                delete this.__bag.backup;
                notifyPropertyListeners.call(this, this.__basePath, this.__bag.item, this.__bag, false);
                this.__bag.rollingback  = false;
            }},
            transform:          {value: function(path, property)
            {
                var accessor    = pathParser.parse(path);
                var that        = this;
                this.define(path, {get: function(key)
                {
                    return property.to(accessor.get({bag: that.__bag, basePath: that.__basePath}, undefined, true).value);
                }});
                this.listen((function()
                {
                    var virtual = accessor.get
                    (
                        {bag: this.__bag, basePath: this.__basePath},
                        this.__bag.updating.length > 0
                        ?   (function(pathSegments){addProperties(this.__bag, pathSegments);}).bind(this)
                        :   undefined
                    );
                    var value = property.back(virtual.value);
                    accessor.set({bag: this.__bag, basePath: this.__basePath}, value, undefined, true);
                }).bind(this), path);
            }}
        });});
        each(["push","pop","shift","unshift","sort","reverse","splice"], function(name)
        {
            Object.defineProperty
            (
                arrayObserverFunctionFactory.root.prototype, 
                name, 
                {
                    value: function()
                    {
                        var items       = this();
                        var oldItems    = items.slice();
                        var result      = items[name].apply(items, arguments);

                        this.__notify(this.__basePath, getItemChanges(oldItems, items), name==="sort" || name==="reverse");
                        if(name!=="sort" && name!=="reverse")   notifyPropertyListeners.call(this, this.__basePath + ".length", items.length, this.__bag, true);
                        return result === items ? this : result; 
                    }
                }
            );
        });
        each(["remove","removeAll","move","swap"], function(name)
        {
            Object.defineProperty
            (
                arrayObserverFunctionFactory.root.prototype,
                name, 
                {
                    value: function()
                    {
                        var items       = this();
                        var oldItems    = items.slice();
                        var result      = this["__"+name].apply(this, arguments); 
                        this.__notify(this.__basePath, getItemChanges(oldItems, items), false);
                        notifyPropertyListeners.call(this, this.__basePath + ".length", items.length, this.__bag, true);
                        return result; 
                    }
                }
            );
        });
        each(["join","indexOf","slice"], function(name)
        {
            Object.defineProperty
            (
                arrayObserverFunctionFactory.root.prototype, 
                name, 
                {
                    value: function()
                    {
                        var items   = this.unwrap(); 
                        return items[name].apply(items, arguments);
                    }
                }
            );
        });
        Object.defineProperties(arrayObserverFunctionFactory.root.prototype,
        {
            __move:             {value: function(value, toIndex)
            {
                var items   = this();
                if (!Array.isArray(items))  throw new Error("Observer does not wrap an Array.");
                swap.call(items, items.indexOf(value), toIndex);
            }},
            __swap:             {value: function(index, toIndex)
            {
                var items   = this();
                if (!Array.isArray(items))  throw new Error("Observer does not wrap an Array.");
                swap.call(items, index, toIndex);
            }},
            __remove:           {value: function(value)
            {
                var items   = this();
                if (!Array.isArray(items))  throw new Error("Observer does not wrap an Array.");
                removeFromArray(items, items.indexOf(value));
            }},
            __removeAll:        {value: function(values)
            {
                var items   = this();
                var keepers = [];
                if (!Array.isArray(items))  throw new Error("Observer does not wrap an Array.");
                for(var itemCounter=0;itemCounter<items.length;itemCounter++)
                {
                    var item    = items[itemCounter];
                    if (values.indexOf(item) == -1) keepers.push(item);
                }
                items.length = 0;
                items.push.apply(items, keepers);
            }},
            filter:             {value: function(filter)
            {
                var items       = this();
                var filtered    = [];
                for(var counter=0;counter<items.length;counter++)   if (filter(items[counter])) filtered.push(items[counter]);
                return filtered;
            }},
            isArrayObserver:    {value: true},
            count:              {get: function(){return this().length;}}
        });
        return createObserver;
    }
    root.define("atomic.observerFactory", function(removeFromArray, isolatedFunctionFactory, each, pathParser)
    {
        if (createObserver === undefined)  createObserver   = buildConstructor(removeFromArray, isolatedFunctionFactory, each, pathParser);
        return function observer(_item)
        {
            var bag             =
            {
                item:                   _item,
                virtualProperties:      {paths:{}, matchers: []},
                listenerId:             0,
                listenersByPath:        {},
                listenersByRootPath:    {},
                listeners:              [],
                propertyKeys:           [],
                updating:               [],
                shadows:                {},
                rollingback:            false
            };
            return createObserver("", bag, Array.isArray(_item));
        };
    });
}();
!function(){"use strict";root.define("atomic.dataBinder", function dataBinder(each, removeItemFromArray, defineDataProperties)
{
    function notifyProperties()
    {
        each(this.__properties,(function(property)
        {
            property.listen({bindPath: this.bindPath||"", data: this.data===undefined?null:this.data});
        }).bind(this));
    }
    function dataBinder(target, data)
    {
        Object.defineProperties(this,
        {
            "__properties": {value: [], configurable: true},
            "__forceRoot":  {value: false, configurable: true},
            "__target":     {value: target, configurable: true}
        });
        this.__makeRoot();
        if (data) this.data = data;
    };
    Object.defineProperties(dataBinder.prototype,
    {
        __makeRoot:             {value: function()
        {
            var parent  = this.__parentBinder;
            Object.defineProperty(this,"__parentBinder", {value: null, configurable: true});
            if(parent)   parent.unregister(this);
        }},
        bindPath:
        {
            get:    function(){return this.__bindPath;},
            set:    function(value){Object.defineProperty(this,"__bindPath", {value: value, configurable: true}); notifyProperties.call(this);}
        },
        data:
        {
            get:    function(){return this.__data;},
            set:    function(value)
            {
                if (value !== undefined && value !== null && value.isBinder && !this.__forceRoot)
                {
                    Object.defineProperty(this,"__parentBinder", {value: value, configurable: true});
                    value.register(this);
                    return;
                }

                if (this.__parentBinder !== null && value !== this.__parentBinder.data)
                {
                    Object.defineProperty(this,"__parentBinder", {value: null, configurable: true});
                    return;
                }

                Object.defineProperty(this, "__data", {value: value, configurable: true});
                notifyProperties.call(this);
            }
        },
        defineDataProperties:   {value: function (target, properties, singleProperty){defineDataProperties(target, this, properties, singleProperty);}},
        destroy:                {value: function()
        {
            each(this.__properties,(function(property){property.destroy();}).bind(this));
            each
            ([
                "__properties",
                "__forceRoot",
                "__target",
                "__data"
            ],
            (function(name)
            {
                Object.defineProperty(this, name, {value: null, configurable: true});
                delete this[name];
            }).bind(this));
        }},
        isBinder:               {value: true},
        isRoot:
        {
            get: function(){return this.__forceRoot || (this.__parentBinder==null&&this.__data!=null);}, 
            set: function(value)
            {
                if (value===true)   this.__makeRoot();
                Object.defineProperty(this, "__forceRoot", {value: value, configurable: true});
            }
        },
        register:               {value: function(property){if (this.__properties.indexOf(property)==-1) this.__properties.push(property); property.listen({data: this.data, bindPath: this.bindPath});}},
        unregister:             {value: function(property){property.data = undefined; removeItemFromArray(this.__properties, property);}}
    });
    return dataBinder;
});}()
!function()
{"use strict";
    var defineDataProperties;
    var bindCounter             = 0;
    function buildFunction(isolatedFunctionFactory, each)
    {
        var functionFactory = new isolatedFunctionFactory();
        var dataProperty    =
        functionFactory.create
        (function dataProperty(owner, getter, setter, onchange, binder, delay)
        {if (binder === undefined)  debugger;
            var property    = this;
            Object.defineProperties(this,
            {
                ___invoke:              {value: function(value, forceSet)
                {
                    if (value !== undefined || forceSet)
                    {
                        if (typeof setter === "function")   setter.call(owner, value);
                        if (Object.keys(this.__onchange).length===0)    property.__inputListener();
                    }
                    else                                    return getter.call(owner);
                }, configurable: true},
                __owner:                {value: owner, configurable: true},
                __binder:               {value: binder, configurable: true},
                __delay:                {value: delay, configurable: true},
                __getter:               {value: function(){if(getter === undefined) debugger; return getter.call(owner);}, configurable: true},
                __setter:               {value: function(value){if (typeof setter === "function") setter.call(owner, value);}, configurable: true},
                __notifyingObserver:    {value: undefined, writable: true, configurable: true},
                __onchange:             {value: {}, configurable: true},
                __inputListener:        {value: function(event){property.___inputListener(); if (event !== undefined && event !== null && typeof event.stopPropagation === "function") event.stopPropagation();}, configurable: true}
            });
            if (typeof onchange === "string") debugger;
            property.listen({onchange: onchange});
            if (binder) binder.register(property);
            return property;
        });
        function bindData()
        {
            if (this.__data === undefined || this.__data == null || this.isDestroyed)   return;
            Object.defineProperty(this,"__bounded", {value: true, configurable: true});
            if (this.__bind !== undefined)
            {
                Object.defineProperty(this, "__bindListener", 
                {
                    configurable:   true, 
                    value:          (function(val, ignore)
                    {
                        var value           = this.__getDataValue();
                        var currentValue    = this.__getter();
                        if (value === currentValue)  return;
                        if (!this.__notifyingObserver) this.__setter(value);
                        ignore((function(){notifyOnDataUpdate.call(this, this.data);}).bind(this)); 
                    }).bind(this)
                });
                each(this.__onchange, (function(onchange){onchange.listen(this.__inputListener, true);}).bind(this));
                this.data.listen(this.__bindListener, this.__root);
                notifyOnbind.call(this, this.data);
                return this;
            }
            else if (this.__onupdate)
            {
                Object.defineProperty(this, "__bindListener", {configurable: true, value: (function(){ this.__getDataValue(); setTimeout((function(){notifyOnDataUpdate.call(this, this.data);}).bind(this),0); }).bind(this)});
                this.data.listen(this.__bindListener, this.__root);
                notifyOnbind.call(this, this.data);
            }
            return this;
        }
        function unbindData()
        {
            Object.defineProperty(this,"__bounded", {value: false, configurable: true});
            var notify = false;
            if (this.__bindListener !== undefined)
            {
                if (notify = (this.data !== undefined)) this.data.ignore(this.__bindListener);
                this.__bindListener.ignore  = true;
                Object.defineProperty(this, "__bindListener", {configurable: true, value: undefined});
            }
            each(this.__onchange, (function(onchange){onchange.ignore(this.__inputListener);}).bind(this));
            if (notify)                                 notifyOnunbind.call(this);
        }
        function notifyOnbind(data)         { if (this.__onbind) this.__onbind.call(this.__owner, data); }
        function notifyOnDataUpdate(data)   { if (this.__onupdate) this.__onupdate.call(this.__owner, data); }
        function notifyOnunbind(data)       { if (this.__onunbind) this.__onunbind.call(this.__owner, data); }
        
        function rebind(callback)
        {
            unbindData.call(this);
            callback.call(this);
            bindData.call(this);
        }
        Object.defineProperties(functionFactory.root.prototype,
        {
            destroy:            {value: function()
            {
                unbindData.call(this);
                each
                ([
                    "___invoke",
                    "__owner",
                    "__binder",
                    "__delay",
                    "__getter",
                    "__setter",
                    "__notifyingObserver",
                    "__onchange",
                    "__inputListener",
                    "__data",
                    "__bind",
                    "__root",
                    "__onbind",
                    "__onupdate",
                    "__onunbind"
                ],
                (function(name)
                {
                    Object.defineProperty(this, name, {value: null, configurable: true});
                    delete this[name];
                }).bind(this));
                Object.defineProperty(this, "isDestroyed", {value: true});
            }},
            ___inputListener:   {value: function()
            {
                if (this.__delayId !== undefined)
                {
                    clearTimeout(this.__delayId);
                    delete this.__delayId;
                }
                function notifyObserver()
                {
                    if (this.__bounded===false) return;
                    this.__notifyingObserver    = true;
                    this.__setDataValue();
                    this.__notifyingObserver    = false;
                }
                if (this.__delay === undefined) notifyObserver.call(this);
                else                            this.__delayId  = setTimeout(notifyObserver.bind(this), this.__delay);
            }},
            __getDataValue:
            {
                value:  function()
                {
                    var bindPath    = this.__bindPath||"";
                    if      (typeof this.__bind === "function")                     return this.__bind.call(this.__owner, this.data.observe(bindPath));
                    else if (typeof this.__bind === "string")                       return this.data((bindPath.length>0?bindPath+".":"")+this.__bind);
                    else if (this.__bind && typeof this.__bind.get === "function")  return this.__bind.get.call(this.__owner, this.data.observe(bindPath));
                    return this.data(bindPath);
                }
            },
            __setDataValue:
            {
                value:  function()
                {
                    var bindPath    = this.__bindPath||"";
                    if (this.__getter === undefined || this.__bind === undefined)   return;

                    if      (typeof this.__bind === "string")                       this.data((bindPath.length>0?bindPath+".":"")+this.__bind, this.__getter());
                    else if (this.__bind && typeof this.__bind.set === "function")  this.__bind.set.call(this.__owner, this.data.observe(bindPath), this.__getter());
                    else                                                            {debugger; throw new Error("Unable to set back two way bound value to model.");}
                }
            },
            isDataProperty: {value: true, configurable: false, writable: false},
            listen:         {value: function(options)
            {
                rebind.call(this, function()
                {
                    each(["data","bindPath","root","onupdate"],(function(name){ if(options[name] !== undefined) Object.defineProperty(this, "__"+name, {value: options[name], configurable: true}); }).bind(this));
                    if(options.bind !== undefined)
                    {
                        Object.defineProperty(this, "__bind", {value: options.bind, configurable: true});
                    }
                    if(options.onchange !== undefined)
                    {
                        each(this.__onchange,   (function(event, name){Object.defineProperty(this.__onchange,name,{writable: true});delete this.__onchange[name];}).bind(this));
                        each(options.onchange,  (function(event, name){Object.defineProperty(this.__onchange,name,{value: event, configurable: true, enumerable: true});}).bind(this));
                    }
                });
            }},
            onchange:
            {
                get:    function(){return this.__onchange;},
                set:    function(value){throw new Error("obsolete");}
            },
            update:         {value: function(){this.___inputListener();}}
        });
        each(["data","bind","root"],function(name)
        {
            Object.defineProperty(functionFactory.root.prototype, name,
            {
                get:    function(){return this["__"+name];},
                set:    function(value){throw new Error("obsolete");}
            });
        });
        each(["onbind","onunbind","delay"],function(name)
        {
            Object.defineProperty(functionFactory.root.prototype, name,
            {
                get:    function(){return this["__"+name];},
                set:    function(value){Object.defineProperty(this, "__"+name, {value: value, configurable: true});}
            });
        });
        function defineDataProperty(target, binder, propertyName, property)
        {
            if (target.hasOwnProperty(propertyName)) target[propertyName].destroy();
            Object.defineProperty(target, propertyName, {value: new dataProperty(property.owner||target, property.get, property.set, property.onchange, binder, property.delay), configurable: true})
            each(["onbind","onupdate","onunbind","delay"],function(name){if (property[name])  target[propertyName][name] = property[name];});
        }
        function defineDataProperties(target, binder, properties, singleProperty)
        {
            if (typeof properties === "string") defineDataProperty(target, binder, properties, singleProperty);
            else                                each(properties, function(property, propertyName){defineDataProperty(target, binder, propertyName, property);});
        }
        return defineDataProperties;
    }
    root.define("atomic.defineDataProperties", function(isolatedFunctionFactory, each)
    {
        if (defineDataProperties === undefined) defineDataProperties    = buildFunction(isolatedFunctionFactory, each);
        return defineDataProperties;
    });
}();
!function(){"use strict";root.define("atomic.html.compositionRoot", function htmlCompositionRoot(customizeControlTypes)
{
    var each                    = root.utilities.each
    var isolatedFunctionFactory = new root.atomic.html.isolatedFunctionFactory(document);
    var pathParserFactory       = new root.atomic.pathParserFactory(new root.atomic.tokenizer());
    var pathParser              = new pathParserFactory.parser(new root.atomic.lexer(new root.atomic.scanner(), pathParserFactory.getTokenizers(), root.utilities.removeFromArray));
    var observer                = new root.atomic.observerFactory(root.utilities.removeFromArray, isolatedFunctionFactory, each, pathParser);
    var pubSub                  = new root.utilities.pubSub(isolatedFunctionFactory, root.utilities.removeItemFromArray);
    var defineDataProperties    = new root.atomic.defineDataProperties(isolatedFunctionFactory, each, pubSub);
    var dataBinder              = new root.atomic.dataBinder(each, root.utilities.removeItemFromArray, defineDataProperties);
    var eventsSet               = new root.atomic.html.eventsSet(pubSub, each);
    var controlTypes            = {};
    var viewAdapterFactory      =   new root.atomic.html.viewAdapterFactory
                                    (
                                        document,
                                        controlTypes,
                                        pubSub,
                                        function(message){console.log(message);},
                                        each,
                                        observer
                                    );

    var control                 = new root.atomic.html.control(document, root.utilities.removeItemFromArray, window.setTimeout, each, eventsSet, dataBinder);
    var readonly                = new root.atomic.html.readonly(control, each);
    var label                   = new root.atomic.html.label(readonly, each);
    var link                    = new root.atomic.html.link(readonly, each);
    var container               = new root.atomic.html.container(control, observer, each, viewAdapterFactory, root.utilities.removeItemFromArray);
    var panel                   = new root.atomic.html.panel(container, each);
    var screen                  = new root.atomic.html.screen(panel, observer);
    var linkPanel               = new root.atomic.html.link(panel, each);
    var composite               = new root.atomic.html.composite(container, each);
    var repeater                = new root.atomic.html.repeater(container, root.utilities.removeFromArray);
    var input                   = new root.atomic.html.input(control);
    var checkbox                = new root.atomic.html.checkbox(control);
    var select                  = new root.atomic.html.select(input, dataBinder, each);
    var radiogroup              = new root.atomic.html.radiogroup(input, dataBinder, each);
    var checkboxgroup           = new root.atomic.html.checkboxgroup(input, dataBinder, each);
    var multiselect             = new root.atomic.html.multiselect(select);
    var image                   = new root.atomic.html.image(control);
    var audio                   = new root.atomic.html.audio(control);
    var video                   = new root.atomic.html.video(audio);
    var button                  = new root.atomic.html.button(control);

    Object.defineProperties(controlTypes,
    {
        control:        {value: control},
        readonly:       {value: readonly},
        label:          {value: label},
        link:           {value: link},
        linkPanel:      {value: linkPanel},
        container:      {value: container},
        panel:          {value: panel},
        screen:         {value: screen},
        composite:      {value: composite},
        repeater:       {value: repeater},
        input:          {value: input},
        checkbox:       {value: checkbox},
        select:         {value: select},
        radiogroup:     {value: radiogroup},
        checkboxgroup:  {value: checkboxgroup},
        multiselect:    {value: multiselect},
        image:          {value: image},
        audio:          {value: audio},
        video:          {value: video},
        button:         {value: button}
    });
    var atomic  = { viewAdapterFactory: viewAdapterFactory, observer: observer };
    if (typeof customizeControlTypes === "function")    customizeControlTypes(controlTypes, atomic);
    return atomic;
});}();
!function(window, document){"use strict";root.define("atomic.launch", function launch(viewElement, controlsOrAdapter, callback)
{
    root.atomic.ready(function(atomic)
    {
        var adapter = atomic.viewAdapterFactory.launch(viewElement, controlsOrAdapter, callback);
    });
});}(window, document);
!function(window, document)
{"use strict";
    var atomic;
    root.define("atomic.ready", function ready(callback)
    {
        var deferOrExecute  =
        function()
        {
            if (atomic === undefined)   atomic  = root.atomic.html.compositionRoot();
            if (typeof callback === "function") callback(atomic);
        }
        if (document.readyState !== "complete") window.addEventListener("load", deferOrExecute);
        else                                    deferOrExecute();
    });
}(window, document);