!function(){"use strict";root.define("atomic.html.link", function htmlLink(base, reflect)
{
    function link(elements, selector, parent, bindPath, childKey, protoChildKey)
    {
        base.call(this, elements, selector, parent, bindPath, childKey, protoChildKey);
        this.__binder.defineDataProperties(this,
        {
            href: {get: function(){return this.__element.href;}, set: function(value){var val = value&&value.isObserver?value():value; if(this.__elements !== undefined) for(var counter=0,element; (element=this.__elements[counter])!==undefined; counter++) element.href = val; this.__element.href = val; this.getEvents("viewupdated").viewupdated(["href"]);}}
        });
    }
    Object.defineProperty(link, "prototype", {value: Object.create(base.prototype)});
    Object.defineProperty(link, "__getViewProperty", {value: function(name) { return base.__getViewProperty(name); }});
    Object.defineProperties(link.prototype,
    {
        constructor:    {value: link},
        __createNode:   {value: function(){return document.createElement("a");}, configurable: true}
    });
    return link;
});}();