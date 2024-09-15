class UserGroupSerializer
  include JSONAPI::Serializer
  attributes :role, :joined_at
end
