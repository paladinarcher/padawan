from os import fork, setsid, getsid
from time import time, clock, sleep
from flask import Flask, jsonify, abort, make_response, request
from flask_pymongo import PyMongo


# -------------------------------------------------------------------------------------------------------

# NEEDS IMPROVEMENT
# MUST ASK JAY BEFORE EVEN THINKING ABOUT LOOKING ANY FURTHER AT THIS CODE

# -------------------------------------------------------------------------------------------------------


app = Flask(__name__)
app.config['MONGO_DBNAME'] = 'meteor'
app.config['MONGO_URI'] = 'mongodb://127.0.0.1:3001/meteor'
mongo = PyMongo(app)

# Global variable - represents the child process's session id created in the /getUsers/ route
sid = 0
# Global variable - represents the current status of the child process
processing_status = 0
# Mimics a long process
def delay_process():
   start = time()
   clock()   
   sleep(5)
   global processing_status
   processing_status += time() - start
   return processing_status

# Returns the child process's session id
@app.route('/getUsers/', methods=['GET'])
def get_id():   
   try:
       pid = fork()
       if pid > 0:
           # Exit parent process
           sys.exit(0)
   except OSError, e:
       print >> sys.stderr, "Fork failed: %d (%s)" % (e.errno, e.strerror)
       sys.exit(1)
   setsid()
   return jsonify({ 'sid' : getsid(pid) })

# Returns the child process's status or the results if it has finished
@app.route('/getUsers/<id>', methods=['GET'])
def get_data(id):
   try:
       # Verify the process exists
       if int(id) == getsid(int(id)):
           global sid
           global processing_status
           # Generate delay and track status of current process
           if sid != int(id):
               sid = int(id)
               processing_status = 0
           if delay_process() <= 20:
               return "Not finished"
           # Return the results once the process has "finished"
           else:
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
   # Return a message is the id entered isn't a current process  
   except:
       return "Not a current process"    

@app.route('/getRoles/', methods=['GET'])
def get_data2():
   roles = mongo.db.roles
   output = []
   for role in roles.find():
       output.append({ 'id' : role['_id'], 'name' : role['name'] })
   return jsonify({ 'roles' : output })

@app.errorhandler(404)
def not_found(error):
   return make_response(jsonify({'error': 'Not found'}), 404)

if __name__ == '__main__':
   app.run(debug=True)