!function()
{"use strict";root.define("atomic.forms.controls.textbox", function formsTextboxControl()
{
    var adapterDefinition   =
    {
        controls:
        {
            label:  { type: "readonly", selector: ".textbox-label" },
            input:  { type: "input", selector: ".textbox-input" }
        },
        extensions:
        [{
            initializers:
            {
                bind:
                {
                    
                }
            }
        }]
    };
    return adapterDefinition;
});}();