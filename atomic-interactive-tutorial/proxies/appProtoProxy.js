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
                        instruction:    
`# Hello World
This is the classic hello world example.  Note that the word \`World\` in the example is dynamically obtained from the model using a simple value binding.

This example uses the simplest overload of the \`root.atomic.launch\` method which accepts a single argument containing the [\`view adapter\` definition](https://github.com/TyreeJackson/atomic/wiki/AtomicJS-Documentation#view-adapter-definition-structure).
`,
                        javascript:     "root.atomic.launch ({worldLabel: {value: \"World\"}});",
                        css:            "",
                        html:           "<div class=\"well\">\n    <h1 id=\"greeting\">Hello <span id=\"worldLabel\"></span>!</h1>\n</div>",
                        criteria:       ""
                    }
                }
            ]
        };
        return data;
    }

    return methods;
});}();