{"use strict";root.define("atomic.html.label", function htmlLabel(control, each)
{
    function label(elements, selector, parent)
    {
        control.call(this, elements, selector, parent);
        Object.defineProperty(this, "__elements", {value: Array.prototype.slice.call(parent.__element.querySelectorAll(selector)), configurable: true});
        this.__binder.defineDataProperties(this,
        {
            for:                {get: function(){return this.__element.getAttribute("for");},   set: function(value){each(this.__elements, function(element){element.setAttribute("for", value);}); this.__element.setAttribute("for", value);}}
        });
    }
    Object.defineProperty(label, "prototype", {value: Object.create(control.prototype)});
    Object.defineProperties(label.prototype,
    {
        constructor:    {value: label},
        __createNode:   {value: function(){return document.createElement("label");}, configurable: true},
        __addSpacing:   {value: true}
    });
    return label;
});}();