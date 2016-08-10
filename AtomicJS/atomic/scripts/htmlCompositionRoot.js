!function()
{"use strict";root.define("atomic.htmlCompositionRoot", function htmlCompositionRoot()
{
return {
        viewAdapterFactory:
        new root.atomic.viewAdapterFactory
        (
            new root.atomic.htmlViewAdapterFactorySupport
            (
                document,
                new root.atomic.htmlAttachViewMemberAdapters
                (
                    window,
                    document,
                    root.utilities.removeItemFromArray,
                    window.setTimeout,
                    window.clearTimeout,
                    root.utilities.each
                ),
                new root.atomic.initializeViewAdapter(root.utilities.each),
                root.utilities.pubSub,
                function(message){console.log(message);}
            )
        ),
        observer:
        new root.atomic.observerFactory(root.utilities.removeFromArray, new root.atomic.isolatedFunctionFactory(document))
    }
});}();
!function(window, document)
{"use strict";root.define("atomic.adaptHtml", function adaptHtml(viewElement, controlsOrAdapter)
{
    if (arguments.length == 1)
    {
        controlsOrAdapter   = viewElement;
        viewElement         = document.body;
    }
    var callback;
    var deferOrExecute  =
    function()
    {
        var atomic  = root.atomic.htmlCompositionRoot();
        var adapter =
        atomic.viewAdapterFactory.create
        (
            typeof controlsOrAdapter !== "function" ? function(appViewAdapter){return {controls: controlsOrAdapter}; } : controlsOrAdapter, 
            viewElement||document.body
        );
        adapter.bindData(new atomic.observer({}));
        adapter.bindSourceData(new atomic.observer({}));
        if (typeof callback === "function") callback(adapter);
    }
    if (document.readyState !== "complete") window.addEventListener("load", deferOrExecute);
    else                                    deferOrExecute();

    return function(callbackFunction){ callback = callbackFunction; };
});}(window, document);