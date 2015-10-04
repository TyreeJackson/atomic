!function()
{
    root.define
    (
        "todoMVC.appController",
        function todoMVCAppController(appView, appProxy)
        {
            function rebindTodoList(todos)
            {
                appView.bindData(todos);
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