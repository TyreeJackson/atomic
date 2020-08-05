!function()
{"use strict";
    function __namespace() {}
    function define(fullName, item) { namespace(this, fullName, item); }
    function get(fullName) { return namespace(this, fullName); }
    Object.defineProperties(__namespace.prototype, 
    {
        define: {value:define},
        get:    {value:get}
    });
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
    var reflect = {};
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
    Object.defineProperties(reflect,
    {
        deleteProperty:     {value: function deleteProperty(object, propertyName)
        {
            Object.defineProperty(object, propertyName, {value: null, configurable: true});
            delete object[propertyName];
        }},
        deleteProperties:   { value: function deleteProperties(object, propertyNames)
        {
            for(var counter=0,propertyName;(propertyName=propertyNames[counter]) !== undefined;counter++)
            {
                Object.defineProperty(object, propertyName, {value: null, configurable: true});
                delete object[propertyName];
            }
        }}
    });
    root.define("utilities.reflect", reflect);
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
                ___invoke:                  {value: function __invoke()
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
                {value: function destroy()
                {
                    reflect.deleteProperties(this,
                    [
                        "__listenersChanged",
                        "__listeners"
                    ]);
                    Object.defineProperty(this, "isDestroyed", { value: true });
                }},
                "__notifyListenersChanged": {value: function __notifyListenersChanged(){if (typeof this.__listenersChanged === "function") this.__listenersChanged(this.__listeners.length);}},
                listen:                     {value: function listen(listener, notifyEarly) { this.__listeners[notifyEarly?"unshift":"push"](listener); this.__notifyListenersChanged(); }},
                ignore:                     {value: function ignore(listener)              { removeItemFromArray(this.__listeners, listener); this.__notifyListenersChanged(); }},
                invoke:                     {value: function invoke(){this.apply(this, arguments);}}
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
!function(){"use strict";root.define("atomic.html.eventsSet", function eventsSet(pubSub, reflect)
{
    function listenerList(target, eventNames, withCapture, intermediary)
    {
        Object.defineProperties(this,
        {
            "__eventNames":     {value: eventNames},
            "__target":         {value: target},
            "__withCapture":    {value: withCapture},
            "__intermediary":   {value: intermediary&&intermediary.bind(this)},
            pubSub:             {value: new pubSub((this.__listenersChanged).bind(this))}
        });
    }
    Object.defineProperties(listenerList.prototype,
    {
        "__listenersChanged":   {value: function __listenersChanged(listenerCount)
        {
            for(var eventCounter=0,eventName;(eventName=this.__eventNames[eventCounter]) !== undefined;eventCounter++)
            if (listenerCount > 0 && !this.__isAttached)
            {
                this.__target.__element.addEventListener(eventName, this.__intermediary||this.pubSub, this.__withCapture);
                Object.defineProperty(this, "__isAttached", {value: true, configurable: true});
            }
            else    if(listenerCount == 0 && this.__isAttached)
            {
                this.__target.__element.removeEventListener(eventName, this.__intermediary||this.pubSub, this.__withCapture);
                Object.defineProperty(this, "__isAttached", {value: false, configurable: true});
            }
        }},
        destroy:
        {value: function destroy()
        {
            for(var eventCounter=0,eventName;(eventName=this.__eventNames[eventCounter]) !== undefined;eventCounter++)  this.__target.__element.removeEventListener(eventName, this.__intermediary||this.pubSub, this.__withCapture);
            this.pubSub.destroy();
            reflect.deleteProperties(this,
            [
                "pubSub",
                "__target"
            ]);
        }}
    });
    function eventsSet(target, intermediaries)
    {
        Object.defineProperties(this,
        {
            "__target":                     {value: target, configurable: true}, 
            "__listenersUsingCapture":      {value:{}, configurable: true}, 
            "__listenersNotUsingCapture":   {value:{}, configurable: true},
            "__intermediaries":             {value: intermediaries||{}, configurable: true}
        });
    }
    function getListener(name, withCapture, add)
    {
        var listeners       = withCapture ? this.__listenersUsingCapture : this.__listenersNotUsingCapture;
        var eventListeners  = listeners[name];
        var intermediary    = this.__intermediaries[name];
        if (add && eventListeners === undefined)    Object.defineProperty(listeners, name, {value: eventListeners=new listenerList(this.__target, intermediary ? intermediary.eventNames : [name], withCapture, intermediary&&intermediary.handler)});
        return eventListeners&&eventListeners.pubSub;
    }
    Object.defineProperties(eventsSet.prototype,
    {
        getOrAdd:   {value: function getOrAdd(name, withCapture){ return getListener.call(this, name, withCapture, true); }},
        get:        {value: function get(name, withCapture){ return getListener.call(this, name, withCapture, false); }},
        destroy:    {value: function destroy()
        {
            function destroyListener(listenerSet)
            {
                var keys    = Object.keys(listenerSet);
                for(var counter=0,key;(key=keys[counter])!==undefined;counter++)   listenerSet[key].destroy();
                reflect.deleteProperties(listenerSet, keys);
            };
            destroyListener(this.__listenersUsingCapture);
            destroyListener(this.__listenersNotUsingCapture);
            destroyListener(this.__intermediaries);

            reflect.deleteProperties(this,
            [
                "__target",
                "__listenersUsingCapture",
                "__listenersNotUsingCapture",
                "__intermediaries"
            ]);
        }}
    });
    return eventsSet;
});}();
!function(){"use strict";root.define("atomic.html.control", function htmlControl(document, removeItemFromArray, setTimeout, reflect, eventsSet, dataBinder, debugInfoObserver)
{
    var logCounter              = 0;
    var callbackCounter         = 0;
    var debugInfoAddQueue       = [];
    var debugInfoRemoveQueue    = [];
    var updateDebugInfoId;
    function resetDebugInfoQueue()
    {
        if (updateDebugInfoId !== undefined)
        {
            clearTimeout(updateDebugInfoId);
            updateDebugInfoId   = undefined;
        }
        function deferred()
        {
            updateDebugInfoId       = undefined;
            var addQueue            = debugInfoAddQueue;
            var removeQueue         = debugInfoRemoveQueue;
            debugInfoAddQueue       = [];
            debugInfoRemoveQueue    = [];
            var debugInfo           = debugInfoObserver.unwrap();
            for(var removeCounter=0,path;(path=removeQueue[removeCounter++])!==undefined;)
            for(var indexCounter=0,indexItem;(indexItem=debugInfo.__controlIndex[indexCounter++])!==undefined;)
            if (indexItem.path == path)
            {
                debugInfo.__controlIndex.splice(indexCounter-1, 1);
                debugInfoObserver.delete("controls."+path, true);
                break;
            }
            for(var addCounter=0,item;(item=addQueue[addCounter++])!==undefined;)
            {
                debugInfo.__controlIndex.push({shortName: item.viewAdapterPath.replace(/\.controls\./g, "."), path: item.viewAdapterPath})
                debugInfoObserver.setValue("controls."+item.viewAdapterPath, item, true);
            }
            debugInfo.__controlIndex.sort(function(a,b){return a.shortName<b.shortName?-1:a.shortName>b.shortName?1:0;});
            debugInfoObserver.notify("__controlIndex");
            debugInfoObserver.notify("controls");
        }
        updateDebugInfoId   = setTimeout(deferred, 100);
    }
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
            function setOption(option)
            {
                var optionName  = "option"+option.substr(0,1).toUpperCase()+option.substr(1);
                if (binding[option] !== undefined)  this[optionName] = binding[option];
            };
            setOption.call(this, "text");
            setOption.call(this, "value");
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
    var initializers    = {};
    var notifyEarly     = [];
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
        link:               {enumerable: true, value: function(viewAdapter, value)
        {
            var parentLink;
            for(var counter=0, dataLink; (dataLink=viewAdapter.__dataLinks[counter++]) !== undefined;)  if ((parentLink = value[dataLink]) !== undefined)   viewAdapter.link(parentLink, dataLink);
        }},
        on:                 {enumerable: true, value: function(viewAdapter, value)
        {
            for(var name in value)  viewAdapter.addEventListener(name, value[name].bind(viewAdapter), false, notifyEarly.indexOf(name) > -1);
        }},
        updateon:           {value: function updateon(viewAdapter, value)    {if (Array.isArray(value))  viewAdapter.updateon = value;}}
    });

    function defineBasicInitializer(val){ initializers[val] = function(viewAdapter, value) { if (viewAdapter[val] === undefined) {console.error("property named " +val + " was not found on the view adapter of type " + viewAdapter.constructor.name + ".  Skipping initializer."); return;} viewAdapter[val](value); }; }
    var initializerKeys = ["alt", "autoplay", "currentTime", "loop", "muted", "nativeControls", "preload", "mediaType", "playbackRate", "value", "volume"];
    for(var counter=0,initializerKey;(initializerKey=initializerKeys[counter]) !== undefined; counter++)    defineBasicInitializer(initializerKey);

    function defineOptionInitializer(val){ initializers[val] = function(viewAdapter, value) { viewAdapter[val] = value; }; }
    initializerKeys     = ["optionValue", "optionText", "isDataRoot"];
    for(var counter=0,initializerKey; (initializerKey=initializerKeys[counter]) !== undefined; counter++)    defineOptionInitializer(initializerKey);

    initializers.classes = function(viewAdapter, value){ for(var counter=0, className;(className=value[counter]) !== undefined;counter++) viewAdapter.toggleClass(className, true); };

    function defineHiddenInitializer(val){ initializers[val] = function(viewAdapter, value) { viewAdapter["__" + val] = value; }; };
    initializerKeys = ["onbind", "ondataupdate", "onsourceupdate", "onunbind"];
    for(var counter=0,initializerKey; (initializerKey=initializerKeys[counter]) !== undefined; counter++)    defineHiddenInitializer(initializerKey);

    function defineEventInitializer(val) { initializers["on" + val] = function(viewAdapter, callback)
    {
        console.warn("The '{on" + val + ": listener}' event initializer has been deprecated.  Please switch to the '{on: {" + val + ": listener}}' initializer instead."); 
        viewAdapter.addEventListener(val, callback.bind(viewAdapter), false);
    };}
    initializerKeys = ["abort", "blur", "canplay", "canplaythrough", "change", "changing", "click", "contextmenu", "copy", "cut", "dblclick", "drag", "dragend", "dragenter", "dragleave", "dragover", "dragstart", "drop", "durationchanged", "ended", "enter", "error", "escape", "focus", "focusin", "focusout", "hide", "input", "loadeddata", "loadedmetadata", "loadstart", "keydown", "keypress", "keyup", "mousedown", "mouseenter", "mouseleave", "mousemove", "mouseover", "mouseout", "mouseup", "paste", "pause", "play", "playing", "progress", "ratechange", "search", "seeked", "seeking", "select", "show", "stalled", "suspend", "timeupdate", "touchcancel", "touchend", "touchmove", "touchstart", "volumechange", "waiting", "wheel", "transitionend", "viewupdated"];
    for(var counter=0,initializerKey; (initializerKey=initializerKeys[counter]) !== undefined; counter++)    defineEventInitializer(initializerKey);

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
        for(var eventNameCounter=0;eventNameCounter<eventNames.length;eventNameCounter++)   Object.defineProperty(this.on, eventNames[eventNameCounter], {value: this.__events.getOrAdd(eventNames[eventNameCounter]), enumerable: true});
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
    function control(element, selector, parent, bindPath, childKey, protoChildKey)
    {
        if (element === undefined)
        {
            element                                                 = this.__createNode(selector);
            parent.__element.appendChild(element);
            if (this.__addSpacing)  parent.__element.appendChild(document.createTextNode (" "));
            element[selector.substr(0,1)==="#"?"id":"className"]    = selector.substr(1);
            element.__selectorPath                                  = parent.getSelectorPath();
        }
        Object.defineProperties(this, 
        {
            __element:              {value: element, configurable: true},
            __elementPlaceholder:   {value: [], configurable: true},
            __events:               {value: new eventsSet(this, this.__getCustomEvents()), configurable: true},
            on:                     {value: {}, configurable: true},
            __attributes:           {value: {}, writable: true, configurable: true},
            __class:                {value: null, writable: true, configurable: true},
            __selector:             {value: selector, configurable: true},
            parent:                 {value: parent, configurable: true},
            __binder:               {value: new dataBinder(this), configurable: true},
            __forceRoot:            {value: false, configurable: true},
            classes:                {value: {}, configurable: true},
            __viewUpdateQueue:      {value: {order: [], elements: {}}, configurable: true},
            __childKey:             {value: childKey, configurable: true},
            __protoChildKey:        {value: protoChildKey, configurable: true}
        });
        Object.defineProperties(this, 
        {
            __selectorPath:         {value: this.getSelectorPath()},
            __viewAdapterPath:      {value: this.getViewAdapterPath()},
            __protoViewAdapterPath: {value: this.getViewAdapterPath(true)}
        });
        if (debugInfoObserver)
        {
            debugInfoAddQueue.push({protoViewAdapterPath: this.__protoViewAdapterPath, viewAdapterPath: this.__viewAdapterPath, selectorPath: this.__selectorPath, selector: this.__selector, childKey: this.__childKey||"root", protoChildKey: protoChildKey||"root", bindPaths: this.__binder.__getDebugInfo()});
            resetDebugInfoQueue();
            this.__element.addEventListener("mouseover", (function(event)
            {
                if (!event.ctrlKey || !event.shiftKey)  return;
                debugInfoObserver("__selectedControlPath", this.__viewAdapterPath);
                event.preventDefault();
                event.stopPropagation();
                event.cancelBubble = true;
                return false;
            }).bind(this), false);
        }
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
                    if (this.__attributes !== undefined)
                    {
                        for (var key in this.__attributes) this.__element.setAttribute("data-" + key, undefined);
                        this.getEvents("viewupdated").viewupdated(Object.keys(this.__attributes));
                    }

                    this.__attributes=value;

                    if (value!==undefined)
                    {
                        for(var key in value)   this.__element.setAttribute("data-" + key, value[key]);
                        this.getEvents("viewupdated").viewupdated(Object.keys(value));
                    }
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
    function notifyClassEvent(classNames, exists)
    {
        for (var counter=0,className,event;(className = classNames[counter++]) !== undefined;)
        if ((event = this.__events.get("class-"+className)) !== undefined)  event(exists);
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
    Object.defineProperty(control, "__getViewProperty", {value: function __getViewProperty(name) { return viewProperties[name]; }});
    Object.defineProperties(control.prototype,
    {
        // fields
        constructor:        {value: control},
        // properties
        bindPath:           {get:   function(){return this.__binder.bindPath||"";},                             set:    function(value){this.__binder.bindPath = value; }},
        bind:               {get:   function(){return this.value.bind;}},
        data:               {get:   function(){return this.__binder.data.observe(this.bindPath);}},
        height:             {get:   function(){return this.__element.offsetHeight;},                            set:    function(value){console.log("setting height on " + this.getSelectorPath()); this.__element.style.height = parseInt(value)+"px"; this.getEvents("viewupdated").viewupdated(["offsetHeight"]);}},
        isDataRoot:         {get:   function(){return this.__isDataRoot;},                                      set:    function(value){Object.defineProperty(this, "__isDataRoot", {value: value===true, configurable: true});}},
        isRoot:             {get:   function(){return this.__forceRoot||this.parent===undefined;},              set:    function(value){Object.defineProperty(this, "__forceRoot", {value: value===true, configurable: true});}},
        scrollTop:          {get:   function(){return this.__element.scrollTop;},                               set:    function(value){this.__element.style.scrollTop = parseInt(value); this.getEvents("viewupdated").viewupdated(["scrollTop"]);}},
        root:               {get:   function(){return !this.isRoot && this.parent ? this.parent.root : this;}},
        updateon:           {get:   function(){return Object.keys(this.value.onchange); },                      set:    function(eventNames){ this.value.onchange = this.getEvents(eventNames); }},
        width:              {get:   function(){return this.__element.offsetWidth;},                             set:    function(value){console.log("setting width on " + this.getSelectorPath()); this.__element.style.width = parseInt(value)+"px"; this.getEvents("viewupdated").viewupdated(["offsetWidth"]);}},
        // methods
        __addCustomEvents:  {value: function __addCustomEvents(events)
        {
            Object.defineProperties(events,
            {
                escape:           {value:   {eventNames: ["keydown"],   handler: function(event){ if (event.keyCode==27) { this.pubSub(event); } }}},
                gainingfocus:     {value:   {eventNames: ["focusin"],   handler: function(event){ this.pubSub(event); }}},
                losingfocus:      {value:   {eventNames: ["focusout"],  handler: function(event){ if (!this.__target.__element.contains(event.relatedTarget)) { this.pubSub(event); } }}}
            });
        }},
        __createNode:       {value: function __createNode()                             { return document.createElement("div"); }, configurable: true},
        __getCustomEvents:  {value: function __getCustomEvents()
        {
           var customEvents = {};
           this.__addCustomEvents(customEvents);
           return customEvents;
        }},
        __getData:          {value: function __getData()                                { return this.__binder.data; }},
        __getViewData:      {value: function __getViewData(name)
        {
            var property    = this.constructor.__getViewProperty(name);
            return  this.__viewUpdateQueue.elements[name] !== undefined
                    ?   property.reset
                        ?   this.__viewUpdateQueue.elements[name]
                        :   this.__viewUpdateQueue.elements[name][this.__viewUpdateQueue.elements[name].length-1]
                    :   property.get(this);
        }},
        __setViewData:      {value: function __setViewData(name, value)
        {
            var property    = this.constructor.__getViewProperty(name);
            if (property.reset)
            {
                this.__viewUpdateQueue.elements[name]   = value;
                this.__viewUpdateQueue.order.push({name: name, value: value});
            }
            else
            {
                (this.__viewUpdateQueue.elements[name]=this.__viewUpdateQueue.elements[name]||[]).push(value)
                this.__viewUpdateQueue.order.push({name: name, value: value});
            }

            if (property.value) property.value(this, value);
            (!this.isRoot ? this.parent : this).__deferViewUpdate(this);
        }},
        __updateDebugInfo:  {value: function __updateDebugInfo()
        {
            if (debugInfoObserver === undefined)    return;
            function deferred()
            {
                delete this.__updateDebugInfoId;
                if (this.__binder !== undefined)    debugInfoObserver(this.__viewAdapterPath + ".bindPaths", this.__binder.__getDebugInfo()); 
                else                                debugInfoObserver.delete(this.__viewAdapterPath);
            }
            if (this.__updateDebugInfoId !== undefined)
            {
                clearTimeout(this.__updateDebugInfoId);
                delete(this.__updateDebugInfoId);
            }
            this.__updateDebugInfoId    = setTimeout(deferred.bind(this), 0);
        }},
        __updateView:       {value: function __updateView()
        {
            var queue           = this.__viewUpdateQueue;
            Object.defineProperty(this, "__viewUpdateQueue", {value: {order: [], elements: {}}, configurable: true});
            var keys            = [];
            while(queue.order.length > 0)
            {
                var operation   = queue.order.shift();
                var property    = this.constructor.__getViewProperty(operation.name);
                property.set(this, operation.value);
                if (keys.indexOf(operation.name) == -1) keys.push(operation.name);
            }
            this.getEvents("viewupdated").viewupdated(keys);
        }},
        __reattach:         {value: function __reattach()
        {
            this.__elementPlaceholder.parentNode.replaceChild(this.__element, this.__elementPlaceholder); 
            delete this.__elementPlaceholder;
            return this;
        }},
        __setData:          {value: function __setData(data)                          { this.__binder.data = data; }},
        addClass:           {value: function addClass(className, silent)
        {
            if (className === undefined)    return;
            var classNames      = this.__getViewData("className").split(" ");
            var classNamesToAdd = className.split(" ");
            for(var counter=0,classNameToAdd;(classNameToAdd = classNamesToAdd[counter++]) !== undefined;)
            if (classNames.indexOf(classNameToAdd) === -1)  classNames.push(classNameToAdd);
            this.__setViewData("className", classNames.join(" ").trim());
            if (!silent)    notifyClassEvent.call(this, classNamesToAdd, true);
            return this;
        }},
        bindClass:          {value: function bindClass(className)
        {
            this.__binder.defineDataProperties(this.classes, className, 
            {
                owner:      this,
                get:        function(){return this.hasClass(className);}, 
                set:        function(value){this.toggleClass(className, value===true, true);}, 
                onchange:   [this.__events.getOrAdd("class-"+className)]
            })
        }},
        destroy:            {value: function destroy()
        {
            this.__binder.data = undefined;
            if (debugInfoObserver)
            {
                debugInfoRemoveQueue.push(this.__viewAdapterPath);
                resetDebugInfoQueue();
            }
            this.__events.destroy();
            this.__binder.destroy();
            reflect.deleteProperties(this, 
            [
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
            ]);
            Object.defineProperty(this, "isDestroyed", {value: true});
            Object.freeze(this);
        }},
        frame:              {value: function frame(controlDefinition)
        {
            addEvents.call(this, controlDefinition.events);
            addCustomMembers.call(this, controlDefinition.members);

            if (controlDefinition.extensions !== undefined && controlDefinition.extensions.length !== undefined)
            for(var counter=0;counter<controlDefinition.extensions.length;counter++)
            {
                if (controlDefinition.extensions[counter] === undefined)        throw new Error("Extension was undefined in view adapter with element " + this.__element.__selectorPath+"-"+this.__selector);
                if (controlDefinition.extensions[counter].extend !== undefined) controlDefinition.extensions[counter].extend.call(this);
            }
        }},
        getEvents:          {value: function getEvents(eventNames)
        {
            if (!Array.isArray(eventNames)) eventNames  = [eventNames];
            var events  = {};
            for(var counter=0,eventName;(eventName=eventNames[counter]) !== undefined; counter++) events[eventName] = this.__events.getOrAdd(eventName);
            return events;
        }},
        getSelectorPath:    {value: function getSelectorPath()                                      { return (this.parent === undefined ? "" : this.parent.getSelectorPath() + "-") + (this.__selector||"root"); }},
        getViewAdapterPath: {value: function getViewAdapterPath(proto)                              { return (this.parent === undefined ? "" : this.parent.getViewAdapterPath(proto) + ".controls.") + ((proto?this.__protoChildKey:this.__childKey)||((this.__selector||"#root").substr(1) + ".root")); }},
        hasClass:           {value: function hasClass(className)                                    { return this.__getViewData("className").split(" ").indexOf(className) > -1; }},
        hasFocus:           {value: function hasFocus(nested)                                       { return document.activeElement == this.__element || (nested && this.__element.contains(document.activeElement)); }},
        hide:               {value: function hide()                                                 { this.__setViewData("style.display", "none"); this.triggerEvent("hide"); return this; }},
        initialize:         {value: function initialize(initializerDefinition, controlDefinition)
        {
            for(var initializerKey in initializers)
            if (initializerDefinition.hasOwnProperty(initializerKey))   initializers[initializerKey](this, initializerDefinition[initializerKey]);

            if (controlDefinition !== undefined && controlDefinition.extensions !== undefined && controlDefinition.extensions.length !== undefined)
            for(var counter=0;counter<controlDefinition.extensions.length;counter++)    initializeViewAdapterExtension.call(this, initializerDefinition, controlDefinition.extensions[counter]);
        }},
        //TODO: ensure that this control is moved to the siblingControl's parent controls set
        insertBefore:       {value: function insertBefore(siblingControl)                           { siblingControl.__element.parentNode.insertBefore(this.__element, siblingControl.__element); return this; }},
        //TODO: ensure that this control is moved to the siblingControl's parent controls set
        insertAfter:        {value: function insertAfter(siblingControl)                            { siblingControl.__element.parentNode.insertBefore(this.__element, siblingControl.__element.nextSibling); return this; }},
        removeClass:        {value: function removeClass(className, silent)
        {
            if (className === undefined)
            {
                this.__setViewData("className", "");
                return;
            }
            var classNames              = this.__getViewData("className").split(" ");
            var classNamesToRemove      = className.split(" ");
            for(var counter=0,classNameToRemove;(classNameToRemove = classNamesToRemove[counter++]) !== undefined;)
            if (classNames.indexOf(classNameToRemove) > -1) removeItemFromArray(classNames, classNameToRemove);
            this.__setViewData("className", classNames.join(" "));
            if (!silent)    notifyClassEvent.call(this, classNamesToRemove, false);
            return this;
        }},
        scrollIntoView:     {value: function scrollIntoView()                                       { if (this.__element.scrollIntoView) this.__element.scrollIntoView(); else this.__element.scrollTop = 0; return this; }},
        select:             {value: function select()                                               { selectContents(this.__element); return this; }},
        show:               {value: function show()                                                 { this.__setViewData("style.display", ""); this.triggerEvent("show"); return this; }},
        toggleClass:        {value: function toggleClass(className, condition, silent)              { if (condition === undefined) condition = !this.hasClass(className); return this[condition?"addClass":"removeClass"](className, silent); }},
        toggleEdit:         {value: function toggleEdit(condition)                                  { if (condition === undefined) condition = this.__element.getAttribute("contentEditable")!=="true"; this.__element.setAttribute("contentEditable", condition); this.getEvents("viewupdated").viewupdated(["contentEditable"]); return this; }},
        toggleDisplay:      {value: function toggleDisplay(condition)                               { if (condition === undefined) condition = this.__getViewData("style.display")=="none"; this[condition?"show":"hide"](); return this; }},
        triggerEvent:       {value: function triggerEvent(eventName)                                { var args = Array.prototype.slice(arguments, 1); this.__events.getOrAdd(eventName).invoke(args); return this; }}
    });
    function defineCallback(name){Object.defineProperty(control.prototype,name,{value:function(){this.__setViewData("callback", function(){this.__setViewData("callback", function(){this.__element[name]();});}); return this;}});}
    defineCallback("blur");
    defineCallback("click");
    defineCallback("focus");
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
    function defineForSet(name1, name2){defineFor(name1, name2);defineFor(name2,name1);}
    defineForSet("addClass","removeClass");
    defineForSet("show","hide");

    function defineListeners(name)
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
                if (!Array.isArray(eventNames)) eventNames  = [eventNames];
                for(var counter=0,eventName;(eventName=eventNames[counter]) !== undefined; counter++)   this.addEventListener(eventName, listener, withCapture, notifyEarly);
                return this;
            }}
        );
    }
    defineListeners("addEvent");
    defineListeners("removeEvent");
    return control;
});}();
!function(){"use strict";root.define("atomic.html.readonly", function htmlReadOnly(control, reflect)
{
    function readonly(elements, selector, parent, bindPath, childKey, protoChildKey)
    {
        control.call(this, elements, selector, parent, bindPath, childKey, protoChildKey);
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
            disabled:           {get: function(){return this.__element.disabled;},                  set: function(value){for(var counter=0,element; (element=this.__elements[counter])!==undefined; counter++) element.disabled = !(!value); this.__element.disabled=!(!value); this.getEvents("viewupdated").viewupdated(["disabled"]);}},
            display:            {get: function(){return this.__getViewData("styles.display")=="";}, set: function(value){this[value?"show":"hide"]();}},
            enabled:            {get: function(){return !this.__element.disabled;},                 set: function(value){for(var counter=0,element; (element=this.__elements[counter])!==undefined; counter++) element.disabled = !value; this.__element.disabled=!value; this.getEvents("viewupdated").viewupdated(["disabled"]);}},
            tooltip:            {get: function(){return this.__element.title;},                     set: function(value){var val = value&&value.isObserver?value():(value||""); for(var counter=0,element; (element=this.__elements[counter])!==undefined; counter++) element.title = val; this.__element.title = val; this.getEvents("viewupdated").viewupdated(["title"]);}},
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
!function(){"use strict";root.define("atomic.html.label", function htmlLabel(control, reflect)
{
    function label(elements, selector, parent, bindPath, childKey, protoChildKey)
    {
        control.call(this, elements, selector, parent, bindPath, childKey, protoChildKey);
        Object.defineProperty(this, "__elements", {value: Array.prototype.slice.call(parent.__element.querySelectorAll(selector)), configurable: true});
        this.__binder.defineDataProperties(this,
        {
            for:                {get: function(){return this.__element.getAttribute("for");},   set: function(value){for(var counter=0,element; (element=this.__elements[counter])!==undefined; counter++) element.setAttribute("for", value); this.__element.setAttribute("for", value); this.getEvents("viewupdated").viewupdated(["for"]);}}
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
!function(){"use strict";root.define("atomic.html.link", function htmlLink(base, reflect)
{
    function link(elements, selector, parent, bindPath, childKey, protoChildKey)
    {
        base.call(this, elements, selector, parent, bindPath, childKey, protoChildKey);
        this.__binder.defineDataProperties(this,
        {
            href: {get: function(){return this.__element.href;}, set: function(value){var val = value&&value.isObserver?value():value; if(this.__elements !== undefined) for(var counter=0,element; (element=this.__elements[counter])!==undefined; counter++) element.href = val; this.__element.href = val; this.getEvents("viewupdated").viewupdated(["href"]);}}
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
!function(){"use strict";root.define("atomic.html.container", function htmlContainer(control, observer, reflect, viewAdapterFactory, removeItemFromArray, debugInfoObserver)
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
        "label":                    "label",
        "input:file":               "file",
        "table":                    "table",
        "details":                  "details"
    };

    var controlTypeNames    = ["default","abbr","address","article","aside","b","bdi","blockquote","body","caption","cite","code","col","colgroup","dd","del","dfn","dialog","div","dl","dt","em","fieldset","figcaption","figure","footer","h1","h2","h3","h4","h5","h6","header","i","ins","kbd","legend","li","menu","main","mark","menuitem","meter","nav","ol","optgroup","p","pre","q","rp","rt","ruby","section","s","samp","small","span","strong","sub","summary","sup","tbody","td","tfoot","th","thead","time","title","tr","u","ul","wbr"];
    for(var counter=0, controlTypeName;(controlTypeName=controlTypeNames[counter]) !== undefined; counter++)    elementControlTypes[controlTypeName]    = "readonly";

    function getControlTypeForElement(definition, element, multipleElements)
    {
        return  definition.type
                ||
                (definition.controls || definition.adapter
                ?   element !== undefined && element.nodeName.toLowerCase() == "a"
                    ?   "linkPanel"
                    :   element.nodeName.toLowerCase() == "details"
                        ?   "details"
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
    function container(elements, selector, parent, bindPath, childKey, protoChildKey)
    {
        control.call(this, elements, selector, parent, bindPath, childKey, protoChildKey);
        Object.defineProperties(this,
        {
            __controlKeys:          {value: [], configurable: true},
            controlData:            {value: new observer({}), configurable: true},
            controls:               {value: {}, configurable: true},
            __extendedBindPath:     {value: "", configurable: true},
            __controlsToUpdate:     {value: {}, configurable: true},
            __links:                {value: {}, configurable: true},
            __forwardedProperties:  {value: {}, configurable: true}
        });
    }
    function forwardProperty(propertyKey, property)
    {
        var propertyValue   = property.property.call(this);
        this.__binder.defineDataProperties(this, propertyKey, {get: function(){return propertyValue();}, set: function(value){propertyValue(value);}, onchange: propertyValue.onchange});
        
        if (property.value !== undefined)
        if (this[propertyKey].isDataProperty)   this[propertyKey](property.value);
        else                                    this[propertyKey]   = property.value;
    }
    function forwardDeferredForwardProperties()
    {
        if (this.__forwardedProperties === undefined)   return;
        var propertyKeys    = Object.keys(this.__forwardedProperties);
        for(var counter=0,propertyKey;(propertyKey=propertyKeys[counter]) !== undefined; counter++) forwardProperty.call(this, propertyKey, this.__forwardedProperties[propertyKey]);
        reflect.deleteProperty(this, "__forwardedProperties");
    }
    function deferForwardProperty(propertyKey, property)
    {
        if (this.__forwardedProperties === undefined)   return forwardProperty(propertyKey, {property: property});
        this.__forwardedProperties[propertyKey] = { property: property, value: undefined};
        this.__binder.defineDataProperties(this, propertyKey, {get: function(){return this.__forwardedProperties[propertyKey].value;}, set: function(value){this.__forwardedProperties[propertyKey].value = value;}});
    }
    function attachProperty(propertyKey, property)
    {
        var state   = {updating: false};
        if (typeof property === "function")         deferForwardProperty.call(this, propertyKey, property);
        else    if (property.bound === true)
        {
            var get     = typeof property.get === "string" ? buildGet(property.get) : property.get;
            var set     = typeof property.set === "string" ? buildSet(property.set, state) : function(value){state.updating = true; property.set.call(this, value); state.updating = false;}
            this.__binder.defineDataProperties(this, propertyKey, {get: get, set: set, onchange:  connectOnchange(this, propertyKey, get, property.onchange||"change", state), onupdate: property.onupdate, delay: property.delay});
        }
        else                                        Object.defineProperty(this, propertyKey, {get: property.get, set: property.set});
    }
    function buildGet(property)                     { return function(){return this.controlData(property);} }
    function buildSet(property, state)              { return function(value){state.updating = true; this.controlData(property, value); state.updating = false;} }
    function connectOnchange(control, propertyKey, get, listenerCallback, state)
    {
        if (typeof listenerCallback === "string")   return control.getEvents(listenerCallback);
        
        var propertyEvent   = control.__events.getOrAdd("controlData:" + propertyKey);
        state.updating      = true;
        control.controlData.listen(function(){var value = get.call(control); if (!state.updating) propertyEvent(null, value);});
        state.updating      = false;
        return [propertyEvent];
    }
    function updateChildControlBindPaths()
    {
        var childControls   = this.children;
        var bindPath        = this.__customBind ? "" : (this.bindPath + (this.bindPath.length > 0 && this.__extendedBindPath.length > 0 ? "." : "") + this.__extendedBindPath);
        if (childControls != null)
        {
            var childControlKeys    = Object.keys(childControls);
            for(var counter=0, childControlKey;(childControlKey=childControlKeys[counter]) !== undefined; counter++)    childControls[childControlKey].bindPath = bindPath;
        }
    }
    Object.defineProperty(container, "prototype", {value: Object.create(control.prototype)});
    Object.defineProperties(container,
    {
        elementControlTypes:    {get:   function() { return elementControlTypes; }},
        __getViewProperty:      {value: function __getViewProperty(name) { return control.__getViewProperty(name); }},
    });
    Object.defineProperties(container.prototype,
    {
        __cancelViewUpdate:     {value: function __cancelViewUpdate()
        {
            if (this.__updateViewTimerId !== undefined)
            {
                clearTimeout(this.__updateViewTimerId);
                if (this.isDestroyed)   return;
                delete this.__updateViewTimerId;
            }
        }},
        __deferViewUpdate:      {value: function __deferViewUpdate(control)
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
        __updateView:           {value: function __updateView(detach)
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
        __getData:              {value: function __getData()
        {
            return this.__customBind ? this.controlData : this.__binder.data;
        }},
        __linkData:             {value: function __linkData(data)
        {
            var parentLinkPaths = Object.keys(this.__links);
            if (parentLinkPaths.length === 0)   return;
            for(var counter=0,parentLinkPath;(parentLinkPath = parentLinkPaths[counter++]) !== undefined;)  data.link(parentLinkPath, this.controlData, this.__links[parentLinkPath]);
        }},
        __setData:              {value: function __setData(data)
        {
            if (this.__binder.data !== undefined && this.__binder.data !== null)    this.__unlinkData(this.__binder.data);
            this.__binder.data      = data; 
            var childControls       = this.children;
            var childData           = this.__getData();
            if (childControls != null)
            {
                var childControlKeys    = Object.keys(childControls);
                for(var counter=0, childControlKey;(childControlKey=childControlKeys[counter]) !== undefined; counter++)    childControls[childControlKey].__setData(childData);
            }
            if (data !== undefined && data !== null)                                this.__linkData(data.peek(this.__binder.bindPath));
        }},
        __setExtendedBindPath:  {value: function __setExtendedBindPath(path)
        {
            Object.defineProperty(this, "__extendedBindPath", {value: path||"", configurable: true});
            updateChildControlBindPaths.call(this);
            if (debugInfoObserver)  this.__updateDebugInfo();
        }},
        __unlinkData:           {value: function __unlinkData(data)
        {
            var parentLinkPaths = Object.keys(this.__links);
            for(var counter=0,parentLinkPath;(parentLinkPath = parentLinkPaths[counter++]) !== undefined;)  data.unlink(parentLinkPath, this.controlData, this.__links[parentLinkPath]);
        }},
        bind:                   {get:   function(){var bind = this.value.bind; if (bind !== undefined && typeof bind !== "string") throw new Error("You may only use simple bindings on containers.  Please consider using a computed property on the observer instead."); return bind;}},
        constructor:            {value: container},
        appendControl:          {value: function appendControl(key, childControl)
        {
            this.__element.appendChild(childControl.__element); 
            this.__controlKeys.push(key);
            this.controls[key] = childControl;
            this.getEvents("viewupdated").viewupdated(["innerHTML"]);
            return this;
        }},
        addControl:             {value: function addControl(controlKey, controlDeclaration)
        {console.warn("The `addControl` method maybe deprecated soon.");
            if (controlDeclaration === undefined)  return;
            var control;
            var bindPath    = this.__customBind ? "" : this.bindPath + (this.bindPath.length > 0 && this.__extendedBindPath.length > 0 ? "." : "") + this.__extendedBindPath;
            this.appendControl(controlKey, control = this.createControl(controlDeclaration, undefined, "#" + controlKey, controlKey, controlKey, bindPath));
            if (this.data !== undefined)    this.controls[controlKey].__setData(this.__getData());
            return control;
        }},
        attachControls:         {value: function attachControls(controlDeclarations)
        {
            if (controlDeclarations === undefined)  return;
            var selectorPath    = this.getSelectorPath();
            var bindPath    = this.__customBind ? "" : (this.bindPath + (this.bindPath.length > 0 && this.__extendedBindPath.length > 0 ? "." : "") + this.__extendedBindPath);
            for(var controlKey in controlDeclarations)
            {
                this.__controlKeys.push(controlKey);
                var declaration = controlDeclarations[controlKey];
                var selector    = (declaration.selector||("#"+controlKey));
                var elements    = viewAdapterFactory.selectAll(this.__element, selector, selectorPath);
                var control     = this.controls[controlKey] = this.createControl(declaration, elements&&elements[0], selector, controlKey, controlKey, bindPath, elements && elements.length > 1);
            }
            var data            = this.__getData();
            if (data !== undefined) for(var controlKey in controlDeclarations)  this.controls[controlKey].__setData(data);
        }},
        attachRemoteControl:    {value: function attachRemoteControl(remoteControlUrl, remoteControlName, constructorArguments, controlKey, callback)
        {
            viewAdapterFactory.loadControlFactory(remoteControlUrl, remoteControlName, constructorArguments, (function(controlFactory)
            {
                if (this.isDestroyed)   return;
                var def         = {};
                def[controlKey] = {factory: controlFactory};
                this.attachControls(def);
                callback();
            }).bind(this));
        }},
        attachProperties:       {value: function attachProperties(propertyDeclarations)
        {
            if (propertyDeclarations === undefined) return;
            for(var propertyKey in propertyDeclarations)
            {
                attachProperty.call(this, propertyKey, propertyDeclarations[propertyKey]);
            }
        }},
        attachDataLinks:        {value: function attachDataLinks(dataLinks)
        {
            Object.defineProperty(this, "__dataLinks", {value: (dataLinks||[]).slice()})
        }},
        children:               {get: function(){return this.controls || null;}},
        createControl:          {value: function createControl(controlDeclaration, controlElement, selector, controlKey, protoControlKey, bindPath, multipleElements, preConstruct)
        {
            var control;
            if (controlDeclaration.factory !== undefined)
            {
                control = controlDeclaration.factory(this, controlElement, selector, controlKey, protoControlKey, this.__customBind ? "" : bindPath, controlDeclaration);
            }
            else    control = viewAdapterFactory.create
            ({
                definitionConstructor:  controlDeclaration.adapter||function(){ return controlDeclaration; },
                initializerDefinition:  controlDeclaration,
                viewElement:            controlElement,
                parent:                 this,
                selector:               selector,
                controlKey:             controlKey,
                protoControlKey:        protoControlKey,
                controlType:            getControlTypeForElement(controlDeclaration, controlElement, multipleElements),
                preConstruct:           preConstruct,
                bindPath:               this.__customBind ? "" : bindPath
            });
            return control;
        }},
        destroy:                {value: function destroy()
        {
            if (this.__binder.data !== undefined && this.__binder.data !== null)    this.__unlinkData(this.__binder.data);
            this.__binder.data      = undefined; 
            var childControls       = this.children;
            if (childControls != null)
            {
                var childControlKeys    = Object.keys(childControls);
                for(var counter=0, childControlKey;(childControlKey=childControlKeys[counter]) !== undefined; counter++)    childControls[childControlKey].destroy();
            }
            reflect.deleteProperties(this,
            [
                "__controlKeys",
                "controls"
            ]);
            control.prototype.destroy.call(this);
        }},
        frame:                  {value: function frame(controlDefinition)
        {
            Object.defineProperty(this, "__customBind", {value: controlDefinition.customBind === true, configurable: true});
            control.prototype.frame.call(this, controlDefinition);

            this.attachProperties(controlDefinition.properties);
            this.attachDataLinks(controlDefinition.dataLinks);
        }},
        initialize:         {value: function initialize(initializerDefinition, controlDefinition)
        {
            var binding =   initializerDefinition.bind !== undefined && initializerDefinition.bind !== null
                            ?   typeof initializerDefinition.bind === "object" && initializerDefinition.bind.value !== undefined && initializerDefinition.bind.value !== null
                                ?   typeof initializerDefinition.bind.value === "object" && initializerDefinition.bind.value.to !== undefined && initializerDefinition.bind.value.to !== null
                                    ?   initializerDefinition.bind.value.to
                                    :   initializerDefinition.bind.value
                                :   initializerDefinition.bind
                            :   null;
            if (typeof binding === "function")      throw new Error("Function based value bindings are no longer supported on containers.  Please switch to binding to a computed property on the observer.  Path: "+ this.getSelectorPath());
            else if (typeof binding === "string")   {this.__setExtendedBindPath(binding);}
            control.prototype.initialize.call(this, initializerDefinition, controlDefinition);
            if (controlDefinition !== undefined)    this.attachControls(controlDefinition.controls, this.__element);
            forwardDeferredForwardProperties.call(this);
        }},
        link:                   {value: function(parentLinkPath, controlDataLinkPath)
        {
            this.__links[parentLinkPath]    = controlDataLinkPath;
            if (this.__binder.data !== undefined)   this.__binder.data.link(parentLinkPath, this.controlData, this.__links[parentLinkPath]);
        }},
        removeControl:          {value: function(key)
        {console.warn("The `removeControl` method maybe deprecated soon.");
            var childControl    = this.controls[key];
            if (childControl !== undefined)
            {
                this.__setViewData("removeChild", childControl.__element);
                delete this.controls[key];
            }
            removeItemFromArray(this.__controlKeys, key);
            this.getEvents("viewupdated").viewupdated(["innerHTML"]);
            return this;
        }},
        value:                  {get: function(){return {listen: (function(options)
        {
            if (typeof options.bind === "function")     throw new Error("Function based value bindings are no longer supported on containers.  Please switch to binding to a computed property on the observer.  Path: "+ this.getSelectorPath());
            else if (typeof options.bind === "string")  {this.__setExtendedBindPath(options.bind);}
        }).bind(this)}}, configurable: true}
    });
    return container;
});}();
!function(){"use strict";root.define("atomic.html.panel", function htmlPanel(container, reflect)
{
    function panel(elements, selector, parent, bindPath, childKey, protoChildKey)
    {
        container.call(this, elements, selector, parent, bindPath, childKey, protoChildKey);
    }
    Object.defineProperty(panel, "prototype", {value: Object.create(container.prototype)});
    Object.defineProperty(panel, "__getViewProperty", {value: function(name) { return container.__getViewProperty(name); }});
    Object.defineProperties(panel.prototype,
    {
        constructor:        {value: panel},
        frame:              {value: function(controlDefinition, initializerDefinition)
        {
            container.prototype.frame.call(this, controlDefinition, initializerDefinition);
        }}
    });
    return panel;
});}();
!function(){"use strict";root.define("atomic.html.details", function htmlDetails(panel, document)
{
    function details(element, selector, parent, bindPath, childKey, protoChildKey)
    {
        panel.call(this, element, selector, parent, bindPath, childKey, protoChildKey);
        var summaryElement  = element.querySelector("summary");
        if (summaryElement == null)
        {
            summaryElement  = document.createElement("summary");
            this.__element.appendChild(summaryElement);
        }
        Object.defineProperties(this, 
        {
            __summaryElement:   {value: summaryElement, configurable: true}
        });
        this.__binder.defineDataProperties(this,
        {
            open:       {get: function(){return this.__element.open==true;},        set: function(value){this.__element.open=!(!value); this.getEvents("viewupdated").viewupdated(["open"]);},    onchange: this.getEvents("toggle")},
            summary:    {get: function(){return this.__getViewData("summary");},    set: function(value){this.__setViewData("summary", value);}}
        });
    }
    Object.defineProperty(details, "prototype", {value: Object.create(panel.prototype)});
    var viewProperties  =
    {
        summary:    { reset:    false,  get: function(control){ return control.__summary    !== undefined ? control.__summary   : control.__summaryElement.innerHTML; },    set: function(control, value){ var val = value&&value.isObserver?value():value; control.__summary   = control.__summaryElement.innerHTML    = val;},     value: function(control, value){ control.__summary = value; } }
    };
    Object.defineProperty(details, "__getViewProperty", {value: function(name) { return viewProperties[name]||panel.__getViewProperty(name); }});
    Object.defineProperties(details.prototype,
    {
        constructor:    {value: details},
        __createNode:   {value: function(){return document.createElement("details");}, configurable: true}
    });
    return details;
});}();
!function(){"use strict";root.define("atomic.html.screen", function htmlScreen(panel, observer)
{
    function screen(elements, selector, parent, bindPath, childKey, protoChildKey)
    {
        panel.call(this, elements, selector, parent, bindPath, childKey, protoChildKey);
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
!function(){"use strict";root.define("atomic.html.composite", function htmlComposite(base, reflect, observer)
{
    function composite(elements, selector, parent, bindPath, childKey, protoChildKey)
    {
        base.call(this, elements, selector, parent, bindPath, childKey, protoChildKey);
    }
    Object.defineProperty(composite, "prototype", {value: Object.create(base.prototype)});
    Object.defineProperty(composite, "__getViewProperty", {value: function(name) { return base.__getViewProperty(name); }});
    Object.defineProperties(composite.prototype,
    {
        constructor:        {value: composite},
        frame:              {value: function(controlDefinition, initializerDefinition)
        {
            base.prototype.frame.call(this, controlDefinition, initializerDefinition);
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
                delete this.__repeatedControls[templateKey];
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
            console.log("Collecting garbage... ");
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
        var clone       = { key: itemKey, parent: template.parent, control: this.createControl(template.declaration, elementCopy, "#" + itemKey, itemKey, templateKey, bindPath + (bindPath.length > 0 ? "." : "") + itemIndex) };
        Object.defineProperty(clone.control, "__templateKey", {value: templateKey});
        //console.log("created: " + clone.control.__selector)
        return clone;
    }
    function getTemplateCopy(templateKey, itemIndex)
    {
        var itemKey         = templateKey+"_"+itemIndex;
        var template        = this.__templates[templateKey];
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
    function repeater(elements, selector, parent, bindPath, childKey, protoChildKey)
    {
        control.call(this, elements, selector, parent, bindPath, childKey, protoChildKey);
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
        constructor:    {value: repeater},
        frame:          {value: function(controlDefinition, initializerDefinition)
        {
            extractDeferredControls.call(this, controlDefinition.repeat, this.__element);
            control.prototype.frame.call(this, controlDefinition, initializerDefinition);
        }},
        children:       {get:   function(){return this.__repeatedControls || null;}},
        destroy:        {value: function()
        {
            refreshList.call(this, 0);
            control.prototype.destroy.call(this);
        }},
        pageSize:       {get:   function(){return this.__pageSize;}, set: function(value){this.__pageSize = value;}}
    });
    return repeater;
});}();
!function(){"use strict";root.define("atomic.html.table", function htmlTable(control, removeFromArray)
{
    var querySelector       =
    function(uiElement, selector, selectorPath, typeHint)
    {
        return uiElement.querySelector(selector)||document.createElement(typeHint);
    };
    function removeAllElementChildren(element)
    {
        while(element.lastChild)    element.removeChild(element.lastChild);
    }
    function extractDeferredControls(headerDeclaration, rowDeclaration, cellDeclaration, viewElement)
    {
        if (headerDeclaration !== undefined)
        {
            var headerElement                               = querySelector(viewElement, (headerDeclaration.selector||("thead>tr>th")), this.getSelectorPath(), "th");
            var headerElementParent                         = headerElement.parentNode;
            if (headerElementParent !== null)               headerElementParent.removeChild(headerElement);
            Object.defineProperty(this, "__header", { value:
            { 
                declaration:    headerDeclaration,
                element:        headerElement,
                parentElement:  headerElementParent
            }});
        }
        if (cellDeclaration !== undefined)
        {
            var cellElement                                 = querySelector(viewElement, (cellDeclaration.selector||("tbody>tr>td")), this.getSelectorPath(), "td");
            var rowElement                                  = cellElement.parentNode;
            var rowElementParent                            = rowElement.parentNode;
            rowElement.removeChild(cellElement);
            if (rowElementParent !== null)                  rowElementParent.removeChild(rowElement);
            Object.defineProperty(this, "__cell", { value:
            { 
                declaration:    cellDeclaration,
                cellElement:    cellElement,
                rowDeclaration: rowDeclaration,
                rowElement:     rowElement,
                parentElement:  rowElementParent
            }});
        }
        removeAllElementChildren(this.__header.parentElement);
        removeAllElementChildren(this.__cell.parentElement);
    }
    function removeListItem(itemIndex)
    {
        var templateKey     = "row_" + itemIndex;
        var repeatedControl = this.__repeatedRows[templateKey];
        if (repeatedControl !== undefined)
        {
            this.__retained[templateKey]    = repeatedControl;
            repeatedControl.__element.parentNode.removeChild(repeatedControl.__element);
            repeatedControl.__setData(null);
            delete this.__repeatedRows[templateKey];
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
    function addListItem(itemIndex, documentFragment)
    {
        var clone       = getTemplateCopy.call(this, itemIndex);
        if (clone !== undefined)
        {
            this.__repeatedRows["row_" + itemIndex] = clone.control;
            documentFragment.appendChild(clone.control.__element);
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
    function createTemplateCopy(itemIndex, itemKey)
    {
        var elementCopy = this.__cell.rowElement.cloneNode(true);
        elementCopy.setAttribute("id", itemKey);
        var bindPath    = this.__rows.__basePath;
        var clone       = { key: itemKey, control: this.createControl(this.__cell.rowDeclarations, elementCopy, "#" + itemKey, itemKey, "row", bindPath + (bindPath.length > 0 ? "." : "") + itemIndex) };
        Object.defineProperty(clone.control, "__templateKey", {value: "row"});
        //console.log("created: " + clone.control.__selector)
        return clone;
    }
    function getTemplateCopy(itemIndex)
    {
        var itemKey         = "row_"+itemIndex;
        var template        = this.__cell;
        var retainedControl = getRetainedTemplateCopy.call(this, itemKey);
        var clone           = retainedControl !== null ? { key: itemKey, parent: template.parentElement, control: retainedControl } : createTemplateCopy.call(this, itemIndex, itemKey);
        var data            = this.__getData();
        if (data !== undefined) clone.control.__setData(data);
        return clone;
    };
    function discardRetained()
    {
        this.__trash.push(this.__retained);
        Object.defineProperty(this, "__itemCount", {value: 0, configurable: true});
        Object.defineProperty(this, "__retained", {value: {}, configurable: true});
    }
    function refreshTable(forceRefresh)
    {
        var itemCount   = this.__rows != undefined ? this.__rows("length")||0 : 0;
        if (isNaN(itemCount) || itemCount === (this.__itemCount) || this.__headerCount === 0)   return;
        if (forceRefresh)   discardRetained.call(this);
        if (this.__itemCount < itemCount)
        {
            var documentFragment    = document.createDocumentFragment();
            for(var counter=this.__itemCount;counter<itemCount;counter++)   addListItem.call(this, counter, documentFragment);
            this.__setViewData("callback", function() { this.__cell.parentElement.appendChild(documentFragment); });
        }
        else if (this.__itemCount > itemCount)
        {
            for(var counter=this.__itemCount-1;counter>=itemCount;counter--)   removeListItem.call(this, counter);
            resetGarbageCollector.call(this);
        }
        Object.defineProperty(this, "__itemCount", {value: itemCount, configurable: true});
    }
    function refreshLayout()
    {
        var headerCount = this.__headers != undefined ? this.__headers("length")||0 : 0;
        if (isNaN(headerCount) || headerCount === (this.__headerCount)) return;
        removeAllElementChildren(this.__header.parentElement);

        var headerDeclarations      = {selector: "thead > tr", bind: this.headers.bind, controls: {}};
        this.__cell.rowDeclarations = {bind: this.__cell.rowDeclaration.bind, on: this.__cell.rowDeclaration.on, controls: {}};
        for(var counter=0;counter < this.__headers("length"); counter++)
        {
            headerDeclarations.controls["header_"+counter] = {bind: counter.toString(), controls: this.__header.declaration};
            var newNode = this.__header.element.cloneNode(true);
            newNode.id  = "header_"+counter;
            this.__header.parentElement.appendChild(newNode);

            this.__cell.rowDeclarations.controls["cell_" + counter] = {bind: counter.toString(), controls: this.__cell.declaration};
            var newNode = this.__cell.cellElement.cloneNode(true);
            newNode.id  = "cell_"+counter;
            this.__cell.rowElement.appendChild(newNode);
        }
        this.attachControls({header: headerDeclarations});
        Object.defineProperty(this, "__headerCount", {value: headerCount, configurable: true});
        refreshTable.call(this, true);
    }
    function table(elements, selector, parent, bindPath, childKey, protoChildKey)
    {
        control.call(this, elements, selector, parent, bindPath, childKey, protoChildKey);
        Object.defineProperties(this,
        {
            __headerRowCells:       {value: [], configurable: true},
            __templateContainers:   {value: {}, configurable: true},
            __retained:             {value: {}, configurable: true},
            __trash:                {value: [], configurable: true},
            __itemCount:            {value: 0, configurable: true},
            __headerCount:          {value: 0, configurable: true},
            __repeatedRows:         {value: {}, configurable: true}
        });
        this.__binder.defineDataProperties(this,
        {
            headers:    {get: function(){return this.__headers;},   set: function(value){this.__headers = value; refreshLayout.call(this);}, simpleBindingsOnly: true},
            rows:       {get: function(){return this.__rows;},      set: function(value){this.__rows = value; refreshTable.call(this);}, simpleBindingsOnly: true}
        });
        this.value.listen({bind: ""});
    }
    Object.defineProperty(table, "prototype", {value: Object.create(control.prototype)});
    Object.defineProperty(table, "__getViewProperty", {value: function(name) { return control.__getViewProperty(name); }});
    Object.defineProperties(table.prototype,
    {
        constructor:                {value: table},
        frame:                      {value: function(controlDefinition, initializerDefinition)
        {
            extractDeferredControls.call(this, controlDefinition.header, controlDefinition.row, controlDefinition.cell, this.__element);
            control.prototype.frame.call(this, controlDefinition, initializerDefinition);
        }},
        children:   {get: function(){return this.__repeatedRows || null;}},
        pageSize:   {get: function(){return this.__pageSize;}, set: function(value){this.__pageSize = value;}}
    });
    return table;
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
    function notifyIfValueHasChangedOrDelay()
    {
        if ((this.__target.__lastChangingValueSeen||"") === this.__target.value())  return;
        this.__target.__lastChangingValueSeen = this.__target.value();
        if (this.__target.onchangingdelay !== undefined)
        {
            if (this.__target.__lastChangingTimeout !== undefined)   clearTimeout(this.__target.__lastChangingTimeout);
            this.__target.__lastChangingTimeout  = setTimeout(notifyIfValueHasChanged.bind(this.__target, this.pubSub), this.__target.onchangingdelay);
        }
        else    notifyIfValueHasChanged.call(this, callback);
    }
    function input(elements, selector, parent, bindPath, childKey, protoChildKey)
    {
        control.call(this, elements, selector, parent, bindPath, childKey, protoChildKey);
        this.__binder.defineDataProperties(this,
        {
            value:          {get: function(){return this.__element.value;},         set: function(value){this.__element.value = value||""; this.getEvents("viewupdated").viewupdated(["value"]);},    onchange: this.getEvents("change")},
            placeholder:    {get: function(){return this.__element.placeholder;},   set: function(value){this.__element.placeholder = value||""; this.getEvents("viewupdated").viewupdated(["placeholder"]);}}
        });
    }
    Object.defineProperty(input, "prototype", {value: Object.create(control.prototype)});
    Object.defineProperty(input, "__getViewProperty", {value: function(name) { return control.__getViewProperty(name); }});
    Object.defineProperties(input.prototype,
    {
        constructor:        {value: input},
        __addCustomEvents:  {value: function(events)
        {
            control.prototype.__addCustomEvents.call(this, events);
            Object.defineProperties(events,
            {
                changing:         {value:   {eventNames: ["keydown", "keyup", "mouseup", "touchend", "change"], handler: notifyIfValueHasChangedOrDelay} },
                enter:            {value:   {eventNames: ["keypress"],                                          handler: function(event){ if (event.keyCode==13) { this.pubSub(event); } }}}
            });
        }},
        __createNode:       {value: function(){var element = document.createElement("input"); element.type="textbox"; return element;}, configurable: true},
        select:             {value: function(){this.__element.select(); return this;}},
        onchangingdelay:    {get:   function(){return this.__onchangingdelay;}, set: function(value){Object.defineProperty(this, "__onchangingdelay", {value: value, configurable: true});}}
    });
    return input;
});}();
!function(){"use strict";root.define("atomic.html.checkbox", function htmlCheckbox(control)
{
    function checkbox(elements, selector, parent, bindPath, childKey, protoChildKey)
    {
        control.call(this, elements, selector, parent, bindPath, childKey, protoChildKey);
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
!function(){"use strict";root.define("atomic.html.file", function htmlFile(control)
{
    function useReader(use, callback, errorCallback)
    {
        var reader  = new FileReader();
        function handleloadend()
        {
            reader.removeEventListener("loadend", handleloadend);
            callback(reader.result);
            reader  = null;
        }
        reader.addEventListener("loadend", handleloadend);
        function handleerror()
        {
            reader.removeEventListener("error", handleerror);
            errorCallback();
            reader  = null;
        }
        reader.addEventListener("error", handleerror);
        use(reader);
    }
    function File(htmlFile)
    {
        Object.defineProperty(this, "__file", {value: htmlFile, configurable: true});
        Object.defineProperties(this,
        {
            lastModified:       {get: function(){return this.__file.lastModified;}, enumerable: true},
            lastModifiedDate:   {get: function(){return this.__file.lastModifiedDaate;}, enumerable: true},
            name:               {get: function(){return this.__file.name;}, enumerable: true},
            size:               {get: function(){return this.__file.size;}, enumerable: true},
            type:               {get: function(){return this.__file.type;}, enumerable: true}
        });
    }
    Object.defineProperties(File.prototype,
    {
        readAsArrayBuffer:  {value: function(callback, errorCallback){useReader((function(reader){reader.readAsArrayBuffer(this.__file);}).bind(this), callback, errorCallback)}},
        readAsBinaryString: {value: function(callback, errorCallback){useReader((function(reader){reader.readAsBinaryString(this.__file);}).bind(this), callback, errorCallback)}},
        readAsDataURL:      {value: function(callback, errorCallback){useReader((function(reader){reader.readAsDataURL(this.__file);}).bind(this), callback, errorCallback)}},
        readAsText:         {value: function(callback, errorCallback){useReader((function(reader){reader.readAsText(this.__file);}).bind(this), callback, errorCallback)}}
    });
    function adapt(htmlFiles)
    {
        var returnFiles = [];
        for(var counter=0, htmlFile; (htmlFile=htmlFiles[counter++]) !== undefined;)  returnFiles.push(new File(htmlFile));
        return returnFiles;
    }
    function file(elements, selector, parent, bindPath, childKey, protoChildKey)
    {
        control.call(this, elements, selector, parent, bindPath, childKey, protoChildKey);
        this.__binder.defineDataProperties(this,
        {
            value:  {get: function(){return adapt(this.__element.files);}, set: function(value){},  onchange: this.getEvents("change")}
        });
    }
    Object.defineProperty(file, "prototype", {value: Object.create(control.prototype)});
    Object.defineProperty(file, "__getViewProperty", {value: function(name) { return control.__getViewProperty(name); }});
    Object.defineProperties(file.prototype,
    {
        constructor:    {value: file},
        __createNode:   {value: function(){var element = document.createElement("input"); element.type="file"; return element;}, configurable: true}
    });
    return file;
});}();
!function(){"use strict";root.define("atomic.html.select", function htmlSelect(input, dataBinder, reflect)
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
        if (this.items !== undefined)
        {
            var bound       = this.items.bind != undefined;
            if (this.__element.options.length > 0) for(var counter=0;counter<this.__element.options.length;counter++) this.__element.options[counter].selected = (bound ? this.__element.options[counter].rawValue : this.__element.options[counter].value) == value;
            this.getEvents("viewupdated").viewupdated(["value"]);
        }
    }
    function selectoption(element, selector, parent)
    {
        Object.defineProperties(this, 
        {
            "__element":        {value: element, configurable: true},
            "__sourceBinder":   {value: new dataBinder(), configurable: true}
        });
        this.__sourceBinder.defineDataProperties(this,
        {
            text:   {get: function(){return this.__element.text;}, set: function(value){this.__element.text = value&&value.isObserver?value():value;}},
            value:  {get: function(){return this.__element.rawValue;}, set: function(value){this.__element.value = this.__element.rawValue = value&&value.isObserver?value():value; this.selected = parent.__isValueSelected(value);}}
        });
    }
    Object.defineProperties(selectoption.prototype,
    {
        source:     {get: function(){return this.__sourceBinder.data;}, set: function(value){this.__sourceBinder.data = value;}},
        selected:   {get: function(){return this.__element.selected;}, set: function(value){this.__element.selected = !(!value);}},
        destroy:                {value: function()
        {
            this.__sourceBinder.destroy();
            reflect.deleteProperties(this,
            [
                "__element",
                "__sourceBinder"
            ]);
            Object.defineProperty(this, "isDestroyed", {value: true});
        }},
    });
    function createOption(sourceItem, index)
    {
        var option          = new selectoption(document.createElement('option'), this.selector+"-"+index, this);
        option.text.listen({bind: this.optionText||""});
        option.value.listen({bind: this.optionValue||""});
        option.source       = sourceItem;
        return option;
    }
    function select(element, selector, parent, bindPath, childKey, protoChildKey)
    {
        input.call(this, element, selector, parent, bindPath, childKey, protoChildKey);
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
                    var itemCount       = value !== undefined && value !== null ? value.isObserver ? value("length") : value.length : 0;
                    var items           = value !== undefined && value !== null && value.isObserver ? value() : value;
                    if (items === this.__items && itemCount === this.__itemCount)           return;
                    var truncateIndex   = items === this.__items ? itemCount : 0;
                    Object.defineProperties(this,
                    {
                        __items:        {value: items, configurable: true},
                        __itemCount:    {value: itemCount, configurable: true},
                    });

                    bindSelectListSource.call(this, value, truncateIndex);
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
        __isValueSelected:  {value: function(value){return this.__rawValue === value;}},
        destroy:            {value: function()
        {
            bindSelectListSource.call(this, undefined, 0);
            input.prototype.destroy.call(this);
        }}
    });
    function defineOptionMember(name)
    {
        var thisName    = name.substr(0,1).toUpperCase()+name.substr(1);
        Object.defineProperty(select.prototype, "option"+thisName, 
        {
            get: function(){ return this["__option"+thisName]; },
            set: function(value)
            {
                Object.defineProperty(this,"__option"+thisName, {value: value, configurable: true});
                for(var counter=0,option;(option=this.__options[counter]) !== undefined; counter++) option[name].bind = value;
            }
        });
    }
    defineOptionMember("text");
    defineOptionMember("value");
    function removeOption(index)
    {
        var option  = this.__options[index];
        this.__element.removeChild(option.__element);
        option.destroy();
        this.__options.splice(index, 1);
    }
    function clearOptions(truncateIndex){ for(var counter=this.__options.length-1;counter>=truncateIndex;counter--) removeOption.call(this, counter); }
    function bindSelectListSource(items, truncateIndex)
    {
        var selectedValue   = this.__rawValue;
        var itemsCount      = items !== undefined && items !== null ? items.count : 0;
        clearOptions.call(this, truncateIndex);
        var startingIndex   = this.__options.length;
        if (items === undefined)   return;

        for(var counter=startingIndex;counter<itemsCount;counter++)
        {
            var sourceItem  = items.observe(counter, true);
            var option      = createOption.call(this, sourceItem, counter);
            this.__options.push(option);
            this.__element.appendChild(option.__element);
        }
    }
    return select;
});}();
!function(){"use strict";root.define("atomic.html.radiogroup", function htmlRadioGroup(input, dataBinder, reflect)
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
    function radiogroup(elements, selector, parent, bindPath, childKey, protoChildKey)
    {
        input.call(this, elements, selector, parent, bindPath, childKey, protoChildKey);
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
    function defineOptionMember(name)
    {
        var thisName    = name.substr(0,1).toUpperCase()+name.substr(1);
        Object.defineProperty(radiogroup.prototype, "option"+thisName, 
        {
            get: function(){ return this["__option"+thisName]; },
            set: function(value)
            {
                Object.defineProperty(this,"__option"+thisName, {value: value, configurable: true});
                for(var counter=0,option;(option=this.__options[counter]) !== undefined; counter++) option[name].bind = value;
            }
        });
    }
    defineOptionMember("text");
    defineOptionMember("value");
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
    function multiselect(elements, selector, parent, bindPath, childKey, protoChildKey)
    {
        base.call(this, elements, selector, parent, bindPath, childKey, protoChildKey);
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
!function(){"use strict";root.define("atomic.html.checkboxgroup", function htmlCheckboxGroup(input, dataBinder, reflect)
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
    function checkboxgroup(elements, selector, parent, bindPath, childKey, protoChildKey)
    {
        input.call(this, elements, selector, parent, bindPath, childKey, protoChildKey);
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
    function defineOptionMember(name)
    {
        var thisName    = name.substr(0,1).toUpperCase()+name.substr(1);
        Object.defineProperty(checkboxgroup.prototype, "option"+thisName, 
        {
            get: function(){ return this["__option"+thisName]; },
            set: function(value)
            {
                Object.defineProperty(this,"__option"+thisName, {value: value, configurable: true});
                for(var counter=0,option;(option=this.__options[counter]) !== undefined; counter++) option[name].bind = value;
            }
        });
    }
    defineOptionMember("text");
    defineOptionMember("value");
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
    function image(elements, selector, parent, bindPath, childKey, protoChildKey)
    {
        control.call(this, elements, selector, parent, bindPath, childKey, protoChildKey);
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
    function audio(elements, selector, parent, bindPath, childKey, protoChildKey)
    {
        control.call(this, elements, selector, parent, bindPath, childKey, protoChildKey);
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
    function video(elements, selector, parent, bindPath, childKey, protoChildKey)
    {
        audio.call(this, elements, selector, parent, bindPath, childKey, protoChildKey);
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
    function button(element, selector, parent, bindPath, childKey, protoChildKey)
    {
        control.call(this, element, selector, parent, bindPath, childKey, protoChildKey);
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
!function(){"use strict";root.define("atomic.html.viewAdapterFactory", function htmlViewAdapterFactory(document, controlTypes, pubSub, logger, reflect)
{
    function loadACU(url, controlUnitFullName, callback)
    {
        var callbackExecuted        = false;
        function executeCallback()
        {
            if (callbackExecuted)   return;
            callbackExecuted    = true;
            callback(root.get(controlUnitFullName));
        }
        var script                  = document.createElement('script');
        script.src                  = url;
        script.onload               = executeCallback;
        script.onreadystatechange   = executeCallback;
    
        document.body.appendChild(script);
    };
    function loadACView(controlDefinition)
    {
        if (typeof controlDefinition.constructor !== "function") throw new Error("Failed to load remote Atomic control unit.");
        var cssElement          = document.createElement("style");
        cssElement.innerHTML    = controlDefinition.css;
        document.body.appendChild(cssElement);
        var viewElement         = document.createElement("div");
        viewElement.innerHTML   = controlDefinition.html;
        return viewElement.querySelector(controlDefinition.selector);
    }
    var dynamicControlUnits = {};
    var viewAdapterFactory  =
    {
        create:             function create(options)
        {
            var selector                = options.selector || (options.viewElement.id?("#"+options.viewElement.id):("."+options.viewElement.className));
            if (controlTypes[options.controlType] === undefined)    debugger;

            var viewAdapter             = new controlTypes[options.controlType](options.viewElement, selector, options.parent, options.bindPath, options.controlKey, options.protoControlKey);
            var controlDefinition       = new options.definitionConstructor(viewAdapter);
            viewAdapter.frame(controlDefinition, options.initializerDefinition||controlDefinition);
            viewAdapter.initialize(options.initializerDefinition||controlDefinition, controlDefinition);
            if (typeof options.preConstruct === "function") options.preConstruct.call(viewAdapter);
            if(viewAdapter.construct)   viewAdapter.construct.call(viewAdapter);
            return viewAdapter;
        },
        createView:         function createView(definitionConstructor, viewElement)
        {
            var adapter = this.create
            ({
                definitionConstructor:  typeof definitionConstructor !== "function" ? function(appViewAdapter){return {controls: definitionConstructor}; } : definitionConstructor,
                initializerDefinition:  {},
                viewElement:            viewElement,
                parent:                 undefined,
                selector:               undefined,
                controlKey:             undefined,
                protoControlKey:        undefined,
                controlType:            "screen",
                bindPath:               ""
            });
            return adapter;
        },
        createFactory:      function createFactory(definitionConstructor, viewElementTemplate)
        {
            if (typeof viewElementTemplate === "string")    viewElementTemplate = document.querySelector(viewElementTemplate);
            viewElementTemplate.parentNode.removeChild(viewElementTemplate);
            var factory = (function(parent, containerElement, selector, controlKey, protoControlKey, bindPath, initializerDefinition)
            {
                var container                       = parent;
                var viewElement                     = viewElementTemplate.cloneNode(true);
                if (containerElement !== undefined)
                {
                    if (initializerDefinition.replaceElement)   containerElement.parentNode.replaceChild(viewElement, containerElement);
                    else
                    {
                        container                       = this.create
                        ({
                            definitionConstructor:  function(){return {};}, 
                            initializerDefinition:  {},
                            viewElement:            containerElement,
                            parent:                 parent,
                            selector:               selector,
                            controlKey:             controlKey,
                            protoControlKey:        protoControlKey,
                            controlType:            "panel",
                            bindPath:               bindPath
                        });
                        containerElement.innerHTML   = "";
                        containerElement.appendChild(viewElement);
                    }
                }
                else                                parent.__setViewData("appendChild", viewElement);

                var view                            = this.create
                ({
                    definitionConstructor:  typeof definitionConstructor !== "function" ? function(control){return definitionConstructor} : function(control){return definitionConstructor(control, factory);},
                    initializerDefinition:  initializerDefinition,
                    viewElement:            viewElement,
                    parent:                 container,
                    selector:               selector,
                    controlKey:             controlKey,
                    protoControlKey:        protoControlKey,
                    controlType:            "composite",
                    bindPath:               bindPath
                });
                return view;
            }).bind(this);
            return factory;
        },
        launch:             function(viewElement, controlsOrAdapter, callback)
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
            else if(callback.isObserver)            callback    = (function(data){return function(adapter){adapter.__setData(data);};})(callback);
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
        loadView:           function(controlUnitUrl, controlUnitFullName, constructorArguments, callback)
        {
            loadACU(controlUnitUrl, controlUnitFullName, (function(controlDefinition){ callback(this.createView(controlDefinition.constructor.apply(null, constructorArguments), loadACView(controlDefinition))); }).bind(this));
        },
        loadControlFactory: function(controlUnitUrl, controlUnitFullName, constructorArguments, callback)
        {
            if (dynamicControlUnits[controlUnitFullName] !== undefined) return callback(dynamicControlUnits[controlUnitFullName]);
            loadACU(controlUnitUrl, controlUnitFullName, (function(controlDefinition){callback(dynamicControlUnits[controlUnitFullName] = this.createFactory(controlDefinition.constructor.apply(null, constructorArguments), loadACView(controlDefinition))); }).bind(this));
        },
        select:             function(uiElement, selector, selectorPath)
        {
            var element = uiElement.querySelector(selector)||undefined;
            element.__selectorPath  = selectorPath;
            return element;
        },
        selectAll:          function(uiElement, selector, selectorPath, typeHint)
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
        var wordCharacters          = /[a-zA-Z0-9_\-$]/;
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
        else if (segment.value === "$rootPath")
        {
            return {type: resolvedSegmentType, value: "$root" + (newBasePath.length > 0 ? "." + newBasePath.join(".") : ""), newBasePath: newBasePath};
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
        {
            resolved.segment.value.set({bag: root.bag, basePath: resolved.basePath}, newValue);
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
    function buildConstructor(removeFromArray, isolatedFunctionFactory, reflect, pathParser)
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
            addPropertyPath(bag, path, listener, pathSegments.length == 1);
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
            var postCallback    = listener.callback.call
            (
                listener.observer,
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
            if (bag.__updatingLinkedObservers)  {return;}
            var listenersToNotify   = {};

            var listeners       = bag.listenersByPath[propertyKey];
            if (listeners !== undefined)
            {
                var listenerIds     = Object.keys(listeners);
                for(var listenerIdCounter=0,listener;(listener=listeners[listenerIds[listenerIdCounter++]]) !== undefined;)
                    if (listener.listener.callback !== undefined && !listener.listener.callback.ignore && (!directOnly||listener.direct)) listenersToNotify[listener.listener.id]  = listener.listener;
            }

            for(var rootPath in bag.listenersByRootPath)
            if ((propertyKey == rootPath || propertyKey.startsWith(rootPath+".") || rootPath == "") && propertyKey.indexOf(".$shadow", rootPath.length) == -1)
            {
                listeners           = bag.listenersByRootPath[rootPath];
                listenerIds         = Object.keys(listeners);
                for(var listenerIdCounter=0,listener;(listener=listeners[listenerIds[listenerIdCounter++]]) !== undefined;)
                    if (listener.callback !== undefined && !listener.callback.ignore)   listenersToNotify[listener.id]  = listener;
            }

            listenerIds             = Object.keys(listenersToNotify);
            //console.log((directOnly?"Directly":"Indirectly") + " notifying " + listenerIds.length + " listeners for changes to property located at `" + propertyKey + "`.");
            for(var listenerIdCounter=0,listener;(listener=listenersToNotify[listenerIds[listenerIdCounter++]]) !== undefined;)
            if(listener.callback !== undefined && !listener.callback.ignore)    notifyPropertyListener.call(this, listener, bag, value);
            
            notifyLinkedObserverPaths.call(this, propertyKey, value, bag);
        }
        function notifyLinkedObserverPaths(propertyKey, value, bag)
        {
            bag.__updatingLinkedObservers   = true;
            var linkedPaths = Object.keys(bag.linkedObservers);
            if (linkedPaths.length > 0)
            {
                var resolvedPropertyKeyPath     = this.observe(propertyKey)("$rootPath");
                for(var counter=0;counter<linkedPaths.length;counter++)
                {
                    var linkedPath  = linkedPaths[counter];
                    if (linkedPath === resolvedPropertyKeyPath  || linkedPath.startsWith(resolvedPropertyKeyPath+(resolvedPropertyKeyPath.length > 0 ? "." : "")))   updateLinkedObservers.call(this, bag.linkedObservers[linkedPath], this.unwrap(linkedPath))
                    else if(linkedPath === "$root"              || resolvedPropertyKeyPath.startsWith(linkedPath + (linkedPath.length > 0 ? "." : "")))              notifyLinkedObservers.call(this, bag.linkedObservers[linkedPath], linkedPath === "$root" ? propertyKey : linkedPath.length > 0 ? resolvedPropertyKeyPath.substr(linkedPath.length + 1) : propertyKey, value);
                }
            }
            bag.__updatingLinkedObservers   = false;
        }
        function updateLinkedObservers(linkedChildObservers, value)
        {
            for(var linkedChildObserverCounter=0,linkedChildObserver;(linkedChildObserver = linkedChildObservers[linkedChildObserverCounter++]) !== undefined;)
            for(var pathCounter=0,path;(path=linkedChildObserver.paths[pathCounter++]) !== undefined;)
            linkedChildObserver.childObserver(path, value);
        }
        function notifyLinkedObservers(linkedChildObservers, propertyPath, value)
        {
            for(var linkedChildObserverCounter=0,linkedChildObserver;(linkedChildObserver = linkedChildObservers[linkedChildObserverCounter++]) !== undefined;)
            for(var pathCounter=0,path;(path=linkedChildObserver.paths[pathCounter++]) !== undefined;)
            linkedChildObserver.childObserver.__notifyLinkUpdate(path + (path.length > 0 && propertyPath.length > 0 ? "." : "") + propertyPath, value);
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
            for(var pathCounter=paths.length-1,path;(path=paths[pathCounter]) !== undefined;pathCounter--)
            if (path.length <= counter || path[counter] !== pathSegment)    paths.splice(pathCounter, 1);
        }
        var regExMatch  = /^\/.*\/$/;
        function undefine(virtualProperty)
        {
            if (virtualProperty === undefined)  return;
            var paths   = Object.keys(virtualProperty.cachedValues);
            for(var pathCounter=paths.length-1,path;(path=paths[pathCounter--]) !== undefined;) this.ignore(virtualProperty.cachedValues[path].listener);
        }
        function decorateFunctionFactory(functionFactory){Object.defineProperties(functionFactory.root.prototype,
        {
            __invoke:           {value: function(path, value, getObserver, peek, forceSet, silentUpdate)
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
                    accessor.set({bag: this.__bag, basePath: this.__basePath}, value, (function(revisedPath){if (!silentUpdate) notifyPropertyListeners.call(this, revisedPath, value, this.__bag, false);}).bind(this));
                }
            }},
            __notify:           {value: function(path, changes, directOnly)
            {
                for(var counter=0;counter<changes.changed.length;counter++) notifyPropertyListeners.call(this, path+"."+changes.changed[counter], changes.items[changes.changed[counter]], this.__bag, directOnly);
                notifyPropertyListeners.call(this, path, changes.items, this.__bag, true);
            }},
            __notifyLinkUpdate: {value: function(path, value)   { notifyPropertyListeners.call(this, path, value, this.__bag, false); }},
            delete:             {value: function(path, silent){this.__invoke(path, undefined, undefined, undefined, true, silent);}},
            equals:             {value: function(other){return other !== undefined && other !== null && this.__bag === other.__bag && this.__basePath === other.__basePath;}},
            observe:            {value: function(path, peek){return this.__invoke(path, undefined, getObserverEnum.yes, peek);}},
            peek:               {value: function(path, unwrap){return this.__invoke(path, undefined, unwrap === true ? getObserverEnum.no : getObserverEnum.auto, true);}},
            read:               {value: function(path, peek){return this.__invoke(path, undefined, getObserverEnum.auto, peek);}},
            toggle:             {value: function(path, value){this.setValue(path, this(path) == value ? undefined : value, false); }},
            unwrap:             {value: function(path){return this.__invoke(path, undefined, getObserverEnum.no, false);}},
            basePath:           {value: function(){return this.__basePath;}},
            shadows:            {get:   function(){return this.__bag.shadows;}},
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
                        var path = basePath + ((basePath||"").length > 0 && (key||"").length > 0 ? "[\'" : "") + key.replace("'", "\\'") + ((basePath||"").length > 0 && (key||"").length > 0 ? "']" : "");
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
                    var currentMatched  = Object.keys(this.__bag.listenersByPath).map(function(path){return path.split(".");}).concat(Object.keys(this.__bag.linkedObservers).map(function(path){return path.substr(6).split(".");}));
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
                                    undefine.call(this, matcher.property);
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
                                undefine.call(this, current.paths[pathSegment].property);
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
                    for(var pathCounter=0,path;(path=currentMatched[pathCounter++]) !== undefined;) notifyPropertyListeners.call(this, path.join("."), this.__bag.item, this.__bag, false);
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
                        delete listener.id;
                        delete listener.callback;
                        delete listener.observer;
                        delete listener.properties;
                        delete listener.nestedUpdatesRootPath;
                        callbackFound   = true;
                    }
               }
                if (!callbackFound) debugger;
            }},
            isObserver:         {value: true},
            link:               {value: function(rootPath, childObserver, childRootPath, skipLinkBack)
            {
                var resolvedObserver        = this.observe(rootPath);
                rootPath                    = resolvedObserver("$rootPath");
                var linkedChildObservers    = this.__bag.linkedObservers[rootPath] = this.__bag.linkedObservers[rootPath]||[];
                var linkedChildObserver     = undefined;

                for(var linkedChildObserverCounter=0;(linkedChildObserver = linkedChildObservers[linkedChildObserverCounter++]) !== undefined;) if (linkedChildObserver.childObserver == childObserver) break;

                if (linkedChildObserver === undefined)                          linkedChildObservers.push({childObserver: childObserver, paths: [childRootPath]});
                else if(linkedChildObserver.paths.indexOf(childRootPath) == -1) linkedChildObserver.paths.push(childRootPath);

                if (skipLinkBack)   return;

                childObserver.link(childRootPath, this, rootPath, true);
                childObserver(childRootPath, resolvedObserver.unwrap());
            }},
            listen:             {value: function(callback, nestedUpdatesRootPath)
            {
                var listener    =
                {
                    id:                     this.__bag.listenerId++,
                    callback:               callback, 
                    observer:               this,
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
            notify:             {value: function(path, directOnly){notifyPropertyListeners.call(this, path, this.unwrap(path), this.__bag, directOnly);}},
            rollback:           {value: function()
            {
                this.__bag.rollingback  = true;
                this.__bag.item         = this.__bag.backup;
                delete this.__bag.backup;
                notifyPropertyListeners.call(this, this.__basePath, this.__bag.item, this.__bag, false);
                this.__bag.rollingback  = false;
            }},
            setValue:           {value: function(path, value, silent){this.__invoke(path, value, undefined, undefined, true, silent);}},
            toString:           {value: function(){ return " Atomic Observer bound to path: `" + this.__basePath + "`; If you are seeing this, you might have bound a value based property to an object within the observer."; }},
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
            }},
            unlink:             {value: function(rootPath, childObserver, childRootPath, skipLinkBack)
            {
                rootPath                    = this.observe(rootPath)("$path");
                var linkedChildObservers    = this.__bag.linkedObservers[rootPath] = this.__bag.linkedObservers[rootPath]||[];
                var linkedChildObserver     = undefined;

                for(var linkedChildObserverCounter=0;(linkedChildObserver = linkedChildObservers[linkedChildObserverCounter++]) !== undefined;) if (linkedChildObserver.childObserver == childObserver) break;

                if (linkedChildObserver === undefined)  return;
                
                var pathIndex;
                if((pathIndex = linkedChildObserver.paths.indexOf(childRootPath)) != -1)    linkedChildObserver.paths.splice(pathIndex, 1);

                if (skipLinkBack)   return;

                childObserver.unlink(childRootPath, this, rootPath, true);
            }}
        });}
        decorateFunctionFactory(objectObserverFunctionFactory);
        decorateFunctionFactory(arrayObserverFunctionFactory);
        function addArrayMembers(name)
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

                        this.__notify(this.__basePath, getItemChanges(oldItems, items), false);
                        if(name!=="sort" && name!=="reverse")   notifyPropertyListeners.call(this, this.__basePath + ".length", items.length, this.__bag, true);
                        return result === items ? this : result; 
                    }
                }
            );
        }
        var members = ["push","pop","shift","unshift","sort","reverse","splice"];
        for(var counter=0,member;(member=members[counter]) !== undefined; counter++)   addArrayMembers(member);

        members     = ["remove","removeAll","move","swap"];
        function addArrayMembers2(name)
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
        }
        for(var counter=0,member;(member=members[counter]) !== undefined; counter++)   addArrayMembers2(member);

        members     = ["join","indexOf","slice"];
        function addArrayMembers3(name)
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
        }
        for(var counter=0,member;(member=members[counter]) !== undefined; counter++)   addArrayMembers3(member);

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
            count:              {get: function(){return this("length");}},
            reduce:             {value: function(callback, initialValue)
            {
                var returnValue = initialValue;
                var count       = this.count;
                var items       = Object(this.unwrap());
                for (var counter=0;counter<count;counter++) if(counter in items)    returnValue = callback(returnValue, this(counter), counter, this());
                return returnValue;
            }}
        });
        return createObserver;
    }
    root.define("atomic.observerFactory", function(removeFromArray, isolatedFunctionFactory, reflect, pathParser)
    {
        if (createObserver === undefined)  createObserver   = buildConstructor(removeFromArray, isolatedFunctionFactory, reflect, pathParser);
        return function observer(_item)
        {
            var bag             =
            {
                item:                   _item,
                virtualProperties:      {paths:{}, matchers: []},
                listenerId:             0,
                listenersByPath:        {},
                listenersByRootPath:    {},
                linkedObservers:        {},
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
!function(){"use strict";root.define("atomic.dataBinder", function dataBinder(reflect, removeItemFromArray, defineDataProperties)
{
    function notifyProperties()
    {
        for(var counter=0,property;(property=this.__properties[counter]) !== undefined; counter++) property.listen({bindPath: this.bindPath||"", data: this.data===undefined?null:this.data});
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
        __getDebugInfo:         {value: function()
        {
            var debugInfo   = {};
            var hasBinding  = false;
            for(var counter=0,property;(property=this.__properties[counter]) !== undefined; counter++)
            {
                var debugBindPath   = property.__debugBindPath;
                if (debugBindPath !== undefined)
                {
                    hasBinding                  = true;
                    debugInfo[property.name]    = debugBindPath;
                }
            }
            return hasBinding ? debugInfo : undefined;
        }},
        __updateDebugInfo:      {value: function(){if (this.__target !== undefined) this.__target.__updateDebugInfo();}},
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
        defineDataProperties:   {value: function $_defineDataProperties(target, properties, singleProperty){defineDataProperties(target, this, properties, singleProperty);}},
        destroy:                {value: function destroy()
        {
            Object.defineProperty(this, "__data", {value: undefined, configurable: true});
            for(var counter=0,property;(property=this.__properties[counter]) !== undefined; counter++)  property.destroy();
            reflect.deleteProperties(this,
            [
                "__properties",
                "__forceRoot",
                "__target",
                "__data"
            ]);
            Object.defineProperty(this, "isDestroyed", {value: true});
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
        unregister:             {value: function(property){removeItemFromArray(this.__properties, property);}}
    });
    return dataBinder;
});}()
!function()
{"use strict";
    var defineDataProperties;
    var bindCounter             = 0;
    function buildFunction(isolatedFunctionFactory, reflect)
    {
        var functionFactory = new isolatedFunctionFactory();
        var dataProperty    =
        functionFactory.create
        (function dataProperty(owner, getter, setter, onchange, binder, delay, name)
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
                __inputListener:        {value: function(event){property.___inputListener(); if (event !== undefined && event !== null && typeof event.stopPropagation === "function") event.stopPropagation();}, configurable: true},
                name:                   {value: name}
            });
            if (typeof onchange === "string") debugger;
            property.listen({onchange: onchange});
            if (binder) binder.register(property);
            return property;
        });
        function bindData()
        {
            var that    = this;
            if (this.__data === undefined || this.__data == null || this.isDestroyed)   return;
            Object.defineProperty(this,"__bounded", {value: true, configurable: true});
            if (this.__bind !== undefined)
            {
                Object.defineProperty(this, "__bindListener", 
                {
                    configurable:   true, 
                    value:          function __bindListener(val, ignore)
                    {
                        var value           = that.__getDataValue();
                        var currentValue    = that.__getter();
                        if (value === currentValue)  return;
                        if (!that.__notifyingObserver) that.__setter(value);
                        ignore(function ignoreCallback(){notifyOnDataUpdate.call(that, that.data);}); 
                    }
                });
                var onchangeKeys    = Object.keys(this.__onchange);
                for(var counter=0, onchangeKey;(onchangeKey=onchangeKeys[counter]) !== undefined; counter++)    this.__onchange[onchangeKey].listen(this.__inputListener, true);
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
            var onchangeKeys    = Object.keys(this.__onchange);
            for(var counter=0, onchangeKey;(onchangeKey=onchangeKeys[counter]) !== undefined; counter++)    this.__onchange[onchangeKey].ignore(this.__inputListener);
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
            destroy:            {value: function destroy()
            {
                unbindData.call(this);
                reflect.deleteProperties(this.__onchange, Object.keys(this.__onchange));
                reflect.deleteProperties(this,
                [
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
                ]);
                Object.defineProperty(this, "isDestroyed", {value: true});
            }},
            __debugBindPath:    {get: function()
            {
                var bindPath    = this.__bindPath||"";
                return  this.__bind !== undefined
                        ?   typeof this.__bind === "string"
                            ?   (bindPath.length>0?bindPath+".":"")+this.__bind
                            :   typeof this.__bind === "function"
                                ?   "function(data(`" + bindPath + "`))"
                                :   this.__bind && typeof this.__bind.get === "function"
                                    ?   "getter(data(`" + bindPath + "`))"
                                    :   bindPath
                        :   undefined;
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
                    var optionKeys = ["data","bindPath","root","onupdate"];
                    for(var counter=0,optionKey;(optionKey=optionKeys[counter]) !== undefined; counter++)
                    {
                        if(options[optionKey] !== undefined)    Object.defineProperty(this, "__"+optionKey, {value: options[optionKey], configurable: true});
                    }
                    if (options.bindPath !== undefined) this.__binder.__updateDebugInfo();
                    if(options.bind !== undefined)
                    {
                        Object.defineProperty(this, "__bind", {value: options.bind, configurable: true});
                    }
                    if(options.onchange !== undefined)
                    {
                        reflect.deleteProperties(this.__onchange, Object.keys(this.__onchange));

                        var onchangeKeys    = Object.keys(options.onchange);
                        for(var counter2=0, onchangeKey;(onchangeKey=onchangeKeys[counter2]) !== undefined; counter2++)
                        {
                            var event   = options.onchange[onchangeKey];
                            Object.defineProperty(this.__onchange,onchangeKey,{value: event, configurable: true, enumerable: true});
                        }
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
        function definePrototypeMember(name)
        {
            Object.defineProperty(functionFactory.root.prototype, name,
            {
                get:    function(){return this["__"+name];},
                set:    function(value){throw new Error("obsolete");}
            });
        }
        definePrototypeMember("data");
        definePrototypeMember("bind");
        definePrototypeMember("root");

        function definePrototypeMember2(name)
        {
            Object.defineProperty(functionFactory.root.prototype, name,
            {
                get:    function(){return this["__"+name];},
                set:    function(value){Object.defineProperty(this, "__"+name, {value: value, configurable: true});}
            });
        }
        definePrototypeMember2("onbind");
        definePrototypeMember2("onunbind");
        definePrototypeMember2("delay");

        function defineDataProperty(target, binder, propertyName, property)
        {
            if (target.hasOwnProperty(propertyName))
            {
                binder.unregister(target[propertyName]);
                target[propertyName].destroy();
                Object.defineProperty(target, propertyName, {value: null, configurable: true, writable: true}); 
                delete target[propertyName];
            }
            Object.defineProperty(target, propertyName, {value: new dataProperty(property.owner||target, property.get, property.set, property.onchange, binder, property.delay, propertyName), configurable: true})

            var memberNames = ["onbind","onupdate","onunbind","delay"];
            for(var counter=0,memberName;(memberName=memberNames[counter]) !== undefined; counter++)    if (property[memberName])   target[propertyName][memberName] = property[memberName];
        }
        function defineDataProperties(target, binder, properties, singleProperty)
        {
            if (typeof properties === "string") defineDataProperty(target, binder, properties, singleProperty);
            else
            {
                var propertyKeys    = Object.keys(properties);
                for(var counter=0,propertyKey;(propertyKey=propertyKeys[counter]) !== undefined; counter++) defineDataProperty(target, binder, propertyKey, properties[propertyKey]);
            }
        }
        return defineDataProperties;
    }
    root.define("atomic.defineDataProperties", function(isolatedFunctionFactory, reflect)
    {
        if (defineDataProperties === undefined) defineDataProperties    = buildFunction(isolatedFunctionFactory, reflect);
        return defineDataProperties;
    });
}();
!function(){"use strict";root.define("atomic.html.compositionRoot", function htmlCompositionRoot(customizeControlTypes, debugInfoObserver)
{
    var reflect                 = root.utilities.reflect;
    var isolatedFunctionFactory = new root.atomic.html.isolatedFunctionFactory(document);
    var pathParserFactory       = new root.atomic.pathParserFactory(new root.atomic.tokenizer());
    var pathParser              = new pathParserFactory.parser(new root.atomic.lexer(new root.atomic.scanner(), pathParserFactory.getTokenizers(), root.utilities.removeFromArray));
    var observer                = new root.atomic.observerFactory(root.utilities.removeFromArray, isolatedFunctionFactory, reflect, pathParser);
    if (debugInfoObserver === true) debugInfoObserver = new observer({__controlIndex:[], __controls:{}});

    var pubSub                  = new root.utilities.pubSub(isolatedFunctionFactory, root.utilities.removeItemFromArray);
    var defineDataProperties    = new root.atomic.defineDataProperties(isolatedFunctionFactory, reflect, pubSub);
    var dataBinder              = new root.atomic.dataBinder(reflect, root.utilities.removeItemFromArray, defineDataProperties);
    var eventsSet               = new root.atomic.html.eventsSet(pubSub, reflect);
    var controlTypes            = {};
    var viewAdapterFactory      =   new root.atomic.html.viewAdapterFactory
                                    (
                                        document,
                                        controlTypes,
                                        pubSub,
                                        function(message){console.log(message);},
                                        reflect
                                    );

    var control                 = new root.atomic.html.control(document, root.utilities.removeItemFromArray, window.setTimeout, reflect, eventsSet, dataBinder, debugInfoObserver);
    var readonly                = new root.atomic.html.readonly(control, reflect);
    var label                   = new root.atomic.html.label(readonly, reflect);
    var link                    = new root.atomic.html.link(readonly, reflect);
    var container               = new root.atomic.html.container(control, observer, reflect, viewAdapterFactory, root.utilities.removeItemFromArray);
    var panel                   = new root.atomic.html.panel(container, reflect);
    var screen                  = new root.atomic.html.screen(panel, observer);
    var linkPanel               = new root.atomic.html.link(panel, reflect);
    var composite               = new root.atomic.html.composite(container, reflect);
    var repeater                = new root.atomic.html.repeater(container, root.utilities.removeFromArray);
    var table                   = new root.atomic.html.table(container, root.utilities.removeFromArray);
    var input                   = new root.atomic.html.input(control);
    var checkbox                = new root.atomic.html.checkbox(control);
    var file                    = new root.atomic.html.file(control);
    var select                  = new root.atomic.html.select(input, dataBinder, reflect);
    var radiogroup              = new root.atomic.html.radiogroup(input, dataBinder, reflect);
    var checkboxgroup           = new root.atomic.html.checkboxgroup(input, dataBinder, reflect);
    var multiselect             = new root.atomic.html.multiselect(select);
    var image                   = new root.atomic.html.image(control);
    var audio                   = new root.atomic.html.audio(control);
    var video                   = new root.atomic.html.video(audio);
    var button                  = new root.atomic.html.button(control);
    var details                 = new root.atomic.html.details(panel, document);

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
        button:         {value: button},
        file:           {value: file},
        table:          {value: table},
        details:        {value: details}
    });
    var atomic  = { viewAdapterFactory: viewAdapterFactory, observer: observer, debugInfoObserver: debugInfoObserver };
    if (typeof customizeControlTypes === "function")    customizeControlTypes(controlTypes, atomic);
    return atomic;
});}();
!function(window, document)
{"use strict";
    var atomic;
    var atomicScript        = document.currentScript||document.getElementById("atomicjs")
    var debugInfoObserver;
    root.define("atomic.launch", function launch(viewElement, controlsOrAdapter, callback)
    {
        root.atomic.ready(function(atomic)
        {
            var adapter = atomic.viewAdapterFactory.launch(viewElement, controlsOrAdapter, callback);
        });
    });
    root.define("atomic.init", function(options)
    {
        debugInfoObserver   = (options&&options.debugInfoObserver)||debugInfoObserver;
    });
    root.define("atomic.ready", function ready(callback)
    {
        var deferOrExecute  =
        function()
        {
            if (atomic === undefined)   atomic  = root.atomic.html.compositionRoot(undefined, debugInfoObserver);
            if (typeof callback === "function") callback(atomic);
        }
        if (document.readyState !== "complete") window.addEventListener("load", deferOrExecute);
        else                                    deferOrExecute();
    });
    setTimeout(function(){root.atomic.ready(function(atomic)
    {
        if (atomicScript !== undefined && atomicScript !== null)
        {
            var controlName         = atomicScript.getAttribute("data-atomic-name");
            var hostSelector        = atomicScript.getAttribute("data-atomic-selector");
            var remoteControlUrl    = atomicScript.getAttribute("data-atomic-src");
            var hostElement         = document.querySelector(hostSelector)||document.body;
            if (controlName && hostSelector && remoteControlUrl)    atomic.viewAdapterFactory.loadView(remoteControlUrl, controlName, [], function(control) { hostElement.appendChild(control.__element); if (control && control.launch)  control.launch(); });
        }
    });}, 0);
}(window, document);