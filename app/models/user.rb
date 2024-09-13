class User < ApplicationRecord
  include Devise::JWT::RevocationStrategies::JTIMatcher

  devise :database_authenticatable,
         :registerable,
         :jwt_authenticatable,
         jwt_revocation_strategy: JwtDenylist

  has_many :user_groups
  has_many :groups, through: :user_groups

  def generate_jwt
    JWT.encode(
      {
        sub: id,
        jti: SecureRandom.uuid,
        iat: Time.now.to_i,
        exp: 1.day.from_now.to_i
      },
      Rails.application.credentials.fetch(:secret_key_base)
    )
  end
end
