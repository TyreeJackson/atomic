!function()
{"use strict";root.define("atomic.forms.appView", function(observer)
{return function tutorialAppView(view)
{
    var adapterDefinition   =
    {
        controls:   
        {
            root:
            {
                type:   "layout"
            },
            model:
            {
                type:   "json",
                width:  12,
                label:  "Root",
                bind:   ""
            }
        },
        members:
        {
            construct:  function()
            {
                this.data   = new observer({});
                this.controls.root.layoutData   = this.data.observe();
                this.controls.model.layoutData  = new observer(adapterDefinition.controls.model); 
            }
        }
    };
    return adapterDefinition;
}});}();