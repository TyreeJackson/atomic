!function(){"use strict";root.define("atomic.html.label", function htmlLabel(control, reflect)
{
    function label(elements, selector, parent, bindPath, childKey, protoChildKey)
    {
        control.call(this, elements, selector, parent, bindPath, childKey, protoChildKey);
        Object.defineProperty(this, "__elements", {value: Array.prototype.slice.call(parent.__element.querySelectorAll(selector)), configurable: true});
        this.__binder.defineDataProperties(this,
        {
            for:                {get: function(){return this.__element.getAttribute("for");},   set: function(value){for(var counter=0,element; (element=this.__elements[counter])!==undefined; counter++) element.setAttribute("for", value); this.__element.setAttribute("for", value); this.getEvents("viewupdated").viewupdated(["for"]);}}
        });
    }
    Object.defineProperty(label, "prototype", {value: Object.create(control.prototype)});
    Object.defineProperty(label, "__getViewProperty", {value: function(name) { return control.__getViewProperty(name); }});
    Object.defineProperties(label.prototype,
    {
        constructor:    {value: label},
        __createNode:   {value: function(){return document.createElement("label");}, configurable: true},
        __addSpacing:   {value: true}
    });
    return label;
});}();