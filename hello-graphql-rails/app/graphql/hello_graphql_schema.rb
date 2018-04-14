HelloGraphqlSchema = GraphQL::Schema.define do
  mutation(Types::MutationType)
  query(Types::QueryType)

  id_from_object ->(object, type_definition, query_ctx) {
    node_id = GraphQL::Schema::UniqueWithinType.encode(type_definition.name, object.id)
    puts("object_from_id: OUTPUT: #{node_id}")
    return node_id
  }

  object_from_id ->(id, query_ctx) {
    puts("object_from_id: OUTPUT: #{id}")
    puts(id)
    type_name, item_id = GraphQL::Schema::UniqueWithinType.decode(id)

    puts type_name

    # Now, based on `type_name` and `id`
    # find an object in your application
    # ....
  }

  resolve_type ->(type, obj, ctx) {
    puts("RESOLVE type")
    case obj
    when User
      Types::UserType
    else
      raise("Unexpected object: #{obj}")
    end
  }
end
