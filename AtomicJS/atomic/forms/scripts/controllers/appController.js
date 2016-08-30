!function()
{"use strict";root.define("atomic.forms.appController", function formsAppController(appView, appProxy, observer, path)
{
    function handleResult(result)
    {
        appView.controls.root.layoutData("", result);debugger;
        appView.data("", result.data);
    }
    this.launch =
    function()
    {
        appView.controls.root.layoutData    = new observer({});
        appView.data                        = new observer({});
        path.rescue(function(path){appProxy.get(path.substr(1), handleResult);});
        path.root("#/");
        path.listen();
    }
});}();