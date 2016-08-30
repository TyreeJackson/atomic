!function()
{"use strict";root.define("atomic.forms.controls.template", function formsLayoutControl(control, dataBinder, defineDataProperties)
{
    function template(element, selector, parent)
    {
        control.call(this, element, selector, parent);
        Object.defineProperties(this, 
        {
            __layoutBinder: {value: new dataBinder()}
        });
        defineDataProperties(this, this.__layoutBinder,
        {
            layout: {get: function(){return this.__layout;}, set: function(value){Object.defineProperty(this, "__layout", {value: value, configurable: true});}}
        });
    }
    Object.defineProperty(template, "prototype", {value: Object.create(control.prototype)});
    Object.defineProperties(template.prototype,
    {
        constructor:    {value: template},
        layoutData:     {get:   function(){return this.__layoutBinder.data;},   set: function(value){this.__layoutBinder.data = value;}}
    });
    return template;
});}();