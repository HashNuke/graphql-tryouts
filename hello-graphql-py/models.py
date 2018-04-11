from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy import Column, BigInteger, Text, TIMESTAMP
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

class Like(Base):
    __tablename__ = 'likes'

    id = Column(BigInteger, primary_key=True)
    post_id = Column(BigInteger)
    user_id = Column(BigInteger)
    created_at = Column(TIMESTAMP)
    updated_at = Column(TIMESTAMP)

class Post(Base):
    __tablename__ = 'posts'

    id = Column(BigInteger, primary_key=True)
    title = Column(Text)
    user_id = Column(BigInteger)
    created_at = Column(TIMESTAMP)
    updated_at = Column(TIMESTAMP)
