!function()
{
    root.define
    (
        "todoMVC.appProxy",
        function todoMVCAppProtoProxy(localStorage, removeFromArray)
        {
            var storageKey  = "todoMVC.todos";
            function getTodos() { return JSON.parse((localStorage.getItem(storageKey)||"{\"currentId\":0, \"items\":[]}")); }
            function setTodos(todos) { localStorage.setItem(storageKey, JSON.stringify(todos)); }
            function getTodo(todoId, todos)
            {
                for(var itemCounter=0;itemCounter<todos.items.length;itemCounter)
                if (todos.items[itemCounter].Id == todoId) return todos.items[itemCounter];
            }
            function setTodo(todo, todos)
            {
                for(var itemCounter=0;itemCounter<todos.items.length;itemCounter)
                if (todos.items[itemCounter].Id == todo.Id)
                {
                    todos.items[itemCounter] = todo;
                    return;
                }
                todos.items.push(todo);
            }
            function removeTodo(todoId)
            {
                var todos   = getTodos();
                for(var itemCounter=0;itemCounter<todos.items.length;itemCounter)
                if (todos.items[itemCounter].Id == todoId)
                {
                    removeFromArray(todos.items, itemCounter);
                    break;
                }
                return todos;
            }
     return {
                loadTodos:
                function(callback)
                {
                    callback(localStorage.getItem(storageKey).items);
                },
                addTodo:
                function(todo, callback)
                {
                    var todos   = getTodos();
                    todo.Id     = todos.currentId++;
                    todos.items.push(todo);
                    setTodos(todos)
                    callback(todos);
                },
                completeTodo:
                function(todoId, callback)
                {
                    var todos   = getTodos();
                    var todo    = getTodo(todoId, todos);
                    todo.completed  = true;
                    setTodo(todo, todos);
                    setTodos(todos)
                    callback(todos);
                },
                deleteTodo:
                function(todoId, callback)
                {
                    var todos   = removeTodo(todoId);
                    setTodos(todos)
                    callback(todos);
                }
            };
        }
    );
}();