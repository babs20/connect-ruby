class CurrentUserController < ApplicationController
  authorize_resource class: false

  def index
    if current_user
      render json: api_response(UserSerializer, current_user, "User data retrieved success"), status: :ok
    else
      render json: api_response_no_data("User not found"), status: :not_found
    end
  end
end
