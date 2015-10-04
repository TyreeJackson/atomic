!function()
{
    root.define
    (
        "todoMVC.appController",
        function todoMVCAppController(appView, appProxy, observer)
        {
            var todosObserver;
            function rebindTodoList(todos)
            {
                todosObserver   = new observer(todos);
                appView.unbindData();
                appView.bindData(todosObserver);
            }
            appView.on.addNewTodo.listen
            (function(value)
            {
                appProxy.addTodo({todo: value}, function(todos){rebindTodoList(todos);});
            });
            appView.on.deleteTodo.listen
            (function(value)
            {
                appProxy.deleteTodo(value, function(todos){rebindTodoList(todos);});
            });
            appView.on.saveTodo.listen
            (function(todo)
            {
                appProxy.saveTodo(todo, function(todos){rebindTodoList(todos);});
            });
            appView.on.toggleAllCompleted.listen
            (function(value)
            {
                var todos   = todosObserver();
                for(var todoCounter=0;todoCounter<todos.length;todoCounter++)   todos[todoCounter].completed  = value;;
                appProxy.saveTodos(todos, function(refreshedTodos){rebindTodoList(refreshedTodos);});
            });
            this.launch =
            function()
            {
                appProxy.getTodos
                (function(todos)
                {
                    rebindTodoList(todos);
                });
            }
        }
    );
}();