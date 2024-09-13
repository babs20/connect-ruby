class GroupsController < ApplicationController
  load_and_authorize_resource
  before_action :set_group, only: %i[ show update destroy ]

  def index
    @groups = Group.all.select do |group|
      group.privacy_setting == "public" || group.users.include?(current_user)
    end

    render json: @groups
  end

  def show
    render json: @group
  end

  def create
  @group = Group.new(group_params)

  ActiveRecord::Base.transaction do
    @group.save!
    @group.user_groups.create!(user: current_user, role: :admin)
  end

  render json: @group, status: :created, location: @group

  rescue ActiveRecord::RecordInvalid => e
    @group.errors.merge!(e.record.errors) if e.record != @group
    render json: @group.errors, status: :unprocessable_entity
  end

  def update
    if @group.update(group_params)
      render json: @group
    else
      render json: @group.errors, status: :unprocessable_entity
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
