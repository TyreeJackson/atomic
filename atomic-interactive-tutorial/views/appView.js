!function()
{"use strict";root.define("atomic.interactiveTutorial.appView", function(editorControl, markdownControl, json)
{return function playgroundAppView(viewAdapter)
{
    function getActiveExamplePath(item, withLesson)
    {
        var active          = item("...active");
        var activeLesson    = item("...activeLesson");
        var activeTutorial;
        if (active !== undefined && item.peek("...examples") !== undefined)
        for(var counter=0;counter<item.peek("...examples").count;counter++) if(item.peek("...examples."+counter+".name")==active) { activeTutorial = "...examples."+counter+".example"; break; }
        if (activeTutorial === undefined) activeTutorial = "...examples.0.example";
        if (activeLesson === undefined || activeLesson > item("activeTutorial.lessons.length")) { activeLesson = 0; item("...activeLesson", activeLesson); }
        return activeTutorial+(withLesson?".lessons."+activeLesson:"");
    }
    function getRenderedOutput()
    {
        return viewAdapter.controls.playground.controls.preview.__element.getElementsByTagName("iframe")[0].contentDocument.body.querySelector("#output").innerHTML.replace(/\</g, "&lt;").replace(/\>/g, "&gt;");
    }
    var updaterIds  = {};
    function clearIframe(parent)
    {
        parent.value('                <iframe name="result" sandbox="allow-forms allow-popups allow-scripts allow-same-origin" style="width: 100%; height: 100%;" frameborder="0">#document</iframe>');
    }
    function updateIframe(parent, execute, peek, isTarget)
    {
        var examplePath = getActiveExamplePath(this.data, true);
        var html        = '<!DOCTYPE html><html><head><link rel="stylesheet" href="css/bootstrap.css" /><scr' + 'ipt type="application/javascript" src="3rdparty/atomic.js"></sc' + 'ript></head><body><div id="output">' + (this.data.read(examplePath+(isTarget?".targetHTML":".html"), peek)||"").replace(/\&lt\;/g, "<").replace(/\&gt\;/g, ">") + '</div><scr' + 'ipt type="application/javascript">' + this.data.read(examplePath+(isTarget?".targetJavascript":".javascript"), peek) + '</scr' + 'ipt></body></html>';
        if (!execute) return;
        clearIframe(parent);
        function doIt()
        {
            updaterIds[parent.id()] = undefined;
            parent.value('                <iframe name="result" sandbox="allow-forms allow-popups allow-scripts allow-same-origin" style="width: 100%; height: 100%;" frameborder="0">#document</iframe>');
            var iframe  = parent.__element.getElementsByTagName("iframe")[0];
            iframe.contentWindow.document.open();
            iframe.contentWindow.document.write(html);
            iframe.contentWindow.document.close();
        }
        if (updaterIds[parent.id()] !== undefined)  clearTimeout(updaterIds[parent.id()]);
        updaterIds[parent.id()] = setTimeout(doIt.bind(this), 1000);
    }
    var adapterDefinition   =
    {
        controls:
        {
            runButton:                  { onclick:  function(){ updateIframe.call(this, this.root.controls.playground.controls.preview, true); }, bind: { display: { when: "livePreview", "!=": true } } },
            editorThemeList:            { bind: "editorTheme" },
            exampleList:
            {
                bind:
                {
                    value:  {to : "active", onupdate: function(){ updateIframe.call(this, this.root.controls.playground.controls.preview, true, true); updateIframe.call(this, this.root.controls.authorEditors.controls.targetPreview, true, true, true); } },
                    items:
                    {
                        to:     "examples",
                        text:   "name",
                        value:  "name"
                    }
                }
            },
            addNewTutorialButton:
            {
                onclick:
                function()
                {
                    var name = prompt("Enter a name for the new playground (blank to abort): "); 
                    if (name == null || name == '') return;
                    this.data("examples").push({name: name, example: {lessons: [{instructions: "", javascript: "", html: "", targetJavascript: "", targetHTML: ""}]}});
                    this.data("...activeLesson", 0);
                    var newPlayground = this.data("examples")(this.data("examples").count-1)("example");
                    this.data("...active", name);
                },
                bind:   { display: "displayAuthorEditors" }
            },
            savePlaygroundsButton:          { onclick: function() { viewAdapter.on.savePlayground(this.data());} },
            resetPlaygroundsButton:         { onclick: function() { viewAdapter.on.resetPlayground(); } },
            exportTutorialButton:           { onclick: function() { alert(json.stringify(this.data(getActiveExamplePath(this.data))())); }, bind:   { display: "displayAuthorEditors" } },
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
            displayAuthorEditorsCheckbox:   { bind: "displayAuthorEditors" },
            viewEngineModelCheckbox:        { bind: "viewEngineModel" },
            playground: 
            {
                bind:       { value: function(item){return getActiveExamplePath(item, true); }, display: function(item) { return !item(getActiveExamplePath(item)+".placeholder"); }, classes: { displayEditors: "displayEditors" } }, 
                controls:
                {
                    instructions:           { factory:  markdownControl,                        bind: "instructions" },
                    javascriptEditor:       { factory:  editorControl,  mode:   "javascript",   bind: { value: "javascript",   theme: "...editorTheme" } },
                    htmlEditor:             { factory:  editorControl,  mode:   "html",         bind: { value: "html",         theme: "...editorTheme" } },
                    preview:                { bind:     { value: { onupdate: function(item){updateIframe.call(this, this, item("...livePreview")); } } } },
                    fixCodeAndHtmlButton:
                    {
                        onclick:
                        function()
                        {
                            if (confirm("Are you sure you wand to do this?  Your code and markup will be replaced with working copies."))
                            {
                                this.data("html", this.data("targetHTML"));
                                this.data("javascript", this.data("targetJavascript"));
                            }
                        },
                        bind:   { display: { when: "nohelp", "!=": true } }
                    },
                    movePreviousArrow:
                    {
                        onclick: function() { this.data("...activeLesson", this.data("...activeLesson")-1); },
                        bind:   { enabled: function(item){return item("...activeLesson") > 0;} }
                    },
                    moveNextArrow:
                    {
                        onclick: function() { this.data("...activeLesson", this.data("...activeLesson")+1); },
                        bind:   { enabled: function(item){return item("...activeLesson") < item(getActiveExamplePath(item)+".lessons.length")-1;} }
                    },
                    currentLesson:  { selector: ".currentLesson",   bind: function(item){ return item("...activeLesson")+1; } },
                    lessonCount:    { selector: ".lessonCount",     bind: function(item){ return item(getActiveExamplePath(item)+".lessons.length"); } },
                    moveToNextLessonButton:
                    {
                        onclick: function() { this.data("...activeLesson", this.data("...activeLesson")+1); },
                        bind:   { display: function(item){return item("...activeLesson") < item(getActiveExamplePath(item)+".lessons.length")-1;} }
                    }
                }
            },
            authorEditors: 
            {
                bind:       { value: function(item){ return getActiveExamplePath(item, true); }, display: function(item) { return !item(getActiveExamplePath(item)+".placeholder"); }, classes: { displayAuthorEditors: "displayAuthorEditors" } }, 
                controls:
                {
                    markdownEditor:         { factory:  editorControl,  mode:   "markdown",     bind: { value: "instructions",      theme: "...editorTheme" } },
                    targetJavascriptEditor: { factory:  editorControl,  mode:   "javascript",   bind: { value: "targetJavascript",  theme: "...editorTheme" } },
                    targetHTMLEditor:       { factory:  editorControl,  mode:   "html",         bind: { value: "targetHTML",        theme: "...editorTheme" } },
                    targetPreview:          { bind:     { value: { onupdate: function(item){updateIframe.call(this, this, item("...livePreview"), false, true); } } } },
                    addLessonButton:
                    {
                        onclick:
                        function()
                        {
                            var lessons = this.data(getActiveExamplePath(this.data)+".lessons");
                            lessons.push({instructions: "", javascript: "", html: "", targetJavascript: "", targetHTML: ""});
                            this.data("...activeLesson", lessons.count-1);
                            this.parent.controls.markdownEditor.focus();
                        }
                    },
                    removeLessonButton:
                    {
                        onclick:
                        function()
                        {
                            if (confirm("Are you sure that you want to delete the current lesson?"))
                            {
                                var lessons = this.data(getActiveExamplePath(this.data)+".lessons");
                                lessons.remove(this.data.unwrap());
                                if (this.data("...activeLesson")>=lessons.count) this.data("...activeLesson", lessons.count-1);
                            }
                        }
                    }
                }
            },
            engineFooter:               { bind: { display: "viewEngineModel" } },
            model:                      { bind: { value: { to: function(item){return this.data("viewEngineModel") && JSON.stringify(this.data(), null, '    ').replace(/\</g, "&lt;").replace(/\>/g, "&gt;");}, root: "" } } }
        },
        events: ["savePlayground", "resetPlayground", "exportPlayground", "downloadPlayground", "importPlayground"]
    };
    return adapterDefinition;
}});}();
