!function()
{"use strict";root.define("atomic.tests.viewAdapterFactory",
function viewAdapterFactoryTests(mock, logger, viewAdapterFactoryModule)
{
    var tests   =
    {
        When_calling_the_create_method_of_the_viewAdapterFactory_the_create_method_of_the_internalFunctions_should_be_called:
        function()
        {
            
            var mockInternalFunctions       = new mock("internalFunctions");
            var mockViewAdapterDefinition   = new mock("viewAdapterDefinition");
            var mockViewElement             = new mock("viewElement");
            var mockParent                  = new mock("parent");
            var mockViewAdapter             = new mock("viewAdapter");
            mockInternalFunctions.setup(internalFunctions => internalFunctions.create(mock.IsAny, mock.IsAny, mock.IsAny)).returns(mockViewAdapter.object);
            var viewAdapterFactory  = new viewAdapterFactoryModule(mockInternalFunctions.object);
            var viewAdapter         = viewAdapterFactory.create(mockViewAdapterDefinition.object, mockViewElement.object, mockParent.object);
            mockInternalFunctions.verify(internalFunctions => internalFunctions.create(mockViewAdapterDefinition.object, mockViewElement.object, mockParent.object), mock.times.once());
        }
    };
    return { execute: function(){mock.execute(tests, logger);}};
});}();