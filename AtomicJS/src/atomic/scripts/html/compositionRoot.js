!function()
{"use strict";root.define("atomic.html.compositionRoot", function htmlCompositionRoot(customizeControlTypes)
{
    var each                    = root.utilities.each
    var isolatedFunctionFactory = new root.atomic.html.isolatedFunctionFactory(document);
    var pathParserFactory       = new root.atomic.pathParserFactory(new root.atomic.tokenizer());
    var pathParser              = new pathParserFactory.parser(new root.atomic.lexer(new root.atomic.scanner(), pathParserFactory.getTokenizers(), root.utilities.removeFromArray));
    var observer                = new root.atomic.observerFactory(root.utilities.removeFromArray, isolatedFunctionFactory, each, pathParser);
    var pubSub                  = new root.utilities.pubSub(isolatedFunctionFactory, root.utilities.removeItemFromArray);
    var defineDataProperties    = new root.atomic.defineDataProperties(isolatedFunctionFactory, each, pubSub);
    var dataBinder              = new root.atomic.dataBinder(each, root.utilities.removeItemFromArray, defineDataProperties);
    var eventsSet               = new root.atomic.html.eventsSet(pubSub, each);
    var controlTypes            = {};
    var viewAdapterFactory      =   new root.atomic.html.viewAdapterFactory
                                    (
                                        document,
                                        controlTypes,
                                        pubSub,
                                        function(message){console.log(message);},
                                        each,
                                        observer
                                    );

    var control                 = new root.atomic.html.control(document, root.utilities.removeItemFromArray, window.setTimeout, each, eventsSet, dataBinder);
    var readonly                = new root.atomic.html.readonly(control, each);
    var label                   = new root.atomic.html.label(readonly, each);
    var link                    = new root.atomic.html.link(readonly, each);
    var container               = new root.atomic.html.container(control, each, viewAdapterFactory, new root.atomic.initializeViewAdapter(each), root.utilities.removeItemFromArray);
    var panel                   = new root.atomic.html.panel(container, each);
    var linkPanel               = new root.atomic.html.link(panel, each);
    var composite               = new root.atomic.html.composite(container, each);
    var repeater                = new root.atomic.html.repeater(container, root.utilities.removeFromArray);
    var input                   = new root.atomic.html.input(control);
    var checkbox                = new root.atomic.html.checkbox(control);
    var select                  = new root.atomic.html.select(input, dataBinder, each);
    var radiogroup              = new root.atomic.html.radiogroup(input, dataBinder, each);
    var checkboxgroup           = new root.atomic.html.checkboxgroup(input, dataBinder, each);
    var multiselect             = new root.atomic.html.multiselect(select);
    var image                   = new root.atomic.html.image(control);
    var audio                   = new root.atomic.html.audio(control);
    var button                  = new root.atomic.html.button(control);

    Object.defineProperties(controlTypes,
    {
        control:        {value: control},
        readonly:       {value: readonly},
        label:          {value: label},
        link:           {value: link},
        linkPanel:      {value: linkPanel},
        container:      {value: container},
        panel:          {value: panel},
        composite:      {value: composite},
        repeater:       {value: repeater},
        input:          {value: input},
        checkbox:       {value: checkbox},
        select:         {value: select},
        radiogroup:     {value: radiogroup},
        checkboxgroup:  {value: checkboxgroup},
        multiselect:    {value: multiselect},
        image:          {value: image},
        audio:          {value: audio},
        button:         {value: button}
    });
    var atomic  = { viewAdapterFactory: viewAdapterFactory, observer: observer };
    if (typeof customizeControlTypes === "function")    customizeControlTypes(controlTypes, atomic);
    return atomic;
});}();
!function(window, document)
{"use strict";root.define("atomic.launch", function launch(viewElement, controlsOrAdapter, callback)
{
    root.atomic.ready(function(atomic)
    {
        var adapter = atomic.viewAdapterFactory.launch(viewElement, controlsOrAdapter, callback);
    });
});}(window, document);
!function(window, document)
{
    "use strict";
    var atomic;
    root.define("atomic.ready", function ready(callback)
    {
        var deferOrExecute  =
        function()
        {
            if (atomic === undefined)   atomic  = root.atomic.html.compositionRoot();
            if (typeof callback === "function") callback(atomic);
        }
        if (document.readyState !== "complete") window.addEventListener("load", deferOrExecute);
        else                                    deferOrExecute();
    });
}(window, document);