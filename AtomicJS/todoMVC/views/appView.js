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
                    toggleAllCompleted: { onchange: function() { this.root.on.toggleAllCompleted(this.value()); } },
                    todoList:
                    {
                        repeat:
                        {
                            todoListItemTemplate:
                            {
                                getKey:     function(item){return "todoListItem-"+item().id},
                                controls:
                                {
                                    toggleCompletedCheckbox:
                                    {
                                        bindTo:     "completed",
                                        onchange:
                                        function()
                                        {
                                            this.root.on.saveTodo(this.data());
                                        } 
                                    },
                                    todoLabel:
                                    {
                                        bindTo:     "todo",
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
                                        bindTo:     "todo",
                                        onenter:
                                        function()
                                        {
                                            this.value(this.value().trim());
                                            this.data.commit();
                                            if (this.value() == "") this.root.on.deleteTodo(this.data().id);
                                            else                    this.root.on.saveTodo(this.data());
                                        },
                                        onescape:
                                        function()
                                        {
                                            this.data.rollback();
                                            this.parent.removeClass("editing");
                                        },
                                        updateon:   ["change", "keyup"]
                                    }
                                },
                                ondataupdate:
                                function(data)
                                {
                                    this.toggleClass("completed", data().completed||false);
                                },
                            }
                        }
                    }
                },
                hidden:         true,
                ondataupdate:   function(data)
                {
                    var items           = data();
                    this.toggleDisplay(items.length>0);
                    var allCompleted    = true;
                    for(var itemCounter=0;itemCounter<items.length;itemCounter++)
                    allCompleted = allCompleted && (items[itemCounter].completed||false);
                    this.controls.toggleAllCompleted.value(allCompleted);
                },
                onunbind:       function(data) { this.hide(); }
            },
            todosFooter:
            {
                controls:
                {
                    todosCountLabel:        { bindAs: function(todos){return getActiveTodos(todos()).length;} },
                    todosCountDescription:  { bindAs: function(todos){return getActiveTodos(todos()).length == 1 ? " item left" : " items left";} },
                    allTodosLink:           { onclick: function(){this.root.attribute("filter", "none");} },
                    activeTodosLink:        { onclick: function(){this.root.attribute("filter", "active");} },
                    completedTodosLink:     { onclick: function(){this.root.attribute("filter", "completed");} },
                    deleteCompletedTodos:   { onclick: function(){this.root.on.deleteCompletedTodos();} },
                },
                hidden: true,
                ondataupdate:   function(data)
                {
                    this.toggleDisplay(data().length>0);
                }
            }
        },
        events:["addNewTodo", "deleteTodo", "saveTodo", "toggleAllCompleted", "deleteCompletedTodos"]
    };
    return adapterDefinition;
}});}();
