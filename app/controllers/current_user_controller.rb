class CurrentUserController < ApplicationController
  authorize_resource class: false

  def index
    if current_user
    render json: {
      message: "User data retrieved successfully",
      user: UserSerializer.new(current_user).serializable_hash[:data][:attributes]
    }, status: :ok
    else
      render json: { error: "User not found" }, status: :not_found
    end
  end
end
