!function(){"use strict";root.define("atomic.html.screen", function htmlScreen(panel, observer)
{
    function screen(elements, selector, parent, bindPath)
    {
        panel.call(this, elements, selector, parent, bindPath);
        this.__setData(new observer({}));
    }
    Object.defineProperty(screen, "prototype", {value: Object.create(panel.prototype)});
    Object.defineProperty(screen, "__getViewProperty", {value: function(name) { return panel.__getViewProperty(name); }});
    Object.defineProperties(screen.prototype,
    {
        constructor:        {value: screen}
    });
    return screen;
});}();