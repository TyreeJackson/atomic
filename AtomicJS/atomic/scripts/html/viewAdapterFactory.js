!function()
{"use strict";root.define("atomic.html.viewAdapterFactory", function htmlViewAdapterFactory(document, controlTypes, initializeViewAdapter, pubSub, logger, each, observer)
{
    var missingElements;
    var elementControlTypes =
    {
        "input":                    "input",
        "input:checkbox":           "checkbox",
        "textarea":                 "input",
        "img":                      "image",
        "select:select-multiple":   "multiselect",
        "select:select-one":        "select",
        "radiogroup":               "radiogroup"
    };
    each(["default","a","abbr","address","article","aside","b","bdi","blockquote","body","caption","cite","code","col","colgroup","dd","del","details","dfn","dialog","div","dl","dt","em","fieldset","figcaption","figure","footer","h1","h2","h3","h4","h5","h6","header","i","ins","kbd","label","legend","li","menu","main","mark","menuitem","meter","nav","ol","optgroup","p","pre","q","rp","rt","ruby","section","s","samp","small","span","strong","sub","summary","sup","table","tbody","td","tfoot","th","thead","time","title","tr","u","ul","wbr"],
    function(name)
    {
        elementControlTypes[name]   = "readonly";
    });
    function getControlTypeForElement(definition, element)
    {
        return  definition.type
                ||
                (definition.controls || definition.adapter
                ?   "panel"
                :   definition.repeat
                    ?   "repeater"
                    :   element !== undefined
                        ?   elementControlTypes[element.nodeName.toLowerCase() + (element.type ? ":" + element.type.toLowerCase() : "")]||elementControlTypes[element.nodeName.toLowerCase()]||elementControlTypes.default
                        :   elementControlTypes.default);
    }
    var viewAdapterFactory  =
    {
        createControl:  function(controlDeclaration, controlElement, parent, selector)
        {
            var control;
            if (controlDeclaration.factory !== undefined)
            {
                control = controlDeclaration.factory(controlElement, selector, parent);
            }
            else    control = this.create(controlDeclaration.adapter||function(){ return controlDeclaration; }, controlElement, parent, selector, getControlTypeForElement(controlDeclaration, controlElement));
            initializeViewAdapter(control, controlDeclaration);
            return control;
        },
        create:         function createViewAdapter(viewAdapterDefinitionConstructor, viewElement, parent, selector, controlType)
        {
            selector                    = selector || (viewElement.id?("#"+viewElement.id):("."+viewElement.className));
            if (controlTypes[controlType] === undefined)    debugger;
            var viewAdapter             = new controlTypes[controlType](viewElement, selector, parent);
            viewAdapter.init(new viewAdapterDefinitionConstructor(viewAdapter));
            if(viewAdapter.construct)   viewAdapter.construct(viewAdapter);
            return viewAdapter;
        },
        createView:     function(viewAdapterDefinitionConstructor, viewElement)
        {
            return this.create
            (
                typeof viewAdapterDefinitionConstructor !== "function"
                ?   function(appViewAdapter){return {controls: viewAdapterDefinitionConstructor}; }
                :   viewAdapterDefinitionConstructor,
                viewElement,
                undefined,
                undefined,
                "panel"
            );
        },
        createFactory:  function createFactory(viewAdapterDefinitionConstructor, viewElementTemplate)
        {
            if (typeof viewElementTemplate === "string")    viewElementTemplate = document.querySelector(viewElementTemplate);
            viewElementTemplate.parentNode.removeChild(viewElementTemplate);
            return (function(containerElement, selector, parent)
            {
                var container   = parent;
                if (containerElement !== undefined)
                {
                    container                       = viewAdapterFactory.create(function(){return {};}, containerElement, parent, selector, "composite");
                    container.__element.innerHTML   = "";
                }
                var view                            = viewAdapterFactory.create
                (
                    typeof viewAdapterDefinitionConstructor !== "function"
                    ?   function(control){return viewAdapterDefinitionConstructor}
                    :   viewAdapterDefinitionConstructor,
                    viewElementTemplate.cloneNode(true),
                    container,
                    selector,
                    "composite"
                );
                container.appendControl(view);
                return view;
            }).bind(this);
        },
        launch:         function(viewElement, controlsOrAdapter, callback)
        {
            if (controlsOrAdapter === undefined)
            {
                controlsOrAdapter   = viewElement;
                viewElement         = document.body;
            }
            var adapter =
            this.createView
            (
                controlsOrAdapter, 
                typeof viewElement === "string" ? document.querySelector(viewElement) : viewElement||document.body
            );
            adapter.data    = new observer({});
            if (typeof callback === "function") callback(adapter);
            return adapter;
        },
        select:         function(uiElement, selector, selectorPath)
        {
            return uiElement.querySelector(selector)||undefined;
            if (element === null)
            {
                logger("Element for selector " + selector + " was not found in " + (uiElement.id?("#"+uiElement.id):("."+uiElement.className)));
                var element             = document.createElement("div");
                uiElement.appendChild(element);
                element.style.border    = "solid 2px red";
                element[selector.substr(0,1)==="#"?"id":"className"]    = selector.substr(1);
                element.setAttribute("data-missing", "true");
            }
            element.__selectorPath  = selectorPath;
            return element;
        },
        selectAll:      function(uiElement, selector, selectorPath, typeHint)
        {
            return uiElement.querySelectorAll(selector);
        }
    };
    return viewAdapterFactory;
});}();