from sqlalchemy import Column, ForeignKey, Integer, String, Numeric, Boolean, DateTime
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import relationship
from sqlalchemy import create_engine
from passlib.apps import custom_app_context as pwd_context
from itsdangerous import (TimedJSONWebSignatureSerializer as Serializer, BadSignature, SignatureExpired)

Base = declarative_base()

class User(Base):
    __tablename__ = 'user'
    id = Column(Integer, primary_key=True)
    username = Column(String(32), nullable=False)
    password_hash = Column(String(128), nullable=False)
    
    receivedInvitations = relationship("GroupInvitation", back_populates="user", foreign_keys='GroupInvitation.user_id')
    sentInvitations = relationship("GroupInvitation", back_populates="sender", foreign_keys='GroupInvitation.sender_id')
    
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
        
    def toJson(self):
        return {'id': self.id, 'username': self.username}
        
    def toJsonFull(self):
        receivedInvitationsJson = [ri.toJson() for ri in self.receivedInvitations]
        sentInvitationsJson = [si.toJson() for si in self.sentInvitations]
        return {'id': self.id, 'username': self.username, 'receivedInvitations': receivedInvitationsJson, 'sentInvitations': sentInvitationsJson}
	
class Group(Base):
    __tablename__ = 'group'
    id = Column(Integer, primary_key=True)
    name = Column(String(50), nullable=False)
    owner_id = Column(Integer, ForeignKey('user.id'))
    owner = relationship("User")
    
    groupUsers = relationship("GroupUsers", back_populates="group", foreign_keys='GroupUsers.group_id')
    
    def toJson(self):
        return {'id': self.id, 'name': self.name, 'owner': self.owner.toJson()}

    def toJsonFull(self):
        return {'id': self.id, 'name': self.name, 'owner': self.owner.toJson(),
                'users': [gu.user.toJson() for gu in self.groupUsers]}
	        
class GroupInvitation(Base):
    __tablename__ = 'group_invitation'
    id = Column(Integer, primary_key=True)
    user_id = Column(Integer, ForeignKey('user.id'))
    user = relationship("User", back_populates="receivedInvitations", foreign_keys=[user_id])
    sender_id = Column(Integer, ForeignKey('user.id'))
    sender = relationship("User", back_populates="sentInvitations", foreign_keys=[sender_id])
    group_id = Column(Integer, ForeignKey('group.id'))
    group = relationship("Group")
    
    def toJson(self):
        return {'id': self.id, 'invitedUser': self.user.toJson(), 'sender': self.sender.toJson(), 'group': self.group.toJson()}
	
class GroupUsers(Base):
	__tablename__ = 'group_users'
	id = Column(Integer, primary_key=True)
	user_id = Column(Integer, ForeignKey('user.id'))
	user = relationship("User")
	group_id = Column(Integer, ForeignKey('group.id'))
	group = relationship("Group", back_populates="groupUsers")
	
class FoodProvider(Base):
    __tablename__ = 'food_provider'
    id = Column(Integer, primary_key=True)
    name = Column(String(50), nullable=False)
    address = Column(String(80), nullable=False)
    phone = Column(String(15), nullable=False)
    group_id = Column(Integer, ForeignKey('group.id'))
    group = relationship("Group")
    
    food = relationship("Food", back_populates="food_provider")
    
    def toJson(self):
        return {'id': self.id, 'name': self.name, 'address': self.address, 'phone': self.phone}
                
    def toJsonFull(self):
        return {'id': self.id, 'name': self.name, 'address': self.address, 'phone': self.phone, 
                'group': self.group.toJson(), 'food': [f.toJson() for f in self.food]}
    
class Food(Base):
    __tablename__ = 'food'
    id = Column(Integer, primary_key=True)
    name = Column(String(50), nullable=False)
    description = Column(String(80), nullable=False)
    price = Column(Numeric, nullable=False)
    food_provider_id = Column(Integer, ForeignKey('food_provider.id'))
    food_provider = relationship("FoodProvider", back_populates="food")
    
    def toJson(self):
        return {'id': self.id, 'name': self.name, 'description': self.description,'price': str(self.price)}
   
class Order(Base):
    __tablename__ = 'order'
    id = Column(Integer, primary_key=True)
    description = Column(String(80), nullable=True)
    confirm_date_time = Column(DateTime, nullable=True)
    status = Column(String(1), nullable=False)
    food_provider_id = Column(Integer, ForeignKey('food_provider.id'))
    food_provider = relationship("FoodProvider")
    order_owner_id = Column(Integer, ForeignKey('user.id'))
    order_owner = relationship("User")
    group_id = Column(Integer, ForeignKey('group.id'))
    group = relationship("Group")
    
    ordered_food = relationship("OrderedFood", back_populates="order")
    
    def toJson(self):
        return {'id': self.id, 'description': self.description, 'confirmDateTime': self.confirm_date_time, 'status': self.status,
                'foodProvider': self.food_provider.toJson(), 'orderOwner': self.order_owner.toJson()}
                
    def toJsonFull(self):
        return {'id': self.id, 'description': self.description, 'confirmDateTime': self.confirm_date_time, 'status': self.status,
                'foodProvider': self.food_provider.toJsonFull(), 'orderOwner': self.order_owner.toJson(),
                'orderedFood': [of.toJson() for of in self.ordered_food]}
    
class OrderedFood(Base):
    __tablename__ = 'ordered_food'
    id = Column(Integer, primary_key=True)
    paid = Column(Boolean, default=False, nullable=False)
    user_id = Column(Integer, ForeignKey('user.id'))
    user = relationship("User")
    food_id = Column(Integer, ForeignKey('food.id'))
    food = relationship("Food")
    order_id = Column(Integer, ForeignKey('order.id'))
    order = relationship("Order", back_populates="ordered_food")
    
    def toJson(self):
        return {'id': self.id, 'paid': self.paid, 'user': self.user.toJson(), 'food': self.food.toJson()}
    
engine = create_engine('sqlite:///order_food.db')
Base.metadata.create_all(engine)