class UserSerializer
  include JSONAPI::Serializer
  set_key_transform :camel_lower
  attributes :id, :email

  # add param for showing role for the current group
  attributes :role, if: Proc.new { |record, params| params && params[:group_id] } do |user, params|
    user.user_groups.where(group_id: params[:group_id]).first&.role
  end
end
