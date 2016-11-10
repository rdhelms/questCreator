var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io').listen(http);

app.use('/', express.static(__dirname + '/'));

app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});

io.on('connection', function(socket){
  console.log('a user connected');
  socket.emit('create character', socket.id);

  socket.on('send new player', function(charInfo) {
    socket.broadcast.emit('new player joining', charInfo);
  });

  socket.on('send old player', function(response) {
    console.log("Finding old player");
    socket.broadcast.to(response.id).emit('old player found', response.oldCharInfo);
  });

  socket.on('player update', function(charUpdate) {
    socket.broadcast.emit('updating player', charUpdate);
  });

  socket.on('chat message', function(msg){
    console.log("Message submitted!");
    io.emit('chat message', msg);
  });
  socket.on('disconnect', function() {
    socket.broadcast.emit('player left', socket.id);
    console.log('user disconnected');
  });
});

http.listen(process.env.PORT || 4000, function(){
  console.log('listening on *:4000');
});
