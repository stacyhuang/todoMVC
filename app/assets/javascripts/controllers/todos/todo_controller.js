function TodoController(config, todoView) {
  this.$todoItems = config.todoItems;
  this.$inputTodoDescription = config.inputTodoDescription;
  this.$btnClearCompleted = config.btnClearCompleted;
  this.todoView = todoView;

  this.init();
}

TodoController.prototype.init = function() {
  this.$inputTodoDescription.on("keypress", $.proxy(this.addTodo, this));
  this.$todoItems.on("click", ".btn-delete-todo", $.proxy(this.deleteTodo, this));
  this.$todoItems.on("click", ".ctn-todo-status", $.proxy(this.toggleStatus, this));
  this.$btnClearCompleted.on("click", $.proxy(this.clearCompleted, this));
  this.$todoItems.on("dblclick", ".ctn-todo-description", $.proxy(this.startEditing, this));
  this.$todoItems.on("keypress", ".ctn-todo-description", $.proxy(this.updateTodo, this));
  this.$todoItems.on("blur", ".ctn-todo-description", $.proxy(this.stopEditing, this));
};

TodoController.prototype.addTodo = function(event) {
  if(event.which !== 13) return;

  event.preventDefault();
  var thisEl = $(event.currentTarget);
  var description = thisEl.val();
  var todo = { "description": description };
  thisEl.val("");

  $.ajax({
    type: "POST",
    dataType: "json",
    url: "/todos",
    data: {
      todo: todo
    },
    success: function(data) {
      this.todoView.addTodo(data);
    }.bind(this),
    error: function(jqXHR) {
      alert(jqXHR.responseText);
    }.bind(this)
  });
};

TodoController.prototype.deleteTodo = function(event) {
  var thisEl = $(event.currentTarget);
  var id = thisEl.closest(".todo-item").attr("data-todo-id");

  $.ajax({
    type: "POST",
    dataType: "json",
    url: "/todos/" + id,
    data: {
      _method: "DELETE",
    },
    success: function(data) {
      this.todoView.deleteTodo(data.id);
    }.bind(this),
    error: function(jqXHR) {
      alert(jqXHR.responseText);
    }.bind(this)
  });
};

TodoController.prototype.clearCompleted = function(event) {
  $.ajax({
    type: "POST",
    dataType: "json",
    url: "/todos/completed",
    data: {
      _method: "DELETE",
    },
    success: function(data) {
      this.todoView.clearCompleted();
    }.bind(this),
    error: function(jqXHR) {
      alert(jqXHR.responseText);
    }.bind(this)
  });
};

TodoController.prototype.toggleStatus = function(event) {
  var thisEl = $(event.currentTarget);
  var id = thisEl.closest(".todo-item").attr("data-todo-id");
  var status = thisEl.prop("checked") ? "completed" : "active";
  var todo = { "status": status };

  $.ajax({
    type: "POST",
    dataType: "json",
    url: "/todos/" + id,
    data: {
      _method: "PATCH",
      todo: todo
    },
    success: function(data) {
      this.todoView.toggleStatus(data.id);
    }.bind(this),
    error: function(jqXHR) {
      alert(jqXHR.responseText);
    }.bind(this)
  });
};

TodoController.prototype.startEditing = function(event) {
  var thisEl = $(event.currentTarget);
  this.todoView.startEditing(thisEl);
};

TodoController.prototype.stopEditing = function(event) {
  var thisEl = $(event.currentTarget);
  var id = thisEl.closest(".todo-item").attr("data-todo-id");
  this.todoView.stopEditing(id);
};

TodoController.prototype.updateTodo = function(event) {
  if(event.which !== 13) return;

  event.preventDefault();
  var thisEl = $(event.currentTarget);
  var id = thisEl.closest(".todo-item").attr("data-todo-id");
  var description = thisEl.val();
  var todo = { "description": description };

  $.ajax({
    type: "POST",
    dataType: "json",
    url: "/todos/" + id,
    data: {
      _method: "PATCH",
      todo: todo
    },
    success: function(data) {
      this.todoView.stopEditing(data.id);
    }.bind(this),
    error: function(jqXHR) {
      alert(jqXHR.responseText);
    }.bind(this)
  });
};
