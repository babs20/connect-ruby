class User < ApplicationRecord
  include Devise::JWT::RevocationStrategies::JTIMatcher

  devise :database_authenticatable,
         :registerable,
         :jwt_authenticatable,
          jwt_revocation_strategy: self

  def generate_jwt
    JWT.encode({ id: id, exp: 1.day.from_now.to_i }, Rails.application.credentials.fetch(:secret_key_base))
  end
end
