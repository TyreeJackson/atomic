!function(){"use strict";root.define("atomic.html.composite", function htmlComposite(base, each, observer)
{
    function composite(elements, selector, parent, bindPath, childKey, protoChildKey)
    {
        base.call(this, elements, selector, parent, bindPath, childKey, protoChildKey);
    }
    Object.defineProperty(composite, "prototype", {value: Object.create(base.prototype)});
    Object.defineProperty(composite, "__getViewProperty", {value: function(name) { return base.__getViewProperty(name); }});
    Object.defineProperties(composite.prototype,
    {
        constructor:        {value: composite},
        frame:              {value: function(definition)
        {
            base.prototype.frame.call(this, definition);
        }}
    });
    return composite;
});}();