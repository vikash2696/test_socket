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

  //Get all records 

  
      socket.emit('alluser',"true");

      socket.on('user_detail', function(data) {
          //fetch user data
          Users.find({'user_name':data.user_name, 'password': data.password},function(err,users){
                if(err) {
                    return false;
                }
                if(users.length > 0){
                  socket.emit('validuser',users);
                  console.log("valid");
                }else{
                  console.log("invalid user");
                  return false;
                }
            });

      });

      socket.on('clicked_div', function(data) {
          console.log(data.currentId);
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
            socket.emit('newquestion',savedquestion);
            return true;
         });  
    });
});




http.listen(3020, function() {
   console.log('listening on localhost:3020');
});
