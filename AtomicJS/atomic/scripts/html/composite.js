!function()
{"use strict";root.define("atomic.html.composite", function htmlComposite(base, each)
{
    function composite(elements, selector, parent)
    {
        base.call(this, elements, selector, parent);
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
                if (typeof property === "function")     Object.defineProperty(this, propertyKey, {value: property.call(this)});
                else    if (property.bound === true)    {this.__binder.defineDataProperties(this, propertyKey, {get: property.get, set: property.set, onchange: this.getEvents(property.onchange||"change"), onupdate: property.onupdate});}
                else                                    Object.defineProperty(this, propertyKey, {get: property.get, set: property.set});
            }
        }},
        data:
        {
            get:    function(){return this.__binder.data;},
            set:    function(value)
            {
                this.__binder.data = value;
                each(this.__controlKeys, (function(controlKey)
                {
                    if (!this.controls[controlKey].isDataRoot) this.controls[controlKey].data = value.observe(this.bind);
                }).bind(this));
            }
        },
        init:               {value: function(definition)
        {
            base.prototype.init.call(this, definition);
            if (definition.properties !== undefined)    Object.defineProperty(this, "bind", { get: function(){return this.__bind;}, set: function(value){Object.defineProperty(this,"__bind", {value: value, configurable: true});}, configurable: true });
            this.attachControls(definition.controls, this.__element);
            this.attachProperties(definition.properties);
        }},
        children:           {value: function(){return this.controls || null;}}
    });
    return composite;
});}();