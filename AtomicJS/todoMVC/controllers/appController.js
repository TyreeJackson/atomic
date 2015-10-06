!function()
{
    root.define
    (
        "todoMVC.appController",
        function todoMVCAppController(appView, appProxy, observer)
        {
            // todosObserver is the model observer that wraps the todo list "model"
            var todosObserver;
            function rebindTodoList(todos)
            {
                //todosObserver   = new observer(todos);
                //appView.unbindData();
                //appView.bindData(todosObserver);
                if (todosObserver === undefined)
                {
                    todosObserver   = new observer(todos);
                    appView.bindData(todosObserver);
                }
                else                                todosObserver("", todos);
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
                appProxy.toggleAllTodos(value, function(refreshedTodos){rebindTodoList(refreshedTodos);});
            });
            appView.on.deleteCompletedTodos.listen
            (function()
            {
                appProxy.deleteCompletedTodos(function(refreshedTodos){rebindTodoList(refreshedTodos);});
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