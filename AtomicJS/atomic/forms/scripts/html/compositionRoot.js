!function(window, document)
{"use strict";root.define("atomic.forms.dock", function launch(viewElement, proxy, controls)
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
            var template        = new root.atomic.forms.controls.template(controlTypes.container, dataBinder, defineDataProperties);
            var layout          = new root.atomic.forms.controls.layout(template, document.querySelector("#layout"), defineDataProperties, atomic.viewAdapterFactory, each);
            var menu            = new root.atomic.forms.controls.menu(template, document.querySelector("#menu"), defineDataProperties, atomic.viewAdapterFactory);
            var staticControl   = new root.atomic.forms.controls.static(template, document.querySelector("#static"), defineDataProperties);
            var textboxControl  = new root.atomic.forms.controls.textbox(template, document.querySelector("#textbox"), defineDataProperties);
            var json            = new root.atomic.forms.controls.json(staticControl, document.querySelector("#json"), defineDataProperties);
            Object.defineProperties(controlTypes,
            {
                layout:     {value: layout},
                menu:       {value: menu},
                static:     {value: staticControl},
                json:       {value: json},
                textbox:    {value: textboxControl}
            });
        });
        var app =
        new root.atomic.forms.appController
        (
            atomic.viewAdapterFactory.createView
            (
                new root.atomic.forms.appView(atomic.observer), 
                typeof viewElement === "string" ? document.querySelector(viewElement) : viewElement||document.body
            ),
            typeof proxy === "function" ? new proxy() : proxy,
            new root.path()
        );
        if (typeof callback === "function") callback(app);
        else                                app.launch();
    }
    if (document.readyState !== "complete") window.addEventListener("load", deferOrExecute);
    else                                    deferOrExecute();

    return function(callbackFunction){ callback = callbackFunction; };
});}(window, document);