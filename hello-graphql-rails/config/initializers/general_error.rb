class GeneralError < StandardError
  attr_accessor :errors
  def initialize(code, message, context={})
    @errors = [
      {
        message: message,
        extensions: {
          code: code,
          context: context
        }
      }
    ]
  end
end
