class CreateGroups < ActiveRecord::Migration[7.2]
  def change
    create_table :groups do |t|
      t.string :name, null: false
      t.text :description
      t.integer :privacy_setting, default: 0

      t.timestamps
    end
    add_index :groups, :privacy_setting
  end
end
