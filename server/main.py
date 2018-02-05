from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

from createDB import Base, User, Group, GroupInvitation, GroupUsers, FoodProvider, Food, Order, OrderedFood

from flask import Flask, jsonify, abort, request, g, url_for
from flask_httpauth import HTTPBasicAuth
import json
from flask_cors import CORS

import re

#flask app
app = Flask(__name__)
app.secret_key = "super secret key"

CORS(app)

#database SQLAlchemy
engine = create_engine('sqlite:///order_food.db')
Base.metadata.bind = engine
DBSession = sessionmaker(bind=engine)
session = DBSession()

#auth
auth = HTTPBasicAuth()
    
@app.route('/register', methods = ['POST'])
def register():
    username = request.json.get('username')
    password = request.json.get('password')
    
    if username is None or password is None:
        abort(400) # missing arguments
    if not re.match('^[a-zA-Z0-9_]+$',username): 
        abort(400)
    if session.query(User).filter(User.username==username).first() is not None:
        abort(400) # existing user
    user = User(username = username)
    user.hash_password(password)
    session.add(user)
    session.commit()
    return jsonify({ 'id': user.id, 'username': user.username }), 201, {'Location': url_for('get_user_account', id = user.id, _external = True)}

@auth.verify_password
def verify_password(username_or_token, password):
    # first try to authenticate by token
    user = User.verify_auth_token(username_or_token, app.secret_key, session)
    if not user:
        # try to authenticate with username/password
        user = session.query(User).filter(User.username==username_or_token).first()
        if not user or not user.verify_password(password):
            return False
    g.user = user
    return True
     
@app.route('/login')
@auth.login_required
def get_auth_token():
    token = g.user.generate_auth_token(app.secret_key, 600)
    return jsonify({'token': token.decode('ascii'), 'duration': 600})
    
@app.route('/account', methods=['GET'])
@auth.login_required
def get_user_account():
    return jsonify(g.user.toJsonFull())
    
"""@app.route('/users/<int:id>', methods=['GET'])
@auth.login_required
def get_user(id):
    user = session.query(User).filter(User.id==id)
    if not user:
        abort(400)
    return jsonify(user.toJsonFull())"""
    
@app.route('/users/<string:partial_name>', methods=['GET'])
@auth.login_required
def get_users(partial_name):
    list = [user.toJson() for user in session.query(User).filter(User.username.like('%'+partial_name+'%')).all()]
    return jsonify({'users': list})
    
@app.route('/createGroup', methods=['POST'])
@auth.login_required
def createGroup():
    name = request.json.get('name')
    if name is None:
        abort(400) # missing argument
    group = Group(name = name, owner = g.user)
    session.add(group)
    session.commit()
    return jsonify({'group': group.toJson()}), 201

@app.route('/groups', methods=['GET'])
@auth.login_required
def get_groups():
    groups = [group.toJson() for group in session.query(Group).join(Group.groupUsers).filter(GroupUsers.user_id==g.user.id).all()]
    groups.extend([group.toJson() for group in session.query(Group).filter(Group.owner_id==g.user.id).all()])
    return jsonify({'groups': groups})
    
@app.route('/groups/<int:group_id>', methods=['GET', 'PUT', 'DELETE'])
@auth.login_required
def groups_data(group_id):
    group = session.query(Group).filter(Group.id==group_id).first()
    if not group:
        abort(400)
    if request.method == 'GET':
        return jsonify({'group': group.toJsonFull()})
    elif request.method == 'PUT' and group.owner_id==g.user.id:
        name = request.json.get('name')
        if name is None:
            abort(400) # missing argument
        else:
            group.name=name
            session.commit()
            return jsonify({'group': group.toJsonFull()}), 200
    elif group.owner_id==g.user.id:
        session.delete(group)
        session.commit()
        return jsonify({}), 200
    
@app.route('/groups/<int:group_id>/users/<int:user_id>', methods=['DELETE'])
@auth.login_required
def groups_data_users(group_id, user_id):
    group = session.query(Group).filter(Group.id==group_id).first()
    gu = session.query(GroupUsers).filter(GroupUsers.user_id==user_id, GroupUsers.group_id==group_id).first()
    if gu and group:
        if(group.owner_id == g.user.id or gu.user_id==g.user.id):   
            session.delete(gu)
            session.commit()
            return jsonify({}), 200
        else:
            abort(400)
    else:
        abort(400)
    
@app.route('/groups/<int:group_id>/users/<int:user_id>/invitation', methods=['POST'])
@auth.login_required
def groups_data_users_invitation(group_id, user_id):
    group = session.query(Group).filter(Group.id==group_id).first()
    user = session.query(User).filter(User.id==user_id).first()
    if user and group:
        if group_owner_or_user(group):
            invitation = GroupInvitation(group = group, user = user, sender = g.user)
            session.add(invitation)
            session.commit()
            return jsonify({'invitation': invitation.toJson()}), 201
        else:
            return jsonify({}), 401
    else:
        abort(400) #wrong arguments
    
@app.route('/invitations/<int:invitation_id>', methods=['PUT', 'DELETE'])
@auth.login_required
def put_delete_invitations(invitation_id):
    invitation = session.query(GroupInvitation).filter(GroupInvitation.id==invitation_id).first()
    if invitation:
        if invitation.user_id != g.user.id:
            return jsonify({}), 401
        if request.method == 'PUT':
            decision = request.json.get('decision')
            if decision is None:
                abort(400)
            if decision:
                gu = GroupUsers(group = invitation.group, user = invitation.user)
                session.add(gu)
        session.delete(invitation)
        session.commit()
        return jsonify({}), 200
    else:
        abort(400) #wrong arguments
        
