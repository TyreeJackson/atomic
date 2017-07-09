!function()
{"use strict";root.define("atomic.interactiveTutorial.appController", function tutorialAppController(appView, appProxy, observer, jszip, saveAs, aja)
{
    function buildHTML(source)
    {
        return '<!DOCTYPE html><html><head><link rel="stylesheet" href="css/bootstrap.css" /><link rel="stylesheet" href="index.css" /><scr' + 'ipt type="application/javascript" src="3rdparty/atomic.js"></sc' + 'ript></head><body>' + (source||"").replace(/\&lt\;/g, "<").replace(/\&gt\;/g, ">") + '<scr' + 'ipt type="application/javascript" src="index.js"></scr' + 'ipt></body></html>';
    }
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
        appView.on.importPlayground.listen(function(playground)
        {
            appProxy.importExample(playground, function(response)
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