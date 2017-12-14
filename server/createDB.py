from sqlalchemy import Column, ForeignKey, Integer, String
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import relationship
from sqlalchemy import create_engine

Base = declarative_base()

class User(Base):
    __tablename__ = 'user'
    id = Column(Integer, primary_key=True)
    name = Column(String(250), nullable=False)
    password = Column(String(250), nullable=False)
	
class Group(Base):
	__tablename__ = 'group'
	id = Column(Integer, primary_key=True)
	name = Column(String(250), nullable=False)
	owner_id = Column(Integer, ForeignKey('user.id'))
	owner = relationship("User")
	
class GroupInvitation(Base):
	__tablename__ = 'group_invitation'
	id = Column(Integer, primary_key=True)
	user_id = Column(Integer, ForeignKey('user.id'))
	user = relationship(User)
	group_id = Column(Integer, ForeignKey('group.id'))
	group = relationship(Group)
	
class GroupUsers(Base):
	__tablename__ = 'group_users'
	id = Column(Integer, primary_key=True)
	user_id = Column(Integer, ForeignKey('user.id'))
	user = relationship(User)
	group_id = Column(Integer, ForeignKey('group.id'))
	group = relationship(Group)
	
engine = create_engine('sqlite:///order_food.db')
Base.metadata.create_all(engine)