var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io').listen(http);

app.use('/', express.static(__dirname + '/public'));

io.on('connection', function(socket){
  console.log('a user connected');

  socket.on('game joined', function(newPlayer) {
    console.log('Player ' + newPlayer.id + ' is playing ' + newPlayer.game);
    socket.join(newPlayer.game);
    io.to(newPlayer.game).emit('new player', newPlayer);
    socket.emit('self info', socket.id);
    // socket.emit('create character', socket.id);
  });

  socket.on('game left', function(leavingPlayer) {
    console.log('Player ' + leavingPlayer.id + ' left the game');
    socket.to(leavingPlayer.game).emit('player left', leavingPlayer);
    socket.leave(leavingPlayer.game);
  });

  // socket.on('send old player', function(response) {
  //   console.log("Finding old player");
  //   socket.broadcast.to(response.id).emit('old player found', response.oldCharInfo);
  // });

  // socket.on('player update', function(charUpdate) {
  //   socket.broadcast.emit('updating player', charUpdate);
  // });

  socket.on('chat message', function(msgInfo){
    var msg = msgInfo.msg;
    var gameName = msgInfo.gameName;
    console.log("Message submitted!");
    io.to(gameName).emit('chat message', msg);
  });
  socket.on('disconnect', function() {
    console.log('user disconnected');
  });
});

http.listen(process.env.PORT || 4000, function(){
  console.log('listening on *:4000');
});
