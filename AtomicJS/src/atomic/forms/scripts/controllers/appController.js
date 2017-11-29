!function()
{"use strict";root.define("atomic.forms.appController", function formsAppController(appView, appProxy, path)
{
    function handleResult(result)
    {
        appView.data("", result);
    }
    this.launch =
    function()
    {
        path.rescue(function(path){appProxy.get(path.substr(1), handleResult);});
        path.root("#/");
        path.listen();
    }
});}();