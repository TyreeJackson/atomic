!function()
{"use strict";root.define("atomic.forms.controls.static",
{
    controls:
    {
        label:      { type: "readonly", selector: ".static-label" },
        readout:    { type: "readonly", selector: ".static-readout" }
    },
    properties:
    {
        label:  {get: function(){return this.controls.label.value();}, set: function(value){this.controls.label.value(value);}},
        value:  function(){return this.controls.readout.value}
    },
    extensions:
    [{
        initializers:
        {
            label:  function(adapter, value){debugger; adapter.label = value;}
        }
    }]
});}();