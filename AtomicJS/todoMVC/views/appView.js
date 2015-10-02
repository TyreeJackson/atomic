!function()
{
    root.define
    (
        "todoMVC.appView",
        function()
        {
            return function todoMVCAppView(viewAdapter)
            {
         return {
                    controls:
                    {
                        newTodoTextbox:
                        {
                            onEnter: function(){viewAdapter.on.addNewTodo(this.value()); this.value("");}
                        },
                        todosView:
                        {
                            hidden: true
                        },
                        todosFooter:
                        {
                            hidden: true
                        }
                    },
                    events:["addNewTodo"]
                };
            }
        }
    );
}();
function demoViewAdapterLibrary(demoSubView)
{
    return function demoViewAdapter(viewAdapter)
    {
 return {
            controls:
            {
                sampleButton:   { hidden:       true },
                sampleTextbox:  { onchange:     function(){} },
                classedSubView:
                {
                    viewAdapter:    demoSubView,
                    hidden:         true
                },
                inlineSubView:
                {
                    controls:
                    {
                        subViewButton1:     { hidden:   true },
                        subViewCheckbox:    { onchange: function(){} }
                    },
                    hidden:     true
                }
            },
            events: [],
            members:
            {
            }
        }
    }
}