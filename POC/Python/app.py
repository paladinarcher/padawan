from flask import Flask, jsonify, abort, make_response, request
from flask_pymongo import PyMongo

app = Flask(__name__)
app.config['MONGO_DBNAME'] = 'meteor'
app.config['MONGO_URI'] = 'mongodb://127.0.0.1:3001/meteor'
mongo = PyMongo(app)

@app.route('/getUsers/', methods=['GET'])
def get_data():
    users = mongo.db.users
    output = []
    for user in users.find():
        output.append({
        'id' : user['_id'],
        'createdAt' : user['createdAt'],
        'services' : user['services'],
        'username' : user['username'],
        'emails' : user['emails'],
        'slug' : user['slug'],
        'updateAt' : user['updateAt'],
        'MyProfile' : user['MyProfile'],
        'teams' : user['teams'],
        'roles' : user['roles'],
        'profile' : user['profile']
        })
    return jsonify({ 'users' : output })

@app.route('/getRoles/', methods=['GET'])
def get_data2():
    roles = mongo.db.roles
    output = []
    for role in roles.find():
        output.append({ 'id' : role['_id'], 'name' : role['name'] })
    return jsonify({ 'roles' : output })

@app.errorhandler(404)
def not_found(error):
    return make_response(jsonify({'error': 'Please add /getUsers or /getRoles to the end of the URL'}), 404)

if __name__ == '__main__':
    app.run(debug=True)