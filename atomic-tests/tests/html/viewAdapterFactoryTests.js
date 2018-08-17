!function()
{"use strict";root.define("atomic.tests.html.viewAdapterFactory", function viewAdapterFactoryTests(ion, mock)
{return{
    __setup:
    function()
    {
        this.mockDocument                           = new mock("document");
        this.mockControlTypes                       = new mock("controlTypes");
        this.mockControlType                        = new mock("controlType");
        this.mockControl                            = new mock("control");
        this.mockPubSub                             = new mock("pubSub");
        this.mockLogger                             = new mock("logger");
        this.mockEach                               = new mock("each");
        this.mockObserver                           = new mock("observer");
        this.mockViewAdapterDefinitionConstructor   = new mock("viewAdapterDefinitionConstructor");
        this.mockViewElement                        = new mock("viewElement");
        this.mockParent                             = new mock("parent");
        this.viewAdapterFactory                     = new root.atomic.html.viewAdapterFactory(this.mockDocument.object, this.mockControlTypes.object, this.mockPubSub.object, this.mockLogger.object, this.mockEach.object, this.mockObserver.object);
    },
    When_calling_the_create_method_of_the_viewAdapterFactory_a_view_adapter_is_constructed_and_returned:
    function()
    {
        var self                = this;
        var id                  = faker.random.uuid();
        var controlType         = faker.random.uuid();
        var bindPath            = faker.random.uuid();
        var childKey            = faker.random.uuid();
        var protoChildKey       = faker.random.uuid();
        var adapterDefinition   = {};
        var preConstructCalled  = false;
        var preConstruct        = function(){preConstructCalled = this==self.mockControl.object;}
        this.mockViewElement.setup(viewElement => viewElement.id).returns(id);
        this.mockControlTypes.setup(controlTypes => controlTypes[controlType]).returns(this.mockControlType.object);
        this.mockControlType.setup(controlType => controlType(mock.isAny, mock.isAny, mock.isAny, mock.isAny, mock.isAny)).callback((viewElementArg, selectorArg, parentArg)=>this.mockControl.object);
        this.mockViewAdapterDefinitionConstructor.setup(viewAdapterDefinitionConstructor => viewAdapterDefinitionConstructor(mock.isAny)).callback(viewAdapterArg=>adapterDefinition)
        this.mockControl.setup(control => control.frame(mock.isAny));
        this.mockControl.setup(control => control.construct());

        var control             = this.viewAdapterFactory.create
        ({
            definitionConstructor:  this.mockViewAdapterDefinitionConstructor.object,
            viewElement:            this.mockViewElement.object,
            parent:                 this.mockParent.object,
            selector:               undefined,
            controlType:            controlType,
            preConstruct:           preConstruct,
            bindPath:               bindPath,
            controlKey:             childKey,
            protoControlKey:        protoChildKey
        });

        this.mockViewElement.verify(viewElement => viewElement.id, mock.times.exactly(2));
        this.mockControlTypes.verify(controlTypes => controlTypes[controlType], mock.times.exactly(2));
        this.mockControlType.verify(controlType => controlType(this.mockViewElement.object, "#"+id, this.mockParent.object, bindPath, childKey, protoChildKey), mock.times.once());
        this.mockViewAdapterDefinitionConstructor.verify(viewAdapterDefinitionConstructor => viewAdapterDefinitionConstructor(this.mockControl.object), mock.times.once());
        this.mockControl.verify(control => control.frame(adapterDefinition), mock.times.once());
        ion.assert(preConstructCalled, "The preConstruct callback was not called with the viewAdapter.");
        this.mockControl.verify(control => control.construct(), mock.times.once());
        ion.areEqual(this.mockControl.object, control, "The control constructed was expected but not returned from the create method.");
    }
};});}();