class Group < ApplicationRecord
  enum :privacy_setting, { public: 0, private: 1, invitation_only: 2 }, prefix: true, default: :public
  validates :name, presence: true
end
