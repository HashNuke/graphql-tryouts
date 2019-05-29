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
      raise GeneralError.new('SY-10034', 'Bad image URL', {bad_url: "http://example.com"})
    }
  end
end
