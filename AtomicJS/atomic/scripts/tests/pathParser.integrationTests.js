!function()
{"use strict";root.define("atomic.tests.pathParser_integration", function pathParserIntegrationTests(ion, mock)
{return{
    __setup:
    function()
    {
        this.scanner        = new root.atomic.scanner();
        this.tokenizer      = new root.atomic.tokenizer();
        this.parserFactory  = new root.atomic.pathParserFactory(this.tokenizer);
        this.tokenizers     = this.parserFactory.getTokenizers();
        this.lexer          = new root.atomic.lexer(this.scanner, this.tokenizers, root.utilities.removeFromArray);
    },
    When_calling_the_parse_method_of_the_pathParser_an_accessor_should_be_returned_that_can_set_or_get_the_value_at_the_resolved_path_location:
    function()
    {
        var testInputs  = 
        [
            {
                basePath:   "",
                path:       "data.person.firstName",
                newValue:   faker.name.firstName(),
                get:        root=>root.data.person.firstName
            },
            {
                basePath:   "",
                path:       "data.person['lastName']",
                newValue:   faker.name.lastName(),
                get:        root=>root.data.person.lastName
            },
            {
                basePath:   "",
                path:       "data.person.addresses[0].addressLine1",
                newValue:   faker.address.streetAddress(3),
                get:        root=>root.data.person.addresses[0].addressLine1
            },
            {
                basePath:   "",
                path:       "data.person.addresses.0.addressLine1",
                newValue:   faker.address.streetAddress(3),
                get:        root=>root.data.person.addresses[0].addressLine1
            },
            {
                basePath:   "",
                path:       "data.person.phonesByType.main.number",
                newValue:   faker.phone.phoneNumberFormat(),
                get:        root=>root.data.person.phonesByType.main.number
            },
            {
                basePath:   "",
                path:       "data.person.phonesByType[\"main\"].number",
                newValue:   faker.phone.phoneNumberFormat(),
                get:        root=>root.data.person.phonesByType.main.number
            },
            {
                basePath:   "data.person",
                path:       "phonesByType[primaryPhoneType].number",
                newValue:   faker.phone.phoneNumberFormat(),
                get:        root=>root.data.person.phonesByType.home.number
            },
            {
                basePath:   "data.person.phonesByType.home",
                path:       "$root.data.person.emailAddressesByType[$key].address",
                newValue:   faker.internet.email(),
                get:        root=>root.data.person.emailAddressesByType.home.address
            },
            {
                basePath:   "data.person.phonesByType.home",
                path:       "$parent.$parent.emailAddressesByType[$key].address",
                newValue:   faker.internet.email(),
                get:        root=>root.data.person.emailAddressesByType.home.address
            },
            {
                basePath:   "data.person.phonesByType.home",
                path:       "$home.$parent.$parent.emailAddressesByType[$key].address",
                newValue:   faker.internet.email(),
                get:        root=>root.data.person.emailAddressesByType.home.address
            }
        ];
        var mainAddressId   = faker.random.uuid();
        var dataObject      =
        {
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
        };
        var pathParser  = new this.parserFactory.parser(this.lexer);
        for(var counter=0, testInput;testInput=testInputs[counter];counter++)
        {
            ion.log("Testing input " + counter + " with base path {" + testInput.basePath + "} and path {" + testInput.path + "}");
            var accessor    = pathParser.parse(testInput.path);
            ion.assert(accessor.get({item: dataObject, basePath: testInput.basePath}) === testInput.get(dataObject),    "The value " +  testInput.get(dataObject) + " was expected but instead the value " + accessor.get({item: dataObject, basePath: testInput.basePath}) + " was returned.");
            accessor.set({item: dataObject, basePath: testInput.basePath}, testInput.newValue);
            ion.assert(testInput.newValue === testInput.get(dataObject),                                                "The first name should have been updated to " + testInput.newValue + " but instead is set to " + testInput.get(dataObject) + ".");
        }
    }
};});}();