$(function() {
  if (!$('#todos-index').length) {
    return;
  }

  var todoView = new TodoView({
    todoCount: $('#todo-count'),
    btnDisplayAll: $('.btn-display-all'),
    btnDisplayActive: $('.btn-display-active'),
    btnDisplayCompleted: $('.btn-display-completed'),
    todoItems: $('.todo-items')
  });

  var todoController = new TodoController({
    inputTodoDescription: $('.input-todo-description'),
    todoItems: $('.todo-items'),
    btnClearCompleted: $('.btn-clear-completed')
  }, todoView);

});