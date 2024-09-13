class AddCascadeDeleteToUserGroups < ActiveRecord::Migration[7.2]
  def change
    remove_foreign_key :user_groups, :groups
    add_foreign_key :user_groups, :groups, on_delete: :cascade
  end
end
