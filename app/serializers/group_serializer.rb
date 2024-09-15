class GroupSerializer
  include JSONAPI::Serializer
  set_key_transform :camel_lower
  attributes :id, :name, :description, :privacy_setting, :created_at, :updated_at
end
