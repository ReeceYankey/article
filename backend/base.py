from flask import Flask, request, jsonify
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity, JWTManager
from werkzeug.security import generate_password_hash, check_password_hash
from pymongo import MongoClient
import pymongo
from bson.objectid import ObjectId
from bson.errors import InvalidId
import time
from datetime import timedelta

app = Flask(__name__)

app.config["JWT_SECRET_KEY"] = 'secret' # TODO move to an env file
jwt = JWTManager(app)

client = MongoClient('localhost', 27017)
db = client['article_db']
articles = db['articles']
users = db['users']
comments = db['comments']

def has_keys(dictionary, required_keys):
    """returns whether dictionary contains all of the required keys"""
    for key in required_keys:
        if key not in dictionary:
            return False
    return True

@app.route("/login", methods=['POST'])
def login():
    """
    Gives the user a jwt token upon successful login

    Input:
        data: {
            username (str): your username
            password (str): your password
        }

    Response:
        data: {
            access_token (str): the jwt token
            msg (str): message describing reason for failure
        }
    """ 
    data = request.get_json()
    if not has_keys(data, ['username', 'password']):
        return jsonify({"msg": "Missing username and/or password"}), 400
    username = data['username']
    password = data['password']

    user = users.find_one({"username":username})
    if user is None:
        return jsonify({"msg": "Bad username or password"}), 401

    if not check_password_hash(user['password'], password):
        return jsonify({"msg": "Bad username or password"}), 401

    access_token = create_access_token(identity=username, expires_delta=timedelta(hours=12))
    return jsonify(access_token=access_token), 200



@app.route("/create_user", methods=['POST'])
@jwt_required(optional=True)
def create_user():
    """
    Creates a new user with the given username and password

    Input:
        headers: {
            (optional) Authorization: Bearer {token}
        }
        data: {
            username (str): your username
            password (str): your password
            (optional) privilege: number indicating privilege level of the new user. Must be level 2 to work
        }

    Response:
        data: {
            msg: message describing success or reason for failure
        }
    """
    # TODO regex for allowed usernames/passwords
    data = request.get_json()
    if not has_keys(data, ['username', 'password']):
        return jsonify({"msg": "Missing username and/or password"}), 400
    username = data['username']
    password = data['password']

    if username == "" or password == "":
        return jsonify({"msg": "Missing username and/or password"}), 400
    
    if users.find_one({"username":username}):
        return jsonify({"msg": "Username taken"}), 409

    # admin accounts can create users with different privileges
    privilege = 0
    jwt_user = get_jwt_identity()
    print(jwt_user)
    if jwt_user is not None and users.find_one({"username":jwt_user})['privilege'] == 2:
        if 'privilege' in data:
            privilege = data['privilege']

    pass_hash = generate_password_hash(password, method='pbkdf2', salt_length=16)
    users.insert_one({'username':username, 'password':pass_hash, 'privilege':privilege})
    return jsonify({"msg": "Succesfully made account"}), 200


@app.route("/post_comment", methods=['POST'])
@jwt_required()
def post_comment():
    """
    Post a comment as the user associated with the given JWT token

    Input:
        headers: {
            Authorization: Bearer {token}
        }
        data: {
            content (str): the content/body of the comment
            article_id (str): the article_id you are commenting on
        }

    Response:
        data: {
            msg: message describing success or reason for failure
        }
    """ 
    username = get_jwt_identity()

    data = request.get_json()
    if not has_keys(data, ['content', 'article_id']):
        return jsonify({"msg": "Missing content and/or article id"}), 400
    content = data['content']
    article_id = data['article_id']

    seconds_since_epoch = int(time.time())

    comments.insert_one({"article_id":article_id, "author":username, "content":content, "creation_date":seconds_since_epoch})
    return jsonify({"msg": "Successfully posted comment"}), 200


