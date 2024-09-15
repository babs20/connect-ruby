class GroupsController < ApplicationController
  load_and_authorize_resource
  before_action :set_group, only: %i[ show update destroy ]

  def index
    @groups = Group.all.select do |group|
      group.privacy_setting == "public" || group.users.include?(current_user)
    end

    render json: api_response(GroupSerializer, @groups, "Groups retrieved successfully"), status: :ok
  end

  def show
    render json: api_response(GroupSerializer, @group, "Group retrieved successfully"), status: :ok
  end

  def create
  @group = Group.new(group_params)

  ActiveRecord::Base.transaction do
    @group.save!
    @group.user_groups.create!(user: current_user, role: :admin)
  end

  render json: api_response(GroupSerializer, @group, "Group created successfully"), status: :created, location: @group

  rescue ActiveRecord::RecordInvalid => e
    @group.errors.merge!(e.record.errors) if e.record != @group
    render json: api_response_no_data(@group.errors.full_messages.join(", ")), status: :unprocessable_entity
  end

  def update
    if @group.update(group_params)
      render json: api_response(GroupSerializer, @group, "Group updated successfully"), status: :ok
    else
      render json: api_response_no_data(@group.errors.full_messages.join(", ")), status: :unprocessable_entity
    end
  end

  def destroy
    @group.destroy!
  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_group
      @group = Group.find(params[:id])
    end

  # Only allow a list of trusted parameters through.
  def group_params
    params.require(:group).permit(:name, :description, :privacy_setting)
  end
end
