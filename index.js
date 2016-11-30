var express = require('express');
var app = express();
var http = require('http').Server(app);
// var io = require('socket.io').listen(http);

app.use('/', express.static(__dirname + '/public'));

// io.on('connection', function(socket){
//   console.log('a user connected');
//
//   socket.on('game joined', function(newPlayer) {
//     socket.emit('self info', socket.id);  // Provide the front end with each player's socket id
//     console.log('Player ' + newPlayer.id + ' is playing ' + newPlayer.game);
//     socket.join(newPlayer.game);
//     var playerBasic = {
//       id: newPlayer.id,
//       game: newPlayer.game
//     };
//     newPlayer.socketId = socket.id;
//     io.to(newPlayer.game).emit('new player', playerBasic);  // includes self
//     socket.to(newPlayer.game).emit('draw new player', newPlayer); // only to others
//   });
//
//   socket.on('draw old player', function(response) {
//     var oldPlayer = response.data;
//     var newPlayer = response.dest;
//     socket.to(newPlayer).emit('draw old player', oldPlayer);
//   });
//
//   socket.on('update player', function(playerUpdate) {
//     socket.to(playerUpdate.game).emit('update player', playerUpdate);
//   });
//
//   socket.on('game left', function(leavingPlayer) {
//     console.log('Player ' + leavingPlayer.id + ' left ' + leavingPlayer.game);
//     socket.to(leavingPlayer.game).emit('player left', leavingPlayer);
//     socket.leave(leavingPlayer.game);
//   });
//
//   socket.on('chat message', function(msgInfo){
//     var msg = msgInfo.msg;
//     var gameName = msgInfo.gameName;
//     console.log("Message submitted!");
//     io.to(gameName).emit('chat message', msg);
//   });
//   socket.on('disconnect', function() {
//     console.log('user disconnected');
//   });
// });

http.listen(process.env.PORT || 4000, function(){
  console.log('listening on *:4000');
});
