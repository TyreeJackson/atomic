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
        defineDataProperties(this, this.__binder, {value: {onupdate: function(value)
        {
            each(this.__controlKeys, (function(controlKey){if (!this.controls[controlKey].isDataRoot) this.controls[controlKey].data = this.data.observe(this.bind);}).bind(this));
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