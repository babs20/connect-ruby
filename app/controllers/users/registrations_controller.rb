class Users::RegistrationsController < Devise::RegistrationsController
  respond_to :json

  def create
    build_resource(sign_up_params)
    resource.save
    render_resource(resource)
  end

  private

  def render_resource(resource)
    if resource.errors.empty?
      render json: { message: "Signed up successfully.", user: resource }, status: :ok
    else
      render json: { message: "Sign up failure.", errors: resource.errors }, status: :unprocessable_entity
    end
  end
end
