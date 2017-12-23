from sqlalchemy import Column, ForeignKey, Integer, String
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import relationship
from sqlalchemy import create_engine
from passlib.apps import custom_app_context as pwd_context
from itsdangerous import (TimedJSONWebSignatureSerializer as Serializer, BadSignature, SignatureExpired)

Base = declarative_base()

class User(Base):
    __tablename__ = 'user'
    id = Column(Integer, primary_key=True)
    username  = Column(String(32), nullable=False)
    password_hash = Column(String(128), nullable=False)
    
    def hash_password(self, password):
        self.password_hash = pwd_context.encrypt(password)
        
    def verify_password(self, password):
        return pwd_context.verify(password, self.password_hash)       
        
    def generate_auth_token(self, secret_key, expiration=600):
        s = Serializer(secret_key, expires_in=expiration)
        return s.dumps({'id': self.id})

    @staticmethod
    def verify_auth_token(token, secret_key, session):
        s = Serializer(secret_key)
        try:
            data = s.loads(token)
        except SignatureExpired:
            return None    # valid token, but expired
        except BadSignature:
            return None    # invalid token
        user = session.query(User).filter(User.id==data['id']).first()
        return user
	
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