!function()
{"use strict";root.define("tutorial.appView", function()
{return function tutorialAppView(appViewAdapter)
{
    function setPage(pageNumber)
    {
    }
    var adapterDefinition   =
    {
        controls:
        {
            examples:
            {
                controls:
                {
                    example1: { hidden: true },
                    example2: { hidden: true },
                    example3: { hidden: true },
                    example4: { hidden: true },
                    example5: { hidden: true }
                }
            }
        },
        members:
        {
            showExample:
            function(exampleNumber)
            {
                for(var example in this.controls.examples.controls) this.controls.examples.controls[example].hide();
                this.controls.examples.controls["example"+exampleNumber].show();
            }
        }
    };
    return adapterDefinition;
}});}();