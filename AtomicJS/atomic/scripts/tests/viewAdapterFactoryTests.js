!function()
{"use strict";root.define("atomic.tests.viewAdapterFactory",
function viewAdapterFactoryTests(mock)
{
return{
        __setup:
        function()
        {
            this.mockInternalFunctions       = new mock("internalFunctions");
            this.mockViewAdapterDefinition   = new mock("viewAdapterDefinition");
            this.mockViewElement             = new mock("viewElement");
            this.mockParent                  = new mock("parent");
            this.mockViewAdapter             = new mock("viewAdapter");
        },
        When_calling_the_create_method_of_the_viewAdapterFactory_the_create_method_of_the_internalFunctions_should_be_called_with_the_arguments_specified:
        function()
        {
            this.mockInternalFunctions.setup(internalFunctions => internalFunctions.create(mock.IsAny, mock.IsAny, mock.IsAny)).returns(this.mockViewAdapter.object);
            var viewAdapterFactory          = new root.atomic.viewAdapterFactory(this.mockInternalFunctions.object);
            var viewAdapter                 = viewAdapterFactory.create(this.mockViewAdapterDefinition.object, this.mockViewElement.object, this.mockParent.object);
            this.mockInternalFunctions.verify(internalFunctions => internalFunctions.create(this.mockViewAdapterDefinition.object, this.mockViewElement.object, this.mockParent.object), mock.times.once());
        },
        The_create_method_of_the_viewAdapterFactory_should_return_the_value_returned_by_the_call_to_the_create_method_of_the_internalFunctions:
        function()
        {
            this.mockInternalFunctions.setup(internalFunctions => internalFunctions.create(mock.IsAny, mock.IsAny, mock.IsAny)).returns(this.mockViewAdapter.object);
            var viewAdapterFactory          = new root.atomic.viewAdapterFactory(this.mockInternalFunctions.object);
            var viewAdapter                 = viewAdapterFactory.create(this.mockViewAdapterDefinition.object, this.mockViewElement.object, this.mockParent.object);
            mock.assert.areEqual(this.mockViewAdapter.object, viewAdapter, "The viewAdapter returned was not expected.");
        }
    };
});}();