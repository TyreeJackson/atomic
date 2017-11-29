!function()
{"use strict";root.define("atomic.html.input", function htmlInput(control)
{
    function input(elements, selector, parent)
    {
        control.call(this, elements, selector, parent);
        this.__binder.defineDataProperties(this,
        {
            value:  {get: function(){return this.__element.value;}, set: function(value){this.__element.value = value||"";},  onchange: this.getEvents("change")}
        });
    }
    Object.defineProperty(input, "prototype", {value: Object.create(control.prototype)});
    Object.defineProperties(input.prototype,
    {
        constructor:        {value: input},
        __createNode:       {value: function(){var element = document.createElement("input"); element.type="textbox"; return element;}, configurable: true},
        select:             {value: function(){this.__element.select(); return this;}},
        onchangingdelay:    {get:   function(){return this.__onchangingdelay;}, set: function(value){Object.defineProperty(this, "__onchangingdelay", {value: value, configurable: true});}}
    });
    return input;
});}();