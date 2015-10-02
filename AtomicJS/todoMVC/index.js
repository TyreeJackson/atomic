!function()
{
    window.onload   =
    function ComposeApp()
    {
        var querySelector       = function(uiElement, selector){ return uiElement.querySelector(selector); };
        var viewAdapterFactory  =
        new root.atomic.viewAdapterFactory
        (
            new root.atomic.viewAdapterFactorySupport
            (
                new root.atomic.attachViewMemberAdapters
                (
                    root.utilities.removeItemFromArray, 
                    window.setTimeout, 
                    window.clearTimeout
                ),
                new root.atomic.initializeViewAdapter(root.utilities.each),
                querySelector,
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
                querySelector(document, "#todoMVCApp")
            ),
            new root.todoMVC.appProxy(window.localStorage)
        );
        
        //var app = new root.demo.app
        //(
        //    viewAdapterFactory.createView(root.demo.app.views.appView, document.body),
        //    new root.demo.app.proxy(aja)
        //);
    };
}();
