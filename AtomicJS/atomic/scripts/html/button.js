!function()
{"use strict";root.define("atomic.html.button", function htmlButton(control)
{
    function button(element, selector, parent)
    {
        control.call(this, element, selector, parent);
        this.__binder.defineDataProperties(this,
        {
            value:  {get: function(){return this.__element.innerHTML;},   set: function(value){this.__element.innerHTML = value||"";}}
        });
    }
    Object.defineProperty(button, "prototype", {value: Object.create(control.prototype)});
    Object.defineProperties(button.prototype,
    {
        constructor:    {value: button},
        __createNode:   {value: function(selector){var element = document.createElement("button"); element.innerHTML = selector; return element;}, configurable: true}
    });
    return button;
});}();