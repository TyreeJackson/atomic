!function()
{
    root.define
    (
        "todoMVC.appController",
        function todoMVCAppController(appView, appProxy, observer)
        {
            function rebindTodoList(todos)
            {
                // Replace the array directly wrapped in the observer bound to the appView with the new array argument passed in the todos parameter
                appView.data("", todos);
            }
            appView.on.addNewTodo.listen
            (function(value)
            {
                appProxy.addTodo({todo: value}, rebindTodoList);
            });
            appView.on.deleteTodo.listen
            (function(todoId)
            {
                appProxy.deleteTodo(todoId, rebindTodoList);
            });
            appView.on.saveTodo.listen
            (function(todo)
            {
                appProxy.saveTodo(todo, rebindTodoList);
            });
            appView.on.toggleAllCompleted.listen
            (function(flag)
            {
                appProxy.toggleAllTodos(flag, rebindTodoList);
            });
            appView.on.deleteCompletedTodos.listen
            (function()
            {
                appProxy.deleteCompletedTodos(rebindTodoList);
            });
            this.launch =
            function()
            {
                appView.data = new observer([]);
                appProxy.getTodos(rebindTodoList);
            }
        }
    );
}();