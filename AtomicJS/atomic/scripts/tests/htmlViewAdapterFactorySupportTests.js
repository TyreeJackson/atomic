!function()
{"use strict";root.define("atomic.tests.htmlViewAdapterFactorySupport",
function htmlViewAdapterFactorySupport(mock)
{
return{
        __setup:
        function()
        {
            this.mockPubSub = new mock("pubSub");
        },
        When_calling_addEvents_an_on_property_should_be_added_to_the_viewAdapter_when_it_does_not_already_exist:
        function()
        {
            var factorySupport  = new root.atomic.htmlViewAdapterFactorySupport(null, null, null, this.mockPubSub.object);
            mock.assert.fail();
        },
        When_calling_addEvents_an_on_property_should_not_be_replaced_on_the_viewAdapter_when_it_does_already_exist:
        function()
        {
            mock.assert.fail();
        },
        When_calling_addEvents_a_new_event_should_be_added_to_the_on_property_of_the_viewAdapter_for_each_eventName_specified:
        function()
        {
            mock.assert.fail();
        }
    };
});}();