!function()
{"use strict";root.define("atomic.html.panel", function htmlPanel(container, each)
{
    function panel(elements, selector, parent)
    {
        container.call(this, elements, selector, parent);
        this.__binder.defineDataProperties(this, {value: {set: function(value)
        {
            var bind    = typeof this.bind === "string" ? this.bind : typeof this.bind === "function" ? this.bind(this.data) : "";
            each(this.__controlKeys, (function(controlKey)
            {
                if (!this.controls[controlKey].isDataRoot) this.controls[controlKey].data = this.data.observe(bind);
            }).bind(this));
        }}});
        this.bind   = "";
    }
    Object.defineProperty(panel, "prototype", {value: Object.create(container.prototype)});
    Object.defineProperties(panel.prototype,
    {
        constructor:        {value: panel},
        init:               {value: function(definition)
        {
            container.prototype.init.call(this, definition);
            this.attachControls(definition.controls, this.__element);
        }},
        children:           {value: function(){return this.controls || null;}}
    });
    return panel;
});}();