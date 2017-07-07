!function()
{"use strict";root.define("atomic.playground.appController", function tutorialAppController(appView, appProxy, observer)
{
    this.launch =
    function()
    {
        appView.on.savePlayground.listen(function(data)
        {
            appProxy.saveExamples(data, function(response)
            {
                appView.data("", response.data.examples);
            });
        });
        appView.on.resetPlayground.listen(function()
        {
            appProxy.resetExamples(function(response)
            {
                appView.data("", response.data.examples);
            });
        });
        appProxy.launch(function(response)
        {
            appView.data    = new observer(response.data.examples);
        });
    }
});}();