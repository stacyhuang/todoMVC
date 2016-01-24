class CreateTodos < ActiveRecord::Migration
  def change
    create_table :todos do |t|
      t.text :description
      t.integer :status

      t.timestamps null: false
    end
  end
end
