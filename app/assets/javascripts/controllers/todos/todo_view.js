function TodoView(config) {
  this.$todoCount = config.todoCount;
  this.$todoItems = config.todoItems;
  this.$btnDisplayAll = config.btnDisplayAll;
  this.$btnDisplayActive = config.btnDisplayActive;
  this.$btnDisplayCompleted = config.btnDisplayCompleted;

  this.init();
}

TodoView.prototype.init = function() {
  this.$btnDisplayAll.on('click', $.proxy(this.displayAll, this));
  this.$btnDisplayActive.on('click', $.proxy(this.displayActive, this));
  this.$btnDisplayCompleted.on('click', $.proxy(this.displayCompleted, this));
  this.$todoItems.on("dblclick", "input[readonly]", $.proxy(this.editTodo, this));
};

TodoView.prototype.addTodoCount = function() {
  var todoCount = parseInt(this.$todoCount.text(), 10);
  this.$todoCount.text(todoCount + 1);
};

TodoView.prototype.subtractTodoCount = function() {
  var todoCount = parseInt(this.$todoCount.text(), 10);
  this.$todoCount.text(Math.max(todoCount - 1, 0));
};

TodoView.prototype.displayAll = function() {
  this.$todoItems.children().each(function(index, value){
    $(this).removeClass('hidden');
  });
};

TodoView.prototype.displayActive = function() {
  this.$todoItems.children().each(function(index, value) {
    if ($(this).attr('data-todo-status') == 'active') {
      $(this).removeClass('hidden');
    } else {
      $(this).addClass('hidden');
    }
  });
};

TodoView.prototype.displayCompleted = function() {
  this.$todoItems.children().each(function(index, value) {
    if ($(this).attr('data-todo-status') == 'completed') {
      $(this).removeClass('hidden');
    } else {
      $(this).addClass('hidden');
    }
  });
};

TodoView.prototype.removeTodo = function(id) {
  var deletedTodo = $(".todo-item[data-todo-id=" + id + "]");
  deletedTodo.remove();
};

TodoView.prototype.editTodo = function(event) {
  var thisEl = $(event.currentTarget);
  thisEl.removeAttr('readonly').addClass('editing');
};

TodoView.prototype.toggleStatus = function(id) {
  var $todo = $(".todo-item[data-todo-id=" + id + "]");
  $todo.find('.ctn-todo-description').toggleClass('completed');

  var status = $todo.attr('data-todo-status');
  $todo.attr('data-todo-status', status === 'completed' ? 'active' : 'completed');
};
