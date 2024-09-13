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

  def destroy
    super do |user|
      remove_jwt_cookies(response)
    end
  end

  private

  def respond_with(resource, _opts = {})
    render json: {
      message: "Logged in successfully.",
      data: UserSerializer.new(resource).serializable_hash[:data][:attributes]
    }, status: :ok
  end

  def respond_to_on_destroy
  if request.headers["Authorization"].present?
    jwt_payload = JWT.decode(request.headers["Authorization"].split(" ").last, ENV["DEVISE_JWT_SECRET_KEY"]).first
    current_user = User.find(jwt_payload["sub"])
    if current_user
      remove_jwt_cookies(response)
      render json: { message: "Logged out successfully." }, status: :ok
    else
      render json: { message: "Couldn't find an active session." }, status: :unauthorized
    end
  else
    render json: { message: "Logged out successfully." }, status: :ok
  end
  rescue JWT::DecodeError
    render json: { message: "Invalid token" }, status: :unauthorized
  end
end
