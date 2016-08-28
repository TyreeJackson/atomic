!function()
{"use strict";root.define("todoMVC.appView",
function()
{return function todoMVCAppView()
{
    function getActiveTodos(todos)
    {
        var activeTodos = [];
        for(var counter=0;counter<todos.length;counter++) if (!todos[counter].completed) activeTodos.push(todos[counter]);
        return activeTodos;
    }
    var adapterDefinition   =
    {
        controls:
        {
            newTodoTextbox:
            {
                onenter:
                function()
                {
                    if (this.value().trim() !== "") this.root.on.addNewTodo(this.value().trim());
                    this.value("");
                }
            },
            todosView:
            {
                controls:
                {
                    toggleAllCompleted: 
                    {
                        bind:
                        {
                            value:
                            {
                                to:
                                {
                                    get:    function(data)
                                    {
                                        var items           = data();
                                        var allCompleted    = true;
                                        for(var itemCounter=0;itemCounter<items.length;itemCounter++)
                                        allCompleted = allCompleted && (items[itemCounter].completed||false);
                                        return allCompleted;
                                    },
                                    set:    function(data, value)
                                    {
                                        this.root.on.toggleAllCompleted(value);
                                    }
                                }
                            }
                        }
                    },
                    todoList:
                    {
                        repeat:
                        {
                            todoListItemTemplate:
                            {
                                getKey:     function(item){return "todoListItem-"+item().id},
                                bind:       { classes: { completed:  "completed" } },
                                controls:
                                {
                                    toggleCompletedCheckbox:
                                    {
                                        bind:       "completed",
                                        onchange:
                                        function()
                                        {
                                            this.root.on.saveTodo(this.data());
                                        } 
                                    },
                                    todoLabel:
                                    {
                                        bind:       "todo",
                                        ondblclick:
                                        function()
                                        {
                                            this.data.beginTransaction();
                                            this.parent.addClass("editing");
                                            this.parent.controls.editTodoTextbox.focus().select();
                                        } 
                                    },
                                    deleteTodoButton:
                                    {
                                        onclick:
                                        function()
                                        {
                                            this.root.on.deleteTodo(this.data().id);
                                        }
                                    },
                                    editTodoTextbox:
                                    {
                                        bind:       "todo",
                                        onenter:
                                        function()
                                        {
                                            this.value(this.value().trim());
                                            this.value.update();
                                            this.data.commit();
                                            if (this.value() == "") this.root.on.deleteTodo(this.data().id);
                                            else                    this.root.on.saveTodo(this.data());
                                            this.parent.removeClass("editing");
                                        },
                                        onescape:
                                        function()
                                        {
                                            this.data.rollback();
                                            this.parent.removeClass("editing");
                                        },
                                        updateon:   ["change", "keyup"]
                                    }
                                }
                            }
                        }
                    }
                },
                bind:           { display: "length" },
                onunbind:       function(data) { this.hide(); }
            },
            todosFooter:
            {
                controls:
                {
                    todosCountLabel:        { bind: function(todos){return getActiveTodos(todos()).length;} },
                    todosCountDescription:  { bind: function(todos){return getActiveTodos(todos()).length == 1 ? " item left" : " items left";} },
                    allTodosLink:           { onclick: function(){this.root.attributes({filter: "none"});} },
                    activeTodosLink:        { onclick: function(){this.root.attributes({filter: "active"});} },
                    completedTodosLink:     { onclick: function(){this.root.attributes({filter: "completed"});} },
                    deleteCompletedTodos:   { onclick: function(){this.root.on.deleteCompletedTodos();} },
                },
                bind:       { display: "length" }
            }
        },
        events:["addNewTodo", "deleteTodo", "saveTodo", "toggleAllCompleted", "deleteCompletedTodos"]
    };
    return adapterDefinition;
}});}();
