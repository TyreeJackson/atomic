!function(window, document)
{"use strict";root.define("atomic.forms.dock", function adaptHtml(viewElement, proxy, controls)
{
    if (arguments.length == 1)
    {
        proxy       = viewElement;
        viewElement = document.body;
    }
    var callback;
    var deferOrExecute  =
    function()
    {
        var atomic  = root.atomic.html.compositionRoot(controls);
        var app =
        new root.atomic.forms.appController
        (
            atomic.viewAdapterFactory.create
            (
                new root.atomic.forms.appView(), 
                typeof viewElement === "string" ? document.querySelector(viewElement) : viewElement||document.body
            ),
            typeof proxy === "function" ? new proxy() : proxy,
            atomic.observer,
            new root.path()
        );
        if (typeof callback === "function") callback(app);
        else                                app.launch();
    }
    if (document.readyState !== "complete") window.addEventListener("load", deferOrExecute);
    else                                    deferOrExecute();

    return function(callbackFunction){ callback = callbackFunction; };
});}(window, document);