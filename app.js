var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
//user service
app.use(express.static(__dirname + '/public'));

//Mongo DB credentials
var mongoose = require('mongoose');
//mean_app is database name
var MONGO_DB_URI = 'mongodb://127.0.0.1/test_socket';
mongoose.connect(MONGO_DB_URI, {
    useMongoClient: true
});

//Mongo connection success message
mongoose.connection.on('connected', function() {
    console.log('app is connected to mongodb ', MONGO_DB_URI);
});

mongoose.connection.on('error', err => {
    console.log('error while connecting to mongoose ', err);
});

var Users = require('./service/userService');
var Questions = require('./service/questionService');

app.get('/', function(req, res) {
   res.sendfile('index.html');
});

users = [];
io.on('connection', function(socket) {

      socket.on('user_detail', function(data) {
          //fetch user data
          Users.find({'user_name':data.user_name, 'password': data.password},function(err,users){
                if(err) {
                    return false;
                }
                if(users.length > 0){
                  socket.emit('loggedInuser',{is_new_user: "no", user: users});

                }else{
                     var createUserdata = { 
                      user_name: data.user_name,
                      password: data.password,
                      is_admin:'0'
                      };
                     Users.create(createUserdata ,function(err,savedUser){
                        if(err) {
                           return  false;
                        }

                        socket.emit('loggedInuser',{is_new_user: "yes", user: savedUser});
                     });
                }
            });

      });

      socket.on('clicked_div', function(data) {
          io.sockets.emit('current_div',data.currentId);

      });


      socket.on('question_data', function(data) {
      //Save question
         var saveQuestiondata = { 
              name: data.name,
              phone: data.phone,
              address: data.address
          };
         Questions.create(saveQuestiondata ,function(err,savedquestion){
            if(err) {
               return  false;
            }
            io.sockets.emit('question_submit',savedquestion);
            return true;
         });  
    });
});




http.listen(3020, function() {
   console.log('listening on localhost:3020');
});
