class GeneralError < StandardError
  attr_accessor :errors
  def initialize(errors)
    @errors = errors
  end
end
