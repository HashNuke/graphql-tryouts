Types::UserType = GraphQL::ObjectType.define do
  name "User"
  implements GraphQL::Relay::Node.interface
end
