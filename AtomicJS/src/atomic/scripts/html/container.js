!function(){"use strict";root.define("atomic.html.container", function htmlContainer(control, observer, each, viewAdapterFactory, removeItemFromArray, debugInfoObserver)
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
    function container(elements, selector, parent, bindPath, childKey, protoChildKey)
    {
        control.call(this, elements, selector, parent, bindPath, childKey, protoChildKey);
        Object.defineProperties(this,
        {
            __controlKeys:      {value: [], configurable: true},
            controlData:        {value: new observer({}), configurable: true},
            controls:           {value: {}, configurable: true},
            __extendedBindPath: {value: "", configurable: true},
            __controlsToUpdate: {value: {}, configurable: true},
            __links:            {value: {}, configurable: true}
        });
    }
    function forwardProperty(propertyKey, property)
    {
        var propertyValue   = property.call(this);
        if (this.__customBind && propertyValue.isDataProperty)  this.__binder.defineDataProperties(this, propertyKey, {get: function(){return propertyValue();}, set: function(value){propertyValue(value);}, onchange: propertyValue.onchange});
        else                                                    Object.defineProperty(this, propertyKey, {value: propertyValue});
    }
    function attachProperty(propertyKey, property)
    {
        var state   = {updating: false};
        if (typeof property === "function")         forwardProperty.call(this, propertyKey, property);
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
    function buildOnchange(control, property, state)
    {
        var propertyEvent   = control.__events.getOrAdd("controlData:" + property);
        state.updating      = true;
        control.controlData.listen(function(){var value = this(property); if (!state.updating) propertyEvent(null, value);}, property);
        state.updating      = false;
        return [propertyEvent];
    }
    function connectOnchange(control, propertyKey, get, listenerCallback, state)
    {
        if (typeof listenerCallback === "string")   return control.getEvents(listenerCallback);
        
        var propertyEvent   = control.__events.getOrAdd("controlData:" + propertyKey);
        state.updating      = true;
        control.controlData.listen(function(){var value = get.call(control); if (!state.updating) propertyEvent(null, value);});
        state.updating      = false;
        return [propertyEvent];
    }
    Object.defineProperty(container, "prototype", {value: Object.create(control.prototype)});
    Object.defineProperties(container,
    {
        elementControlTypes:    {get:   function() { return elementControlTypes; }},
        __getViewProperty:      {value: function(name) { return control.__getViewProperty(name); }},
    });
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
        __linkData:             {value: function(data)
        {
            var parentLinkPaths = Object.keys(this.__links);
            if (parentLinkPaths.length === 0)   return;
            for(var counter=0,parentLinkPath;(parentLinkPath = parentLinkPaths[counter++]) !== undefined;)  data.link(parentLinkPath, this.controlData, this.__links[parentLinkPath]);
        }},
        __setData:              {value: function(data)
        {
            if (this.__binder.data !== undefined && this.__binder.data !== null)    this.__unlinkData(this.__binder.data);
            this.__binder.data = data; 
            var childControls   = this.children;
            var childData       = this.__getData();
            if (childControls != null)  each(childControls, function(child){child.__setData(childData);});
            if (data !== undefined && data !== null)                                this.__linkData(data.peek(this.__binder.bindPath));
        }},
        __setExtendedBindPath:  {value: function(path)
        {
            Object.defineProperty(this, "__extendedBindPath", {value: path||"", configurable: true});
            if (debugInfoObserver)  this.__updateDebugInfo();
        }},
        __unlinkData:           {value: function(data)
        {
            var parentLinkPaths = Object.keys(this.__links);
            for(var counter=0,parentLinkPath;(parentLinkPath = parentLinkPaths[counter++]) !== undefined;)  data.unlink(parentLinkPath, this.controlData, this.__links[parentLinkPath]);
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
            var bindPath    = this.__customBind ? "" : this.bindPath + (this.bindPath.length > 0 && this.__extendedBindPath.length > 0 ? "." : "") + this.__extendedBindPath;
            this.appendControl(controlKey, control = this.createControl(controlDeclaration, undefined, "#" + controlKey, controlKey, controlKey, bindPath));
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
                var control     = this.controls[controlKey] = this.createControl(declaration, elements&&elements[0], selector, controlKey, controlKey, this.__customBind ? "" : (this.bindPath + (this.bindPath.length > 0 && this.__extendedBindPath.length > 0 ? "." : "") + this.__extendedBindPath), elements && elements.length > 1);
            }
            var data            = this.__getData();
            if (data !== undefined) for(var controlKey in controlDeclarations)  this.controls[controlKey].__setData(data);
        }},
        attachProperties:       {value: function(propertyDeclarations)
        {
            if (propertyDeclarations === undefined) return;
            for(var propertyKey in propertyDeclarations)
            {
                attachProperty.call(this, propertyKey, propertyDeclarations[propertyKey]);
            }
        }},
        attachDataLinks:        {value: function(dataLinks)
        {
            Object.defineProperty(this, "__dataLinks", {value: (dataLinks||[]).slice()})
        }},
        children:               {get: function(){return this.controls || null;}},
        createControl:          {value: function(controlDeclaration, controlElement, selector, controlKey, protoControlKey, bindPath, multipleElements, preConstruct)
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
        frame:                  {value: function(controlDefinition)
        {
            Object.defineProperty(this, "__customBind", {value: controlDefinition.customBind === true, configurable: true});
            control.prototype.frame.call(this, controlDefinition);

            this.attachProperties(controlDefinition.properties);
            this.attachDataLinks(controlDefinition.dataLinks);
        }},
        initialize:         {value: function(initializerDefinition, controlDefinition)
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