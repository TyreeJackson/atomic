!function()
{"use strict";root.define("atomic.html.control", function hmtlControl(document, removeItemFromArray, setTimeout, each, eventsSet, dataBinder)
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
            __selector:             {value: selector, configurable: true},
            parent:                 {value: parent, configurable: true},
            __binder:               {value: new dataBinder(this), configurable: true},
            __forceRoot:            {value: false, configurable: true},
            classes:                {value: {}, configurable: true}
        });
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
                }
            },
            disabled:           {get: function(){return this.__element.disabled;},                  set: function(value){this.__element.disabled=!(!value);}},
            display:            {get: function(){return this.__element.style.display=="";},         set: function(value){this[value?"show":"hide"]();}},
            draggable:          {get: function(){return this.__element.getAttribute("draggable");}, set: function(value){this.__element.setAttribute("draggable", value);}},
            enabled:            {get: function(){return !this.__element.disabled;},                 set: function(value){this.__element.disabled=!value;}},
            for:                {get: function(){return this.__element.getAttribute("for");},       set: function(value){this.__element.setAttribute("for", value);}},
            id:                 {get: function(){return this.__element.id;},                        set: function(value){this.__element.id=value;}},
            tooltip:            {get: function(){return this.__element.title;},                     set: function(value){this.__element.title = value||"";}},
            value:              {get: function(){return this.__element.value;},                     set: function(value){this.__element.value = value;},  onchange: this.getEvents("change")}
        });
    }
    function notifyClassEvent(className, exists)
    {
        var event = this.__events.get("class-"+className);
        if (event !== undefined)    event(exists);
    }
    Object.defineProperties(control.prototype,
    {
        getSelectorPath:    {value: function()
        {
            return this.parent === undefined ? "" : this.parent.getSelectorPath() + "-" + (this.__selector||"root");
        }},
        constructor:        {value: control},
        __createNode:       {value: function(selector){return document.createElement("div");}, configurable: true},
        init:               {value: function(definition)
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
        addClass:           {value: function(className, silent)
        {
            var classNames              = this.__element.className.split(" ");
            if (classNames.indexOf(className) === -1) classNames.push(className);
            this.__element.className    = classNames.join(" ").trim();
            if (!silent)    notifyClassEvent.call(this, className, true);
            return this;
        }},
        bind:               {get:   function(){return this.value.bind;},      set: function(value){this.value.bind = value;}},
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
        data:               {get:   function(){return this.__binder.data;},   set: function(value){this.__binder.data = value;}},
        destroy:
        {value: function()
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
        getEvents:          {value: function(eventNames)
        {
            if (!Array.isArray(eventNames)) eventNames  = [eventNames];
            var events  = {};
            each(eventNames, (function(eventName){events[eventName] = this.__events.getOrAdd(eventName);}).bind(this));
            return events;
        }},
        hasClass:           {value: function(className){return this.__element.className.split(" ").indexOf(className) > -1;}},
        hasFocus:           {value: function(nested){return document.activeElement == this.__element || (nested && this.__element.contains(document.activeElement));}},
        height:             {get:   function(){return this.__element.offsetHeight;}, set: function(value){this.__element.style.height = parseInt(value)+"px";}},
        hide:               {value: function(){ this.__element.style.display="none"; this.triggerEvent("hide"); return this;}},
        //TODO: ensure that this control is moved to the siblingControl's parent controls set
        insertBefore:       {value: function(siblingControl){ siblingControl.__element.parentNode.insertBefore(this.__element, siblingControl.__element); return this;}},
        //TODO: ensure that this control is moved to the siblingControl's parent controls set
        insertAfter:        {value: function(siblingControl){ siblingControl.__element.parentNode.insertBefore(this.__element, siblingControl.__element.nextSibling); return this;}},
        isDataRoot:         {get: function(){return this.__isDataRoot;}, set: function(value){Object.defineProperty(this, "__isDataRoot", {value: value===true, configurable: true});}},
        isRoot:
        {
            get:    function(){return this.__forceRoot||this.parent===undefined;}, 
            set:    function(value){Object.defineProperty(this, "__forceRoot", {value: value===true, configurable: true});}
        },
        removeClass:        {value: function(className, silent)
        {
            if (className === undefined)
            {
                this.__element.className    = "";
                return;
            }
            var classNames              = this.__element.className.split(" ");
            if (classNames.indexOf(className) > -1) removeItemFromArray(classNames, className);
            this.__element.className    = classNames.join(" ");
            if (!silent)    notifyClassEvent.call(this, className, false);
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
        toggleClass:        {value: function(className, condition, silent){if (condition === undefined) condition = !this.hasClass(className); return this[condition?"addClass":"removeClass"](className, silent);}},
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
        },
        width:              {get:   function(){return this.__element.offsetWidth;}, set: function(value){this.__element.style.width = parseInt(value)+"px";}}
    });
    each(["blur","click","focus"],function(name){Object.defineProperty(control.prototype,name,{value:function(){this.__element[name](); return this;}});});
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