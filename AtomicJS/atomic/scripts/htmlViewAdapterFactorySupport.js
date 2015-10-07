/*
outstanding issues:
support string key paths in observable
*/
!function()
{"use strict";root.define("atomic.htmlViewAdapterFactorySupport",
function htmlViewAdapterFactorySupport(document, attachViewMemberAdapters, initializeViewAdapter, pubSub)
{
    var querySelector       =
    function(uiElement, selector)
    {
        var element = uiElement.querySelector(selector);
        if (element === null)   throw new Error("Element for selector " + selector + " was not found in " + (uiElement.id?("#"+uiElement.id):("."+uiElement.className)));
        element.removeAttribute("id");
        return element;
    };
    function removeAllElementChildren(element)
    {
        while(element.lastChild)    element.removeChild(element.lastChild);
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
            viewAdapter.__controlKeys   = [];
            viewAdapter.controls        = {};
            for(var controlKey in controlDeclarations)
            {
                viewAdapter.__controlKeys.push(controlKey);
                viewAdapter.controls[controlKey] = this.createControl(controlDeclarations[controlKey], querySelector(viewElement, (controlDeclarations[controlKey].selector||("#"+controlKey))), viewAdapter);
            }
        },
        createControl:
        function(controlDeclaration, controlElement, parent)
        {
            var control = this.create(controlDeclaration.viewAdapter||function(){ return controlDeclaration; }, controlElement, parent);
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
            function(templateKey)
            {
                var templateElement = this.__templateElements[templateKey];
                return { getKey: templateElement.declaration.getKey, parent: templateElement.parent, control: internalFunctions.createControl(templateElement.declaration, templateElement.element.cloneNode(true), viewAdapter) };
            };
            for(var templateKey in templateDeclarations)
            {
                viewAdapter.__templateKeys.push(templateKey);
                var templateDeclaration                         = templateDeclarations[templateKey];
                var templateElement                             = querySelector(viewElement, (templateDeclaration.selector||("#"+templateKey)));
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
        function createViewAdapter(viewAdapterDefinitionConstructor, viewElement, parent)
        {
            var viewAdapter             = {__element: viewElement, parent: parent};
            var viewAdapterDefinition   = new viewAdapterDefinitionConstructor(viewAdapter);
            this.attachControls(viewAdapter, viewAdapterDefinition.controls, viewElement);
            this.extractDeferredControls(viewAdapter, viewAdapterDefinition.repeat, viewElement);
            attachViewMemberAdapters(viewAdapter);
            this.addEvents(viewAdapter, viewAdapterDefinition.events);
            this.addCustomMembers(viewAdapter, viewAdapterDefinition.members);
            if(viewAdapter.construct)   viewAdapter.construct(viewAdapter);
            return viewAdapter;
        }
    };
    return internalFunctions;
});}();