Types::QueryType = GraphQL::ObjectType.define do
  name "Query"
  # Add root-level fields here.
  # They will be entry points for queries on your schema.

  # TODO: remove me
  field :testField, types.String do
    description "An example field added by the generator"
    resolve ->(obj, args, ctx) {
      "Hello World!"
    }
  end



  connection :allUsers, Types::UserType.connection_type do
    resolve ->(obj, args, ctx) {
      User.all
    }
  end

  # field :allUsers, Types::UserType.to_list_type do
  #   description "Get list of all users"
  #   resolve ->(obj, args, ctx) {
  #     User.all
  #   }
  # end

  field :node, GraphQL::Relay::Node.field
  field :nodes, GraphQL::Relay::Node.plural_field
end
