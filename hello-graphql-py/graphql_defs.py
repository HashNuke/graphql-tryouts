import graphene
from graphene_sqlalchemy import SQLAlchemyObjectType, SQLAlchemyConnectionField
from models import User as UserModel, Post as PostModel, Like as LikeModel, create_session
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


class Post(SQLAlchemyObjectType):
    # users_who_liked = graphene.List(lambda: UserType, description="users who liked post")

    # def resolve_users_who_liked(self, info):
    #     pprint("RESOLVE: usersWhoLiked")
    #     pprint(info)
    #     return [UserType(id="123", name="Tommy")]

    class Meta:
        model = PostModel
        interfaces = (relay.Node,)


class Query(graphene.ObjectType):
    # node = relay.Node.Field()
    hello_python = graphene.String(description='A typical hello world')
    posts_by_user_id = graphene.Field(graphene.List(Post), user_id=graphene.String())

    def resolve_hello_python(self, info):
        return 'Hello from Python'

    def resolve_posts_by_user_id(self, info, **args):
        user_id = args.get('user_id')
        pprint("USER ID: {}".format(user_id))
        return Post.get_query(info).filter(PostModel.user_id == 1)

    # def resolve_users(self, info):
    #     query = UserType.get_query(info)  # SQLAlchemy query
    #     return query.all()
