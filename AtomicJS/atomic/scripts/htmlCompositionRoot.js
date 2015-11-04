!function()
{"use strict";root.define("atomic.htmlCompositionRoot",
function htmlCompositionRoot()
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
                    window.clearTimeout
                ),
                new root.atomic.initializeViewAdapter(root.utilities.each),
                root.utilities.pubSub
            )
        ),
        observer:
        new root.atomic.observerFactory(root.utilities.removeFromArray, new root.atomic.isolatedFunctionFactory(document))
    }
});}();
