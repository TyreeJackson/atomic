!function()
{"use strict";root.define("atomic.html.viewAdapterFactory", function htmlViewAdapterFactory(document, controlTypes, pubSub, logger, each, observer)
{
    var viewAdapterFactory  =
    {
        create:         function createViewAdapter(viewAdapterDefinitionConstructor, viewElement, parent, selector, controlType)
        {
            selector                    = selector || (viewElement.id?("#"+viewElement.id):("."+viewElement.className));
            if (controlTypes[controlType] === undefined)    debugger;
            var viewAdapter             = new controlTypes[controlType](viewElement, selector, parent);
            viewAdapter.init(new viewAdapterDefinitionConstructor(viewAdapter));
            if(viewAdapter.construct)   viewAdapter.construct.call(viewAdapter);
            return viewAdapter;
        },
        createView:     function(viewAdapterDefinitionConstructor, viewElement)
        {
            var adapter = this.create
            (
                typeof viewAdapterDefinitionConstructor !== "function"
                ?   function(appViewAdapter){return {controls: viewAdapterDefinitionConstructor}; }
                :   viewAdapterDefinitionConstructor,
                viewElement,
                undefined,
                undefined,
                "panel"
            );
            adapter.data    = new observer({});
            return adapter;
        },
        createFactory:  function createFactory(viewAdapterDefinitionConstructor, viewElementTemplate)
        {
            if (typeof viewElementTemplate === "string")    viewElementTemplate = document.querySelector(viewElementTemplate);
            viewElementTemplate.parentNode.removeChild(viewElementTemplate);
            return (function(parent, containerElement, selector)
            {
                var container                       = parent;
                var viewElement                     = viewElementTemplate.cloneNode(true);
                if (containerElement !== undefined)
                {
                    container                       = this.create(function(){return {};}, containerElement, parent, selector, "composite");
                    container.__element.innerHTML   = "";
                    container.__element.appendChild(viewElement);
                }
                else                                parent.__element.appendChild(viewElement);
                var view                            = this.create
                (
                    typeof viewAdapterDefinitionConstructor !== "function"
                    ?   function(control){return viewAdapterDefinitionConstructor}
                    :   viewAdapterDefinitionConstructor,
                    viewElement,
                    container,
                    selector,
                    "composite"
                );
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
            if (typeof callback === "function") callback(adapter);
            return adapter;
        },
        select:         function(uiElement, selector, selectorPath)
        {
            var element = uiElement.querySelector(selector)||undefined;
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