!function()
{"use strict";root.define("atomic.tutorial.debugInfoViewer.appView", function(debugInfoObserver)
{return function tutorialAppView(viewAdapter)
{
    var adapterDefinition   =
    {
        controls:
        {
            debugInfo:      { bind: { value: { to: function(){return JSON.stringify(this.data.unwrap()||{}, null, '    ');}, root: "" } } }
        },
        members:
        {
            construct:
            function()
            {
                this.__setData(debugInfoObserver);
            }
        }
    };
    return adapterDefinition;
}});}();