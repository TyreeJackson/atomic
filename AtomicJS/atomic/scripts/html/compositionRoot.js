!function()
{"use strict";root.define("atomic.html.compositionRoot", function htmlCompositionRoot(customControlTypes)
{
    var each                    = root.utilities.each
    var isolatedFunctionFactory = new root.atomic.html.isolatedFunctionFactory(document);
    var pubSub                  = new root.utilities.pubSub(isolatedFunctionFactory, root.utilities.removeItemFromArray);
    var dataBinder              = new root.atomic.dataBinder(each, root.utilities.removeItemFromArray);
    var defineDataProperties    = new root.atomic.defineDataProperties(isolatedFunctionFactory, each, pubSub);
    var eventsSet               = new root.atomic.html.eventsSet(pubSub);
    var controlTypes            = {};
    var viewAdapterFactory      =   new root.atomic.html.viewAdapterFactory
                                    (
                                        document,
                                        controlTypes,
                                        new root.atomic.initializeViewAdapter(each),
                                        pubSub,
                                        function(message){console.log(message);},
                                        each
                                    );

    var control                 = new root.atomic.html.control(document, root.utilities.removeItemFromArray, window.setTimeout, each, defineDataProperties, eventsSet, dataBinder);
    var readonly                = new root.atomic.html.readonly(control, defineDataProperties);
    var container               = new root.atomic.html.container(control, each);
    var panel                   = new root.atomic.html.panel(container, defineDataProperties, viewAdapterFactory, each);
    var repeater                = new root.atomic.html.repeater(container, defineDataProperties, viewAdapterFactory, root.utilities.removeFromArray);
    var input                   = new root.atomic.html.input(control, defineDataProperties);
    var checkbox                = new root.atomic.html.checkbox(control, defineDataProperties);
    var select                  = new root.atomic.html.select(input, defineDataProperties, dataBinder);
    var radiogroup              = new root.atomic.html.radiogroup(input, defineDataProperties, dataBinder);
    var multiselect             = new root.atomic.html.multiselect(select, defineDataProperties);

    Object.defineProperties(controlTypes,
    {
        control:        {value: control},
        readonly:       {value: readonly},
        panel:          {value: panel},
        repeater:       {value: repeater},
        input:          {value: input},
        checkbox:       {value: checkbox},
        select:         {value: select},
        radiogroup:     {value: radiogroup},
        multiselect:    {value: multiselect}
    });

    return { viewAdapterFactory: viewAdapterFactory, observer: new root.atomic.observerFactory(root.utilities.removeFromArray, isolatedFunctionFactory, each) };
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
        var atomic  = root.atomic.html.compositionRoot();
        var adapter =
        atomic.viewAdapterFactory.create
        (
            typeof controlsOrAdapter !== "function" ? function(appViewAdapter){return {controls: controlsOrAdapter}; } : controlsOrAdapter, 
            typeof viewElement === "string" ? document.querySelector(viewElement) : viewElement||document.body
        );
        adapter.data    = new atomic.observer({});
        if (typeof callback === "function") callback(adapter);
    }
    if (document.readyState !== "complete") window.addEventListener("load", deferOrExecute);
    else                                    deferOrExecute();

    return function(callbackFunction){ callback = callbackFunction; };
});}(window, document);