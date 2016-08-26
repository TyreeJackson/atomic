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
            for(var keyCounter=0;keyCounter<keys.length;keyCounter++)                                       callback(array[keys[keyCounter]], keys[keyCounter]);
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
            (function(listenersChanged)
            {
                function pubSub()
                {
                    var publish = (function(args)
                    {
                        this.__publishTimeoutId = null;
                        this.__lastPublished    = new Number(new Date());
                        if (this.__listeners === undefined) debugger;
                        for(var listenerCounter=0;listenerCounter<this.__listeners.length;listenerCounter++) this.__listeners[listenerCounter].apply(null, args);
                    }).bind(pubSub, arguments);

                    if (this.__publishTimeoutId != null)
                    {
                        clearTimeout(this.__publishTimeoutId);
                        this.__publishTimeoutId = null;
                    }
                    var now         = new Number(new Date());
                    var limitOffset = (this.__lastPublished||0) + (this.limit||0);

                    if (now>=limitOffset)   publish();
                    else                    this.__publishTimeoutId = setTimeout(publish, limitOffset-now);
                }
                Object.defineProperties(pubSub, 
                {
                    "__listenersChanged":   {value: listenersChanged},
                    "__listeners":          {value: []},
                    "__lastPublished":      {writeble: true, value: null},
                    "__publishTimeoutId":   {writable: true, value: null},
                    "limit":                {writable: true, value: null}
                });
                return pubSub;
            });
            Object.defineProperties(functionFactory.root.prototype,
            {
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
!function()
{"use strict";root.define("atomic.html.eventsSet", function eventsSet(pubSub, each)
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
        }}
    });
    function eventsSet(target)
    {
        Object.defineProperties(this,
        {
            "__target":                     {value: target}, 
            "__listenersUsingCapture":      {value:{}}, 
            "__listenersNotUsingCapture":   {value:{}}
        });
    }
    Object.defineProperties(eventsSet.prototype,
    {
        getOrAdd:   {value: function(name, withCapture)
        {
            var listeners       = withCapture ? this.__listenersUsingCapture : this.__listenersNotUsingCapture;
            var eventListeners  = listeners[name];
            if (eventListeners === undefined)   Object.defineProperty(listeners, name, {value: eventListeners=new listenerList(this.__target, name, withCapture)});
            return eventListeners.pubSub;
        }}
    });
    return eventsSet;
});}();
!function()
{"use strict";root.define("atomic.html.control", function hmtlControl(document, removeItemFromArray, setTimeout, each, defineDataProperties, eventsSet, dataBinder)
{
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
    function control(element, selector, parent)
    {
        if (element === undefined)  throw new Error("View element not provided for control with selector " + selector);
        element.title = this.constructor.name;
        Object.defineProperties(this, 
        {
            "__element":            {value: element, configurable: true},
            "__elementPlaceholder": {value: []},
            "__events":             {value: new eventsSet(this)},
            "on":                   {value: {}},
            "__attributes":         {value: {}, writable: true},
            "__selector":           {value: selector},
            "parent":               {value: parent},
            "__binder":             {value: new dataBinder()}
        });
        defineDataProperties(this, this.__binder,
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
                }
            },
            disabled:           {get: function(){return this.__element.disabled;},              set: function(value){this.__element.disabled=!(!value);}},
            display:            {get: function(){return this.__element.style.display=="";},     set: function(value){this[value?"show":"hide"]();}},
            enabled:            {get: function(){return !this.__element.disabled;},             set: function(value){this.__element.disabled=!value;}},
            for:                {get: function(){return this.__element.getAttribute("for");},   set: function(value){this.__element.setAttribute("for", value);}},
            href:               {get: function(){return this.__element.href;},                  set: function(value){this.__element.href=value;}},
            id:                 {get: function(){return this.__element.id;},                    set: function(value){this.__element.id=value;}},
            value:              {get: function(){return this.__element.value;},                 set: function(value){this.__element.value = value;},  onchange: this.getEvents("change")}
        });
    }
    Object.defineProperties(control.prototype,
    {
        getSelectorPath:    {value: function()
        {
            return this.parent === undefined ? "" : this.parent.getSelectorPath() + "-" + (this.__selector||"root");
        }},
        constructor:        {value: control},
        init:               {value: function(definition)
        {
            addEvents.call(this, definition.events);
            addCustomMembers.call(this, definition.members);
            this.__extensions   = definition.extensions;
        }},
        addClass:           {value: function(className)
        {
            var classNames              = this.__element.className.split(" ");
            if (classNames.indexOf(className) === -1) classNames.push(className);
            this.__element.className    = classNames.join(" ").trim();
            return this;
        }},
        bind:               {get: function(){return this.value.bind;},      set: function(value){this.value.bind = value;}},
        data:               {get: function(){return this.__binder.data;},   set: function(value){this.__binder.data = value;}},
        getEvents:          {value: function(eventNames)
        {
            if (!Array.isArray(eventNames)) eventNames  = [eventNames];
            var events  = {};
            each(eventNames, (function(eventName){events[eventName] = this.__events.getOrAdd(eventName);}).bind(this));
            return events;
        }},
        hasClass:           {value: function(className){return this.__element.className.split(" ").indexOf(className) > -1;}},
        hasFocus:           {value: function(nested){return document.activeElement == this.__element || (nested && this.__element.contains(document.activeElement));}},
        height:             {get:   function(){return this.__element.offsetHeight;}},
        hide:               {value: function(){ this.__element.style.display="none"; this.triggerEvent("hide"); return this;}},
        //TODO: ensure that this control is moved to the siblingControl's parent controls set
        insertBefore:       {value: function(siblingControl){ siblingControl.__element.parentNode.insertBefore(this.__element, siblingControl.__element); return this;}},
        //TODO: ensure that this control is moved to the siblingControl's parent controls set
        insertAfter:        {value: function(siblingControl){ siblingControl.__element.parentNode.insertBefore(this.__element, siblingControl.__element.nextSibling); return this;}},
        isRoot:             {get:   function(){return this.__binder.isRoot;}, set: function(value){this.__binder.isRoot=value===true;}},
        removeClass:        {value: function(className)
        {
            if (className === undefined)
            {
                this.__element.className    = "";
                return;
            }
            var classNames              = this.__element.className.split(" ");
            if (classNames.indexOf(className) > -1) removeItemFromArray(classNames, className);
            this.__element.className    = classNames.join(" ");
            return this;
        }},
        "__reattach":       {value: function()
        {
            this.__elementPlaceholder.parentNode.replaceChild(this.__element, this.__elementPlaceholder); 
            delete this.__elementPlaceholder;
            return this;
        }},
        root:               {get:   function(){return !this.isRoot && this.parent ? this.parent.root : this;}},
        scrollIntoView:     {value: function(){this.__element.scrollTop = 0; return this;}},
        select:             {value: function(){selectContents(this.__element); return this;}},
        show:               {value: function(){this.__element.style.display=""; this.triggerEvent("show"); return this;}},
        toggleClass:        {value: function(className, condition){if (condition === undefined) condition = !this.hasClass(className); return this[condition?"addClass":"removeClass"](className);}},
        toggleClass:        {value: function(className, condition){if (condition === undefined) condition = !this.hasClass(className); return this[condition?"addClass":"removeClass"](className);}},
        toggleEdit:         {value: function(condition){if (condition === undefined) condition = this.__element.getAttribute("contentEditable")!=="true"; this.__element.setAttribute("contentEditable", condition); return this;}},
        toggleDisplay:      {value: function(condition){if (condition === undefined) condition = this.__element.style.display=="none"; this[condition?"show":"hide"](); return this;}},
        triggerEvent:       {value: function(eventName){var args = Array.prototype.slice(arguments, 1); this.__events.getOrAdd(eventName).invoke(args); return this;}},
        updateon:
        {
            get: function()
            {
                var names = [];
                each(this.value.onchange,function(event, name){names.push(name);});
                return names;
            },
            set: function(eventNames){ this.value.onchange = this.getEvents(eventNames); }
        }
    });
    each(["blur","click","focus"],function(name){Object.defineProperty(control.prototype,name,{value:function(){this.__element[name](); return this;}});});
    function defineFor(on,off){Object.defineProperty(control.prototype,on+"For",{value:function()
    {
        var args            = Array.prototype.slice.apply(arguments, 0, arguments.length-2),
            milliseconds    = arguments[arguments.length-2],
            onComplete      = arguments[arguments.length-1];
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
!function()
{"use strict";root.define("atomic.html.readonly", function htmlReadOnly(control, defineDataProperties)
{
    function readonly(elements, selector, parent)
    {
        control.call(this, elements, selector, parent);
        defineDataProperties(this, this.__binder,
        {
            value:  {get: function(){return this.__element.innerHTML;}, set: function(value){this.__element.innerHTML = value;}}
        });
    }
    Object.defineProperty(readonly, "prototype", {value: Object.create(control.prototype)});
    Object.defineProperties(readonly.prototype,
    {
        constructor:        {value: readonly}
    });
    return readonly;
});}();
!function()
{"use strict";root.define("atomic.html.container", function htmlContainer(control, each)
{
    var querySelector       =
    function(uiElement, selector, selectorPath, typeHint)
    {
        var element = uiElement.querySelector(selector);
        if (element === null)
        {
            logger("Element for selector " + selector + " was not found in " + (uiElement.id?("#"+uiElement.id):("."+uiElement.className)));
            element                 = document.createElement(typeHint!==undefined?(typeHintMap[typeHint]||typeHint):"div");
            var label               = document.createElement("span");
            label.innerHTML         = (selectorPath||"") + "-" + selector + ":";
            var container           = document.createElement("div");
            missingElements         = missingElements||createMissingElementsContainer();
            container.appendChild(element);
            missingElements.appendChild(label);
            missingElements.appendChild(container);
            element.style.border    = "solid 1px black";
        }
        element.__selectorPath  = selectorPath;
        return element;
    };
    function container(elements, selector, parent)
    {
        control.call(this, elements, selector, parent);
        Object.defineProperties(this,
        {
            "__controlKeys":    {value: []},
            controls:           {value: {}}
        });
    }
    Object.defineProperty(container, "prototype", {value: Object.create(control.prototype)});
    Object.defineProperties(container.prototype,
    {
        constructor:        {value: container},
        init:               {value: function(definition)
        {
            control.prototype.init.call(this, definition);
        }},
        appendControl:      {value: function(childControl)
        {
            this.__element.appendChild(childControl.__element); 
            this.controlKeys.push(childControl.key);
            this.controls[childControl.key] = childControl;
        }},
        addControl:         {value: function(controlKey, controlDeclaration)
        {
            if (controlDeclaration === undefined)  return;
            this.__controlKeys.push(controlKey);
            this.controls[controlKey]       = createControl(controlDeclaration, undefined, this, "#" + controlKey);
            this.controls[controlKey].data  = this.data;
            return this.controls[controlKey];
        }},
        createControl:
        function(controlDeclaration, controlElement, parent, selector)
        {
            var control;
            if (controlDeclaration.factory !== undefined)
            {
                control = controlDeclaration.factory(parent, controlElement, selector);
            }
            else    control = this.create(controlDeclaration.adapter||function(){ return controlDeclaration; }, controlElement||querySelector(parent.__element, (controlDeclaration.selector||("#"+controlKey)), parent.getSelectorPath()), parent, selector);
            initializeViewAdapter(control, controlDeclaration);
            if(controlDeclaration.multipresent){Object.defineProperty(control, "multipresent", {writable: false, value:true});}
            return control;
        },
        removeControl:      {value: function(childControl)
        {
            this.__element.removeChild(childControl.__element);
            removeItemFromArray(this.__controlKeys, childControl.key);
            delete this.controls[childControl.key];
            return this;
        }}
    });
    return container;
});}();
!function()
{"use strict";root.define("atomic.html.panel", function htmlPanel(container, defineDataProperties, viewAdapterFactory, each)
{
    function attachControls(controlDeclarations, viewElement)
    {
        if (controlDeclarations === undefined)  return;
        var selectorPath                = this.getSelectorPath();
        for(var controlKey in controlDeclarations)
        {
            this.__controlKeys.push(controlKey);
            var declaration             = controlDeclarations[controlKey];
            var selector                = (declaration.selector||("#"+controlKey));
            this.controls[controlKey]   = viewAdapterFactory.createControl(declaration, viewAdapterFactory.select(viewElement, selector, selectorPath), this, selector);
        }
    }
    function panel(elements, selector, parent)
    {
        container.call(this, elements, selector, parent);
        defineDataProperties(this, this.__binder, {value: {ondataupdate: function(value)
        {
            each(this.__controlKeys, (function(controlKey){if (!this.controls[controlKey].isRoot) this.controls[controlKey].data = this.data.observe(this.bind);}).bind(this));
        }}});
        this.bind   = "";
    }
    Object.defineProperty(panel, "prototype", {value: Object.create(container.prototype)});
    Object.defineProperties(panel.prototype,
    {
        constructor:        {value: panel},
        init:               {value: function(definition)
        {
            container.prototype.init.call(this, definition);
            attachControls.call(this, definition.controls, this.__element);
        }},
        children:           {value: function(){return this.controls || null;}},
        appendControl:      {value: function(childControl){ this.__element.appendChild(childControl.__element); }},
        addControl:         {value: function(controlKey, controlDeclaration)
        {
            if (controlDeclaration === undefined)  return;
            this.__controlKeys.push(controlKey);
            this.controls[controlKey]   = createControl(controlDeclaration, undefined, this, "#" + controlKey);
            return this.controls[controlKey];
        }},
        removeControl:      {value: function(childControl)
        {
            each(this.__elements, function(element){each(childControl.__elements, function(childElement)
            {
                element.removeChild(childElement);
            });});
            return this;
        }}
    });
    return panel;
});}();
!function()
{"use strict";root.define("atomic.html.repeater", function htmlRepeater(control, defineDataProperties, viewAdapterFactory, removeFromArray)
{
    var querySelector       =
    function(uiElement, selector, selectorPath, typeHint)
    {
        var element = uiElement.querySelector(selector);
        if (element === null)
        {
            logger("Element for selector " + selector + " was not found in " + (uiElement.id?("#"+uiElement.id):("."+uiElement.className)));
            element                 = document.createElement(typeHint!==undefined?(typeHintMap[typeHint]||typeHint):"div");
            var label               = document.createElement("span");
            label.innerHTML         = (selectorPath||"") + "-" + selector + ":";
            var container           = document.createElement("div");
            missingElements         = missingElements||createMissingElementsContainer();
            container.appendChild(element);
            missingElements.appendChild(label);
            missingElements.appendChild(container);
            element.style.border    = "solid 1px black";
        }
        element.__selectorPath  = selectorPath;
        return element;
    };
    function removeAllElementChildren(element)
    {
        while(element.lastChild)    element.removeChild(element.lastChild);
    }
    function locate(item, retained)
    {
        for(var counter=0;counter<retained.length;counter++) if (retained[counter].data() === item)
        {
            var retainedControl = retained[counter];
            removeFromArray(retained, counter);
            return retainedControl;
        }
        return null;
    }
    function createTemplateCopy(templateKey, subDataItem, counter, retained)
    {
        var templateElement = this.__templateElements[templateKey];
        if (templateElement.declaration.skipItem !== undefined && templateElement.declaration.skipItem(subDataItem))    return;
        var key             = templateElement.declaration.getKey.call({parent: this, index: counter}, subDataItem);

        var retainedControl = locate(subDataItem(), retained);
        if (retainedControl !== null)   return { key: key, parent: templateElement.parent, control: retainedControl };

        var elementCopy     = templateElement.element.cloneNode(true);
        elementCopy.setAttribute("id", key);
        var clone           = { key: key, parent: templateElement.parent, control: viewAdapterFactory.createControl(templateElement.declaration, elementCopy, this, "#" + key) };
        clone.control.data  = subDataItem;
        return clone;
    };
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
            templateElementParent.removeChild(templateElement);
            this.__templateElements[templateKey]     =
            {
                parent:         templateElementParent,
                declaration:    templateDeclaration,
                element:        templateElement
            };
        }
        for(var templateKey in templateDeclarations)
        removeAllElementChildren(this.__templateElements[templateKey].parent);
    }

    function bindRepeatedList(observer)
    {
        if (observer() === undefined) return;
        var documentFragment    = document.createDocumentFragment();
        var retained            = unbindRepeatedList.call(this, observer());
        for(var dataItemCounter=0;dataItemCounter<observer.count;dataItemCounter++)
        {
            for(var templateKeyCounter=0;templateKeyCounter<this.__templateKeys.length;templateKeyCounter++)
            {
                var subDataItem                     = observer.observe(dataItemCounter);
                var clone                           = createTemplateCopy.call(this, this.__templateKeys[templateKeyCounter], subDataItem, dataItemCounter, retained);
                if (clone !== undefined)
                {
                    this.__repeatedControls[clone.key]  = clone.control;
                    documentFragment.appendChild(clone.control.__element);
                }
            }
        }
        this.__element.appendChild(documentFragment);
    }
    function unbindRepeatedList(keepList)
    {
        var retain  = [];
        if (this.__repeatedControls !== undefined)
        for(var repeatedControlKey in this.__repeatedControls)
        {
            var repeatedControl     = this.__repeatedControls[repeatedControlKey];
            if (keepList.indexOf(repeatedControl.data()) > -1)  retain.push(repeatedControl);
            else                                                repeatedControl.data    = undefined;
            repeatedControl.__element.parentNode.removeChild(repeatedControl.__element);
        }
        this.__repeatedControls     = {};
        return retain;
    }

    function repeater(elements, selector, parent)
    {
        control.call(this, elements, selector, parent);
        Object.defineProperties(this,
        {
            "__templateKeys":       {value: []},
            "__templateElements":   {value: {}}
        });
        defineDataProperties(this, this.__binder, {value: {ondataupdate: function(value)
        {
            bindRepeatedList.call(this, this.data.observe(this.bind));
        }}});
        this.bind   = "";
    }
    Object.defineProperty(repeater, "prototype", {value: Object.create(control.prototype)});
    Object.defineProperties(repeater.prototype,
    {
        constructor:        {value: repeater},
        init:               {value: function(definition)
        {
            extractDeferredControls.call(this, definition.repeat, this.__element);
            control.prototype.init.call(this, definition);
        }},
        children:   {value: function(){return this.__repeatedControls || null;}},
        refresh:    {value: function(){bindRepeatedList.call(this, this.data(this.__bind||"")); notifyOnDataUpdate.call(this, this.data(this.__bind||""));}}
    });
    return repeater;
});}();
!function()
{"use strict";root.define("atomic.html.input", function htmlInput(control, defineDataProperties)
{
    function input(elements, selector, parent)
    {
        control.call(this, elements, selector, parent);
        defineDataProperties(this, this.__binder,
        {
            value:  {get: function(){return this.__element.value;}, set: function(value){this.__element.value = value||"";},  onchange: this.getEvents("change")}
        });
    }
    Object.defineProperty(input, "prototype", {value: Object.create(control.prototype)});
    Object.defineProperties(input.prototype,
    {
        constructor:    {value: input},
        select:         {value: function(){this.__element.select(); return this;}}
    });
    return input;
});}();
!function()
{"use strict";root.define("atomic.html.checkbox", function htmlCheckbox(control, defineDataProperties)
{
    function checkbox(elements, selector, parent)
    {
        control.call(this, elements, selector, parent);
        defineDataProperties(this, this.__binder,
        {
            value:  {get: function(){return this.__element.checked;}, set: function(value){this.__element.checked = value===true;},  onchange: this.getEvents("change")}
        });
    }
    Object.defineProperty(checkbox, "prototype", {value: Object.create(control.prototype)});
    Object.defineProperties(checkbox.prototype,
    {
        constructor:    {value: checkbox}
    });
    return checkbox;
});}();
!function()
{"use strict";root.define("atomic.html.select", function htmlSelect(input, defineDataProperties, dataBinder)
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
        if (this.__element.options.length > 0) for(var counter=0;counter<this.__element.options.length;counter++) this.__element.options[counter].selected = this.__element.options[counter].rawValue == value;
    }
    function selectoption(element, selector, parent)
    {
        Object.defineProperties(this, 
        {
            "__element":        {value: element},
            "__sourceBinder":   {value: new dataBinder()}
        });
        defineDataProperties(this, this.__sourceBinder,
        {
            text:   {get: function(){return this.__element.text;}, set: function(value){this.__element.text = value;}},
            value:  {get: function(){return this.__element.rawValue;}, set: function(value){this.__element.value = this.__element.rawValue = value;}}
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
        option.text.bind    = this.__sourceText||"";
        option.value.bind   = this.__sourceValue||"";
        option.source       = sourceItem;
        return option;
    }
    function select(element, selector, parent)
    {
        input.call(this, element, selector, parent);
        Object.defineProperties(this, 
        {
            "__items":      {value: null, configurable: true},
            "__options":    {value: []}
        });
        defineDataProperties(this, this.__binder,
        {
            value:  {get: function(){return getSelectListValue.call(this);}, set: function(value){setSelectListValue.call(this, value||null);},  onchange: this.getEvents("change")}
        });
        defineDataProperties(this, this.__binder,
        {
            items:
            {
                get:        function() {return this.__items;},
                set:        function(value)
                {
                    Object.defineProperty(this, "__items", {value: value!==undefined&&value.isObserver?value():value, configurable: true});

                    if (value!==undefined)
                    bindSelectListSource.call(this, value);
                }
            }
        });
    }
    Object.defineProperty(select, "prototype", {value: Object.create(input.prototype)});
    Object.defineProperties(select.prototype,
    {
        constructor:        {value: select},
        count:              {get:   function(){ return this.__elements[0].options.length; }},
        selectedIndex:      {get:   function(){ return this.__elements[0].selectedIndex; },   set: function(value){ this.__element.selectedIndex=value; }},
        __isValueSelected:  {value: function(value){return this.__rawValue === value;}}
    });
    function clearOptions(){ for(var counter=this.__element.options.length-1;counter>=0;counter--) this.__element.remove(counter); }
    function bindSelectListSource(items)
    {
        var selectedValue   = this.value();
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
!function()
{"use strict";root.define("atomic.html.radiogroup", function htmlRadioGroup(input, defineDataProperties, dataBinder)
{
    function setRadioGroupValue(value)
    {
        Object.defineProperty(this, "__rawValue", {value: value, configurable: true});
        if (this.__options.length > 0) for(var counter=0;counter<this.__options.length;counter++) this.__options[counter].selected = this.__options[counter].value() == value;
    }
    function getRadioGroupValue()
    {
        if (this.__options.length > 0) for(var counter=0;counter<this.__options.length;counter++) if (this.__options[counter].selected)
        {
            Object.defineProperty(this, "__rawValue", {value: this.__options[counter].value(), configurable: true});
            break;
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
    function radiooption(element, selector, name, parent)
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
        defineDataProperties(this, this.__sourceBinder,
        {
            text:   {get: function(){return this.__text;}, set: function(value){Object.defineProperty(this,"__text",{value: value}); if (this.__radioLabel != null) this.__radioLabel.innerHTML = value;}},
            value:  {get: function(){return this.__value;}, set: function(value){Object.defineProperty(this, "__value", {value: value}); if (this.__radioElement != null) this.__radioElement.value = value;}}
        });
        this.__radioElement.name = name;
        this.__element.addEventListener
        (
            "click", 
            (function(event)
            {
                event=event||window.event; 
                this.parent.value(this.value());
                this.parent.triggerEvent("change");
                event.cancelBubble=true;
                if (event.stopPropagation) event.stopPropagation();
                return false;
            }).bind(this),
            true
        );
    }
    Object.defineProperties(radiooption.prototype,
    {
        source:     {get: function(){return this.__sourceBinder.data;}, set: function(value){this.__sourceBinder.data = value;}},
        selected:   {get: function(){return this.__radioElement.checked;}, set: function(value){this.__radioElement.checked = !(!value);}}
    });
    function createOption(sourceItem, index)
    {
        var option          = new radiooption(this.__templateElement.cloneNode(true), this.selector+"-"+index, this.__element.__selectorPath + (this.__element.id||"unknown"), this);
        option.text.bind    = this.__sourceText||"";
        option.value.bind   = this.__sourceValue||"";
        option.source       = sourceItem;
        return option;
    }
    function radiogroup(elements, selector, parent)
    {
        input.call(this, elements, selector, parent);
        Object.defineProperties(this, 
        {
            "__items":      {value: null, configurable: true},
            "__options":    {value: []}
        });
        defineDataProperties(this, this.__binder,
        {
            value:  {get: function(){return getRadioGroupValue.call(this);}, set: function(value){setRadioGroupValue.call(this, value||null);},  onchange: this.getEvents("change")}
        });
        defineDataProperties(this, this.__binder,
        {
            items:
            {
                get:        function() {return this.__items;},
                set:        function(value)
                {
                    Object.defineProperty(this, "__items", {value: value!==undefined&&value.isObserver?value():value, configurable: true});
                    captureTemplateIfNeeded.call(this);
                    if (value!==undefined)
                    bindRadioGroupSource.call(this, value);
                }
            }
        });
    }
    Object.defineProperty(radiogroup, "prototype", {value: Object.create(input.prototype)});
    Object.defineProperties(radiogroup.prototype,
    {
        constructor:        {value: radiogroup},
        count:              {get:   function(){ return this.__elements[0].options.length; }},
        selectedIndex:      {get:   function(){ return this.__elements[0].selectedIndex; },   set: function(value){ this.__element.selectedIndex=value; }},
        __isValueSelected:  {value: function(value){return this.__rawValue === value;}}
    });
    function clearRadioGroup(radioGroup){ for(var counter=radioGroup.childNodes.length-1;counter>=0;counter--) radioGroup.removeChild(radioGroup.childNodes[counter]); }
    function bindRadioGroupSource(items)
    {
        var selectedValue   = this.value();
        clearRadioGroup(this.__element);
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
    return radiogroup;
});}();
!function()
{"use strict";root.define("atomic.html.multiselect", function htmlMultiSelect(base, defineDataProperties)
{
    function setSelectListValues(values)
    {
        if (typeof values === "function")   values = values();
        if ( !Array.isArray(values)) values  = [values];
        this.__rawValue = values;
        if (this.__element.options.length > 0) for(var counter=0;counter<this.__element.options.length;counter++) this.__element.options[counter].selected = values.indexOf(this.__element.options[counter].rawValue) > -1;
    }
    function getSelectListValues()
    {
        if (this.__element.options.length == 0) return this.__rawValue;
        var values  = [];
        if (this.__element.options.length > 0) for(var counter=0;counter<this.__element.options.length;counter++) if (this.__element.options[counter].selected)   values.push(this.__element.options[counter].rawValue);
        return this.__rawValue = values;
    }
    function multiselect(elements, selector, parent)
    {
        base.call(this, elements, selector, parent);
        defineDataProperties(this, this.__binder,
        {
            value:  {get: function(){return getSelectListValues.call(this);}, set: function(value){setSelectListValues.call(this, value||null);},  onchange: this.getEvents("change")}
        });
    }
    Object.defineProperty(multiselect, "prototype", {value: Object.create(base.prototype)});
    Object.defineProperties(multiselect.prototype,
    {
        constructor:        {value: multiselect},
        count:              {get:   function(){ return this.__element.options.length; }},
        selectedIndexes:    {get:   function(){ return this.__element.selectedIndex; },   set: function(value){ this.__element.selectedIndex=value; }},
        size:               {get:   function(){ return this.__element.size; },            set: function(value){ this.__elements[0].size=value; }},
        __isValueSelected:  {value: function(value){return Array.isArray(this.__rawValue) && this.__rawValue.indexOf(value) > -1;}}
    });
    return multiselect;
});}();
!function()
{"use strict";root.define("atomic.html.isolatedFunctionFactory", function isolatedFunctionFactory(document)
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
            function(functionToIsolate)
            {
                isolatedDocument.write("<script>parent.__isolatedSubFunction = " + functionToIsolate.toString() + ";<\/script>");
                var __isolatedSubFunction  = window.__isolatedSubFunction;
                delete window.__isolatedSubFunction;
                return __isolatedSubFunction;
            },
            root:   isolatedFunction
        };
    }
});}();
!function()
{"use strict";root.define("atomic.html.viewAdapterFactory", function htmlViewAdapterFactory(document, controlTypes, initializeViewAdapter, pubSub, logger, each)
{
    var typeHintMap         = {};
    var missingElements;
    function createMissingElementsContainer()
    {
        var missingElements = document.createElement("div");
        document.body.appendChild(missingElements);
        return missingElements;
    }
    var elementControlTypes =
    {
        "input":                    "input",
        "input:checkbox":           "checkbox",
        "textarea":                 "input",
        "img":                      "panel",
        "select:select-multiple":   "multiselect",
        "select:select-one":        "select",
        "radiogroup":               "radiogroup"
    };
    each(["default","a","abbr","address","article","aside","b","bdi","blockquote","body","caption","cite","code","col","colgroup","dd","del","details","dfn","dialog","div","dl","dt","em","fieldset","figcaption","figure","footer","h1","h2","h3","h4","h5","h6","header","i","ins","kbd","label","legend","li","menu","main","mark","menuitem","meter","nav","ol","optgroup","p","pre","q","rp","rt","ruby","section","s","samp","small","span","strong","sub","summary","sup","table","tbody","td","tfoot","th","thead","time","title","tr","u","ul","wbr"],
    function(name)
    {
        elementControlTypes[name]   = "readonly";
    });
    function getControlTypeForElement(definition, element)
    {
        return  definition.controls
                ?   "panel"
                :   definition.repeat
                    ?   "repeater"
                    :   elementControlTypes[element.nodeName.toLowerCase() + (element.type ? ":" + element.type.toLowerCase() : "")]||elementControlTypes[element.nodeName.toLowerCase()]||elementControlTypes.default;
    }
    var viewAdapterFactory  =
    {
        createControl:  function(controlDeclaration, controlElement, parent, selector)
        {
            var control;
            if (controlDeclaration.factory !== undefined)
            {
                control = controlDeclaration.factory(parent, controlElement, selector);
            }
            else    control = this.create(controlDeclaration.adapter||function(){ return controlDeclaration; }, controlElement||viewAdapterFactory.select(parent.__element, (controlDeclaration.selector||("#"+controlKey)), parent.getSelectorPath()), parent, selector, controlDeclaration.type);
            initializeViewAdapter(control, controlDeclaration);
            if(controlDeclaration.multipresent){Object.defineProperty(control, "multipresent", {writable: false, value:true});}
            return control;
        },
        create:         function createViewAdapter(viewAdapterDefinitionConstructor, viewElement, parent, selector, controlType)
        {
            selector                    = selector || (viewElement.id?("#"+viewElement.id):("."+viewElement.className));
            var viewAdapterDefinition   = new viewAdapterDefinitionConstructor();
            controlType                 = controlType || getControlTypeForElement(viewAdapterDefinition, viewElement);
            var viewAdapter             = new controlTypes[controlType](viewElement, selector, parent);
            viewAdapter.init(viewAdapterDefinition);
            if(viewAdapter.construct)   viewAdapter.construct(viewAdapter);
            return viewAdapter;
        },
        createFactory:  function createFactory(viewAdapterDefinitionConstructor, viewElementTemplate, selector)
        {
            viewElementTemplate.parentNode.removeChild(viewElementTemplate);
            return (function(parent, containerElement, containerSelector)
            {
                var container   = parent;
                if (containerElement !== undefined)
                {
                    container                       = internalFunctions.create(function(){return {};}, containerElement, parent, selector);
                    container.__element.innerHTML   = "";
                }
                var view                            = internalFunctions.create(viewAdapterDefinitionConstructor, viewElementTemplate.cloneNode(true), container, selector);
                container.appendControl(view);
                return view;
            }).bind(this);
        },
        select:         function(uiElement, selector, selectorPath, typeHint)
        {
            var element = uiElement.querySelector(selector);
            if (element === null)
            {
                logger("Element for selector " + selector + " was not found in " + (uiElement.id?("#"+uiElement.id):("."+uiElement.className)));
                element                 = document.createElement(typeHint!==undefined?(typeHintMap[typeHint]||typeHint):"div");
                var label               = document.createElement("span");
                label.innerHTML         = (selectorPath||"") + "-" + selector + ":";
                var container           = document.createElement("div");
                missingElements         = missingElements||createMissingElementsContainer();
                container.appendChild(element);
                missingElements.appendChild(label);
                missingElements.appendChild(container);
                element.style.border    = "solid 1px black";
            }
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
!function()
{"use strict";root.define("atomic.initializeViewAdapter", function(each)
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
            if (Array.isArray(binding.updateon))                            viewAdapter[name].onchange  = viewAdapter.getEvents(binding.updateon);
        }
    }
    function bindMultipleProperties(viewAdapter, bindings)
    {
        for(var name in bindings) bindProperty(viewAdapter, name, bindings[name]);
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
!function()
{
    "use strict";
    var createObserver;
    function buildConstructor(removeFromArray, isolatedFunctionFactory, each)
    {
        var objectObserverFunctionFactory               = new isolatedFunctionFactory();
        var objectObserver                              =
        objectObserverFunctionFactory.create
        (function objectObserverFactory(basePath, bag)
        {
            function objectObserver(path, value)
            {
                return objectObserver.__invoke(path, value, false);
            }
            Object.defineProperties(objectObserver,
            {
                "__basePath":   {get:   function(){return basePath;}},
                "__bag":        {get:   function(){return bag;}},
                "isDefined":    {value: function(propertyName){return this(propertyName)!==undefined;}},
                "hasValue":     {value: function(propertyName){var value=this(propertyName); return value!==undefined && !(!value);}}
            });
            return objectObserver;
        });
        var arrayObserverFunctionFactory                = new isolatedFunctionFactory();
        var arrayObserver                               =
        arrayObserverFunctionFactory.create
        (function arrayObserverFactory(basePath, bag)
        {
            function each(array, callback) { for(var arrayCounter=0;arrayCounter<array.length;arrayCounter++) callback(array[arrayCounter], arrayCounter); }
            function arrayObserver(path, value)
            {
                return arrayObserver.__invoke(path, value, false);
            }
            Object.defineProperties(arrayObserver,
            {
                "__basePath":   {get:   function(){return basePath;}},
                "__bag":        {get:   function(){return bag;}}
            });
            each(["push","pop","shift","unshift","sort","reverse","splice"], function(name)
            {
                Object.defineProperty
                (
                    arrayObserver, 
                    name, 
                    {
                        value: function()
                        {
                            var items   = this(); 
                            var result  = items[name].apply(items, arguments);
                            this.__notify(this.__basePath, items); 
                            return result === items ? this : result; 
                        }
                    }
                );
            });
            each(["remove","removeAll"], function(name)
            {
                Object.defineProperty
                (
                    arrayObserver,
                    name, 
                    {
                        value: function()
                        {
                            var result = this["__"+name].apply(this, arguments); 
                            this.__notify(this.__basePath, this());
                            return result; 
                        }
                    }
                );
            });
            each(["join","indexOf","slice"], function(name)
            {
                Object.defineProperty
                (
                    arrayObserver, 
                    name, 
                    {
                        value: function()
                        {
                            var items   = this(); 
                            return items[name].apply(items, arguments);
                        }
                    }
                );
            });
            return arrayObserver;
        });
        function createObserver(revisedPath, bag, isArray)
        {
            return new (isArray?arrayObserver:objectObserver)(revisedPath, bag);
        }
        function getValue(pathSegments, revisedPath, getObserver)
        {
            pathSegments    = pathSegments || [""];
            if (this.__bag.updating.length > 0) addProperties(this.__bag.updating[this.__bag.updating.length-1].properties, pathSegments);
            var returnValue = navDataPath(this.__bag, pathSegments);
            if (getObserver||(revisedPath !== undefined && returnValue !== null && typeof returnValue == "object")) return createObserver(revisedPath, this.__bag, Array.isArray(returnValue));
            return returnValue;
        }
        function extractArrayPathSegmentsInto(subSegments, returnSegments, path)
        {
            for(var subSegmentCounter=0;subSegmentCounter<subSegments.length;subSegmentCounter++)
            {
                var subSegment  = subSegments[subSegmentCounter];
                // warning: string subsegments are not currently supported
                if (isNaN(subSegment))  { debugger; throw new Error("An error occured while attempting to parse a array subSegment index in the path " + path); }
                returnSegments.push({type:1, value: parseInt(subSegment)});
            }
        }
        function extractPathSegments(path)
        {if(typeof path.split !== "function") debugger;
            var pathSegments    = path.split(".");
            var returnSegments  = [];
            for(var segmentCounter=0;segmentCounter<pathSegments.length;segmentCounter++)
            {
                var pathSegment = pathSegments[segmentCounter];
                var bracket     = pathSegment.indexOf("[");
                if (bracket > -1)
                {
                    var subSegments = pathSegment.substring(bracket+1, pathSegment.length-1).split("][");
                    pathSegment     = pathSegment.substring(0, bracket);
                    if (pathSegment !=="")   returnSegments.push({type:1, value: pathSegment});
                    extractArrayPathSegmentsInto(subSegments, returnSegments, path);
                }
                else    if (pathSegment !=="")   returnSegments.push({type:0, value: pathSegment});
            }
            return returnSegments;
        }
        function getFullPath(paths)
        {
            if (paths.length == 0) return "";
            var path    = paths[0].value;
            for(var pathCounter=1;pathCounter<paths.length;pathCounter++)   path    += "." + paths[pathCounter].value;
            return path;
        }
        function navDataPath(root, paths, value)
        {
            if (paths.length == 0)
            {
                if(value === undefined) return root.item;
                root.item   = value;
                return;
            }
            var current     = root.item;
            for(var pathCounter=0;pathCounter<paths.length-1;pathCounter++)
            {
                var path    = paths[pathCounter];
                if (current[path.value] === undefined)
                {
                    if (value !== undefined)    current[path.value]   = path.type===0?{}:[];
                    else                        return undefined;
                }
                current     = current[path.value];
            }
            if (value === undefined)    return current[paths[paths.length-1].value];
            current[paths[paths.length-1].value]    = value;
        }
        function addPropertyPath(properties, path, remainingPath)
        {
            properties[path]    = remainingPath !== undefined ? remainingPath : "";
        }
        function addProperties(properties, pathSegments)
        {
            addPropertyPath(properties, "", getFullPath(pathSegments.slice(0)));
            if (pathSegments.length === 0)  return;
            var path    = pathSegments[0].value;
            addPropertyPath(properties, path, getFullPath(pathSegments.slice(1)));
            for(var segmentCounter=1;segmentCounter<pathSegments.length;segmentCounter++)
            {
                path    += "." + pathSegments[segmentCounter].value;
                addPropertyPath(properties, path, getFullPath(pathSegments.slice(segmentCounter+1)));
            }
        }
        function notifyPropertyListener(propertyKey, listener, bag)
        {
            if (listener.callback !== undefined && !listener.callback.ignore && (propertyKey == "" || (listener.nestedUpdatesRootPath !== undefined && propertyKey.substr(0, listener.nestedUpdatesRootPath.length) === listener.nestedUpdatesRootPath) || (listener.properties !== undefined && listener.properties.hasOwnProperty(propertyKey))))
            {
                bag.updating.push(listener);
                listener.properties = {};
                var postCallback = listener.callback();
                bag.updating.pop();
                if (postCallback !== undefined) postCallback();
            }
        }
        function notifyPropertyListeners(propertyKey, value, bag)
        {
            var itemListeners   = bag.itemListeners.slice();
            for(var listenerCounter=0;listenerCounter<itemListeners.length;listenerCounter++)   notifyPropertyListener.call(this, propertyKey, itemListeners[listenerCounter], bag);
        }
        each([objectObserverFunctionFactory,arrayObserverFunctionFactory],function(functionFactory){Object.defineProperties(functionFactory.root.prototype,
        {
            __invoke:           {value: function(path, value, getObserver)
            {
                if (path === "..." && value === undefined)      {return getValue.call(this, [], undefined, getObserver);}
                if (path === undefined && value === undefined)  return getValue.call(this, extractPathSegments(this.__basePath), undefined, getObserver);
                if (path === undefined || path === null)        path    = "";
                var resolvedPath    =   typeof path === "string" && path.substr(0,3) === "..."
                                        ?   path.substr(3)
                                        :   this.__basePath + (typeof path === "string" && path.substr(0, 1) === "." ? "" : ".") + path.toString();
                var pathSegments    = extractPathSegments(resolvedPath);
                var revisedPath     = getFullPath(pathSegments);
                if (value === undefined)    return getValue.call(this, pathSegments, revisedPath, getObserver);
                if (this.__bag.rollingback) return;
                var currentValue = navDataPath(this.__bag, pathSegments);
                if (value !== currentValue)
                {
                    navDataPath(this.__bag, pathSegments, value);
                    notifyPropertyListeners.call(this, revisedPath, value, this.__bag);
                }
            }},
            __notify:           {value: function(path, value){notifyPropertyListeners.call(this, path, value, this.__bag);}},
            observe:            {value: function(path){return this.__invoke(path, undefined, true);}},
            basePath:           {value: function(){return this.__basePath;}},
            beginTransaction:   {value: function(){this.__bag.backup   = JSON.parse(JSON.stringify(this.__bag.item));}},
            commit:             {value: function(){delete this.__bag.backup;}},
            ignore:             {value: function(callback)
            {
                for(var listenerCounter=0;listenerCounter<this.__bag.itemListeners.length;listenerCounter++)
                if (this.__bag.itemListeners[listenerCounter].callback === callback)
                removeFromArray(this.__bag.itemListeners, listenerCounter);
            }},
            isObserver:         {value: true},
            listen:             {value: function(callback, nestedUpdatesRootPath)
            {
                var listener    = {callback: callback, nestedUpdatesRootPath: nestedUpdatesRootPath!==undefined?((this.__basePath||"")+(this.__basePath && this.__basePath.length>0&&nestedUpdatesRootPath.length>0&&nestedUpdatesRootPath.substr(0,1)!=="."?".":"")+nestedUpdatesRootPath):undefined};
                this.__bag.itemListeners.push(listener);
                notifyPropertyListener.call(this, "", listener, this.__bag);
            }},
            rollback:           {value: function()
            {
                this.__bag.rollingback  = true;
                this.__bag.item         = this.__bag.backup;
                delete this.__bag.backup;
                notifyPropertyListeners.call(this, this.__basePath, this.__bag.item, this.__bag);
                this.__bag.rollingback  = false;
            }}
        });});
        Object.defineProperties(arrayObserverFunctionFactory.root.prototype,
        {
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
            isArrayObserver:    {value: true},
            count:              {get: function(){return this().length;}}
        });
        return createObserver;
    }
    root.define("atomic.observerFactory", function(removeFromArray, isolatedFunctionFactory, each)
    {
        if (createObserver === undefined)  createObserver   = buildConstructor(removeFromArray, isolatedFunctionFactory, each);
        return function observer(_item)
        {
            var bag             =
            {
                item:           _item,
                itemListeners:  [],
                rootListeners:  [],
                propertyKeys:   [],
                updating:       [],
                rollingback:    false
            };
            return createObserver("", bag, Array.isArray(_item));
        };
    });
}();
!function()
{"use strict";root.define("atomic.dataBinder", function dataBinder(each, removeItemFromArray)
{
    function notifyProperties()
    {
        each(this.__properties,(function(property)
        {
            property.data = this.data||null;
        }).bind(this));
    }
    function dataBinder(data)
    {
        Object.defineProperties(this,
        {
            "__properties": {value: []},
            "__forceRoot":  {value: false, configurable: true}
        });
        this.__makeRoot();
        if (data) this.data = data;
    };
    Object.defineProperties(dataBinder.prototype,
    {
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
        __makeRoot:   {value: function()
        {
            var parent  = this.__parentBinder;
            Object.defineProperty(this,"__parentBinder", {value: null, configurable: true});
            if(parent)   parent.unregister(this);
        }},
        isBinder:   {value: true},
        isRoot:
        {
            get: function(){return this.__forceRoot || (this.__parentBinder==null&&this.__data!=null);}, 
            set: function(value)
            {
                if (value===true)   this.__makeRoot();
                Object.defineProperty(this, "__forceRoot", {value: value, configurable: true});
            }},
        register:   {value: function(property){if (this.__properties.indexOf(property)==-1) this.__properties.push(property); property.data = this.data;}},
        unregister: {value: function(property){property.data = undefined; removeItemFromArray(this.__properties, property);}}
    });
    return dataBinder;
});}()
!function()
{
    "use strict";
    var defineDataProperties;
    function buildFunction(isolatedFunctionFactory, each)
    {
        var functionFactory = new isolatedFunctionFactory();
        var createProperty  =
        functionFactory.create
        (function createProperty(owner, getter, setter, onchange, binder)
        {
            function property(value, forceSet)
            {
                if (value !== undefined || forceSet)
                {
                    if (typeof setter === "function")   setter.call(owner, value);
                    if (Object.keys(property.__onchange).length===0)    property.__inputListener();
                }
                else                                    return getter.call(owner);
            };
            Object.defineProperties(property,
            {
                __owner:                {value: owner},
                __binder:               {value: binder, configurable: true},
                __getter:               {value: function(){return getter.call(owner);}},
                __setter:               {value: function(value){if (typeof setter === "function") setter.call(owner, value);}},
                __notifyingObserver:    {value: undefined, writable: true},
                __onchange:             {value: {}},
                __inputListener:        {value: function(){property.___inputListener();}}
            });
            if (typeof onchange === "string") debugger;
            property.onchange = onchange;
            if (binder) binder.register(property);
            return property;
        });
        function bindData()
        {
            if (this.__data === undefined || this.__data == null)   return;
            Object.defineProperty(this,"__bounded", {value: true, configurable: true});
            if (this.__bind !== undefined)
            {
                Object.defineProperty(this, "__bindListener", 
                {
                    configurable:   true, 
                    value:          (function()
                    {
                        var value = this.__getDataValue();
                        if (!this.__notifyingObserver) this.__setter(value);
                        notifyOnDataUpdate.call(this, this.data); 
                    }).bind(this)
                });
                each(this.__onchange, (function(onchange){onchange.listen(this.__inputListener);}).bind(this));
                this.data.listen(this.__bindListener, this.__root);
                notifyOnbind.call(this, this.data);
                return this;
            }
            else if (this.__ondataupdate)
            {
                Object.defineProperty(this, "__bindListener", {configurable: true, value: function(){ notifyOnDataUpdate.call(this, this.data); }});
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
                if (notify = this.data !== undefined)   this.data.ignore(this.__bindListener);
                this.__bindListener.ignore = true;
                Object.defineProperty(this, "__bindListener", {configurable: true, value: undefined});
            }
            each(this.__onchange, (function(onchange){onchange.ignore(this.__inputListener);}).bind(this));
            if (notify)                                 notifyOnunbind.call(this);
        }
        function notifyOnbind(data)         { if (this.__onbind) this.__onbind.call(this.__owner, data); }
        function notifyOnDataUpdate(data)   { if (this.__ondataupdate) this.__ondataupdate.call(this.__owner, data); }
        function notifyOnunbind(data)       { if (this.__onunbind) this.__onunbind.call(this.__owner, data); }
        function rebind(callback)
        {
            unbindData.call(this);
            callback.call(this);
            bindData.call(this);
        }
        Object.defineProperties(functionFactory.root.prototype,
        {
            __destroy:
            {
                value:  function()
                {
                    if (this.__binder)  this.__binder.unregister(this);
                    Object.defineProperty(this, "__binder", {value: undefined, writable: true});
                    delete this.__binder;
                }
            },
            ___inputListener:
            {
                value:  function()
                {
                    if (this.__bounded===false) return;
                    this.__notifyingObserver    = true;
                    this.__setDataValue();
                    this.__notifyingObserver    = false;
                }
            },
            __getDataValue:
            {
                value:  function()
                {
                    if      (typeof this.__bind === "function")                     return this.__bind.call(this.__owner, this.data);
                    else if (typeof this.__bind === "string")                       return this.data(this.__bind);
                    else if (this.__bind && typeof this.__bind.get === "function")  {return this.__bind.get.call(this.owner, this.data);}
                    debugger;
                    return this.data();
                }
            },
            __setDataValue:
            {
                value:  function()
                {
                    if (this.__getter === undefined)                                return;

                    if      (typeof this.__bind === "string")                       this.data(this.__bind, this.__getter());
                    else if (this.__bind && typeof this.__bind.set === "function")  this.__bind.set.call(this.owner, this.data, this.__getter());
                    else                                                            throw new Error("Unable to set back two way bound value to model.");
                }
            },
            onchange:
            {
                get:    function(){return this.__onchange;},
                set:    function(value) {rebind.call(this,function()
                {
                    each(this.__onchange,   (function(event, name){Object.defineProperty(this.__onchange,name,{writable: true});delete this.__onchange[name];}).bind(this));
                    each(value,             (function(event, name){Object.defineProperty(this.__onchange,name,{value: event, configurable: true, enumerable: true});}).bind(this));
                });}
            }
        });
        each(["data","bind","root"],function(name)
        {
            Object.defineProperty(functionFactory.root.prototype, name,
            {
                get:    function(){return this["__"+name];},
                set:    function(value)
                {
                    rebind.call(this, function()
                    {
                        Object.defineProperty(this, "__"+name, {value: value, configurable: true});
                    });
                    if(typeof this[name+"updated"] === "function")  this[name+"updated"](value);
                }
            });
        });
        each(["onbind","ondataupdate","onunbind"],function(name)
        {
            Object.defineProperty(functionFactory.root.prototype, name,
            {
                get:    function(){return this["__"+name];},
                set:    function(value){Object.defineProperty(this, "__"+name, {value: value, configurable: true});}
            });
        });
        function defineDataProperties(target, binder, properties)
        {
            each(properties, function(property, propertyName)
            {
                if (target.hasOwnProperty(propertyName)) target[propertyName].__destroy();
                Object.defineProperty(target, propertyName, {value: createProperty(target, property.get, property.set, property.onchange, binder), configurable: true})
                each(["onbind","ondataupdate","onunbind"],function(name){if (property[name])  target[propertyName][name] = property[name];});
            });
        }
        return defineDataProperties;
    }
    root.define("atomic.defineDataProperties", function(isolatedFunctionFactory, each)
    {
        if (defineDataProperties === undefined) defineDataProperties    = buildFunction(isolatedFunctionFactory, each);
        return defineDataProperties;
    });
}();
!function()
{"use strict";root.define("atomic.html.compositionRoot", function htmlCompositionRoot(customControlTypes)
{
    var each                    = root.utilities.each
    var isolatedFunctionFactory = new root.atomic.html.isolatedFunctionFactory(document);
    var pubSub                  = new root.utilities.pubSub(isolatedFunctionFactory, root.utilities.removeItemFromArray);
    var dataBinder              = new root.atomic.dataBinder(each, root.utilities.removeItemFromArray);
    var defineDataProperties    = new root.atomic.defineDataProperties(isolatedFunctionFactory, each, pubSub);
    var eventsSet               = new root.atomic.html.eventsSet(pubSub);
    var controlTypes            = {};
    var viewAdapterFactory      =   new root.atomic.html.viewAdapterFactory
                                    (
                                        document,
                                        controlTypes,
                                        new root.atomic.initializeViewAdapter(each),
                                        pubSub,
                                        function(message){console.log(message);},
                                        each
                                    );

    var control                 = new root.atomic.html.control(document, root.utilities.removeItemFromArray, window.setTimeout, each, defineDataProperties, eventsSet, dataBinder);
    var readonly                = new root.atomic.html.readonly(control, defineDataProperties);
    var container               = new root.atomic.html.container(control, each);
    var panel                   = new root.atomic.html.panel(container, defineDataProperties, viewAdapterFactory, each);
    var repeater                = new root.atomic.html.repeater(container, defineDataProperties, viewAdapterFactory, root.utilities.removeFromArray);
    var input                   = new root.atomic.html.input(control, defineDataProperties);
    var checkbox                = new root.atomic.html.checkbox(control, defineDataProperties);
    var select                  = new root.atomic.html.select(input, defineDataProperties, dataBinder);
    var radiogroup              = new root.atomic.html.radiogroup(input, defineDataProperties, dataBinder);
    var multiselect             = new root.atomic.html.multiselect(select, defineDataProperties);

    Object.defineProperties(controlTypes,
    {
        control:        {value: control},
        readonly:       {value: readonly},
        panel:          {value: panel},
        repeater:       {value: repeater},
        input:          {value: input},
        checkbox:       {value: checkbox},
        select:         {value: select},
        radiogroup:     {value: radiogroup},
        multiselect:    {value: multiselect}
    });

    return { viewAdapterFactory: viewAdapterFactory, observer: new root.atomic.observerFactory(root.utilities.removeFromArray, isolatedFunctionFactory, each) };
});}();
!function(window, document)
{"use strict";root.define("atomic.adaptHtml", function adaptHtml(viewElement, controlsOrAdapter)
{
    if (arguments.length == 1)
    {
        controlsOrAdapter   = viewElement;
        viewElement         = document.body;
    }
    var callback;
    var deferOrExecute  =
    function()
    {
        var atomic  = root.atomic.html.compositionRoot();
        var adapter =
        atomic.viewAdapterFactory.create
        (
            typeof controlsOrAdapter !== "function" ? function(appViewAdapter){return {controls: controlsOrAdapter}; } : controlsOrAdapter, 
            typeof viewElement === "string" ? document.querySelector(viewElement) : viewElement||document.body
        );
        adapter.data    = new atomic.observer({});
        if (typeof callback === "function") callback(adapter);
    }
    if (document.readyState !== "complete") window.addEventListener("load", deferOrExecute);
    else                                    deferOrExecute();

    return function(callbackFunction){ callback = callbackFunction; };
});}(window, document);