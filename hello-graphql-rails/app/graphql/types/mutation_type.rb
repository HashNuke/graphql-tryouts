Types::MutationType = GraphQL::ObjectType.define do
  name "Mutation"

  # TODO: Remove me
  field :testField, types.String do
    description "An example field added by the generator"
    resolve ->(obj, args, ctx) {
      "Hello World!"
    }
  end


  field :testErrorField, types.String do
    description "An example field added by the generator"
    resolve ->(obj, args, ctx) {
      # "Hello World!"

      errors = [
        {
          message: 'Bad image URL',
          extensions: {
            code: 'SY-10034',
            context: {bad_url: "http://example.com"}
          }
        },

        {
          message: 'Duplicate location',
          extensions: {
            code: 'SY-10035',
            context: {location_id: "123"}
          }
        }
      ]

      raise GeneralError.new(errors)
    }
  end
end
