import graphene
from graphene_sqlalchemy import SQLAlchemyObjectType, SQLAlchemyConnectionField
from models import User, Post, Like, create_session
from pprint import pprint
from graphene import relay


class LikeType(SQLAlchemyObjectType):
    # user = SQLAlchemyConnectionField(lambda: UserType)
    # post = SQLAlchemyConnectionField(lambda: PostType)

    # def resolve_user(self, args, context, info):
    #     return []

    # def resolve_post(self, args, context, info):
    #     return []

    class Meta:
        model = Like
        interfaces = (relay.Node,)


class UserType(SQLAlchemyObjectType):
    # posts = SQLAlchemyConnectionField(lambda: PostType)
    # likes = SQLAlchemyConnectionField(lambda: LikeType)

    # def resolve_likes(self, args, context, info):
    #     return []

    # def resolve_posts(self, args, context, info):
    #     return []

    class Meta:
        model = User
        interfaces = (relay.Node,)
        # only_fields = ('id', 'name', 'created_at')


class PostType(SQLAlchemyObjectType):
    users_who_liked = graphene.Field(UserType, description='User type')
    # author = SQLAlchemyConnectionField(UserType)
    # likes = SQLAlchemyConnectionField(LikeType)

    # def resolve_user(self, args, context, info):
    #     return []

    # def resolve_likes(self, args, context, info):
    #     return []

    def resolve_users_who_liked(self, info):
        return UserType(name="Tommy")

    class Meta:
        model = Post
        interfaces = (relay.Node,)


class Query(graphene.ObjectType):
    users = graphene.List(UserType)
    hello = graphene.String(description='A typical hello world')

    def resolve_hello(self, info):
        return 'World'

    def resolve_users(self, info):
        query = UserType.get_query(info)  # SQLAlchemy query
        return query.all()
