!function(){"use strict";root.define("atomic.html.control", function htmlControl(document, removeItemFromArray, setTimeout, each, eventsSet, dataBinder, debugInfoObserver)
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
        updateon:           {value: function(viewAdapter, value)    {if (Array.isArray(value))  viewAdapter.updateon = value;}}
    });
    each(["alt", "autoplay", "currentTime", "loop", "muted", "nativeControls", "preload", "mediaType", "playbackRate", "value", "volume"], function(val){ initializers[val] = function(viewAdapter, value) { if (viewAdapter[val] === undefined) {console.error("property named " +val + " was not found on the view adapter of type " + viewAdapter.constructor.name + ".  Skipping initializer."); return;} viewAdapter[val](value); }; });
    each(["optionValue", "optionText", "isDataRoot"], function(val){ initializers[val] = function(viewAdapter, value) { viewAdapter[val] = value; }; });
    initializers.classes = function(viewAdapter, value) { each(value, function(val){viewAdapter.toggleClass(val, true);}); };
    each(["onbind", "ondataupdate", "onsourceupdate", "onunbind"], function(val){ initializers[val] = function(viewAdapter, value) { viewAdapter["__" + val] = value; }; });
    each(["abort", "blur", "canplay", "canplaythrough", "change", "changing", "click", "contextmenu", "copy", "cut", "dblclick", "drag", "dragend", "dragenter", "dragleave", "dragover", "dragstart", "drop", "durationchanged", "ended", "enter", "error", "escape", "focus", "focusin", "focusout", "hide", "input", "loadeddata", "loadedmetadata", "loadstart", "keydown", "keypress", "keyup", "mousedown", "mouseenter", "mouseleave", "mousemove", "mouseover", "mouseout", "mouseup", "paste", "pause", "play", "playing", "progress", "ratechange", "search", "seeked", "seeking", "select", "show", "stalled", "suspend", "timeupdate", "touchcancel", "touchend", "touchmove", "touchstart", "volumechange", "waiting", "wheel", "transitionend", "viewupdated"], function(val)
    {
        initializers["on" + val] = function(viewAdapter, callback) { console.warn("The '{on" + val + ": listener}' event initializer has been deprecated.  Please switch to the '{on: {" + val + ": listener}}' initializer instead."); viewAdapter.addEventListener(val, callback.bind(viewAdapter), false); };
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
    Object.defineProperty(control, "__getViewProperty", {value: function(name) { return viewProperties[name]; }});
    Object.defineProperties(control.prototype,
    {
        // fields
        constructor:        {value: control},
        // properties
        bindPath:           {get:   function(){return this.__binder.bindPath||"";},                                                             set:    function(value){this.__binder.bindPath = value; }},
        bind:               {get:   function(){return this.value.bind;}},
        data:               {get:   function(){return this.__binder.data.observe(this.bindPath);}},
        height:             {get:   function(){return this.__element.offsetHeight;},                                                            set:    function(value){console.log("setting height on " + this.getSelectorPath()); this.__element.style.height = parseInt(value)+"px"; this.getEvents("viewupdated").viewupdated(["offsetHeight"]);}},
        isDataRoot:         {get:   function(){return this.__isDataRoot;},                                                                      set:    function(value){Object.defineProperty(this, "__isDataRoot", {value: value===true, configurable: true});}},
        isRoot:             {get:   function(){return this.__forceRoot||this.parent===undefined;},                                              set:    function(value){Object.defineProperty(this, "__forceRoot", {value: value===true, configurable: true});}},
        scrollTop:          {get:   function(){return this.__element.scrollTop;},                                                               set:    function(value){this.__element.style.scrollTop = parseInt(value); this.getEvents("viewupdated").viewupdated(["scrollTop"]);}},
        root:               {get:   function(){return !this.isRoot && this.parent ? this.parent.root : this;}},
        updateon:           {get:   function(){var names = []; each(this.value.onchange,function(e, name){names.push(name);}); return names;},  set:    function(eventNames){ this.value.onchange = this.getEvents(eventNames); }},
        width:              {get:   function(){return this.__element.offsetWidth;},                                                             set:    function(value){console.log("setting width on " + this.getSelectorPath()); this.__element.style.width = parseInt(value)+"px"; this.getEvents("viewupdated").viewupdated(["offsetWidth"]);}},
        // methods
        __addCustomEvents:  {value: function(events)
        {
            Object.defineProperties(events,
            {
                escape:           {value:   {eventNames: ["keydown"],   handler: function(event){ if (event.keyCode==27) { this.pubSub(event); } }}},
                gainingfocus:     {value:   {eventNames: ["focusin"],   handler: function(event){ this.pubSub(event); }}},
                losingfocus:      {value:   {eventNames: ["focusout"],  handler: function(event){ if (!this.__target.__element.contains(event.relatedTarget)) { this.pubSub(event); } }}}
            });
        }},
        __createNode:       {value: function()                              { return document.createElement("div"); }, configurable: true},
        __getCustomEvents:  {value: function()
        {
           var customEvents = {};
           this.__addCustomEvents(customEvents);
           return customEvents;
        }},
        __getData:          {value: function()                              { return this.__binder.data; }},
        __getViewData:      {value: function(name)
        {
            var property    = this.constructor.__getViewProperty(name);
            return  this.__viewUpdateQueue.elements[name] !== undefined
                    ?   property.reset
                        ?   this.__viewUpdateQueue.elements[name]
                        :   this.__viewUpdateQueue.elements[name][this.__viewUpdateQueue.elements[name].length-1]
                    :   property.get(this);
        }},
        __setViewData:      {value: function(name, value)
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
        __updateDebugInfo:  {value: function()
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
        __updateView:       {value: function()
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
        __reattach:         {value: function()
        {
            this.__elementPlaceholder.parentNode.replaceChild(this.__element, this.__elementPlaceholder); 
            delete this.__elementPlaceholder;
            return this;
        }},
        __setData:          {value: function(data)                          { this.__binder.data = data; }},
        addClass:           {value: function(className, silent)
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
            if (debugInfoObserver)
            {
                debugInfoRemoveQueue.push(this.__viewAdapterPath);
                resetDebugInfoQueue();
            }
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
        frame:              {value: function(controlDefinition)
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
        getEvents:          {value: function(eventNames)
        {
            if (!Array.isArray(eventNames)) eventNames  = [eventNames];
            var events  = {};
            each(eventNames, (function(eventName){events[eventName] = this.__events.getOrAdd(eventName);}).bind(this));
            return events;
        }},
        getSelectorPath:    {value: function()                              { return (this.parent === undefined ? "" : this.parent.getSelectorPath() + "-") + (this.__selector||"root"); }},
        getViewAdapterPath: {value: function(proto)                         { return (this.parent === undefined ? "" : this.parent.getViewAdapterPath(proto) + ".controls.") + ((proto?this.__protoChildKey:this.__childKey)||((this.__selector||"#root").substr(1) + ".root")); }},
        hasClass:           {value: function(className)                     { return this.__getViewData("className").split(" ").indexOf(className) > -1; }},
        hasFocus:           {value: function(nested)                        { return document.activeElement == this.__element || (nested && this.__element.contains(document.activeElement)); }},
        hide:               {value: function()                              { this.__setViewData("style.display", "none"); this.triggerEvent("hide"); return this; }},
        initialize:         {value: function(initializerDefinition, controlDefinition)
        {
            for(var initializerKey in initializers)
            if (initializerDefinition.hasOwnProperty(initializerKey))   initializers[initializerKey](this, initializerDefinition[initializerKey]);

            if (controlDefinition !== undefined && controlDefinition.extensions !== undefined && controlDefinition.extensions.length !== undefined)
            for(var counter=0;counter<controlDefinition.extensions.length;counter++)    initializeViewAdapterExtension.call(this, initializerDefinition, controlDefinition.extensions[counter]);
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
            var classNamesToRemove      = className.split(" ");
            for(var counter=0,classNameToRemove;(classNameToRemove = classNamesToRemove[counter++]) !== undefined;)
            if (classNames.indexOf(classNameToRemove) > -1) removeItemFromArray(classNames, classNameToRemove);
            this.__setViewData("className", classNames.join(" "));
            if (!silent)    notifyClassEvent.call(this, classNamesToRemove, false);
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