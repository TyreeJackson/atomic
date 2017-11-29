!function()
{"use strict";root.define("atomic.forms.controls.json",
{
    controls:
    {
        label:      { type: "readonly", selector: ".json-label" },
        readout:    { type: "readonly", selector: ".json-readout" }
    },
    properties:
    {
        label:  {get: function(){return this.controls.label.value();}, set: function(value){this.controls.label.value(value);}}
    },
    extensions:
    [{
        extend:         function(control)
        {
            this.__binder.defineDataProperties
            ({
                value:  {get: function(){debugger;var value = this.controls.readout.value(); return value&&JSON.parse(value);}, set: function(value){debugger;this.controls.readout.value(JSON.stringify(value&&value.isObserver?value():value, null, '    '));}}
            });
        },
        initializers:
        {
            label:  function(adapter, value){adapter.label = value;}
        }
    }]
});}();