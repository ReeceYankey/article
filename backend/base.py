from flask import Flask, request
from pymongo import MongoClient
import json
import pymongo

app = Flask(__name__)
client = MongoClient('localhost', 27017)
db = client['recipe_db']
recipes = db['recipes']

@app.route("/query", methods=['POST'])
def index():
    return "Hello"

