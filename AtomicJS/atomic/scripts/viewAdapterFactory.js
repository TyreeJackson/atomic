!function()
{
    root.define
    (
        "atomic.viewAdapterFactorySupport",
        function(attachViewMemberAdapters, initializeViewAdapter, querySelector, pubSub)
        {
     return {
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
                    viewAdapter.__controlKeys   = [];
                    viewAdapter.controls        = {};
                    for(var controlKey in controlDeclarations)
                    {
                        viewAdapter.__controlKeys.push(controlKey);
                        var controlDeclaration              = controlDeclarations[controlKey];
                        viewAdapter.controls[controlKey]    = this.create(controlDeclaration.viewAdapter||function(){ return controlDeclaration; }, querySelector(viewElement, (controlDeclaration.selector||("#"+controlKey))));
                        initializeViewAdapter(viewAdapter.controls[controlKey], controlDeclaration)
                    }
                },
                create:
                function createViewAdapter(viewAdapterDefinitionConstructor, viewElement)
                {
                    var viewAdapter             = {__element: viewElement};
                    var viewAdapterDefinition   = new viewAdapterDefinitionConstructor(viewAdapter);
                    this.attachControls(viewAdapter, viewAdapterDefinition.controls, viewElement);
                    attachViewMemberAdapters(viewAdapter);
                    this.addEvents(viewAdapter, viewAdapterDefinition.events);
                    this.addCustomMembers(viewAdapter, viewAdapterDefinition.members);
                    if(viewAdapter.construct)   viewAdapter.construct(viewAdapter);
                    return viewAdapter;
                }
            };
        }
    );
    root.define
    (
        "atomic.viewAdapterFactory",
        function(internalFunctions)
        {
     return {
                create: function createViewAdapter(viewAdapterDefinitionConstructor, viewElement) { return internalFunctions.create(viewAdapterDefinitionConstructor, viewElement); }
            };
        }
    );
}();