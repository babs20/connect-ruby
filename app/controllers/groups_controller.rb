class GroupsController < ApplicationController
  load_and_authorize_resource
  before_action :set_group, only: %i[ show update destroy ]

  def index
    groups = Group.where(privacy_setting: "public").or(Group.where(id: current_user&.group_ids || -1))
    groups = groups.where(filter_params) if params[:filter].present?
    groups = groups.order(sort_params) if params[:sort].present?

    # Pagination
    page = params[:page] || 1
    per_page = [ params[:per_page].to_i, 100 ].min.nonzero? || 25
    groups = groups.page(page).per(per_page)

    render json: api_response_paginated(GroupSerializer, groups, "Groups retrieved successfully"), status: :ok
  end

  def my
    groups = current_user&.groups || Group.none

    # Pagination
    page = params[:page] || 1
    per_page = [ params[:per_page].to_i, 100 ].min.nonzero? || 25
    groups = groups.page(page).per(per_page)

    render json: api_response_paginated(GroupSerializer, groups, "My groups retrieved successfully"), status: :ok
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

    def filter_params
      params.require(:filter).permit(:privacy_setting)
    end

    def sort_params
      sort = { created_at: :desc }

      if params[:sort].present?
        sort = {}

        params[:sort].split(",").each do |s|
          key, order = s.split(":")
          sort[key.to_sym] = order.to_sym || :asc
        end
      end

      sort
    end
end
