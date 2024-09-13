class Users::SessionsController < Devise::SessionsController
  include RackSessionFix
  include JwtCookies
  respond_to :json

  def create
    super do |user|
      if user.persisted?
        token = user.generate_jwt
        set_jwt_cookies(response, token)
      end
    end
  end

  private

  def respond_with(resource, _opts = {})
    if resource.persisted?
      render json: { message: "Logged in successfully.", user: UserSerializer.new(resource).serializable_hash[:data][:attributes] }, status: :ok
    else
      render json: { message: "Login failed." }, status: :unauthorized
    end
  end

  def respond_to_on_destroy
    token = jwt_token
    if token
      begin
        decoded_token = JWT.decode(
          token,
          Rails.application.credentials.fetch(:secret_key_base),
          true,
          { algorithm: "HS256" }
        )
        jti = decoded_token.first["jti"]
        JwtDenylist.create!(jti: jti, expired_at: Time.now)
      rescue JWT::DecodeError
        # Token is invalid, but we'll continue with logout process
      end
    end

    remove_jwt_cookie
    sign_out(current_user)
    render json: { message: "Logged out successfully." }, status: :ok
  end

  def jwt_token
    request.cookies["jwt"] || request.headers["Authorization"]&.split(" ")&.last
  end
end
