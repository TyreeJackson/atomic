!function()
{"use strict";root.define("atomic.tutorial.appController", function tutorialAppController(appView, appProxy, path)
{
    this.setDebugInfo   = function(debugInfo)
    {
        appView.data("$shadow.debugInfo", debugInfo);
    }
    this.launch =
    function()
    {
        appView.data("", {currentPageNumber: 0});
        path.map("#/example/(:id)").to(function(){appView.showExample(this.params["id"]);});
        path.root("#/example/1");
        path.listen();
    }
});}();