!function(){window.onload   =
function ComposeApp()
{
    var atomic  = root.atomic.htmlCompositionRoot();
    var app =
    new root.tutorial.appController
    (
        atomic.viewAdapterFactory.create
        (
            new root.tutorial.appView(), 
            document.querySelector("#tutorialApp")
        ),
        new root.tutorial.appProxy(window.localStorage, root.utilities.removeFromArray),
        atomic.observer
    );
    app.launch();
};}();