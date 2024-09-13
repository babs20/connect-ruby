class CurrentUserController < ApplicationController
  before_action :authenticate_user!

  def index
    if current_user
      render json: {
        message: "User data retrieved successfully",
        user: UserSerializer.new(current_user).serializable_hash[:data][:attributes]
      }, status: :ok
    else
      render json: { message: "No user is currently logged in" }, status: :unauthorized
    end
  end
end
