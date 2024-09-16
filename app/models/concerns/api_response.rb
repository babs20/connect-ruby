# app/controllers/concerns/api_response.rb
module ApiResponse
  extend ActiveSupport::Concern

  def api_response(serializer, resource, message)
    {
      message: message,
      data: serializer.new(resource).serializable_hash[:data]
    }
  end

  def api_response_paginated(serializer, resource, message)
    {
      message: message,
      data: serializer.new(resource).serializable_hash[:data],
      meta: pagination_meta(resource)
    }
  end

  def api_response_no_data(message)
    {
      message: message,
      data: nil
    }
  end
end
