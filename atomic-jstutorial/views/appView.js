!function()
{"use strict";root.define("tutorial.appView", function()
{return function tutorialAppView(appViewAdapter)
{
    var adapterDefinition   =
    {
        controls:
        {
            exampleLinks:
            {
                controls:
                {
                    exampleLink1:   {},
                    exampleLink2:   {},
                    exampleLink3:   {},
                    exampleLink4:   {},
                    exampleLink5:   {},
                    exampleLink6:   {},
                    exampleLink7:   {},
                    exampleLink8:   {}
                }
            },
            examples:
            {
                controls:
                {
                    example1: { hidden: true },
                    example2: { hidden: true },
                    example3: { hidden: true },
                    example4: { hidden: true },
                    example5: { hidden: true },
                    example6: { hidden: true },
                    example7: { hidden: true },
                    example8: { hidden: true }
                }
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
    return adapterDefinition;
}});}();