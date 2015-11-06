/*
outstanding issues:
support string key paths in observable
*/
!function()
{"use strict";root.define("atomic.htmlViewAdapterFactorySupport",
function htmlViewAdapterFactorySupport(document, attachViewMemberAdapters, initializeViewAdapter, pubSub, logger)
{
    var typeHintMap         = {};
    var missingElements;
    var querySelector       =
    function(uiElement, selector, selectorPath, typeHint)
    {
        var element = uiElement.querySelector(selector);
        if (element === null)
        {
            logger("Element for selector " + selector + " was not found in " + (uiElement.id?("#"+uiElement.id):("."+uiElement.className)));
            element                 = document.createElement(typeHint!==undefined?(typeHintMap[typeHint]||typeHint):"div");
            var label               = document.createElement("span");
            label.innerHTML         = (selectorPath||"") + "-" + selector + ":";
            var container           = document.createElement("div");
            missingElements         = missingElements||createMissingElementsContainer();
            container.appendChild(element);
            missingElements.appendChild(label);
            missingElements.appendChild(container);
            element.style.border    = "solid 1px black";
        }
        return element;
    };
    function createMissingElementsContainer()
    {
        var missingElements = document.createElement("div");
        document.body.appendChild(missingElements);
        return missingElements;
    }
    function removeAllElementChildren(element)
    {
        while(element.lastChild)    element.removeChild(element.lastChild);
    }
    function getSelectorPath(viewAdapter)
    {
        return viewAdapter === undefined ? "" : getSelectorPath(viewAdapter.parent) + "-" + (viewAdapter.__selector||"root");
    }
    var internalFunctions   =
    {
        addEvents:
        function(viewAdapter, eventNames)
        {
            viewAdapter.on  = {};
            if (eventNames)
            for(var eventNameCounter=0;eventNameCounter<eventNames.length;eventNameCounter++)   viewAdapter.on[eventNames[eventNameCounter]]   = new pubSub();
        },
        addCustomMembers:
        function(viewAdapter, members)
        {
            for(var memberKey in members) viewAdapter[memberKey]    = members[memberKey].bind(viewAdapter);
        },
        attachControls:
        function (viewAdapter, controlDeclarations, viewElement)
        {
            if (controlDeclarations === undefined)  return;
            var selectorPath            = getSelectorPath(viewAdapter);
            viewAdapter.__controlKeys   = [];
            viewAdapter.controls        = {};
            for(var controlKey in controlDeclarations)
            {
                viewAdapter.__controlKeys.push(controlKey);
                var declaration = controlDeclarations[controlKey];
                var selector    = (declaration.selector||("#"+controlKey));
                viewAdapter.controls[controlKey] = this.createControl(declaration, querySelector(viewElement, selector, selectorPath), viewAdapter, selector);
            }
        },
        createControl:
        function(controlDeclaration, controlElement, parent, selector)
        {
            var control;
            if (controlDeclaration.factory !== undefined)
            {
                control = controlDeclaration.factory(parent, controlElement, selector);
            }
            else    control = this.create(controlDeclaration.adapter||function(){ return controlDeclaration; }, controlElement, parent, selector);
            initializeViewAdapter(control, controlDeclaration);
            return control;
        },
        extractDeferredControls:
        function(viewAdapter, templateDeclarations, viewElement)
        {
            if (templateDeclarations === undefined) return;
            viewAdapter.__templateKeys          = [];
            viewAdapter.__templateElements      = {};
            viewAdapter.__createTemplateCopy    =
            function(templateKey, subDataItem)
            {
                var templateElement = this.__templateElements[templateKey];
                var key             = templateElement.declaration.getKey(subDataItem);
                var elementCopy     = templateElement.element.cloneNode(true);
                elementCopy.setAttribute("id", key);
                return { key: key, parent: templateElement.parent, control: internalFunctions.createControl(templateElement.declaration, elementCopy, viewAdapter, "#" + key) };
            };
            for(var templateKey in templateDeclarations)
            {
                viewAdapter.__templateKeys.push(templateKey);
                var templateDeclaration                         = templateDeclarations[templateKey];
                var templateElement                             = querySelector(viewElement, (templateDeclaration.selector||("#"+templateKey)), getSelectorPath(viewAdapter));
                var templateElementParent                       = templateElement.parentNode;
                templateElementParent.removeChild(templateElement);
                viewAdapter.__templateElements[templateKey]     =
                {
                    parent:         templateElementParent,
                    declaration:    templateDeclaration,
                    element:        templateElement
                };
            }
            for(var templateKey in templateDeclarations)
            removeAllElementChildren(viewAdapter.__templateElements[templateKey].parent);
        },
        create:
        function createViewAdapter(viewAdapterDefinitionConstructor, viewElement, parent, selector)
        {
            var viewAdapter             = {__element: viewElement, __selector: selector, parent: parent};
            var viewAdapterDefinition   = new viewAdapterDefinitionConstructor(viewAdapter);
            this.attachControls(viewAdapter, viewAdapterDefinition.controls, viewElement);
            this.extractDeferredControls(viewAdapter, viewAdapterDefinition.repeat, viewElement);
            attachViewMemberAdapters(viewAdapter, viewAdapterDefinition.customAttachments, viewAdapterDefinition);
            this.addEvents(viewAdapter, viewAdapterDefinition.events);
            this.addCustomMembers(viewAdapter, viewAdapterDefinition.members);
            if(viewAdapter.construct)   viewAdapter.construct(viewAdapter);
            return viewAdapter;
        }
    };
    return internalFunctions;
});}();
