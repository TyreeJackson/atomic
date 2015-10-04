﻿!function()
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
                                                todoLabel:                  { bindTo:   "todo",         ondblclick: function(){this.parent.addClass("editing"); this.parent.controls.editTodoTextbox.focus();} },
                                                deleteTodoButton:           { bindTo:   "id",           onclick:    function(){appViewAdapter.on.deleteTodo(this.boundItem(this.bindPath));} },
                                                editTodoTextbox:            { bindTo:   "todo",         onenter:    function(){this.blur(); appViewAdapter.on.saveTodo(this.boundItem(this.parent.bindPath));} }
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
                            hidden: true
                        }
                    },
                    events:["addNewTodo", "deleteTodo", "saveTodo", "toggleAllCompleted"]
                };
            }
        }
    );
}();