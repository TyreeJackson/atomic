!function()
{"use strict";root.define("atomic.html.link", function htmlLink(base, each)
{
    function link(elements, selector, parent)
    {
        base.call(this, elements, selector, parent);
        this.__binder.defineDataProperties(this,
        {
            href: {get: function(){return this.__element.href;}, set: function(value){var val = value&&value.isObserver?value():value; each(this.__elements, function(element){element.href = val;}); this.__element.href = val;}}
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