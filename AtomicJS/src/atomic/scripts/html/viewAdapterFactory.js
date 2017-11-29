!function()
{"use strict";root.define("atomic.html.viewAdapterFactory", function htmlViewAdapterFactory(document, controlTypes, pubSub, logger, each, observer)
{
    var viewAdapterFactory  =
    {
        create:         function createViewAdapter(viewAdapterDefinitionConstructor, viewElement, parent, selector, controlType, preConstruct)
        {
            selector                    = selector || (viewElement.id?("#"+viewElement.id):("."+viewElement.className));
            if (controlTypes[controlType] === undefined)    debugger;
            var viewAdapter             = new controlTypes[controlType](viewElement, selector, parent);
            viewAdapter.init(new viewAdapterDefinitionConstructor(viewAdapter));
            if (typeof preConstruct === "function") preConstruct.call(viewAdapter);
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
                "panel",
                function(){this.data = new observer({});}
            );
            return adapter;
        },
        createFactory:  function createFactory(viewAdapterDefinitionConstructor, viewElementTemplate)
        {
            if (typeof viewElementTemplate === "string")    viewElementTemplate = document.querySelector(viewElementTemplate);
            viewElementTemplate.parentNode.removeChild(viewElementTemplate);
            var factory = (function(parent, containerElement, selector)
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
                    :   function(control){return viewAdapterDefinitionConstructor(control, factory);},
                    viewElement,
                    container,
                    selector,
                    "composite"
                );
                return view;
            }).bind(this);
            return factory;
        },
        launch:         function(viewElement, controlsOrAdapter, callback)
        {
            var argsLength  = callback === undefined ? controlsOrAdapter === undefined ? viewElement === undefined ? 0 : 1 : 2 : 3;
            if (argsLength === 0) return;
            if (argsLength === 1 || (argsLength === 2 && (typeof controlsOrAdapter === "function"||(typeof viewElement === "object" && typeof controlsOrAdapter === "object"))))
            {
                callback            = controlsOrAdapter;
                controlsOrAdapter   = viewElement;
                viewElement         = document.body;
            }
            if (callback === undefined)             callback    = function(adapter){adapter.data("", {});};
            else if(typeof callback === "object")   callback    = (function(data){return function(adapter){adapter.data("", data);};})(callback);
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