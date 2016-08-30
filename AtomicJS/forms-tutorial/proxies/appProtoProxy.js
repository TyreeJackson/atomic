!function()
{"use strict";root.define("atomic.forms.tutorial.appProxy", function formsTutorialProtoProxy(localStorage, removeFromArray)
{
    var mainMenu            =
    {
        name:       "mainMenu",
        type:       "menu",
        width:      12,
        bind:       { value: { to: "menu", text: "title", value: "path" } }
    };
    var exampleMenuItems    =
    [
        {
            title:      "Examples",
            path:       "/",
            items:
            [
                {
                    title:  "Hello World!",
                    path:   "/example1"
                },
                {
                    title:  "Hello World Revisted",
                    path:   "/example2"
                }
            ]
        }
    ];
    var resources           =
    {
        not_found:
        {
            layout:
            [
                mainMenu,
                {
                    name:   "main",
                    type:   "layout",
                    width:  12,
                    layout:
                    [
                        {
                            name:       "message",
                            type:       "static",
                            columns:    12,
                            bind:       "message"
                        }
                    ]
                }
            ],
            data:
            {
                menu:       exampleMenuItems,
                message:    "The resource that you are attempting to access was not found.  Please check your route and try again."
            }
        },
        "/":
        {
            layout:
            [
                mainMenu
            ],
            data:
            {
                menu:   exampleMenuItems
            }
        },
        "/example1":
        {
            layout:
            [
                mainMenu,
                {
                    name:   "main",
                    type:   "layout",
                    width:  12,
                    layout:
                    [
                        {
                            name:       "message",
                            type:       "static",
                            columns:    12,
                            label:      "Message",
                            bind:       "data.message"
                        }
                    ]
                },
                {
                    name:   "data",
                    type:   "layout",
                    width:  12,
                    layout:
                    [
                        {
                            name:       "model",
                            type:       "json",
                            columns:    12,
                            label:      "Data",
                            bind:       "...data"
                        }
                    ]
                },
                {
                    name:   "layout",
                    type:   "layout",
                    width:  12,
                    layout:
                    [
                        {
                            name:       "model",
                            type:       "json",
                            columns:    12,
                            label:      "Layout",
                            bind:       "...layout"
                        }
                    ]
                }
            ],
            data:
            {
                menu:       exampleMenuItems,
                message:    "Hello World!"
            }
        },
        "/example2":
        {
            layout: [],
            data:   {}
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