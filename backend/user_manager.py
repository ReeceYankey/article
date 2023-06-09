import click
from pymongo import MongoClient
from werkzeug.security import generate_password_hash


@click.group()
def cli():
    pass

@cli.command()
@click.argument("username")
@click.argument("password")
@click.option("--priv", default=0, help="Privilege level of account. 0 is regular user, 1 is article author, 2 is admin")
def create(username, password, priv):
    users = MongoClient('localhost', 27017)['article_db']['users']
    if users.find_one({"username":username}):
        print("username taken")
        return
    pass_hash = generate_password_hash(password, method='pbkdf2', salt_length=16)
    users.insert_one({"username":username, "password":pass_hash, "privilege":priv})
    print(f"created {username}")

@cli.command()
@click.argument("username")
@click.argument("privilege")
def modify(username, privilege):
    users = MongoClient('localhost', 27017)['article_db']['users']
    users.update_one({"username": username}, {"$set": {"privilege": int(privilege)}})
    print(f"set user {username} to privilege {privilege}")

@cli.command()
@click.argument("username")
def delete(username):
    users = MongoClient('localhost', 27017)['article_db']['users']
    users.delete_one({"username":username})
    print(f"deleted {username}")

if __name__ == "__main__":
    cli()