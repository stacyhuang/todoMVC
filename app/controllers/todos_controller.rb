class TodosController < ApplicationController
  def index
    @todos = Todo.all.order(created_at: :asc)
    @active_todos = Todo.active
  end

  def create
    @todo = Todo.create(todo_params)
    render json: { id: @todo.id, status: @todo.status, description: @todo.description }
  end

  def update
    todo = Todo.find_by_id(params[:id])
    todo.update(todo_params)
    render json: { id: todo.id, status: todo.status}
  end

  def destroy
    if params[:id] == 'completed'
      todos = Todo.completed
      id = todos.pluck(:id)
      todos.destroy_all
      render json: { id: id }
    else
      todo = Todo.find_by_id(params[:id])
      todo.destroy
      render json: { id: todo.id, status: todo.status }
    end
  end

  private
  def todo_params
    params.require(:todo).permit(:description, :status)
  end
end
