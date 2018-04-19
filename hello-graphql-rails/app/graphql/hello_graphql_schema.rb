HelloGraphqlSchema = GraphQL::Schema.define do
  mutation(Types::MutationType)
  query(Types::QueryType)

  id_from_object ->(object, type_definition, query_ctx) {
    GraphQL::Schema::UniqueWithinType.encode(type_definition.name, object.id)
  }

  object_from_id ->(id, query_ctx) {
    type_name, item_id = GraphQL::Schema::UniqueWithinType.decode(id)
    type_name.constantize.find(item_id)
  }

  resolve_type ->(type, obj, ctx) {
    puts("RESOLVE #{type} #{obj}")
    case obj
    when User
      Types::UserType
    else
      raise("Unexpected object: #{obj}")
    end
  }
end
