!function()
{"use strict";root.define("atomic.forms.appController", function formsAppController(appView, appProxy, observer, path)
{
    function handleResult(result)
    {
        alert(JSON.stringify(result));
    }
    this.launch =
    function()
    {
        appView.data    = new observer();
        path.rescue(function(path){appProxy.get(path.substr(1), handleResult);});
        path.root("#/");
        path.listen();
    }
});}();