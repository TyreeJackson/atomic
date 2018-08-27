!function(){"use strict";root.define("atomic.html.viewAdapterFactory", function htmlViewAdapterFactory(document, controlTypes, pubSub, logger, each)
{
    var viewAdapterFactory  =
    {
        create:         function create(options)
        {
            var selector                = options.selector || (options.viewElement.id?("#"+options.viewElement.id):("."+options.viewElement.className));
            if (controlTypes[options.controlType] === undefined)    debugger;

            var viewAdapter             = new controlTypes[options.controlType](options.viewElement, selector, options.parent, options.bindPath, options.controlKey, options.protoControlKey);

            viewAdapter.frame(new options.definitionConstructor(viewAdapter));
            if (typeof options.preConstruct === "function") options.preConstruct.call(viewAdapter);
            if(viewAdapter.construct)   viewAdapter.construct.call(viewAdapter);
            return viewAdapter;
        },
        createView:     function createView(definitionConstructor, viewElement)
        {
            var adapter = this.create
            ({
                definitionConstructor:  typeof definitionConstructor !== "function" ? function(appViewAdapter){return {controls: definitionConstructor}; } : definitionConstructor,
                viewElement:            viewElement,
                parent:                 undefined,
                selector:               undefined,
                controlKey:             undefined,
                protoControlKey:        undefined,
                controlType:            "screen",
                bindPath:               ""
            });
            return adapter;
        },
        createFactory:  function createFactory(definitionConstructor, viewElementTemplate)
        {
            if (typeof viewElementTemplate === "string")    viewElementTemplate = document.querySelector(viewElementTemplate);
            viewElementTemplate.parentNode.removeChild(viewElementTemplate);
            var factory = (function(parent, containerElement, selector, controlKey, protoControlKey, bindPath)
            {
                var container                       = parent;
                var viewElement                     = viewElementTemplate.cloneNode(true);
                if (containerElement !== undefined)
                {
                    container                       = this.create
                    ({
                        definitionConstructor:  function(){return {};}, 
                        viewElement:            containerElement,
                        parent:                 parent,
                        selector:               selector,
                        controlKey:             controlKey,
                        protoControlKey:        protoControlKey,
                        controlType:            "panel",
                        bindPath:               bindPath
                    });
                    containerElement.innerHTML   = "";
                    containerElement.appendChild(viewElement);
                }
                else                                parent.__setViewData("appendChild", viewElement);

                var view                            = this.create
                ({
                    definitionConstructor:  typeof definitionConstructor !== "function" ? function(control){return definitionConstructor} : function(control){return definitionConstructor(control, factory);},
                    viewElement:            viewElement,
                    parent:                 container,
                    selector:               selector,
                    controlKey:             controlKey,
                    protoControlKey:        protoControlKey,
                    controlType:            "composite",
                    bindPath:               bindPath
                });
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
            if (callback === undefined)             callback    = function(adapter){adapter.__getData()("", {});};
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