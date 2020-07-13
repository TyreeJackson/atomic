!function(){"use strict";root.define("atomic.html.compositionRoot", function htmlCompositionRoot(customizeControlTypes, debugInfoObserver)
{
    var reflect                 = root.utilities.reflect;
    var isolatedFunctionFactory = new root.atomic.html.isolatedFunctionFactory(document);
    var pathParserFactory       = new root.atomic.pathParserFactory(new root.atomic.tokenizer());
    var pathParser              = new pathParserFactory.parser(new root.atomic.lexer(new root.atomic.scanner(), pathParserFactory.getTokenizers(), root.utilities.removeFromArray));
    var observer                = new root.atomic.observerFactory(root.utilities.removeFromArray, isolatedFunctionFactory, reflect, pathParser);
    if (debugInfoObserver === true) debugInfoObserver = new observer({__controlIndex:[], __controls:{}});

    var pubSub                  = new root.utilities.pubSub(isolatedFunctionFactory, root.utilities.removeItemFromArray);
    var defineDataProperties    = new root.atomic.defineDataProperties(isolatedFunctionFactory, reflect, pubSub);
    var dataBinder              = new root.atomic.dataBinder(reflect, root.utilities.removeItemFromArray, defineDataProperties);
    var eventsSet               = new root.atomic.html.eventsSet(pubSub, reflect);
    var controlTypes            = {};
    var viewAdapterFactory      =   new root.atomic.html.viewAdapterFactory
                                    (
                                        document,
                                        controlTypes,
                                        pubSub,
                                        function(message){console.log(message);},
                                        reflect
                                    );

    var control                 = new root.atomic.html.control(document, root.utilities.removeItemFromArray, window.setTimeout, reflect, eventsSet, dataBinder, debugInfoObserver);
    var readonly                = new root.atomic.html.readonly(control, reflect);
    var label                   = new root.atomic.html.label(readonly, reflect);
    var link                    = new root.atomic.html.link(readonly, reflect);
    var container               = new root.atomic.html.container(control, observer, reflect, viewAdapterFactory, root.utilities.removeItemFromArray);
    var panel                   = new root.atomic.html.panel(container, reflect);
    var screen                  = new root.atomic.html.screen(panel, observer);
    var linkPanel               = new root.atomic.html.link(panel, reflect);
    var composite               = new root.atomic.html.composite(container, reflect);
    var repeater                = new root.atomic.html.repeater(container, root.utilities.removeFromArray);
    var table                   = new root.atomic.html.table(container, root.utilities.removeFromArray);
    var input                   = new root.atomic.html.input(control);
    var checkbox                = new root.atomic.html.checkbox(control);
    var file                    = new root.atomic.html.file(control);
    var select                  = new root.atomic.html.select(input, dataBinder, reflect);
    var radiogroup              = new root.atomic.html.radiogroup(input, dataBinder, reflect);
    var checkboxgroup           = new root.atomic.html.checkboxgroup(input, dataBinder, reflect);
    var multiselect             = new root.atomic.html.multiselect(select);
    var image                   = new root.atomic.html.image(control);
    var audio                   = new root.atomic.html.audio(control);
    var video                   = new root.atomic.html.video(audio);
    var button                  = new root.atomic.html.button(control);
    var details                 = new root.atomic.html.details(panel, document);

    Object.defineProperties(controlTypes,
    {
        control:        {value: control},
        readonly:       {value: readonly},
        label:          {value: label},
        link:           {value: link},
        linkPanel:      {value: linkPanel},
        container:      {value: container},
        panel:          {value: panel},
        screen:         {value: screen},
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
        video:          {value: video},
        button:         {value: button},
        file:           {value: file},
        table:          {value: table},
        details:        {value: details}
    });
    var atomic  = { viewAdapterFactory: viewAdapterFactory, observer: observer, debugInfoObserver: debugInfoObserver };
    if (typeof customizeControlTypes === "function")    customizeControlTypes(controlTypes, atomic);
    return atomic;
});}();
!function(window, document)
{"use strict";
    var atomic;
    var atomicScript        = document.currentScript||document.getElementById("atomicjs")
    var debugInfoObserver;
    root.define("atomic.launch", function launch(viewElement, controlsOrAdapter, callback)
    {
        root.atomic.ready(function(atomic)
        {
            var adapter = atomic.viewAdapterFactory.launch(viewElement, controlsOrAdapter, callback);
        });
    });
    root.define("atomic.init", function(options)
    {
        debugInfoObserver   = (options&&options.debugInfoObserver)||debugInfoObserver;
    });
    root.define("atomic.ready", function ready(callback)
    {
        var deferOrExecute  =
        function()
        {
            if (atomic === undefined)   atomic  = root.atomic.html.compositionRoot(undefined, debugInfoObserver);
            if (typeof callback === "function") callback(atomic);
        }
        if (document.readyState !== "complete") window.addEventListener("load", deferOrExecute);
        else                                    deferOrExecute();
    });
    setTimeout(function(){root.atomic.ready(function(atomic)
    {
        if (atomicScript !== undefined && atomicScript !== null)
        {
            var controlName         = atomicScript.getAttribute("data-atomic-name");
            var hostSelector        = atomicScript.getAttribute("data-atomic-selector");
            var remoteControlUrl    = atomicScript.getAttribute("data-atomic-src");
            var hostElement         = document.querySelector(hostSelector)||document.body;
            if (controlName && hostSelector && remoteControlUrl)    atomic.viewAdapterFactory.loadView(remoteControlUrl, controlName, [], function(control) { hostElement.appendChild(control.__element); if (control && control.launch)  control.launch(); });
        }
    });}, 0);
}(window, document);