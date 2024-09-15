class ApplicationController < ActionController::API
  include CanCan::ControllerAdditions
  include ActionController::Cookies
  include ApiResponse
  include JwtCookies

  before_action :set_current_user
  check_authorization unless: :devise_controller?

  rescue_from CanCan::AccessDenied do |exception|
    render json: { message: exception.message }, status: :forbidden
  end

  private

  def set_current_user
    @current_user = current_user
  end

  def current_user
    return @current_user if defined?(@current_user)

    token = jwt_token
    return nil unless token

    begin
      decoded_token = JWT.decode(
        token,
        Rails.application.credentials.fetch(:secret_key_base),
        true,
        { algorithm: "HS256" }
      )
      jti = decoded_token.first["jti"]
      return nil if JwtDenylist.exists?(jti: jti)
      @current_user = User.find(decoded_token.first["sub"])
    rescue JWT::DecodeError, ActiveRecord::RecordNotFound
      nil
    end
  end

  def jwt_token
    request.cookies["jwt"] || request.headers["Authorization"]&.split(" ")&.last
  end
end
