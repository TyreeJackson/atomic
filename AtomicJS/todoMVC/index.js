!function()
{
    window.onload   =
    function ComposeApp()
    {
        var viewAdapterFactory  =
        new root.atomic.viewAdapterFactory
        (
            new root.atomic.htmlViewAdapterFactorySupport
            (
                document,
                new root.atomic.htmlAttachViewMemberAdapters
                (
                    document,
                    root.utilities.removeItemFromArray, 
                    window.setTimeout, 
                    window.clearTimeout
                ),
                new root.atomic.initializeViewAdapter(root.utilities.each),
                root.utilities.pubSub
            )
        );
        var app =
        new root.todoMVC.appController
        (
            viewAdapterFactory.create
            (
                new root.todoMVC.appView
                (
                
                ), 
                document.querySelector("#todoMVCApp")
            ),
            new root.todoMVC.appProxy(window.localStorage, root.utilities.removeFromArray),
            new root.atomic.observer(root.utilities.removeFromArray)
        );
        app.launch();
    };
}();