@app.route('/groups/<int:group_id>/createFoodProvider', methods=['POST'])
@auth.login_required
def post_food_provider(group_id):
    group = session.query(Group).filter(Group.id==group_id).first()
    if group:
        if group.owner_id != g.user.id:
            return jsonify({}), 401
        name = request.json.get('name')
        address = request.json.get('address')
        phone = request.json.get('phone')
        if name is None or address is None or phone is None:
            abort(400) # missing argument
        foodProvider = FoodProvider(name = name, address = address, phone = phone, group = group)
        session.add(foodProvider)
        session.commit()
        return jsonify({'foodProvider': foodProvider.toJson()}), 201
    else:
        abort(400)

@app.route('/groups/<int:group_id>/foodProviders', methods=['GET'])
@auth.login_required
def get_food_providers(group_id):
    group = session.query(Group).filter(Group.id==group_id).first()
    food_providers = session.query(FoodProvider).filter(FoodProvider.group_id==group_id).all()
    if food_providers:
        if not group_owner_or_user(group):
            return jsonify({}), 401
        return jsonify({'foodProviders': [fp.toJsonFull() for fp in food_providers]}), 200
    else:
        abort(400)
        
@app.route('/foodProviders/<int:food_provider_id>', methods=['GET', 'PUT', 'DELETE'])
@auth.login_required 
def get_put_delete_foodProvider(food_provider_id):
    food_provider = session.query(FoodProvider).filter(FoodProvider.id==food_provider_id).first()
    if not food_provider:
        abort(400)
    if request.method == 'GET' and group_owner_or_user(food_provider.group):
        return jsonify({'foodProvider': food_provider.toJsonFull()})
    if food_provider.group.owner_id != g.user.id:
        return jsonify({}), 401
    if request.method == 'PUT':
        name = request.json.get('name')
        address = request.json.get('address')
        phone = request.json.get('phone')
        if name is None or address is None or phone is None:
            abort(400) # missing argument
        else:
            food_provider.name=name
            food_provider.address=address
            food_provider.phone=phone
            session.commit()
            return jsonify({'foodProvider': food_provider.toJsonFull()}), 200
    else:
        session.delete(food_provider)
        session.commit()
        return jsonify({}), 200
        
@app.route('/foodProviders/<int:food_provider_id>/createFood', methods=['POST'])
@auth.login_required
def post_food(food_provider_id):
    food_provider = session.query(FoodProvider).filter(FoodProvider.id==food_provider_id).first()
    if food_provider:
        if food_provider.group.owner_id != g.user.id:
            return jsonify({}), 401
        name = request.json.get('name')
        description = request.json.get('description')
        price = request.json.get('price')
        if name is None or description is None or price is None:
            abort(400) # missing argument
        food = Food(name = name, description = description, price = price, food_provider = food_provider)
        session.add(food)
        session.commit()
        return jsonify({'food': food.toJson()}), 201
    else:
        abort(400)
        
@app.route('/food/<int:food_id>', methods=['GET', 'PUT', 'DELETE'])
@auth.login_required 
def get_put_delete_food(food_id):
    food = session.query(Food).filter(Food.id==food_id).first()
    if not food:
        abort(400)
    if food.food_provider.group.owner_id != g.user.id:
        return jsonify({}), 401
    if request.method == 'GET':
        return jsonify({'food': food.toJson()})
    elif request.method == 'PUT':
        name = request.json.get('name')
        description = request.json.get('description')
        price = request.json.get('price')
        if name is None or description is None or price is None:
            abort(400) # missing argument
        else:
            food.name=name
            food.description=description
            food.price=price
            session.commit()
            return jsonify({'food': food.toJson()}), 200
    else:
        session.delete(food)
        session.commit()
        return jsonify({}), 200
        
@app.route('/foodProviders/<int:food_provider_id>/openOrder', methods=['POST'])
@auth.login_required
def post_open_order(food_provider_id):
    food_provider = session.query(FoodProvider).filter(FoodProvider.id==food_provider_id).first()
    if food_provider:
        if not group_owner_or_user(food_provider.group):
            return jsonify({}), 401
        description = request.json.get('description')
        if description is None:
            abort(400) # missing argument
        order = Order(description = description, status = "N", food_provider = food_provider, order_owner = g.user, group = food_provider.group)
        session.add(order)
        session.commit()
        return jsonify({'order': order.toJson()}), 201
    else:
        abort(400)        

@app.route('/groups/<int:group_id>/orders', methods=['GET'])
@auth.login_required
def get_orders(group_id):
    group = session.query(Group).filter(Group.id==group_id).first()
    orders = session.query(Order).filter(Order.group_id==group_id, Order.status.in_("N","P")).all()
    if group:
        if not group_owner_or_user(group):
            return jsonify({}), 401
        return jsonify({'orders': [o.toJson() for o in orders]}), 200
    else:
        abort(400)
        
@app.route('/orders/<int:order_id>/orderFood', methods=['POST'])
@auth.login_required
def post_order_food(order_id):
    order = session.query(Order).filter(Order.id==order_id, Order.status=="N").first()
    if order:
        if not group_owner_or_user(order.group):
            return jsonify({}), 401
        food_id = request.json.get('id')
        if food_id is None:
            abort(400)
        food = session.query(Food).filter(Food.id==food_id).first()
        if food:
            if food.food_provider.group_id != order.group_id:
                abort(400)
            ordered_food = OrderedFood(user = g.user, food = food, order = order)
            session.add(ordered_food)
            session.commit()
            return jsonify({'order': order.toJsonFull()}), 201            
        else:
            abort(400)
    else:
        abort(400)
        
def group_owner_or_user(group):
    user_ids = [i.user_id for i in group.groupUsers]
    if group.owner_id == g.user.id or g.user.id in user_ids:
        return True
    return False
    
if __name__ == '__main__':
    app.run(debug=True)