@app.route("/get_comments", methods=['POST'])
def get_comments():
    """
    Retrieves all comments for the given article

    Input:
        data: {
            article_id: id of the article
        }

    Response:
        data: List [
            {
                comment_id: id of the comment
                article_id: id of the article
                creation_date: seconds since epoch
                content: body of the comment
            }
        ]
        
    """ 
    data = request.get_json()
    if 'article_id' not in data:
        return jsonify({"msg": "Missing article id"}), 400
    article_id = data['article_id']

    matching_comments = list(comments.find({"article_id":article_id}).sort('creation_date', pymongo.DESCENDING))
    for comment in matching_comments:
        comment['comment_id'] = str(comment.pop('_id'))

    print(matching_comments)
    return jsonify(matching_comments), 200


@app.route("/get_article/<article_id>", methods=['GET'])
def get_article(article_id):
    """
    Retrieves all data associated with the given article

    Response:
        data: List [
            { 
                article_id: id of the article
                title: title of the article
                content: body of the article
                author: username of whomever created this article
                creation_date: seconds since epoch
            }
        ]
    """ 
    try:
        id = ObjectId(article_id)
    except(InvalidId):
        return jsonify({"msg": "Invalid article id"}), 404

    article = articles.find_one({"_id":ObjectId(article_id)})
    if article is None:
        return jsonify({"msg": "Invalid article id"}), 404
    article['article_id'] = str(article.pop('_id'))
    return jsonify(article), 200


@app.route("/list_articles", methods=['GET'])
def list_articles():
    """
    Retrieves a list of all articles with their basic information

    Response:
        data: List [
            {
                article_id: id of the article
                title: title of the article
                author: username of whomever created this article
                creation_date: seconds since epoch
            }
        ]
    """ 
    # TODO add range request
    all_articles = list(articles.find().sort('creation_date', pymongo.DESCENDING))
    for article in all_articles:
        article['article_id'] = str(article.pop('_id'))
        article.pop('content')
    
    print(all_articles)

    return jsonify(all_articles), 200



@app.route("/post_article", methods=['POST'])
@jwt_required()
def post_article():
    """
    Saves a new article to the database. The user must be of sufficient privilege (1 or above)

    Input:
        headers: {
            Authorization: Bearer {token}
        }
        data: {
            title: the title of the article
            content: the body of the article
        }

    Response:
        data:
            msg (str): a string indicating success with the id created for the article
    """ 
    # TODO image support
    username = get_jwt_identity()
    user = users.find_one({"username":username})
    if user is None:
        return jsonify({"msg": "Invalid user"}), 401
    if user['privilege'] < 1:
        return jsonify({"msg": "Insufficient permissions"}), 403

    data = request.get_json()
    if not has_keys(data, ['title', 'content']):
        return jsonify({"msg": "Missing title and/or content"}), 400
    title = data['title']
    content = data['content']

    seconds_since_epoch = int(time.time())

    id = articles.insert_one({"author":username, "title":title, "content":content, "creation_date":seconds_since_epoch}).inserted_id
    return jsonify(msg=f"Successfully posted article with id {id}"), 200


@app.route("/delete_article", methods=['DELETE'])
@jwt_required()
def delete_article():
    """
    Deletes the given article. Need to be the author or privilege level 2 (admin).

    Input:
        headers: {
            Authorization: Bearer {token}
        }
        data: {
            article_id: the id of the article to delete
        }

    Response:
        data: {
            msg: string indicating success or reason for failure
        }
    """
    data = request.get_json()
    if 'article_id' not in data:
        return jsonify({"msg": "Missing article id"}), 400
    article_id = data['article_id']

    print(list(articles.find()))
    print(article_id)
    article = articles.find_one({"_id":ObjectId(article_id)})
    print(article)
    if article is None:
        return jsonify({"msg": "Article does not exist"}), 404

    # must be admin or author
    username = get_jwt_identity()
    user = users.find_one({"username":username})
    if user is None:
        return jsonify({"msg": "Invalid user"}), 401
    if user['privilege'] != 2 and username != article['author']:
        return jsonify({"msg": "Insufficient permissions"}), 403
    
    articles.delete_one({"_id":ObjectId(article_id)})
    comments.delete_many({"article_id":article_id})
    return jsonify(msg="Article successfully deleted"), 200