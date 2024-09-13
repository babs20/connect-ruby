class Users::RegistrationsController < Devise::RegistrationsController
  include RackSessionFix
  include JwtCookies
  respond_to :json

  def create
    # Build a new resource (user) with the provided sign_up_params
    build_resource(sign_up_params)

    # Save the resource to the database
    resource.save

    # Check if the resource was successfully saved
    if resource.persisted?
      # Check if the resource is active for authentication
      if resource.active_for_authentication?
        # Sign up the user and generate a JWT token
        sign_up(resource_name, resource)
        token = resource.generate_jwt
        # Set the JWT token as cookies in the response
        set_jwt_cookies(response, token)
        # Respond with the resource (user)
        respond_with resource
      else
        # Expire any data related to sign in
        expire_data_after_sign_in!
        # Respond with the resource (user)
        respond_with resource
      end
    else
      # Clean up any password fields in the resource
      clean_up_passwords resource
      # Set the minimum password length requirement
      set_minimum_password_length
      # Respond with the resource (user)
      respond_with resource
    end
  end

  private

  def respond_with(resource, _opts = {})
    if resource.persisted?
      render json: {
        message: "Signed up successfully.",
        user: UserSerializer.new(resource).serializable_hash[:data][:attributes]
      }, status: :ok
    else
      render json: {
        message: "User couldn't be created successfully. #{resource.errors.full_messages.to_sentence}"
      }, status: :unprocessable_entity
    end
  end
end
