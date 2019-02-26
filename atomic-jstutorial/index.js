!function(){window.onload   =
function ComposeApp()
{
    var atomic                      = root.atomic.html.compositionRoot(undefined, true);
    var debuggerWindow              = window.open(undefined, "debugInfo", "menubar=no,status=no,toolbar=no");
    var debugInfoPanel              = document.querySelector("#debugInfoPanel");
    if(debuggerWindow)
    {
        debuggerWindow.document.open();
        debuggerWindow.document.write(debugInfoPanel.outerHTML);
        debuggerWindow.document.close();
    }
    else
    {
        alert("Pop ups are blocked.  If you want to see the app structure information window, please allow popups for this page and try again.");
    }
    debugInfoPanel.parentNode.removeChild(debugInfoPanel);
    var app                         =
    new root.atomic.tutorial.appController
    (
        atomic.viewAdapterFactory.createView
        (
            new root.atomic.tutorial.appView(root.utilities.each), 
            document.querySelector("#tutorialApp")
        ),
        new root.atomic.tutorial.appProxy(window.localStorage, root.utilities.removeFromArray),
        new root.path(),
        debuggerWindow ? atomic.viewAdapterFactory.createView(new root.atomic.tutorial.debugInfoViewer.appView(atomic.debugInfoObserver), debuggerWindow.document.querySelector("#debugInfoPanel")) : undefined
    );
    root.atomic.init({debugInfoObserver: atomic.debugInfoObserver});
    app.launch();
};}();