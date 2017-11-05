!function()
{"use strict";root.define("atomic.html.panel", function htmlPanel(container, each)
{
    function panel(elements, selector, parent)
    {
        container.call(this, elements, selector, parent);
        this.__binder.defineDataProperties(this, {value: {set: function(value)
        {
            var subData = typeof this.bind === "string" ? this.bind : typeof this.bind === "function" ? this.bind(this.data) : "";
            if (typeof subData === "string")    subData = this.data.observe(subData);
            if (this.__updateDataOnChildControlsTimeoutId !== undefined)    clearTimeout(this.__updateDataOnChildControlsTimeoutId);
            this.__updateDataOnChildControlsTimeoutId   =
            setTimeout
            (
                (function()
                {
                    delete  this.__updateDataOnChildControlsTimeoutId;
                    each(this.__controlKeys, (function(controlKey)
                    {
                        var control = this.controls[controlKey];
                        if (!control.isDataRoot && (control.data == null || !control.data.equals(subData))) this.controls[controlKey].data = subData;
                    }).bind(this));
                }).bind(this),
                0
            );
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