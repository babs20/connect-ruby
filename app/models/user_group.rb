class UserGroup < ApplicationRecord
  enum :role, { guest: 0, member: 1, moderator: 2, admin: 3, owner: 4 }, prefix: true, default: :member
  belongs_to :user
  belongs_to :group
end
