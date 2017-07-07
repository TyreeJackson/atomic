!function(){window.onload   =
function ComposeApp()
{
    var atomic          = root.atomic.html.compositionRoot();
    var editorControl   = atomic.viewAdapterFactory.createFactory(root.atomic.playground.controls.editorControl(ace), document.querySelector("#editorControl"));
    var markdownControl = atomic.viewAdapterFactory.createFactory(root.atomic.playground.controls.markdownControl(marked), document.querySelector("#markdownControl"));
    var app =
    new root.atomic.playground.appController
    (
        atomic.viewAdapterFactory.createView
        (
            new root.atomic.playground.appView(editorControl, markdownControl, JSON), 
            document.body
        ),
        new root.atomic.playground.appProxy(window.localStorage, JSON),
        atomic.observer
    );
    app.launch();
};}();
