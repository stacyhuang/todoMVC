function TodoController(config, todoView) {
  this.$todoItems = config.todoItems;
  this.$inputTodoDescription = config.inputTodoDescription;
  this.$btnClearCompleted = config.btnClearCompleted;
  this.$newTodoTemplate = Handlebars.compile($('#new-todo-template').html());
  this.todoView = todoView;

  this.init();
}

TodoController.prototype.init = function() {
  this.$inputTodoDescription.on("keypress", $.proxy(this.addTodo, this));
  this.$todoItems.on("keypress", ".ctn-todo-description", $.proxy(this.updateTodo, this));
  this.$todoItems.on("click", ".btn-delete-todo", $.proxy(this.deleteTodo, this));
  this.$todoItems.on("click", ".ctn-todo-status", $.proxy(this.toggleStatus, this));
  this.$btnClearCompleted.on('click', $.proxy(this.clearCompleted, this));
};

TodoController.prototype.addTodo = function(event) {
  if(event.which !== 13) return;

  event.preventDefault();
  var thisEl = $(event.currentTarget);
  var description = thisEl.val();
  var todo = { "description": description };

  $.ajax({
    type: 'POST',
    dataType: 'json',
    url: '/todos',
    data: {
      todo: todo
    },
    success: function(data) {
      this.todoView.addTodoCount();
      this.$inputTodoDescription.val('');
      this.$todoItems.append(this.$newTodoTemplate(data));
    }.bind(this),
    error: function(jqXHR) {
      alert(jqXHR.responseText);
    }.bind(this)
  });
};

TodoController.prototype.deleteTodo = function(event) {
  var thisEl = $(event.currentTarget);
  var todoItem = thisEl.closest('.todo-item');
  var id = todoItem.attr('data-todo-id');
  var status = todoItem.find('.ctn-todo-status')[0].checked ? "completed" : "active";

  if (status === 'active') {
    this.todoView.subtractTodoCount();
  }

  $.ajax({
    type: 'POST',
    dataType: 'json',
    url: '/todos/' + id,
    data: {
      _method: 'DELETE',
    },
    success: function(data) {
      this.todoView.removeTodo(data.id);
    }.bind(this),
    error: function(jqXHR) {
      alert(jqXHR.responseText);
    }.bind(this)
  });
};

TodoController.prototype.clearCompleted = function(event) {
  $.ajax({
    type: 'POST',
    dataType: 'json',
    url: '/todos/completed',
    data: {
      _method: 'DELETE',
    },
    success: function(data) {
      var deletedTodos = data.id;

      for(var i = 0; i < deletedTodos.length; i++) {
        this.todoView.removeTodo(deletedTodos[i]);
      }
    }.bind(this),
    error: function(jqXHR) {
      alert(jqXHR.responseText);
    }.bind(this)
  });
};

TodoController.prototype.toggleStatus = function(event) {
  var thisEl = $(event.currentTarget);
  var status = thisEl[0].checked ? "completed" : "active";
  var id = thisEl.closest('.todo-item').attr('data-todo-id');
  var todo = { "status": status };

  $.ajax({
    type: 'POST',
    dataType: 'json',
    url: '/todos/' + id,
    data: {
      _method: 'PATCH',
      todo: todo
    },
    success: function(data) {
      this.todoView.toggleStatus(data.id);

      if (data.status === 'completed') {
        this.todoView.subtractTodoCount();
      } else {
        this.todoView.addTodoCount();
      }
    }.bind(this),
    error: function(jqXHR) {
      alert(jqXHR.responseText);
    }.bind(this)
  });
};

TodoController.prototype.updateTodo = function(event) {
  if(event.which !== 13) return;

  event.preventDefault();
  var thisEl = $(event.currentTarget);
  var description = thisEl.val();
  var id = thisEl.closest('.todo-item').attr('data-todo-id');
  var todo = { "description": description };

  $.ajax({
    type: 'POST',
    dataType: 'json',
    url: '/todos/' + id,
    data: {
      _method: 'PATCH',
      todo: todo
    },
    success: function(data) {
      var $todo = $(".todo-item[data-todo-id=" + id + "]");
      var $ctnTodoDescription = $todo.find('.ctn-todo-description');
      $ctnTodoDescription.attr('readonly', 'readonly').removeClass('editing');
    }.bind(this),
    error: function(jqXHR) {
      alert(jqXHR.responseText);
    }.bind(this)
  });
};
