!function(window, document)
{"use strict";root.define("atomic.forms.dock", function adaptHtml(viewElement, proxy, controls)
{
    if (arguments.length == 1)
    {
        proxy       = viewElement;
        viewElement = document.body;
    }
    var each                    = root.utilities.each
    var isolatedFunctionFactory = new root.atomic.html.isolatedFunctionFactory(document);
    var pubSub                  = new root.utilities.pubSub(isolatedFunctionFactory, root.utilities.removeItemFromArray);
    var dataBinder              = new root.atomic.dataBinder(each, root.utilities.removeItemFromArray);
    var defineDataProperties    = new root.atomic.defineDataProperties(isolatedFunctionFactory, each, pubSub);
    var callback;
    var deferOrExecute  =
    function()
    {
        var atomic  = root.atomic.html.compositionRoot(function(controlTypes, atomic)
        {
            var template        = new root.atomic.forms.controls.template(controlTypes.control, dataBinder, defineDataProperties);
            var layout          = new root.atomic.forms.controls.layout(template, document.querySelector("#layout"), defineDataProperties, atomic.viewAdapterFactory, each);
            var menu            = new root.atomic.forms.controls.menu(template, document.querySelector("#menu"), defineDataProperties, atomic.viewAdapterFactory);
            var staticControl   = new root.atomic.forms.controls.static(template, document.querySelector("#static"), defineDataProperties);
            Object.defineProperties(controlTypes,
            {
                layout: {value: layout},
                menu:   {value: menu},
                static: {value: staticControl}
            });
        });
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