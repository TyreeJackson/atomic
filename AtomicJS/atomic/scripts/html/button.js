!function()
{"use strict";root.define("atomic.html.button", function htmlButton(control)
{
    function button(element, selector, parent)
    {
        control.call(this, element, selector, parent);
    }
    Object.defineProperty(button, "prototype", {value: Object.create(control.prototype)});
    Object.defineProperties(button.prototype,
    {
        constructor:    {value: button},
        __createNode:   {value: function(selector){var element = document.createElement("button"); element.innerHTML = selector; return element;}, configurable: true}
    });
    return button;
});}();