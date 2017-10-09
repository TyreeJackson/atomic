!function()
{"use strict";root.define("atomic.html.composite", function htmlComposite(base, each)
{
    function composite(elements, selector, parent)
    {
        base.call(this, elements, selector, parent);
    }
    function forwardProperty(propertyKey, property)
    {
        var propertyValue   = property.call(this);
        if (propertyValue.isDataProperty)   this.__binder.defineDataProperties(this, propertyKey, {get: function(){return propertyValue();}, set: function(value){propertyValue(value);}, onchange: propertyValue.onchange});
        else                                Object.defineProperty(this, propertyKey, {value: propertyValue});
    }
    Object.defineProperty(composite, "prototype", {value: Object.create(base.prototype)});
    Object.defineProperties(composite.prototype,
    {
        constructor:        {value: composite},
        attachProperties:   {value: function(propertyDeclarations)
        {
            if (propertyDeclarations === undefined) return;
            for(var propertyKey in propertyDeclarations)
            {
                var property    = propertyDeclarations[propertyKey];
                if (typeof property === "function")     forwardProperty.call(this, propertyKey, property);
                else    if (property.bound === true)    {this.__binder.defineDataProperties(this, propertyKey, {get: property.get, set: property.set, onchange: this.getEvents(property.onchange||"change"), onupdate: property.onupdate});}
                else                                    Object.defineProperty(this, propertyKey, {get: property.get, set: property.set});
            }
        }},
        init:               {value: function(definition)
        {
            base.prototype.init.call(this, definition);
            if (definition.properties !== undefined)    this.__binder.defineDataProperties(this, {value: {get: function(){return this.__value;}, set: function(value){this.__value = value;},  onchange: this.getEvents("change")}});
            this.attachControls(definition.controls, this.__element);
            this.attachProperties(definition.properties);
        }},
        children:           {value: function(){return this.controls || null;}}
    });
    return composite;
});}();