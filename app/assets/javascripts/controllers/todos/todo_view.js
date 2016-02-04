function TodoView(config) {
  this.$todoCount = config.todoCount;
  this.$todoItems = config.todoItems;
  this.$btnDisplayAll = config.btnDisplayAll;
  this.$btnDisplayActive = config.btnDisplayActive;
  this.$btnDisplayCompleted = config.btnDisplayCompleted;
  this.$newTodoTemplate = Handlebars.compile($("#new-todo-template").html());

  this.init();
}

TodoView.prototype.init = function() {
  this.$btnDisplayAll.on("click", $.proxy(this.displayAll, this));
  this.$btnDisplayActive.on("click", $.proxy(this.displayActive, this));
  this.$btnDisplayCompleted.on("click", $.proxy(this.displayCompleted, this));
};

TodoView.prototype.addTodo = function(data) {
  this.$todoItems.append(this.$newTodoTemplate(data));
  this.addTodoCount();
};

TodoView.prototype.deleteTodo = function(id) {
  var $deletedTodo = $(".todo-item[data-todo-id=" + id + "]");
  var status = $deletedTodo.attr("data-todo-status");

  if (status === "active") {
    this.subtractTodoCount();
  }
  $deletedTodo.remove();
};

TodoView.prototype.clearCompleted = function() {
  var $completedTodos = $(".todo-item[data-todo-status=completed]").toArray();

  $completedTodos.forEach(function(completedTodo) {
    var id = completedTodo.getAttribute('data-todo-id');
    this.deleteTodo(id);
  }.bind(this));
};

TodoView.prototype.addTodoCount = function() {
  var todoCount = parseInt(this.$todoCount.text(), 10);
  this.$todoCount.text(todoCount + 1);
};

TodoView.prototype.subtractTodoCount = function() {
  var todoCount = parseInt(this.$todoCount.text(), 10);
  this.$todoCount.text(Math.max(todoCount - 1, 0));
};

TodoView.prototype.toggleStatus = function(id) {
  var $todo = $(".todo-item[data-todo-id=" + id + "]");
  $todo.find(".ctn-todo-description").toggleClass("completed");

  var status = $todo.attr("data-todo-status")  === "active" ? "completed" : "active";
  $todo.attr("data-todo-status", status);

  if (status === "completed") {
    this.subtractTodoCount();
  } else {
    this.addTodoCount();
  }
};

TodoView.prototype.startEditing = function(todo) {
  todo.prop("readonly", false).addClass("editing");
};

TodoView.prototype.stopEditing = function(id) {
  var $todo = $(".todo-item[data-todo-id=" + id + "]");
  var $ctnTodoDescription = $todo.find(".ctn-todo-description");
  $ctnTodoDescription.prop("readonly", true).removeClass("editing");
};

TodoView.prototype.displayAll = function() {
  this.$todoItems.children().each(function(index, value){
    $(this).removeClass("hidden");
  });
};

TodoView.prototype.displayActive = function() {
  this.$todoItems.children().each(function(index, value) {
    if ($(this).attr("data-todo-status") == "active") {
      $(this).removeClass("hidden");
    } else {
      $(this).addClass("hidden");
    }
  });
};

TodoView.prototype.displayCompleted = function() {
  this.$todoItems.children().each(function(index, value) {
    if ($(this).attr("data-todo-status") == "completed") {
      $(this).removeClass("hidden");
    } else {
      $(this).addClass("hidden");
    }
  });
};
