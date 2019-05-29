class GraphqlController < ApplicationController
  skip_before_action :verify_authenticity_token

  rescue_from GeneralError, with: :general_error

  def execute
    variables = ensure_hash(params[:variables])
    query = params[:query]
    operation_name = params[:operationName]
    context = {
      # Query context goes here, for example:
      # current_user: current_user,
    }

    puts query
    # puts variables.inspect
    # puts context.inspect
    # puts operation_name.inspect

    # byebug
    result = HelloGraphqlSchema.execute(query, variables: variables, context: context, operation_name: operation_name)
    render json: result
  end


  def general_error(exception)
    render json: {data: {}, errors: exception.errors}
  end

  private

  # Handle form data, JSON body, or a blank value
  def ensure_hash(ambiguous_param)
    case ambiguous_param
    when String
      if ambiguous_param.present?
        ensure_hash(JSON.parse(ambiguous_param))
      else
        {}
      end
    when Hash, ActionController::Parameters
      ambiguous_param
    when nil
      {}
    else
      raise ArgumentError, "Unexpected parameter: #{ambiguous_param}"
    end
  end
end
