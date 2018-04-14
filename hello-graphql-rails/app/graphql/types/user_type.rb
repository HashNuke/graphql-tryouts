Types::UserType = GraphQL::ObjectType.define do
  name "User"
  implements GraphQL::Relay::Node.interface

  global_id_field :id

  field :name, types.String, "The name of the User"
end
