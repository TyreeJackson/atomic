!function()
{"use strict";root.define("atomic.html.checkbox", function htmlCheckbox(control)
{
    function checkbox(elements, selector, parent)
    {
        control.call(this, elements, selector, parent);
        this.__binder.defineDataProperties(this,
        {
            value:  {get: function(){return this.__element.checked;}, set: function(value){this.__element.checked = value===true;},  onchange: this.getEvents("change")}
        });
    }
    Object.defineProperty(checkbox, "prototype", {value: Object.create(control.prototype)});
    Object.defineProperties(checkbox.prototype,
    {
        constructor:    {value: checkbox},
        __createNode:   {value: function(){var element = document.createElement("input"); element.type="checkbox"; return element;}, configurable: true}
    });
    return checkbox;
});}();