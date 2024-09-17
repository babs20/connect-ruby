class Ability
  include CanCan::Ability

  def initialize(user)
    user ||= User.new
    can :read, :all
    can :read, :current_user

    # can only create if user is logged in
    if user.persisted?
      can :create, Group
      can :my, Group
      can [ :update, :destroy ], Group do |group|
        group.user_groups.exists?(user: user, role: [ :owner, :admin ])
      end
    end
  end
end
