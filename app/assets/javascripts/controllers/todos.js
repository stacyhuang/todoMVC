$(function() {
  if (!$('#todos-index').length) {
    return;
  }

  $('.input-todo-description').on("keypress", addTodo);
  $('.todo-items').on("keypress", ".ctn-todo-description", updateTodo);
  $('.todo-items').on("click", ".btn-delete-todo", deleteTodo);
  $('.todo-items').on("click", ".ctn-todo-status", toggleStatus);
  $('.todo-items').on("dblclick", "input[readonly]", editTodo);
  $('.btn-clear-completed').on('click', clearCompleted);
  $('.btn-display-all').on('click', displayAll);
  $('.btn-display-active').on('click', displayActive);
  $('.btn-display-completed').on('click', displayCompleted);

  var newTodoTemplate = Handlebars.compile($('#new-todo-template').html());

  function addTodo(event) {
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
        var todosRemaining = parseInt($('#todos-remaining').text(), 10);
        $('#todos-remaining').text(todosRemaining + 1);

        $('.input-todo-description').val('');
        $('.todo-items').append(newTodoTemplate(data));
      },
      error: function(jqXHR) {
        alert(jqXHR.responseText);
      }
    });
  }

  function deleteTodo(event) {
    var todoItem = $(this).closest('.todo-item');
    var id = todoItem.attr('data-todo-id');
    var status = todoItem.find('.ctn-todo-status')[0].checked ? "completed" : "active";
    if (status === 'active') {
      var todosRemaining = parseInt($('#todos-remaining').text(), 10);
      $('#todos-remaining').text(Math.max(todosRemaining - 1, 0));
    }

    $.ajax({
      type: 'POST',
      dataType: 'json',
      url: '/todos/' + id,
      data: {
        _method: 'DELETE',
      },
      success: function(data) {
        var deletedTodo = $(".todo-item[data-todo-id=" + data.id + "]");
        deletedTodo.remove();
      },
      error: function(jqXHR) {
        alert(jqXHR.responseText);
      }
    });
  }

  function toggleStatus(event) {
    var thisEl = $(event.currentTarget);
    var status = thisEl[0].checked ? "completed" : "active";
    var id = $(this).closest('.todo-item').attr('data-todo-id');
    var todo = { "status": status } ;

    $.ajax({
      type: 'POST',
      dataType: 'json',
      url: '/todos/' + id,
      data: {
        _method: 'PATCH',
        todo: todo
      },
      success: function(data) {
        var todosRemaining = parseInt($('#todos-remaining').text(), 10);

        if (data.status === 'completed') {
          todosRemaining--;
        } else {
          todosRemaining++;
        }

        $('#todos-remaining').text(Math.max(todosRemaining, 0));
        var $selectedTodo = $(".todo-item[data-todo-id=" + data.id + "]");
        $selectedTodo.find('.ctn-todo-description').toggleClass('completed');
      },
      error: function(jqXHR) {
        alert(jqXHR.responseText);
      }
    });
  }

  function editTodo(event) {
    var thisEl = $(event.currentTarget);
    thisEl.removeAttr('readonly').addClass('editing');
    var id = $(this).closest('.todo-item').attr('data-todo-id');
  }

  function updateTodo(event) {
    if(event.which !== 13) return;

    event.preventDefault();
    var thisEl = $(event.currentTarget);
    var description = thisEl.val();
    var todo = { "description": description };
    var id = $(this).closest('.todo-item').attr('data-todo-id');

    $.ajax({
      type: 'POST',
      dataType: 'json',
      url: '/todos/' + id,
      data: {
        _method: 'PATCH',
        todo: todo
      },
      success: function(data) {
        $('.ctn-todo-description').attr('readonly', 'readonly').removeClass('editing');
      },
      error: function(jqXHR) {
        alert(jqXHR.responseText);
      }
    });
  }

  function clearCompleted(event) {
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
          var deletedTodo = $(".todo-item[data-todo-id=" + deletedTodos[i]+ "]");
          deletedTodo.remove();
        }
      },
      error: function(jqXHR) {
        alert(jqXHR.responseText);
      }
    });
  }

  function displayAll() {
    $('.todo-all').removeClass('hidden');
    $('.todo-active').addClass('hidden');
    $('.todo-completed').addClass('hidden');
  }

  function displayActive() {
    $('.todo-all').addClass('hidden');
    $('.todo-active').removeClass('hidden');
    $('.todo-completed').addClass('hidden');
  }

  function displayCompleted() {
    $('.todo-all').addClass('hidden');
    $('.todo-active').addClass('hidden');
    $('.todo-completed').removeClass('hidden');
  }

});