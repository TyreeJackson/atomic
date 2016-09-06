!function()
{"use strict";root.define("atomic.html.container", function htmlContainer(control, each, viewAdapterFactory)
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
            this.__controlKeys.push(childControl.key);
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
        attachControls:     {value: function(controlDeclarations)
        {
            if (controlDeclarations === undefined)  return;
            var selectorPath                = this.getSelectorPath();
            for(var controlKey in controlDeclarations)
            {
                this.__controlKeys.push(controlKey);
                var declaration             = controlDeclarations[controlKey];
                var selector                = (declaration.selector||("#"+controlKey));
                this.controls[controlKey]   = viewAdapterFactory.createControl(declaration, viewAdapterFactory.select(this.__element, selector, selectorPath), this, selector);
            }
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