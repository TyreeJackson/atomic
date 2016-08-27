!function()
{"use strict";root.define("tutorial.appController", function tutorialAppController(appView, appProxy, observer, path)
{
    this.launch =
    function()
    {
        appView.data    = new observer({currentPageNumber: 0});
        path.map("#/example/(:id)").to(function(){appView.showExample(this.params["id"]);});
        path.root("#/example/1");
        path.listen();
    }
});}();