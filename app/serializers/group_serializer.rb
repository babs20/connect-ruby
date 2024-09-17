class GroupSerializer
  include JSONAPI::Serializer
  set_key_transform :camel_lower
  attributes :id, :name, :description, :privacy_setting, :created_at, :updated_at
  attribute :users, if: Proc.new { |record, params| params && params[:include_users] } do |group|
    group.users.map { |user| UserSerializer.new(user, { params: { group_id: group.id } }).serializable_hash[:data][:attributes] }
  end
end
