!function()
{"use strict";root.define("atomic.forms.controls.textbox", 
{
    controls:
    {
        label:  { type: "readonly", selector: ".textbox-label" },
        input:  { type: "input", selector: ".textbox-input" }
    },
    properties:
    {
        label:  {get: function(){return this.controls.label.value();}, set: function(value){this.controls.label.value(value);}},
        value:  function(){return this.controls.input.value}
    },
    extensions:
    [{
        initializers:
        {
            label:  function(adapter, value){adapter.label = value;}
        }
    }]
});}();