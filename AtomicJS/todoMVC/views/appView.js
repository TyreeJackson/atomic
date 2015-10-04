!function()
{
    root.define
    (
        "todoMVC.appView",
        function()
        {
            return function todoMVCAppView(appViewAdapter)
            {
         return {
                    controls:
                    {
                        newTodoTextbox:
                        {
                            onenter: function() { appViewAdapter.on.addNewTodo(this.value()); this.value(""); }
                        },
                        todosView:
                        {
                            controls:
                            {
                                toggleAllCompleted: { onchange: function() { appViewAdapter.on.toggleAllCompleted(this.value()); } },
                                todoList:
                                {
                                    repeat:
                                    {
                                        todoListItemTemplate:
                                        {
                                            getKey:     function(item){return "todoListItem-"+item.id},
                                            controls:
                                            {
                                                toggleCompletedCheckbox:    { bindTo:   "completed",    onchange:   function(){ appViewAdapter.on.saveTodo(this.boundItem(this.parent.bindPath)); } },
                                                todoLabel:                  { bindTo:   "todo",         ondblclick: function(){this.boundItem.beginTransaction(); this.parent.addClass("editing"); this.parent.controls.editTodoTextbox.focus().select();} },
                                                deleteTodoButton:           { bindTo:   "id",           onclick:    function(){appViewAdapter.on.deleteTodo(this.boundItem(this.bindPath));} },
                                                editTodoTextbox:            { bindTo:   "todo",         onenter:    function(){this.boundItem.commit(); appViewAdapter.on.saveTodo(this.boundItem(this.parent.bindPath));},  onescape: function(){this.boundItem.rollback(); this.parent.removeClass("editing");}, updateon:["change", "keyup"] }
                                            },
                                            onbind:     function(data) { this.toggleClass("completed", data(this.bindPath).completed); },
                                        }
                                    }
                                }
                            },
                            hidden:     true,
                            onbind:     function(data)
                            {
                                var items           = data();
                                this.toggleDisplay(items.length>0);
                                var allCompleted    = true;
                                for(var itemCounter=0;itemCounter<items.length;itemCounter++)   allCompleted = allCompleted && (items[itemCounter].completed||false);
                                this.controls.toggleAllCompleted.value(allCompleted);
                            },
                            onunbind:   function(data) { this.hide(); }
                        },
                        todosFooter:
                        {
                            controls:
                            {
                                todosCountLabel:        { bindAs: function(todos){return todos.length;} },
                                todosCountDescription:  { bindAs: function(todos){return todos.length == 0 || todos.length > 1 ? " items left" : " item left";} },
                                allTodosLink:           { onclick: function(){appViewAdapter.attribute("filter", "none");} },
                                activeTodosLink:        { onclick: function(){appViewAdapter.attribute("filter", "active");} },
                                completedTodosLink:     { onclick: function(){appViewAdapter.attribute("filter", "completed");} },
                                deleteCompletedTodos:   { onclick: function(){appViewAdapter.on.deleteCompletedTodos();} },
                            },
                            hidden: true,
                            onbind: function(data)
                            {
                                this.toggleDisplay(data().length>0);
                            }
                        }
                    },
                    events:["addNewTodo", "deleteTodo", "saveTodo", "toggleAllCompleted", "deleteCompletedTodos"]
                };
            }
        }
    );
}();