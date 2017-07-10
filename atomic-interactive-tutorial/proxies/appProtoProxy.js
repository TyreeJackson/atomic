!function()
{"use strict";root.define("atomic.interactiveTutorial.appProxy", function tutorialProtoProxy(localStorage, json)
{
    var examplesKey = "atomic.interactive-tutorials.data.examples";
    function installData(key, data)
    {
        localStorage.setItem(key, json.stringify(data));
    }
    function getData(key, installer)
    {
        if (localStorage.getItem(key) == null)  installData(key, installer());
        return json.parse(localStorage.getItem(key));
    }
    var methods =
    {
        launch:
        function(callback)
        {
            var examples    = getData(examplesKey, getDefaultExamples);
            callback
            ({
                data:
                {
                    examples:   examples
                }
            });
        },
        importExample:
        function(example, callback)
        {
            var exampleSet  = getData(examplesKey, getDefaultExamples);
            exampleSet.examples.push(example);
            installData(examplesKey, exampleSet);
            this.launch(callback);
        },
        saveExamples:
        function(examples, callback)
        {
            installData(examplesKey, examples);
            this.launch(callback);
        },
        resetExamples:
        function(callback)
        {
            installData(examplesKey, getDefaultExamples());
            this.launch(callback);
        }
    };

    function getDefaultExamples()
    {
        var data =
        {
            active:             "--Select a tutorial--",
            activeLesson:       0,
            viewEngineModel:    false,
            displayEditors:     true,
            livePreview:        true,
            editorTheme:        "ace/theme/crimson_editor",
            examples:
            [
                {
                    name:       "--Select a tutorial--",
                    example:
                    {
                        placeholder: true,
                    }
                },
                {
                    name:       "Hello World",
                    example:
                    {
                        lessons:
                        [
                            {
                                instructions:    
`# Hello World
This is the classic hello world example.  Note that the word \`World\` in the example is dynamically obtained from the model using a simple value binding.

This example uses the simplest overload of the \`root.atomic.launch\` method which accepts a single argument containing the [\`view adapter\` definition](https://github.com/TyreeJackson/atomic/wiki/AtomicJS-Documentation#view-adapter-definition-structure).
`,
                                javascript:         "root.atomic.launch ({worldLabel: {value: \"World\"}});",
                                html:               "<div class=\"well\">\n    <h1 id=\"greeting\">Hello <span id=\"worldLabel\"></span>!</h1>\n</div>",
                                targetJavascript:   "root.atomic.launch ({worldLabel: {value: \"World\"}});",
                                targetHTML:         "<div class=\"well\">\n    <h1 id=\"greeting\">Hello <span id=\"worldLabel\"></span>!</h1>\n</div>"
                            },
                            {
                                instructions:    
`# Hello World Revisited
In this version of the hello world example, the greeting is not displayed until the Say Hello button has been pressed.

This example uses the following overload of the launch method: \`root.atomic.launch(\`*\`cssSelector\`*\`, \`*\`viewAdapterDefinition\`*\`)\` where the \`cssSelector\` parameter accepts a string argument containing a css selector that locates the root element of the view and the \`viewAdapterDefinition\` parameter accepts an object argument containing the [\`view adapter\` definition](https://github.com/TyreeJackson/atomic/wiki/AtomicJS-Documentation#view-adapter-definition-structure).
`,
                                javascript:         "root.atomic.launch\n(\n    \"#example2\",\n    {\n        greeting2:      {bind: { display: \"worldValue.length\" }},\n        worldLabel2:    {bind: \"worldValue\"},\n        sayHelloButton:\n        {\n            onclick:    function(){ this.data(\"worldValue\",\"World\"); }, \n            bind:       { display: function(item){return !item.hasValue(\"worldValue\"); } }\n        }\n    }\n);",
                                html:               "<div id=\"example2\">\n    <div class=\"example\">\n        <div class=\"well\">\n            <h1 id=\"greeting2\">Hello <span id=\"worldLabel2\"></span>!</h1>\n            <button id=\"sayHelloButton\">Say Hello</button>\n        </div>\n    </div>\n</div>",
                                targetJavascript:   "root.atomic.launch\n(\n    \"#example2\",\n    {\n        greeting2:      {bind: { display: \"worldValue.length\" }},\n        worldLabel2:    {bind: \"worldValue\"},\n        sayHelloButton:\n        {\n            onclick:    function(){ this.data(\"worldValue\",\"World\"); }, \n            bind:       { display: function(item){return !item.hasValue(\"worldValue\"); } }\n        }\n    }\n);",
                                targetHTML:         "<div id=\"example2\">\n    <div class=\"example\">\n        <div class=\"well\">\n            <h1 id=\"greeting2\">Hello <span id=\"worldLabel2\"></span>!</h1>\n            <button id=\"sayHelloButton\">Say Hello</button>\n        </div>\n    </div>\n</div>"
                            }
                        ]
                    }
                }
            ]
        };
        return data;
    }

    return methods;
});}();