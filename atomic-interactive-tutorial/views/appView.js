!function()
{"use strict";root.define("atomic.interactiveTutorial.appView", function(editorControl, markdownControl, json)
{return function playgroundAppView(viewAdapter)
{
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
        var examplePath = this.data(isTarget?"activeExamplePathWithLesson":"activeExamplePath");
        var cssPath     = this.data("activeExamplePath") + ".css";
        var html        = '<!DOCTYPE html><html><head><link rel="stylesheet" href="css/bootstrap.css" /><scr' + 'ipt type="application/javascript" src="3rdparty/atomic.js"></sc' + 'ript></head><body><div id="output">' + (this.data.read(examplePath+(isTarget?".targetHTML":".html"), peek)||"").replace(/\&lt\;/g, "<").replace(/\&gt\;/g, ">") + '</div><style>' + this.data.read(cssPath, peek) + '</style><scr' + 'ipt type="application/javascript">' + this.data.read(examplePath+(isTarget?".targetJavascript":".javascript"), peek) + '</scr' + 'ipt></body></html>';
        if (!execute) return;
        debugger;
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
            runButton:
            {
                onclick:    function(){ updateIframe.call(this, this.root.controls.playground.controls.preview, true); },
                bind:       { display: { when: "livePreview", "!=": true } }
            },
            editorThemeList:        { bind: "editorTheme" },
            exampleList:
            {
                bind:
                {
                    value:  "active",
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
            exportTutorialButton:           { onclick: function() { alert(json.stringify(this.data.unwrap("...activeExample"))); }, bind:   { display: "displayAuthorEditors" } },
            downloadCurrentPlaygroundButton:{ onclick: function() { viewAdapter.on.downloadPlayground(this.data("...active"), this.data.unwrap("...activeExample")); } },
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
                bind:
                {
                    value:      "...activeExample",
                    display:    { when: "...activeExample.placeholder", "!=": true },
                    classes:    { displayEditors: "displayEditors" } 
                },
                controls:
                {
                    instructions:           { factory:  markdownControl,                        bind: "activeLesson.instructions" },
                    javascriptEditor:       { factory:  editorControl,  mode:   "javascript",   bind: { value: "javascript",    theme: "...editorTheme" } },
                    htmlEditor:             { factory:  editorControl,  mode:   "html",         bind: { value: "html",          theme: "...editorTheme" } },
                    cssEditor:              { factory:  editorControl,  mode:   "css",          bind: { value: "css",           theme: "...editorTheme", display: "...displayAuthorEditors" } },
                    preview:                {},
                    fixCodeAndHtmlButton:
                    {
                        onclick:
                        function()
                        {
                            if (confirm("Are you sure you wand to do this?  Your code and markup will be replaced with working copies."))
                            {
                                var activeExampleWithLesson = this.data.unwrap("activeLesson")||{};
                                this.data("html", activeExampleWithLesson.targetHTML);
                                this.data("javascript", activeExampleWithLesson.targetJavascript);
                            }
                        },
                        bind:   { display: { when: "activeLesson.nohelp",  "!=": true } }
                    },
                    movePreviousArrow:
                    {
                        onclick: function() { this.data("...activeLesson", this.data("...activeLesson")-1); },
                        bind:   { enabled: function(item){return item("...activeLesson") > 0;} }
                    },
                    moveNextArrow:
                    {
                        onclick: function() { this.data("...activeLesson", this.data("...activeLesson")+1); },
                        bind:   { enabled: function(item){return item("...activeLesson") < item("lessons.length")-1;} }
                    },
                    currentLesson:  { selector: ".currentLesson",   bind: function(item){ return item("...activeLesson")+1; } },
                    lessonCount:    { selector: ".lessonCount",     bind: function(item){ return item("lessons.length"); } },
                    moveToNextLessonButton:
                    {
                        onclick: function() { this.data("...activeLesson", this.data("...activeLesson")+1); },
                        bind:   { display: function(item){return item("...activeLesson") < item("lessons.length")-1;} }
                    }
                }
            },
            authorEditors: 
            {
                bind:
                {
                    value:      "...activeExampleWithLesson", 
                    display:    { when: "activeExample.placeholder", "!=": true }, 
                    classes:    { displayAuthorEditors: "displayAuthorEditors" }
                }, 
                controls:
                {
                    markdownEditor:         { factory:  editorControl,  mode:   "markdown",     bind: { value: "instructions",      theme: "...editorTheme" } },
                    targetJavascriptEditor: { factory:  editorControl,  mode:   "javascript",   bind: { value: "targetJavascript",  theme: "...editorTheme" } },
                    targetHTMLEditor:       { factory:  editorControl,  mode:   "html",         bind: { value: "targetHTML",        theme: "...editorTheme" } },
                    targetPreview:          { },
                    addLessonButton:
                    {
                        onclick:
                        function()
                        {
                            var lessons = this.data("...activeExample.lessons");
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
                                var lessons = this.data("activeExample.lessons");
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
        events: ["savePlayground", "resetPlayground", "exportPlayground", "downloadPlayground", "importPlayground"],
        members:
        {
            construct:
            function()
            {
                this.data.define("activeExamplePath", {get: function()
                {
                    var active          = this("active");
                    var activeTutorial;
                    console.log("active", active);
                    if (active !== undefined && this.peek("examples") !== undefined)
                    for(var counter=0;counter<this.peek("examples").count;counter++) if(this.peek("examples."+counter+".name")==active) { activeTutorial = "examples."+counter+".example"; break; }
                    if (activeTutorial === undefined)   activeTutorial = "examples.0.example";
                    return activeTutorial;
                }});
                this.data.define("activeExamplePathWithLesson", {get: function(){return this("activeExamplePath") + ".lessons."+this("activeLesson");}});
                this.data.define("activeExample",               {get: function(){return this(this("activeExamplePath"));}});
                this.data.define("activeExampleWithLesson",     {get: function(){return this(this("activeExamplePathWithLesson"));}});
                this.data.define("examples./\\d/.example.activeLesson", {get: function(){return this("lessons."+this("...activeLesson"));}});

                this.data.listen((function(){updateIframe.call(this, this.controls.playground.controls.preview, this.data("...livePreview"));}).bind(this));
                this.data.listen((function(){updateIframe.call(this, this.controls.authorEditors.controls.targetPreview, this.data("...livePreview"), false, true);}).bind(this));
                this.data.listen((function(){this.data("active"); this.data("activeLesson", 0);}).bind(this));
                this.data.listen((function(){this.data("...activeLesson"); this.controls.playground.controls.instructions.scrollTo(0);}).bind(this));
            }
        }
    };
    return adapterDefinition;
}});}();
