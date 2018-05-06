!function(){"use strict";root.define("atomic.html.panel", function htmlPanel(container, each)
{
    function panel(elements, selector, parent, bindPath)
    {
        container.call(this, elements, selector, parent, bindPath);
    }
    Object.defineProperty(panel, "prototype", {value: Object.create(container.prototype)});
    Object.defineProperty(panel, "__getViewProperty", {value: function(name) { return container.__getViewProperty(name); }});
    Object.defineProperties(panel.prototype,
    {
        constructor:        {value: panel},
        frame:              {value: function(definition)
        {
            container.prototype.frame.call(this, definition);
        }}
    });
    return panel;
});}();