﻿!function()
{"use strict";root.define("atomic.tests.observer_integration", function observerIntegrationTests(ion, mock)
{return{
    __setupSuite:
    function()
    {
        var isolatedFunctionFactory = new root.atomic.html.isolatedFunctionFactory(document);
        var pathParserFactory       = new root.atomic.pathParserFactory(new root.atomic.tokenizer());
        var pathParser              = new pathParserFactory.parser(new root.atomic.lexer(new root.atomic.scanner(), pathParserFactory.getTokenizers(), root.utilities.removeFromArray));
        this.observer               = new root.atomic.observerFactory(root.utilities.removeFromArray, isolatedFunctionFactory, root.utilities.each, pathParser);
    },
    When_changing_a_value_in_an_observer_listeners_are_notified:
    function()
    {
        var mainAddressId   = faker.random.uuid();
        var dataObject      = new this.observer
        ({
            data:
            {
                person:
                {
                    firstName:              faker.name.firstName(),
                    lastName:               faker.name.lastName(),
                    mainAddressId:          mainAddressId,
                    primaryPhoneType:       "home",
                    addresses:
                    [
                        {
                            id:             faker.random.uuid(),
                            addressLine1:   faker.address.streetAddress(3)
                        },
                        {
                            id:             mainAddressId,
                            addressLine1:   faker.address.streetAddress(3)
                        }
                    ],
                    phonesByType:
                    {
                        main:   {number: faker.phone.phoneNumberFormat()},
                        home:   {number: faker.phone.phoneNumberFormat()}
                    },
                    emailAddressesByType:
                    {
                        main:   {address: faker.internet.email()},
                        home:   {address: faker.internet.email()}
                    }
                }
            }
        });
        var person                      = dataObject("data.person");
        var newFirstName                = faker.name.firstName();
        var newHomePhoneNumber          = faker.phone.phoneNumberFormat();
        var firstNameUpdate;
        var primaryPhoneNumberUpdates   = [];
        person.listen(function(value){firstNameUpdate = person("firstName");})
        person.listen(function(value){var number = person("phonesByType[primaryPhoneType].number"); if (value!=undefined) primaryPhoneNumberUpdates.push(number);});
        person("firstName", newFirstName);
        person("phonesByType.home.number", newHomePhoneNumber);
        person("primaryPhoneType", "main");
        ion.assert(newFirstName === firstNameUpdate,                                    "The first name should have been updated to " + newFirstName + " but was set to " + firstNameUpdate + ".");
        ion.assert(primaryPhoneNumberUpdates[0] === newHomePhoneNumber,                 "The first primary phone number change should have been equal to " + newHomePhoneNumber + " but was set to " + primaryPhoneNumberUpdates[0] + ".");
        ion.assert(primaryPhoneNumberUpdates[1] === person("phonesByType.main.number"), "The second primary phone number change should have been equal to " + person.peek("phonesByType.main.number") + " but was set to " + primaryPhoneNumberUpdates[1] + ".");
    }
};});}();