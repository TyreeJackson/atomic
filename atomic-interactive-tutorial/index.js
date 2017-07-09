!function(){window.onload   =
function ComposeApp()
{
    var atomic          = root.atomic.html.compositionRoot();
    var editorControl   = atomic.viewAdapterFactory.createFactory(root.atomic.interactiveTutorial.controls.editorControl(ace), document.querySelector("#editorControl"));
    var markdownControl = atomic.viewAdapterFactory.createFactory(root.atomic.interactiveTutorial.controls.markdownControl(marked), document.querySelector("#markdownControl"));
    var app =
    new root.atomic.interactiveTutorial.appController
    (
        atomic.viewAdapterFactory.createView
        (
            new root.atomic.interactiveTutorial.appView(editorControl, markdownControl, JSON), 
            document.body
        ),
        new root.atomic.interactiveTutorial.appProxy(window.localStorage, JSON),
        atomic.observer
    );
    app.launch();
};}();