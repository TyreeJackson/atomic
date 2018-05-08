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
    function buildOnchange(control, property)
    {
        var propertyEvent   = control.__events.getOrAdd("controlData:" + property);
        var defining        = true;
        control.controlData.listen(function(){var value = this(property); if (!defining) propertyEvent(value);});
        defining            = false;
        return [propertyEvent];
    }
    function connectOnchange(control, propertyKey, get, listenerCallback)
    {
        if (typeof listenerCallback === "string")   return control.getEvents(listenerCallback);
        
        var propertyEvent   = control.__events.getOrAdd("controlData:" + propertyKey);
        var defining        = true;
        control.controlData.listen(function(){var value = get.call(control); if (!defining) propertyEvent(value);});
        defining            = false;
        return [propertyEvent];
    }
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
            var bindPath    = this.__customBind ? "" : this.bindPath + (this.bindPath.length > 0 && this.__extendedBindPath.length > 0 ? "." : "") + this.__extendedBindPath;
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
                var control     = this.controls[controlKey] = this.createControl(declaration, elements&&elements[0], selector, controlKey, this.__customBind ? "" : (this.bindPath + (this.bindPath.length > 0 && this.__extendedBindPath.length > 0 ? "." : "") + this.__extendedBindPath), elements && elements.length > 1);
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
                else    if (typeof property === "string")   this.__binder.defineDataProperties(this, propertyKey, { get: buildGet(property),   set: buildSet(property), onchange: buildOnchange(this, property) });
                else    if (property.bound === true)
                {
                    var get     = typeof property.get === "string" ? buildGet(property) : property.get;
                    this.__binder.defineDataProperties(this, propertyKey, {get: get, set: typeof property.set === "string" ? buildSet(property) : property.set, onchange: connectOnchange(this, propertyKey, get, property.onchange||"change"), onupdate: property.onupdate, delay: property.delay});
                }
                else                                        Object.defineProperty(this, propertyKey, {get: property.get, set: property.set});
            }
        }},
        children:               {get: function(){return this.controls || null;}},
        createControl:          {value: function(controlDeclaration, controlElement, selector, controlKey, bindPath, multipleElements, preConstruct)
        {
            var control;
            if (controlDeclaration.factory !== undefined)
            {
                control = controlDeclaration.factory(this, controlElement, selector, controlKey, this.__customBind ? "" : bindPath);
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
                bindPath:               this.__customBind ? "" : bindPath
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