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
        data:               {get: function(){return this.__binder.data;},   set: function(value){this.__binder.data = value; each(this.__controlKeys, (function(controlKey){if (!this.controls[controlKey].isRoot) this.controls[controlKey].data = value;}).bind(this));}},
        removeControl:      {value: function(childControl)
        {
            this.__element.removeChild(childControl.__element);
            removeItemFromArray(this.__controlKeys, childControl.key);
            delete this.controls[childControl.key];
            return this;
        }},
        source:             {get: function(){return this.__sourceBinder.data;},   set: function(value){this.__sourceBinder.data = value; each(this.__controlKeys, (function(controlKey){if (!this.controls[controlKey].isSourceRoot) this.controls[controlKey].source = value;}).bind(this));}}
    });
    return container;
});}();