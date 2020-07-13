!function(){"use strict";root.define("atomic.html.panel", function htmlPanel(container, reflect)
{
    function panel(elements, selector, parent, bindPath, childKey, protoChildKey)
    {
        container.call(this, elements, selector, parent, bindPath, childKey, protoChildKey);
    }
    Object.defineProperty(panel, "prototype", {value: Object.create(container.prototype)});
    Object.defineProperty(panel, "__getViewProperty", {value: function(name) { return container.__getViewProperty(name); }});
    Object.defineProperties(panel.prototype,
    {
        constructor:        {value: panel},
        frame:              {value: function(controlDefinition, initializerDefinition)
        {
            container.prototype.frame.call(this, controlDefinition, initializerDefinition);
        }}
    });
    return panel;
});}();