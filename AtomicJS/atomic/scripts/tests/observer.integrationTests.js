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
    },
    When_accessing_a_value_from_a_path_in_an_observer_if_the_path_is_defined_as_a_virtual_property_the_virtual_property_is_executed:
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
                            addressLine1:   faker.address.streetAddress(3),
                            addressLine2:   faker.address.secondaryAddress(),
                            city:           faker.address.city(),
                            state:          faker.address.state(),
                            postalCode:     faker.address.zipCode()
                        },
                        {
                            id:             mainAddressId,
                            addressLine1:   faker.address.streetAddress(3),
                            city:           faker.address.city(),
                            state:          faker.address.state(),
                            postalCode:     faker.address.zipCode()
                        },
                        {
                            id:             faker.random.uuid(),
                            city:           faker.address.city(),
                            state:          faker.address.state()
                        }
                    ],
                    phones:
                    [
                        {type: "main", number: faker.phone.phoneNumberFormat()},
                        {type: "home", number: faker.phone.phoneNumberFormat()},
                        {type: "cell", number: faker.phone.phoneNumberFormat()}
                    ],
                    emailAddressesByType:
                    {
                        main:   {address: faker.internet.email()},
                        home:   {address: faker.internet.email()}
                    }
                }
            }
        });
        var person      = dataObject("data.person");
        var fullName    = person("firstName") + " " + person("lastName");
        var address0    = person.unwrap("addresses.0");
        address0        = address0.addressLine1 + "\n" + address0.addressLine2 + "\n" + address0.city + ", " + address0.state + " " + address0.postalCode;
        var address1    = person.unwrap("addresses.1");
        address1        = address1.addressLine1 + "\n" + address1.city + ", " + address1.state + " " + address1.postalCode;
        var address2    = person.unwrap("addresses.2");
        address2        = address2.city + ", " + address2.state;
        var mainNumber  = person("phones.0.number");
        var homeNumber  = person("phones.1.number");
        var cellNumber  = person("phones.2.number");

        person.define("fullName", {get: function(key){return this("firstName") + (this.hasValue("firstName")&&this.hasValue("lastName")?" " : "") + this("lastName");}})
        person.define("/.*/.person", {get: function(key){return this("$parent");}});
        person.define("/.*/./.*/.person", {get: function(key){return this("$parent");}});
        person.define("addresses./\\d/.fullAddress", {get: function(key)
        {
            var line1       = this("addressLine1")||"";
            var line2       = this("addressLine2")||"";
            var city        = this("city")||"";
            var state       = this("state")||"";
            var postalCode  = this("postalCode")||"";
            return line1 + (line1&&line2?"\n":"") + line2 + ((line1||line2)&&(city||state||postalCode)?"\n":"") + city + (city&&state?", ":"") + state + (state&&postalCode?" ":"") + postalCode;
        }});
        person.define("phonesByType./.*/", {get: function(key)
        {
            var phones  = this("$parent.phones");
            if (phones !== undefined && phones.isArrayObserver)
            for(var counter=0;counter<phones.count;counter++)  if (phones(counter+".type") === key)  return phones(counter);
        }});

        ion.assert(person("fullName") === fullName,                     "The person's fullName should have been equal to " + fullName + " but was set to " + person("fullName") + ".");
        ion.assert(person.unwrap("firstName.person") === person(),      "The person property of the person's firstName should have been equal to the person but was not.");
        ion.assert(person("addresses.0.fullAddress") === address0,      "The first full address should have been equal to " + address0 + " but was set to " + person("addresses.0.fullAddress") + ".");
        ion.assert(person("addresses.1.fullAddress") === address1,      "The second full address should have been equal to " + address1 + " but was set to " + person("addresses.1.fullAddress") + ".");
        ion.assert(person("addresses.2.fullAddress") === address2,      "The third full address should have been equal to " + address2 + " but was set to " + person("addresses.2.fullAddress") + ".");
        ion.assert(person("phonesByType.main.number") === mainNumber,   "The phonesByType.main.number should have been equal to " + mainNumber + " but was set to " + person("phonesByType.main.number") + ".");
        ion.assert(person("phonesByType.home.number") === homeNumber,   "The phonesByType.home.number should have been equal to " + homeNumber + " but was set to " + person("phonesByType.home.number") + ".");
        ion.assert(person("phonesByType.cell.number") === cellNumber,   "The phonesByType.cell.number should have been equal to " + cellNumber + " but was set to " + person("phonesByType.cell.number") + ".");
    }
};});}();