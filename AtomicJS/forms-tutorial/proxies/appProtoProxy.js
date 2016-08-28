!function()
{"use strict";root.define("atomic.forms.tutorial.appProxy", function formsTutorialProtoProxy(localStorage, removeFromArray)
{
    var mainMenu            =
    {
        examples:
        {
            title:  "Examples",
            rel:    "/",
            action: "get",
            menu:
            {
                bind:   "examples",
                repeat:
                {
                    bind:
                    {
                        title:  "title",
                        rel:    "path"
                    },
                    action: "get"
                }
            }
        }
    }
    var exampleMenuItems    =
    {
        example1:
        {
            title:  "Hello World!",
            path:   "/example1"
        },
        example2:
        {
            title:  "Hello World Revisted",
            path:   "/example2"
        }
    };
    var resources           =
    {
        not_found:
        {
            layout:
            {
                menu:       mainMenu,
                screens:
                {
                    main:
                    {
                        fields:
                        {
                            message:
                            {
                                type:       "readonly",
                                columns:    12,
                                bind:       "message"
                            }
                        }
                    }
                }
            },
            data:
            {
                examples:   exampleMenuItems,
                message:    "The resource that you are attempting to access was not found.  Please check your route and try again."
            }
        },
        "/":
        {
            layout:
            {
                menu:   mainMenu
            },
            data:
            {
                examples:   exampleMenuItems
            }
        },
        "/example1":
        {
            layout:
            {
                menu:       mainMenu,
                screens:
                {
                    demo:
                    {
                        screens:
                        {
                            example1:
                            {
                                fields:
                                {
                                    message:
                                    {
                                        type:       "readonly",
                                        columns:    12,
                                        bind:       "message"
                                    }
                                }
                            }
                        }
                    },
                    model:
                    {
                        fields:
                        {
                            model:
                            {
                                type:       "readonly",
                                columns:    12,
                                bind:       {to: function(){return JSON.stringify(this.data(), null, '    ');}, root: ".../data" }
                            }
                        }
                    },
                    layout:
                    {
                        fields:
                        {
                            model:
                            {
                                type:       "readonly",
                                columns:    12,
                                bind:       {to: function(){return JSON.stringify(this.data(), null, '    ');}, root: ".../layout" }
                            }
                        }
                    }
                }
            },
            data:
            {
                examples:   exampleMenuItems,
                message:    "Hello World!"
            }
        }
    };
return {
        name:   "formsTutorial",
        get:    function(url, callback)
        {
            callback(resources[url]||resources.not_found);
        },
        put:    function(url, resource, callback)
        {

        },
        post:   function(url, resource, callback)
        {

        },
        delete: function(url, callback)
        {

        }
    };
});}();