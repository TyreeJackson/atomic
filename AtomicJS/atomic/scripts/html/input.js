!function()
{"use strict";root.define("atomic.html.input", function htmlInput(control, defineDataProperties)
{
    function input(elements, selector, parent)
    {
        control.call(this, elements, selector, parent);
        defineDataProperties(this, this.__binder,
        {
            value:  {get: function(){return this.__element.value;}, set: function(value){this.__element.value = value||"";},  onchange: this.getEvents("change")}
        });
    }
    Object.defineProperty(input, "prototype", {value: Object.create(control.prototype)});
    Object.defineProperties(input.prototype,
    {
        constructor:    {value: input},
        select:         {value: function(){this.__element.select(); return this;}}
    });
    return input;
});}();