!function(){window.onload   =
function ComposeApp()
{
    var atomic  = root.atomic.html.compositionRoot();
    var app =
    new root.atomic.tutorial.appController
    (
        atomic.viewAdapterFactory.createView
        (
            new root.atomic.tutorial.appView(root.utilities.each), 
            document.querySelector("#tutorialApp")
        ),
        new root.atomic.tutorial.appProxy(window.localStorage, root.utilities.removeFromArray),
        new root.path()
    );
    app.launch();
};}();