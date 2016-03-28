!function()
{
    window.onload   =
    function ComposeApp()
    {
        var atomic  = root.atomic.htmlCompositionRoot();
        var app =
        new root.todoMVC.appController
        (
            atomic.viewAdapterFactory.create
            (
                new root.todoMVC.appView(), 
                document.querySelector("#todoMVCApp")
            ),
            new root.todoMVC.appProxy(window.localStorage, root.utilities.removeFromArray),
            atomic.observer
        );
        app.launch();
    };
}();