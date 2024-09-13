module JwtCookies
  extend ActiveSupport::Concern

  def set_jwt_cookies(response, token)
    response.set_cookie(
      :jwt,
      {
        value: token,
        expires: 1.day.from_now,
        httponly: true,
        secure: Rails.env.production?,
        same_site: :lax
      }
    )
  end

  def remove_jwt_cookies(response)
    response.delete_cookie(:jwt)
  end
end
