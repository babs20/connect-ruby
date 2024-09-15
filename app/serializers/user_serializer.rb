class UserSerializer
  include JSONAPI::Serializer
  set_key_transform :camel_lower
  attributes :id, :email, :created_at, :updated_at
end
