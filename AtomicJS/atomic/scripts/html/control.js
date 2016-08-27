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
        if (element.getAttribute("data-missing")==="true")
        {
            var container       = element;
            element             = this.__createNode(selector);
            container.appendChild(element);
            element.id          = container.id;
            element.className   = container.className;
            container.id        = 
            container.className = "";
            element.title       = selector;
        }
        Object.defineProperties(this, 
        {
            __element:              {value: element, configurable: true},
            __elementPlaceholder:   {value: []},
            __events:               {value: new eventsSet(this)},
            on:                     {value: {}},
            __attributes:           {value: {}, writable: true},
            __selector:             {value: selector},
            parent:                 {value: parent},
            __binder:               {value: new dataBinder()},
            __forceRoot:            {value: false, configurable: true},
            classes:                {value: {}}
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
        data:               {get:   function(){return this.__binder.data;},   set: function(value){this.__binder.data = value;}},
        bindClass:          {value: function(className)
        {
            defineDataProperties(this.classes, this.__binder, className, 
            {
                owner:      this,
                get:        function(){return this.hasClass(className);}, 
                set:        function(value){this.toggleClass(className, value===true, true);}, 
                onchange:   [this.__events.getOrAdd("class-"+className)]
            })
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
        height:             {get:   function(){return this.__element.offsetHeight;}},
        hide:               {value: function(){ this.__element.style.display="none"; this.triggerEvent("hide"); return this;}},
        //TODO: ensure that this control is moved to the siblingControl's parent controls set
        insertBefore:       {value: function(siblingControl){ siblingControl.__element.parentNode.insertBefore(this.__element, siblingControl.__element); return this;}},
        //TODO: ensure that this control is moved to the siblingControl's parent controls set
        insertAfter:        {value: function(siblingControl){ siblingControl.__element.parentNode.insertBefore(this.__element, siblingControl.__element.nextSibling); return this;}},
        isDataRoot:         {get: function(){return this.__binder.isRoot;}, set: function(value){this.__binder.isRoot = value===true;}},
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