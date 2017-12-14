from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

from createDB import Base, User, Group, GroupInvitation, GroupUsers
from alchemyEncoder import new_alchemy_encoder

from flask import Flask, Response, jsonify, abort, request, redirect
from flask.ext.login import LoginManager, UserMixin, login_required, login_user, logout_user 
import json

app = Flask(__name__)
app.secret_key = "super secret key"

login_manager = LoginManager()
login_manager.init_app(app)
login_manager.login_view = "login"

engine = create_engine('sqlite:///order_food.db')
Base.metadata.bind = engine
DBSession = sessionmaker(bind=engine)
session = DBSession()

class LoggedUser(UserMixin):

    def __init__(self, id):
        self.id = id

@app.route('/')
@login_required
def home():
    return Response("Hello World!")
        
@app.route('/users', methods=['GET'])
@login_required
def get_users():
    list = [json.dumps(x, cls=new_alchemy_encoder(), check_circular=False) for x in session.query(User).all()]
    return jsonify({'users': list})

@app.route('/groupUsers/<int:id>', methods=['GET'])
@login_required
def get_group_users(id):
    groupUsers = [json.dumps(gu.user, cls=new_alchemy_encoder(), check_circular=False) for gu in session.query(GroupUsers).filter(GroupUsers.group_id==id).all()]
    return jsonify({'users': groupUsers})

@app.route('/groups', methods=['GET'])
@login_required
def get_groups():
    print('dzilaa--------------------')
    groups = [json.dumps(x, cls=new_alchemy_encoder(), check_circular=False) for x in session.query(Group).all()]
    print('dzilaa--------------------')
    return jsonify({'groups': groups})
    
@app.route("/login", methods=["GET", "POST"])
def login():
    if request.method == 'POST':
        name = request.form['name']
        password = request.form['password'] 
        user = session.query(User).filter(User.name==name, User.password==password).first()
        if user != None:
            print(user.id)
            login_user(LoggedUser(user.id))
            return redirect(request.args.get("next"))
        else:
            return abort(401)
    else:
        return Response('''
        <form action="" method="post">
            <p><input type=text name=name>
            <p><input type=password name=password>
            <p><input type=submit value=Login>
        </form>
        ''')
        
@app.route("/logout")
@login_required
def logout():
    logout_user()
    return Response('<p>Logged out</p>')
    
@login_manager.user_loader
def load_user(userid):
    return LoggedUser(userid)
    
if __name__ == '__main__':
    app.run(debug=True)