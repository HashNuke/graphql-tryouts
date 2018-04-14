import graphene
from graphene_sqlalchemy import SQLAlchemyObjectType, SQLAlchemyConnectionField
from models import User, create_session
from pprint import pprint

class UserType(SQLAlchemyObjectType):
    posts = SQLAlchemyConnectionField(Post)

    class Meta:
        model = User
        # only_fields = ('id', 'name', 'created_at')


class Query(graphene.ObjectType):
    users = graphene.List(UserType)
    hello = graphene.String(description='A typical hello world')

    def resolve_hello(self, info):
        return 'World'

    def resolve_users(self, info):
        query = UserType.get_query(info)  # SQLAlchemy query
        return query.all()
