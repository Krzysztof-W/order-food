from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

from createDB import Base, User, Group, GroupInvitation, GroupUsers

from flask import Flask, jsonify, abort, request, g, url_for
from flask_httpauth import HTTPBasicAuth
import json
from flask_cors import CORS

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
    if session.query(User).filter(User.username==username).first() is not None:
        abort(400) # existing user
    user = User(username = username)
    user.hash_password(password)
    session.add(user)
    session.commit()
    return jsonify({ 'id': user.id, 'username': user.username }), 201, {'Location': url_for('get_user', id = user.id, _external = True)}

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
    
@app.route('/users/<int:id>', methods=['GET'])
@auth.login_required
def get_user(id):
    user = session.query(User).filter(User.id==id)
    if not user:
        abort(400)
    return jsonify(user.toJsonFull())
    
@app.route('/users', methods=['GET'])
@auth.login_required
def get_users():
    list = [user.toJsonFull() for user in session.query(User).all()]
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
    groups = [g.toJson() for g in session.query(Group).all()]
    return jsonify({'groups': groups})
    
@app.route('/groups/<int:group_id>', methods=['GET', 'PUT', 'DELETE'])
@auth.login_required
def groups_data(group_id):
    group = session.query(Group).filter(Group.id==group_id).first()
    if not group:
        abort(400)
    if request.method == 'GET':
        return jsonify({'group': group.toJsonFull()})
    elif request.method == 'PUT':
        name = request.json.get('name')
        if name is None:
            abort(400) # missing argument
        else:
            group.name=name
            session.commit()
            return jsonify({'group': group.toJsonFull()}), 200
    else:
        session.delete(group)
        session.commit()
        return jsonify({}), 200
    
@app.route('/groups/<int:group_id>/users/<int:user_id>', methods=['POST', 'DELETE'])
@auth.login_required
def groups_data_users(group_id, user_id):
    if request.method == 'POST':
        group = session.query(Group).filter(Group.id==group_id).first()
        user = session.query(User).filter(User.id==user_id).first()
        if user and group:
            gu = GroupUsers(group = group, user = user)
            session.add(gu)
            session.commit()
            return jsonify({}), 201
        else:
            abort(400) #wrong arguments
    else:
        gu = session.query(GroupUsers).filter(GroupUsers.user_id==user_id, GroupUsers.group_id==group_id).first()
        if gu:
            session.delete(gu)
            session.commit()
            return jsonify({}), 200
        else:
            abort(400)
    
if __name__ == '__main__':
    app.run(debug=True)