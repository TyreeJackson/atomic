!function()
{"use strict";root.define("atomic.viewAdapterFactory", function(internalFunctions)
{
return {
        create:         function createViewAdapter(viewAdapterDefinitionConstructor, viewElement, parent) { return internalFunctions.create(viewAdapterDefinitionConstructor, viewElement, parent, (viewElement.id?("#"+viewElement.id):("."+viewElement.className))); },
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
        }
    };
});}();