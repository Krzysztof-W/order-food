from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

from createDB import Base, User, Group, GroupInvitation, GroupUsers

engine = create_engine('sqlite:///order_food.db')
Base.metadata.bind = engine
DBSession = sessionmaker(bind=engine)
session = DBSession()

user_wojtek = User(name='Wojtek', password='qwer')
session.add(user_wojtek)
session.commit()

user_krzysio = User(name='Krzysio', password='qwer')
session.add(user_krzysio)
session.commit()

group_old = Group(name='StaraGrupa', owner=user_wojtek)
session.add(group_old)
session.commit()

group_new = Group(name='NowaGrupa', owner=user_krzysio)
session.add(group_new)
session.commit()

new_group_invitation = GroupInvitation(user=user_wojtek, group=group_new)
session.add(new_group_invitation)
session.commit()

old_group_users_wojtek = GroupUsers(user=user_wojtek, group=group_old)
session.add(old_group_users_wojtek)
session.commit()

old_group_users_krzysio = GroupUsers(user=user_krzysio, group=group_old)
session.add(old_group_users_krzysio)
session.commit()

new_group_users_krzysio = GroupUsers(user=user_krzysio, group=group_new)
session.add(new_group_users_krzysio)
session.commit()