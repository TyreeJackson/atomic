!function()
{"use strict";root.define("atomic.tutorial.appView", function(each)
{return function tutorialAppView()
{
    var adapterDefinition   =
    {
        controls:
        {
            exampleLinks:
            {
                controls:   {}
            },
            examples:
            {
                controls:   {}
            }
        },
        members:
        {
            showExample:
            function(exampleNumber)
            {
                for(var example in this.controls.exampleLinks.controls) this.controls.exampleLinks.controls[example].removeClass("active");
                this.controls.exampleLinks.controls["exampleLink"+exampleNumber].toggleClass("active", true);
                for(var example in this.controls.examples.controls) this.controls.examples.controls[example].hide();
                this.controls.examples.controls["example"+exampleNumber].show();
            }
        }
    };
    each([1,2,3,4,5,6,7,8,9,10], function(val)
    {
        adapterDefinition.controls.exampleLinks.controls["exampleLink"+val] = {};
        adapterDefinition.controls.examples.controls["example"+val]         = {hidden: true};
    });
    return adapterDefinition;
}});}();