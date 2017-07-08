!function()
{"use strict";root.define("atomic.playground.appController", function tutorialAppController(appView, appProxy, observer, jszip, saveAs, aja)
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
        appView.on.downloadPlayground.listen(function(name, playground)
        {
            var atomicScript;
            var bootstrapCSS;
            aja().url("3rdparty/atomic.js").type("text").on("success", function(source){atomicScript = source; zipIt();}).go();
            aja().url("css/bootstrap.css").type("text").on("success", function(source){bootstrapCSS = source; zipIt();}).go();
            function zipIt()
            {
                if (atomicScript === undefined || bootstrapCSS === undefined) return;
                var zip = new jszip();
                zip.file("index.css", playground.css);
                var thirdparty  = zip.folder("3rdparty");
                thirdparty.file("atomic.js", atomicScript);
                var css         = zip.folder("css");
                css.file("bootstrap.css", bootstrapCSS);
                zip.file("index.html", buildHTML(playground.html));
                zip.file("index.js", playground.javascript);
                zip.generateAsync({type:"blob"})
                .then(function(content)
                {
                    saveAs(content, name+".zip");
                });
            }
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