class Todo < ActiveRecord::Base
  after_initialize :default_values, unless: :persisted?
  validates_presence_of :description
  enum status: [:active, :completed]

  def default_values
    self.status = 'active'
  end
end