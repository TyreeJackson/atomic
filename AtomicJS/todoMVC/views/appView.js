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
                            onEnter: function() { viewAdapter.on.addNewTodo(this.value()); this.value(""); }
                        },
                        todosView:
                        {
                            controls:
                            {
                                toggleAllCompleted: {},
                                todoList:
                                {
                                    repeat:
                                    {
                                        todoListItemTemplate:
                                        {
                                            getKey:     function(item){return "todoListItem-"+item.id},
                                            controls:
                                            {
                                                toggleCompletedCheckbox:    { bindTo: "completed" },
                                                todoLabel:                  { bindTo: "todo" },
                                                deleteTodoButton:           { bindTo: "id", onclick: function(){viewAdapter.on.deleteTodo(this.value()); } },
                                                editTodoTextbox:            { hidden: true }
                                            }
                                        }
                                    }
                                }
                            },
                            hidden: true,
                            onbind: function(data){ this.toggleDisplay(data.length>0); }
                        },
                        todosFooter:
                        {
                            hidden: true
                        }
                    },
                    events:["addNewTodo", "deleteTodo"]
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