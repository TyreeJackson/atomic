!function()
{"use strict";root.define("atomic.playground.appView", function(editorControl, markdownControl, json)
{return function playgroundAppView(viewAdapter)
{
    function getActiveExamplePath(item)
    {
        var active  = item("...active");
        if (active !== undefined && item.peek("...examples") !== undefined)
        for(var counter=0;counter<item.peek("...examples").count;counter++) if(item.peek("...examples."+counter+".name")==active) {return "...examples."+counter+".example"; }
        return "...examples.0.example";
    }
    var updaterId;
    function updateIframe(execute, peek)
    {
        var examplePath = getActiveExamplePath(this.data);
        var html        = '<!DOCTYPE html><html><head><link rel="stylesheet" href="css/bootstrap.css" /><scr' + 'ipt type="application/javascript" src="3rdparty/atomic.js"></sc' + 'ript></head><body>' + (this.data.read(examplePath+".html", peek)||"").replace(/\&lt\;/g, "<").replace(/\&gt\;/g, ">") + '<style>' + this.data.read(examplePath+".css", peek) + '</style><scr' + 'ipt type="application/javascript">' + this.data.read(examplePath+".javascript", peek) + '</scr' + 'ipt></body></html>';
        if (!execute) return;
        function doIt()
        {
            updaterId   = undefined;
            this.root.controls.playground.controls.preview.value('                <iframe name="result" sandbox="allow-forms allow-popups allow-scripts allow-same-origin" style="width: 100%; height: 100%;" frameborder="0">#document</iframe>');
            var iframe  = this.root.controls.playground.controls.preview.__element.getElementsByTagName("iframe")[0];
            iframe.contentWindow.document.open();
            iframe.contentWindow.document.write(html);
            iframe.contentWindow.document.close();
        }
        if (updaterId !== undefined)    clearTimeout(updaterId);
        updaterId   = setTimeout(doIt.bind(this), 250);
    }
    var adapterDefinition   =
    {
        controls:
        {
            runButton:                  { onclick:  function(){ updateIframe.call(this, true); }, bind: { display: { when: "livePreview", "!=": true } } },
            editorThemeList:            { bind: "editorTheme" },
            exampleList:
            {
                bind:
                {
                    value:  {to : "active", onupdate: function(){ updateIframe.call(this, true, true); } },
                    items:
                    {
                        to:     "examples",
                        text:   "name",
                        value:  "name"
                    }
                }
            },
            addNewPlaygroundButton:
            {
                onclick:
                function()
                {
                    var name = prompt("Enter a name for the new playground (blank to abort): "); 
                    if (name == null || name == '') return;
                    this.data("examples").push({name: name, example: {javascript: "", html: "", css: ""}});
                    var newPlayground = this.data("examples")(this.data("examples").count-1)("example");
                    this.data("...active", name);
                }
            },
            savePlaygroundsButton:          { onclick: function() { viewAdapter.on.savePlayground(this.data());} },
            resetPlaygroundsButton:         { onclick: function() { viewAdapter.on.resetPlayground(); } },
            exportCurrentPlaygroundButton:  { onclick: function() { alert(json.stringify(this.data(getActiveExamplePath(this.data))())); } },
            downloadCurrentPlaygroundButton:{ onclick: function() { viewAdapter.on.downloadPlayground(this.data("...active"), this.data(getActiveExamplePath(this.data))()); } },
            importPlaygroundButton:
            {
                onclick:
                function()
                {
                    var name = prompt("Enter the name of the new playground: ");
                    if (name == null) return;
                    var data = prompt("Enter the exported playground here: ");
                    if (data == null) return;
                    viewAdapter.on.importPlayground({name: name, example: json.parse(data)});
                }
            },
            livePreviewCheckbox:            { bind: "livePreview" },
            displayEditorsCheckbox:         { bind: "displayEditors" },
            viewEngineModelCheckbox:        { bind: "viewEngineModel" },
            description:                    { factory:  markdownControl, bind: { value: function(item) { return item(getActiveExamplePath(item)+".description"); }, display: function(item) { return item(getActiveExamplePath(item)+".description.length"); } } },
            playground: 
            {
                bind:       { value: getActiveExamplePath, display: function(item) { return !item(getActiveExamplePath(item)+".placeholder"); }, classes: { displayEditors: "displayEditors" } }, 
                controls:
                {
                    javascriptEditor:       { factory:  editorControl,  mode:   "javascript",   bind: { value: "javascript",   theme: "...editorTheme" } },
                    cssEditor:              { factory:  editorControl,  mode:   "css",          bind: { value: "css",          theme: "...editorTheme" } },
                    htmlEditor:             { factory:  editorControl,  mode:   "html",         bind: { value: "html",         theme: "...editorTheme" } },
                    preview:                { bind:     { value: { onupdate: function(item){updateIframe.call(this, item("...livePreview")); } } } }
                }
            },
            engineFooter:               { bind: { display: "viewEngineModel" } },
            model:                      { bind: { value: { to: function(item){return this.data("viewEngineModel") && JSON.stringify(this.data(), null, '    ').replace(/\</g, "&lt;").replace(/\>/g, "&gt;");}, root: "" } } }
        },
        events: ["savePlayground", "resetPlayground", "exportPlayground", "downloadPlayground", "importPlayground"]
    };
    return adapterDefinition;
}});}();