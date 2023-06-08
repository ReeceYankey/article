from flask import Flask, request, jsonify
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity, JWTManager
from pymongo import MongoClient
import json
import pymongo

app = Flask(__name__)

app.config["JWT_SECRET_KEY"] = 'secret'
jwt = JWTManager(app)

# client = MongoClient('localhost', 27017)
# db = client['article_db']
# articles = db['articles']
# users = db['users']
# comments = db['comments']

@app.route("/login", methods=['POST'])
def login():
    data = request.get_json()
    username = data["username"]
    password = data["password"]
    if username != 'test' or password != 'test':
        return jsonify({"msg": "Bad username or password"}), 401

    access_token = create_access_token(identity=username)
    return jsonify(access_token=access_token)

@app.route("/protected", methods=['GET'])
@jwt_required()
def protected():
    user = get_jwt_identity()
    print(user)
    return jsonify(logged_in_as=user)


