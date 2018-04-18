import graphene
from graphene_sqlalchemy import SQLAlchemyObjectType, SQLAlchemyConnectionField
from models import User, Post, Like, create_session
from pprint import pprint
from graphene import relay


# class LikeType(SQLAlchemyObjectType):
#     class Meta:
#         model = Like
#         interfaces = (relay.Node,)


# class UserType(SQLAlchemyObjectType):
#     class Meta:
#         model = User
#         interfaces = (relay.Node,)
#         # only_fields = ('id', 'name', 'created_at')


# class PostType(SQLAlchemyObjectType):
#     users_who_liked = graphene.List(lambda: UserType, description="users who liked post")

#     def resolve_users_who_liked(self, info):
#         pprint("RESOLVE: usersWhoLiked")
#         pprint(info)
#         return [UserType(id="123", name="Tommy")]

#     class Meta:
#         model = Post
#         interfaces = (relay.Node,)


class Query(graphene.ObjectType):
    # users = graphene.List(UserType)
    hello = graphene.String(description='A typical hello world')
    node = relay.Node.Field()

    def resolve_hello(self, info):
        return 'World'

    # def resolve_users(self, info):
    #     query = UserType.get_query(info)  # SQLAlchemy query
    #     return query.all()
