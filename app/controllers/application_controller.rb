class ApplicationController < ActionController::API
  include ActionController::Cookies

  private

  def current_user
    return @current_user if defined?(@current_user)

    token = jwt_token
    return nil unless token

    begin
      decoded_token = JWT.decode(token, Rails.application.credentials.fetch(:secret_key_base), true, { algorithm: "HS256" })
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

  def authenticate_user!
    render json: { message: "Unauthorized" }, status: :unauthorized unless current_user
  end
end
