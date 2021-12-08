!function(){"use strict";root.define("atomic.html.viewAdapterFactory", function htmlViewAdapterFactory(document, controlTypes, pubSub, logger, reflect)
{
    function loadACU(url, controlUnitFullName, callback)
    {
        var callbackExecuted        = false;
        function executeCallback()
        {
            if (callbackExecuted)   return;
            callbackExecuted    = true;
            callback(root.get(controlUnitFullName));
        }
        var script                  = document.createElement('script');
        script.src                  = url;
        script.onload               = executeCallback;
        script.onreadystatechange   = executeCallback;
    
        document.body.appendChild(script);
    };
    function loadACView(controlDefinition)
    {
        if (typeof controlDefinition.constructor !== "function") throw new Error("Failed to load remote Atomic control unit.");
        var cssElement          = document.createElement("style");
        cssElement.innerHTML    = controlDefinition.css;
        document.body.appendChild(cssElement);
        var viewElement         = document.createElement("div");
        viewElement.innerHTML   = controlDefinition.html;
        return viewElement.querySelector(controlDefinition.selector);
    }
    var dynamicControlUnits = {};
    var viewAdapterFactory  =
    {
        create:             function create(options)
        {
            var selector                = options.selector || (options.viewElement.id?("#"+options.viewElement.id):("."+options.viewElement.className));
            if (controlTypes[options.controlType] === undefined)    debugger;

            var viewAdapter             = new controlTypes[options.controlType](options.viewElement, selector, options.parent, options.bindPath, options.controlKey, options.protoControlKey);
            var controlDefinition       = new options.definitionConstructor(viewAdapter);
            viewAdapter.frame(controlDefinition, options.initializerDefinition||controlDefinition);
            viewAdapter.initialize(options.initializerDefinition||controlDefinition, controlDefinition);
            if (typeof options.preConstruct === "function") options.preConstruct.call(viewAdapter);
            if(viewAdapter.construct)   viewAdapter.construct.call(viewAdapter);
            return viewAdapter;
        },
        createView:         function createView(definitionConstructor, viewElement)
        {
            var adapter = this.create
            ({
                definitionConstructor:  typeof definitionConstructor !== "function" ? function(appViewAdapter){return {controls: definitionConstructor}; } : definitionConstructor,
                initializerDefinition:  {},
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
        createFactory:      function createFactory(definitionConstructor, viewElementTemplate)
        {
            if (typeof viewElementTemplate === "string")    viewElementTemplate = document.querySelector(viewElementTemplate);
            viewElementTemplate.parentNode.removeChild(viewElementTemplate);
            var factory = (function(parent, containerElement, selector, controlKey, protoControlKey, bindPath, initializerDefinition)
            {
                var container                       = parent;
                var viewElement                     = viewElementTemplate.cloneNode(true);
                if (containerElement !== undefined)
                {
                    if (initializerDefinition.replaceElement)   containerElement.parentNode.replaceChild(viewElement, containerElement);
                    else
                    {
                        container                       = this.create
                        ({
                            definitionConstructor:  function(){return {};}, 
                            initializerDefinition:  {},
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
                }
                else                                parent.__setViewData("appendChild", viewElement);

                var view                            = this.create
                ({
                    definitionConstructor:  typeof definitionConstructor !== "function" ? function(control){return definitionConstructor} : function(control){return definitionConstructor(control, factory);},
                    initializerDefinition:  initializerDefinition,
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
        launch:             function(viewElement, controlsOrAdapter, callback)
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
            else if(callback.isObserver)            callback    = (function(data){return function(adapter){adapter.__setData(data);};})(callback);
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
        loadView:           function(controlUnitUrl, controlUnitFullName, constructorArguments, callback)
        {
            loadACU(controlUnitUrl, controlUnitFullName, (function(controlDefinition){ callback(this.createView(controlDefinition.constructor.apply(null, constructorArguments), loadACView(controlDefinition))); }).bind(this));
        },
        loadControlFactory: function(controlUnitUrl, controlUnitFullName, constructorArguments, callback)
        {
            if (dynamicControlUnits[controlUnitFullName] !== undefined) return callback(dynamicControlUnits[controlUnitFullName]);
            loadACU(controlUnitUrl, controlUnitFullName, (function(controlDefinition){callback(dynamicControlUnits[controlUnitFullName] = this.createFactory(controlDefinition.constructor.apply(null, constructorArguments), loadACView(controlDefinition))); }).bind(this));
        },
        select:             function(uiElement, selector, selectorPath)
        {
            var element = uiElement.querySelector(selector)||undefined;
            element.__selectorPath  = selectorPath;
            return element;
        },
        selectAll:          function(uiElement, selector, selectorPath, typeHint)
        {
            return uiElement.querySelectorAll(selector);
        }
    };
    return viewAdapterFactory;
});}();