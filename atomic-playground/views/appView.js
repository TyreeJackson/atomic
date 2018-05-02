!function()
{"use strict";root.define("atomic.playground.appView", function(editorControl, markdownControl, json)
{return function playgroundAppView(viewAdapter)
{
    var updaterId;
    function updateIframe(data, execute, peek)
    {
        var html        = '<!DOCTYPE html><html><head><link rel="stylesheet" href="css/bootstrap.css" /><scr' + 'ipt type="application/javascript" src="3rdparty/atomic.js"></sc' + 'ript></head><body>' + (data.read("$shadow.activeExample.html", peek)||"").replace(/\&lt\;/g, "<").replace(/\&gt\;/g, ">") + '<style>' + data.read("$shadow.activeExample.css", peek) + '</style><scr' + 'ipt type="application/javascript">' + data.read("$shadow.activeExample.javascript", peek) + '</scr' + 'ipt></body></html>';
        if (!execute) return;
        function doIt()
        {
            updaterId   = undefined;
            this.root.controls.playground.controls.preview.value('                <iframe name="result" sandbox="allow-modals allow-forms allow-popups allow-scripts allow-same-origin" style="width: 100%; height: 100%;" frameborder="0">#document</iframe>');
            this.root.controls.playground.controls.preview.__setViewData("callback", function()
            {
                var iframe  = this.__element.getElementsByTagName("iframe")[0];
                iframe.contentWindow.document.open();
                iframe.contentWindow.document.write(html);
                iframe.contentWindow.document.close();
            });
        }
        if (updaterId !== undefined)    clearTimeout(updaterId);
        updaterId   = setTimeout(doIt.bind(this), 1000);
    }
    var adapterDefinition   =
    {
        controls:
        {
            runButton:                  { onclick:  function(){ updateIframe.call(this, this.data, true); }, bind: { display: { when: "livePreview", "!=": true } } },
            editorThemeList:            { bind: "editorTheme" },
            exampleList:
            {
                bind:
                {
                    value:  "$shadow.active",
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
                    this.data("$shadow.active", name);
                }
            },
            savePlaygroundsButton:          { onclick: function() { viewAdapter.on.savePlayground(this.data());} },
            resetPlaygroundsButton:         { onclick: function() { viewAdapter.on.resetPlayground(); } },
            exportCurrentPlaygroundButton:  { onclick: function() { alert(json.stringify(this.data.unwrap("$shadow.activeExample"))); } },
            downloadCurrentPlaygroundButton:{ onclick: function() { viewAdapter.on.downloadPlayground(this.data("$shadow.active"), this.data.unwrap("$shadow.activeExample")); } },
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
            toggleSideBar:                  { onclick: function(){ this.data("$shadow.hideSidebar", !this.data("$shadow.hideSidebar")); } },
            playground: 
            {
                bind:
                {
                    value:      "$shadow.activeExample",
                    display:    { when: "$shadow.activeExample.placeHolder", "!=": true },
                    classes:
                    {
                        displayEditors:     "displayEditors",
                        viewEngineModel:    "viewEngineModel",
                        hasDescription:     { when: "$shadow.activeExample.description", hasValue: true }
                    }
                }, 
                controls:
                {
                    description:            { factory:  markdownControl, bind: { value: "description" } },
                    javascriptEditor:       { factory:  editorControl,  mode:   "javascript",   bind: { value: "javascript",   theme: "...editorTheme" } },
                    cssEditor:              { factory:  editorControl,  mode:   "css",          bind: { value: "css",          theme: "...editorTheme" } },
                    htmlEditor:             { factory:  editorControl,  mode:   "html",         bind: { value: "html",         theme: "...editorTheme" } },
                    preview:                { }
                }
            },
            model:                      { bind: { value: { to: function(item){return this.data("viewEngineModel") && JSON.stringify(this.data(), null, '    ').replace(/\</g, "&lt;").replace(/\>/g, "&gt;");}, root: "" } } }
        },
        events: ["savePlayground", "resetPlayground", "exportPlayground", "downloadPlayground", "importPlayground"],
        members:
        {
            construct:
            function()
            {
                this.data.define("$shadow.activeExample", {get: function()
                {
                    var active      = this("active");
                    var examples    = this.peek("$parent.examples", true);
                    if (active !== undefined && examples !== undefined)
                    for(var counter=0;counter<examples.length;counter++)  if(this.peek("$parent.examples."+counter+".name")==active) {return this("$parent.examples."+counter+".example"); }
                    return this("$parent.examples.0.example");
                }});
                this.data.listen((function(){updateIframe.call(this.controls.playground.controls.preview, this.data, this.data("...livePreview"));}).bind(this));
                this.initialize({bind:{classes:{"sidebarHidden": "$shadow.hideSidebar"}}});
            }
        }
    };
    return adapterDefinition;
}});}();