from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, relationship
from sqlalchemy import Column, BigInteger, Text, TIMESTAMP, ForeignKey
from sqlalchemy.ext.declarative import declarative_base
import projectconfig

Base = declarative_base()

def create_session():
  engine = create_engine(projectconfig.db_url, echo=True)
  Session = sessionmaker(bind=engine)
  return Session()

class User(Base):
    __tablename__ = 'users'

    id = Column(BigInteger, primary_key=True)
    name = Column(Text)
    created_at = Column(TIMESTAMP)
    updated_at = Column(TIMESTAMP)

    authored_posts = relationship("Post", back_populates="author")
    likes = relationship("Like", back_populates="user")


class Post(Base):
    __tablename__ = 'posts'

    id = Column(BigInteger, primary_key=True)
    title = Column(Text)
    user_id = Column(BigInteger)
    created_at = Column(TIMESTAMP)
    updated_at = Column(TIMESTAMP)

    user_id = Column(BigInteger, ForeignKey(User.id))
    author = relationship("User", back_populates="authored_posts")

    likes = relationship("Like", back_populates="post")


class Like(Base):
    __tablename__ = 'likes'

    id = Column(BigInteger, primary_key=True)

    post_id = Column(BigInteger, ForeignKey(Post.id))
    post = relationship("Post", back_populates="likes")

    user_id = Column(BigInteger, ForeignKey(User.id))
    user = relationship("User", back_populates="likes")

    created_at = Column(TIMESTAMP)
    updated_at = Column(TIMESTAMP)
