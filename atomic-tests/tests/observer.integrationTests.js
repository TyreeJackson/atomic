!function()
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

        ion.log("Testing that the firstName was updated to " + newFirstName + ".");
        ion.assert(newFirstName === firstNameUpdate,                                    "The first name should have been updated to " + newFirstName + " but was set to " + firstNameUpdate + ".");

        ion.log("Testing that the primaryPhoneNumber was updated to " + newHomePhoneNumber + " first.");
        ion.assert(primaryPhoneNumberUpdates[0] === newHomePhoneNumber,                 "The first primary phone number change should have been equal to " + newHomePhoneNumber + " but was set to " + primaryPhoneNumberUpdates[0] + ".");

        ion.log("Testing that the primaryPhoneNumber was updated to " + person("phonesByType.main.number") + " first.");
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
        var person          = dataObject("data.person");
        var fullName        = person("firstName") + " " + person("lastName");
        var newFirstName    = faker.name.firstName();
        var newLastName     = faker.name.lastName();
        var address0        = person.unwrap("addresses.0");
        address0            = address0.addressLine1 + "\n" + address0.addressLine2 + "\n" + address0.city + ", " + address0.state + " " + address0.postalCode;
        var address1        = person.unwrap("addresses.1");
        address1            = address1.addressLine1 + "\n" + address1.city + ", " + address1.state + " " + address1.postalCode;
        var address2        = person.unwrap("addresses.2");
        address2            = address2.city + ", " + address2.state;
        var mainNumber      = person("phones.0.number");
        var homeNumber      = person("phones.1.number");
        var cellNumber      = person("phones.2.number");

        person.define("fullName", {get: function(key){return this("firstName") + (this.hasValue("firstName")&&this.hasValue("lastName")?" " : "") + this("lastName");}, set: function(key, value){var names = value.split(" ", 2);this("firstName", names[0]);this("lastName", names[1]);}});
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

        ion.log("Testing that the fullName computed property returns " + fullName + ".");
        ion.assert(person("fullName") === fullName,                         "The person's fullName should have been equal to " + fullName + " but was set to " + person("fullName") + ".");

        ion.log("Testing that the fullName computed property updates the person's firstName to " + newFirstName + " and their lastName to " + newLastName + ".");
        person("fullName", newFirstName + " " + newLastName);
        ion.assert(person("firstName") === newFirstName,                    "The person's firstName should have been updated to " + newFirstName + " but was set to " + person("firstName") + ".");
        ion.assert(person("lastName") === newLastName,                      "The person's lastName should have been updated to " + newLastName + " but was set to " + person("lastName") + ".");

        ion.log("Testing that the person computed property of the firstName property returns the person object itself.");
        ion.assert(person.unwrap("firstName.person") === person(),          "The person property of the person's firstName should have been equal to the person but was not.");

        ion.log("Testing that the fullAddress property of the first address returns " + address0.replace(/\n/g, "\\n"));
        ion.assert(person("addresses.0.fullAddress") === address0,          "The first full address should have been equal to " + address0 + " but was set to " + person("addresses.0.fullAddress") + ".");

        ion.log("Testing that the fullAddress property of the second address returns " + address1.replace(/\n/g, "\\n"));
        ion.assert(person("addresses.1.fullAddress") === address1,          "The second full address should have been equal to " + address1 + " but was set to " + person("addresses.1.fullAddress") + ".");

        ion.log("Testing that the fullAddress property of the third address returns " + address2.replace(/\n/g, "\\n"));
        ion.assert(person("addresses.2.fullAddress") === address2,          "The third full address should have been equal to " + address2 + " but was set to " + person("addresses.2.fullAddress") + ".");

        ion.log("Testing that the phonesByType.main.number computed property path returns " + mainNumber + ".");
        ion.assert(person("phonesByType.main.number") === mainNumber,       "The phonesByType.main.number should have been equal to " + mainNumber + " but was set to " + person("phonesByType.main.number") + ".");

        ion.log("Testing that the phonesByType.home.number computed property path returns " + homeNumber + ".");
        ion.assert(person("phonesByType.home.number") === homeNumber,       "The phonesByType.home.number should have been equal to " + homeNumber + " but was set to " + person("phonesByType.home.number") + ".");

        ion.log("Testing that the phonesByType.cell.number computed property path returns " + cellNumber + ".");
        ion.assert(person("phonesByType.cell.number") === cellNumber,       "The phonesByType.cell.number should have been equal to " + cellNumber + " but was set to " + person("phonesByType.cell.number") + ".");

        ion.log("Testing that the phonesByType.business.number computed property path returns undefined.");
        ion.assert(person("phonesByType.business.number") === undefined,    "The phonesByType.cell.number should have been undefined but was set to " + person("phonesByType.cell.number") + ".");
    },
    Observers_support_shadow_properties:
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
        var person              = dataObject("data.person");
        var newFirstName        = faker.name.firstName();
        var hasChangedUpdated   = false;

        person.listen(function()
        {
            var personShadow    = person.peek("$shadow");
            personShadow("hasChanged", (personShadow.peek("hasChanged") !== undefined));
        }, "");

        person.listen(function(){hasChangedUpdated = person.unwrap("$shadow.hasChanged") !== undefined;});
        hasChangedUpdated       = false;

        ion.log("Checking that the hasChanged person shadow property is set to false.");
        ion.assert(dataObject.shadows["data.person"].hasChanged === false,  "The hasChanged property should have been set to false.");

        ion.log("Checking that the listener of the person.$shadow.hasChanged property has not been called.");
        ion.assert(hasChangedUpdated === false,                             "The hasChangedUpdated flag should have been set to false.");

        person("firstName", person("firstName"));
        
        ion.log("Checking that the hasChanged person shadow property is set to false after setting the person's first name to its current value.");
        ion.assert(dataObject.shadows["data.person"].hasChanged === false,  "The hasChanged property should have been set to false.");

        ion.log("Checking that the listener of the person.$shadow.hasChanged property has not been called after setting the person't first name to its current value.");
        ion.assert(hasChangedUpdated === false,                             "The hasChangedUpdated flag should have been set to false.");

        person("firstName", newFirstName);
        
        ion.log("Checking that the hasChanged person shadow property is set to true.");
        ion.assert(dataObject.shadows["data.person"].hasChanged === true,   "The hasChanged property should have been set to true.");

        ion.log("Checking that the listener of the person.$shadow.hasChanged property has been called.");
        ion.assert(hasChangedUpdated === true,                              "The hasChangedUpdated flag should have been set to true.");

        ion.log("Checking that the shadow properties are not returned with the host path of the model.");
        ion.assert(person().$shadow === undefined,                          "The shadow property should not exist in the person object from the wrapped model.");

        ion.log("Checking that the shadow properties do not serialize with the host path of the model.");
        ion.assert(JSON.stringify(person()).indexOf("$shadow") === -1,       "A shadow property should not have been found in the serialized copy of the person object from the wrapped model.");

        ion.log("Checking that the shadow properties do not serialize from anywhere in the model.");
        ion.assert(JSON.stringify(dataObject()).indexOf("$shadow") === -1,   "A shadow property should not have been found in the serialized copy of the wrapped model.");
    }
};});}();