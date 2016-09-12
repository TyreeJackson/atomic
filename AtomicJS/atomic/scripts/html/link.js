!function()
{"use strict";root.define("atomic.html.link", function htmlLink(base)
{
    function link(elements, selector, parent)
    {
        base.call(this, elements, selector, parent);
        this.__binder.defineDataProperties(this,
        {
            href: {get: function(){return this.__element.href;}, set: function(value){this.__element.href = value&&value.isObserver?value():value;}}
        });
    }
    Object.defineProperty(link, "prototype", {value: Object.create(base.prototype)});
    Object.defineProperties(link.prototype,
    {
        constructor:    {value: link},
        __createNode:   {value: function(){return document.createElement("a");}, configurable: true}
    });
    return link;
});}();