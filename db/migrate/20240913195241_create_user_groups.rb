class CreateUserGroups < ActiveRecord::Migration[7.2]
  def change
    create_table :user_groups do |t|
      t.references :user, null: false, foreign_key: true
      t.references :group, null: false, foreign_key: true
      t.integer :role
      t.datetime :joined_at

      t.timestamps
    end
  end
end
