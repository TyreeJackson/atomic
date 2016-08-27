!function()
{"use strict";root.define("atomic.html.viewAdapterFactory", function htmlViewAdapterFactory(document, controlTypes, initializeViewAdapter, pubSub, logger, each)
{
    var missingElements;
    var elementControlTypes =
    {
        "input":                    "input",
        "input:checkbox":           "checkbox",
        "textarea":                 "input",
        "img":                      "panel",
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
        return  definition.controls
                ?   "panel"
                :   definition.repeat
                    ?   "repeater"
                    :   elementControlTypes[element.nodeName.toLowerCase() + (element.type ? ":" + element.type.toLowerCase() : "")]||elementControlTypes[element.nodeName.toLowerCase()]||elementControlTypes.default;
    }
    var viewAdapterFactory  =
    {
        createControl:  function(controlDeclaration, controlElement, parent, selector)
        {
            var control;
            if (controlDeclaration.factory !== undefined)
            {
                control = controlDeclaration.factory(parent, controlElement, selector);
            }
            else    control = this.create(controlDeclaration.adapter||function(){ return controlDeclaration; }, controlElement||viewAdapterFactory.select(parent.__element, (controlDeclaration.selector||("#"+controlKey)), parent.getSelectorPath()), parent, selector, controlDeclaration.type);
            initializeViewAdapter(control, controlDeclaration);
            return control;
        },
        create:         function createViewAdapter(viewAdapterDefinitionConstructor, viewElement, parent, selector, controlType)
        {
            selector                    = selector || (viewElement.id?("#"+viewElement.id):("."+viewElement.className));
            var viewAdapterDefinition   = new viewAdapterDefinitionConstructor();
            controlType                 = controlType || getControlTypeForElement(viewAdapterDefinition, viewElement);
            var viewAdapter             = new controlTypes[controlType](viewElement, selector, parent);
            viewAdapter.init(viewAdapterDefinition);
            if(viewAdapter.construct)   viewAdapter.construct(viewAdapter);
            return viewAdapter;
        },
        createFactory:  function createFactory(viewAdapterDefinitionConstructor, viewElementTemplate, selector)
        {
            viewElementTemplate.parentNode.removeChild(viewElementTemplate);
            return (function(parent, containerElement, containerSelector)
            {
                var container   = parent;
                if (containerElement !== undefined)
                {
                    container                       = internalFunctions.create(function(){return {};}, containerElement, parent, selector);
                    container.__element.innerHTML   = "";
                }
                var view                            = internalFunctions.create(viewAdapterDefinitionConstructor, viewElementTemplate.cloneNode(true), container, selector);
                container.appendControl(view);
                return view;
            }).bind(this);
        },
        select:         function(uiElement, selector, selectorPath)
        {
            var element = uiElement.querySelector(selector);
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