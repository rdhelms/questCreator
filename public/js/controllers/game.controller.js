angular.module('questCreator').controller('gameCtrl', function(socket, $state, $scope) {
  var socketId;
  var charInfo;

  socket.emit('game joined');

  socket.off('old player found');
  socket.on('old player found', function(oldCharInfo) {
    console.log("Found old player");
    $('<canvas>').attr({
      'id': oldCharInfo.id,
      'class': 'avatar',
      'width': '100',
      'height': '100'
    }).css({
      'position': 'absolute',
      'left': oldCharInfo.x,
      'top': oldCharInfo.y,
      'border': '2px solid black',
      'background': oldCharInfo.color
    }).appendTo('body');
  });

  socket.off('new player joining');
  socket.on('new player joining', function(newCharInfo) {
    var response = {
      oldCharInfo: charInfo,
      id: newCharInfo.id
    };
    socket.emit('send old player', response);
    $('<canvas>').attr({
      'id': newCharInfo.id,
      'class': 'avatar',
      'width': '100',
      'height': '100'
    }).css({
      'position': 'absolute',
      'left': newCharInfo.x,
      'top': newCharInfo.y,
      'border': '2px solid black',
      'background': newCharInfo.color
    }).appendTo('body');
  });

  socket.off('updating player');
  socket.on('updating player', function(playerUpdate) {
    $('#' + playerUpdate.id).css({
      'left': playerUpdate.x,
      'top': playerUpdate.y
    });
  });

  socket.off('player left');
  socket.on('player left', function(playerId) {
    console.log("Player left!");
    $('#' + playerId).remove();
  });

  var loopHandle;
  socket.off('create character');
  socket.on('create character', function(id) {
    socketId = id;
    var x = Math.round( Math.random() * window.innerWidth);
    var y = Math.round( Math.random() * window.innerHeight);
    var speedX = 0;
    var speedY = 0;
    var r = Math.round( Math.random() * 255 );
    var g = Math.round( Math.random() * 255 );
    var b = Math.round( Math.random() * 255 );
    var color = 'rgb(' + r + ', ' + g + ',' + b + ')';
    var newCharInfo = {
      id: id,
      x: x,
      y: y,
      speedX: speedX,
      speedY: speedY,
      color: color
    };
    charInfo = newCharInfo;
    socket.emit('send new player', charInfo);   // Send this player to other users
    $('<canvas>').attr({
      'id': id,
      'class': 'avatar',
      'width': '100',
      'height': '100'
    }).css({
      'position': 'absolute',
      'left': x,
      'top': y,
      'border': '2px solid black',
      'background': color
    }).appendTo('body');
    loopHandle = setInterval(function() {
      x += speedX;
      y += speedY;
      $('#' + id).css({
        'left': x,
        'top': y
      });
      charUpdate = {
        id: id,
        x: x,
        y: y,
        speedX: speedX,
        speedY: speedY,
        color: color
      }
      socket.emit('player update', charUpdate);
    }, 20);
    $('body').off().on('keydown', function(event) {
      var keyCode = event.keyCode;
      if (keyCode === 37) {
        speedX += -1;
      } else if (keyCode === 38) {
        speedY += -1;
      } else if (keyCode === 39) {
        speedX += 1;
      } else if (keyCode === 40) {
        speedY += 1;
      }
    });
  });

  $scope.$on("$destroy", function(){
    $('.avatar').remove();
    socket.emit('game left');
    clearInterval(loopHandle);
  });
});
