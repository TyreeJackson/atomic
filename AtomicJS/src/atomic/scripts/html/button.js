!function(){"use strict";root.define("atomic.html.button", function htmlButton(control)
{
    function button(element, selector, parent, bindPath, childKey, protoChildKey)
    {
        control.call(this, element, selector, parent, bindPath, childKey, protoChildKey);
        this.__binder.defineDataProperties(this,
        {
            value:  {get: function(){return this.__getViewData("innerHTML");},   set: function(value){this.__setViewData("innerHTML", value||"");}}
        });
    }
    Object.defineProperty(button, "prototype", {value: Object.create(control.prototype)});
    Object.defineProperty(button, "__getViewProperty", {value: function(name) { return control.__getViewProperty(name); }});
    Object.defineProperties(button.prototype,
    {
        constructor:    {value: button},
        __createNode:   {value: function(selector){var element = document.createElement("button"); element.innerHTML = selector; return element;}, configurable: true}
    });
    return button;
});}();