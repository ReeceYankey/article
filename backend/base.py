from flask import Flask, request, jsonify
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity, JWTManager
from werkzeug.security import generate_password_hash, check_password_hash
from pymongo import MongoClient
import json
import pymongo

app = Flask(__name__)

app.config["JWT_SECRET_KEY"] = 'secret'
jwt = JWTManager(app)

client = MongoClient('localhost', 27017)
db = client['article_db']
articles = db['articles']
users = db['users']
comments = db['comments']

@app.route("/login", methods=['POST'])
def login():
    username = request.json.get("username")
    password = request.json.get("password")

    if username is None or password is None:
        return jsonify({"msg": "Bad username or password"}), 401

    record = users.find_one({"username":username})
    if record is None:
        return jsonify({"msg": "Bad username or password"}), 401

    if not check_password_hash(record['password'], password):
        return jsonify({"msg": "Bad username or password"}), 401

    access_token = create_access_token(identity=username)
    return jsonify(access_token=access_token), 200


@app.route("/create_user", methods=['POST'])
def create_user():
    username = request.json.get("username")
    password = request.json.get("password")

    if username is None or password is None:
        return jsonify({"msg": "Bad username or password"}), 401
    
    if users.find_one({"username":username}):
        return jsonify({"msg": "Username taken"}), 409

    pass_hash = generate_password_hash(password, method='pbkdf2', salt_length=16)
    users.insert_one({'username':username, 'password':pass_hash, 'privilege':0})
    return jsonify({"msg": "Succesfully made account"}), 200


@app.route("/protected", methods=['GET'])
@jwt_required()
def protected():
    user = get_jwt_identity()
    print(user)
    return jsonify(logged_in_as=user), 200


