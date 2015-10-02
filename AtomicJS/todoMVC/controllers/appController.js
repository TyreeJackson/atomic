!function()
{
    root.define
    (
        "todoMVC.appController",
        function todoMVCAppController(appView, appProxy)
        {
            function rebindTodoList(todos)
            {
                appView.controls.todosView.bind(todos);
            }
            appView.on.addNewTodo.listen
            (function(value)
            {
                appProxy.addTodo({todo: value}, function(todos){rebindTodoList(todos);});
            });

        }
    );
}();