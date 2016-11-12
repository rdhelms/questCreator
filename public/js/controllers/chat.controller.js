angular.module('questCreator').controller('chatCtrl', function(socket, $state) {
  $('form').submit(function(){
    console.log("Submitted!");
    socket.emit('chat message', $('#m').val());
    $('#m').val('');
    return false;
  });
  socket.off('chat message');
  socket.on('chat message', function(msg){
    $('#messages').append($('<li>').text(msg));
  });
});
