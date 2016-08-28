!function()
{"use strict";root.define("atomic.forms.appView", function(each)
{return function tutorialAppView()
{
    var adapterDefinition   =
    {
        controls:   
        {
            model: {bind: { value: {to: function(){return JSON.stringify(this.data(), null, '    ');}, root: ""}}}
        },
        members:
        {
        }
    };
    return adapterDefinition;
}});}();