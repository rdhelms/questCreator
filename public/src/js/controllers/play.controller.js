angular.module('questCreator').controller('playCtrl', function(socket, $state, $scope) {

  // Testing creation of background
  var backgroundTest = {
    name: 'Background Another Test',
    obj: {
      canvasElems: [{
        x: 100,
        y: 100,
        width: 30,
        height: 30,
        color: 'blue'
      }],
      collisionMap: [{
        x: 300,
        y: 300,
        width: 30,
        height: 30,
        color: 'red'
      }]
    },
    user_id: 1,
    game_id: 1,
    tags: ['Testing Stuff', 'Fun games'],
    public: false
  };

  // Testing creation of object
  var objectTest = {
    name: 'Object Test',
    obj: {
      canvasElems: [{
        x: 100,
        y: 100,
        width: 30,
        height: 30,
        color: 'blue'
      }],
      collisionMap: [{
        x: 300,
        y: 300,
        width: 30,
        height: 30,
        color: 'red'
      }]
    },
    user_id: 1,
    game_id: 1,
    tags: ['Object thing', 'Really fun new object'],
    public: false
  };

  // Testing creation of entity
  var entityTest = {
    name: 'Entity Test',
    obj: {
      canvasElems: [{
        x: 100,
        y: 100,
        width: 30,
        height: 30,
        color: 'blue'
      }],
      collisionMap: [{
        x: 300,
        y: 300,
        width: 30,
        height: 30,
        color: 'red'
      }]
    },
    user_id: 1,
    game_id: 1,
    tags: ['Entity thing', 'Awesome entity ftw'],
    public: false
  };

  // Testing creation of scene
  var sceneTest = {
    game_id: 1,
    map_id: 1,
    name: 'Scene Test',
    description: 'This is the opening scene for my game.',
    obj: {
        canvasElems: [{
          x: 100,
          y: 100,
          width: 30,
          height: 30,
          color: 'blue'
        }],
        collisionMap: [{
          x: 300,
          y: 300,
          width: 30,
          height: 30,
          color: 'red'
        }]
    }
    // obj: {
    //   mainChar: {
    //     action: 'walk-right',
    //     actionFrames: {
    //       walkUp: [{
    //
    //       }]
    //     }
    //     canvasElems: [{
    //       canvasElems: [{
    //         x: 100,
    //         y: 100,
    //         width: 30,
    //         height: 30,
    //         color: 'blue'
    //       }],
    //       collisionMap: [{
    //         x: 300,
    //         y: 300,
    //         width: 30,
    //         height: 30,
    //         color: 'red'
    //       }]
    //     }]
    //   },
    //   background: {
    //     canvasElems: [{
    //       x: 100,
    //       y: 100,
    //       width: 30,
    //       height: 30,
    //       color: 'blue'
    //     }],
    //     collisionMap: [{
    //       x: 300,
    //       y: 300,
    //       width: 30,
    //       height: 30,
    //       color: 'red'
    //     }]
    //   },
    //   collisionMap: [{
    //     x: 300,
    //     y: 300,
    //     width: 30,
    //     height: 30,
    //     color: 'red'
    //   }]
    // }
  };

  // Testing creation of map
  var mapTest = {
    game_id: 1,
    name: 'Map Test',
    description: 'This is the main map for my game',
    obj: {
      canvasElems: [{
        x: 100,
        y: 100,
        width: 30,
        height: 30,
        color: 'blue'
      }],
      collisionMap: [{
        x: 300,
        y: 300,
        width: 30,
        height: 30,
        color: 'red'
      }]
    }
  };

  // Testing creation of game
  var gameTest = {
    name: 'Game Test',
    description: 'This is my game',
    obj: {
      canvasElems: [{
        x: 100,
        y: 100,
        width: 30,
        height: 30,
        color: 'blue'
      }],
      collisionMap: [{
        x: 300,
        y: 300,
        width: 30,
        height: 30,
        color: 'red'
      }]
    }
  };

  $('.createBackgroundBtn').click(function() {
    $.ajax({
      method: 'POST',
      url: 'https://forge-api.herokuapp.com/backgrounds/create',
      data: backgroundTest,
      success: function(response) {
        console.log(response);
        console.log(response.obj);
        console.log(JSON.parse(response.tags));
      },
      error: function(error) {
        console.log(error);
      }
    });
  });

  $('.createObjectBtn').click(function() {
    $.ajax({
      method: 'POST',
      url: 'https://forge-api.herokuapp.com/obstacles/create',
      data: objectTest,
      success: function(response) {
        console.log(response);
        console.log(response.obj);
        console.log(JSON.parse(response.tags));
      },
      error: function(error) {
        console.log(error);
      }
    });
  })

  $('.createEntityBtn').click(function() {
    $.ajax({
      method: 'POST',
      url: 'https://forge-api.herokuapp.com/entities/create',
      data: entityTest,
      success: function(response) {
        console.log(response);
        console.log(response.obj);
        console.log(JSON.parse(response.tags));
      },
      error: function(error) {
        console.log(error);
      }
    });
  })

  $('.createSceneBtn').click(function() {
    $.ajax({
      method: 'POST',
      url: 'https://forge-api.herokuapp.com/scenes/create',
      data: sceneTest,
      success: function(response) {
        console.log(response);
      },
      error: function(error) {
        console.log(error);
      }
    });
  })

  $('.createMapBtn').click(function() {
    $.ajax({
      method: 'POST',
      url: 'https://forge-api.herokuapp.com/maps/create',
      data: mapTest,
      success: function(response) {
        console.log(response);
      },
      error: function(error) {
        console.log(error);
      }
    });
  })

  $('.createGameBtn').click(function() {
    $.ajax({
      method: 'POST',
      url: 'https://forge-api.herokuapp.com/games/create',
      data: gameTest,
      success: function(response) {
        console.log(response);
      },
      error: function(error) {
        console.log(error);
      }
    });
  })

  function loadBackground(bgSquares) {
    // Draw the squares retrieved from the database
  }

  var socketId;
  var charInfo;
  var allPlayers = [];

  var gameCanvas = document.getElementById('play-canvas');
  var gameCtx = gameCanvas.getContext('2d');
  var gameWidth = 700;
  var gameHeight = 500;


  socket.emit('game joined');

  socket.off('old player found');
  socket.on('old player found', function(oldCharInfo) {
    console.log("Found old player");
    // Add old player to array of players
    allPlayers.push(oldCharInfo);
  });

  socket.off('new player joining');
  socket.on('new player joining', function(newCharInfo) {
    var response = {
      oldCharInfo: charInfo,
      id: newCharInfo.id
    };
    // Add new player to array of players
    allPlayers.push(newCharInfo);
    // Send response from old player to new player
    socket.emit('send old player', response);
  });

  socket.off('updating player');
  socket.on('updating player', function(playerUpdate) {
    // Find the player who is being updated, and update their details
  });

  socket.off('player left');
  socket.on('player left', function(playerId) {
    console.log("Player left!");
    allPlayers.forEach(function(player, index) {
      if (player.id === playerId) {
        //Remove player from array here
      }
    });
  });

  var loopHandle;
  socket.off('create character');
  socket.on('create character', function(id) {
    socketId = id;
    var x = Math.round( Math.random() * gameWidth);
    var y = Math.round( Math.random() * gameHeight);
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
    allPlayers.push(newCharInfo);
    charInfo = newCharInfo;
    socket.emit('send new player', charInfo);   // Send this player to other users
    gameCtx.fillStyle = color;
    gameCtx.fillRect(x,y,100,100);
    loopHandle = setInterval(function() {
      x += speedX;
      y += speedY;
      charUpdate = {
        id: id,
        x: x,
        y: y,
        speedX: speedX,
        speedY: speedY,
        color: color
      }
      // Update the x and y position of the current player
      allPlayers.forEach(function(player, index) {
        if (player.id === id) {
          allPlayers[index] = charUpdate;
        }
      });
      socket.emit('player update', charUpdate);
      redrawGame();
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

  function redrawGame() {
    gameCtx.clearRect(0, 0, gameWidth, gameHeight);
    allPlayers.forEach(function(player) {
      gameCtx.fillStyle = player.color;
      gameCtx.fillRect(player.x, player.y, 100, 100);
    });
  }

  $scope.$on("$destroy", function(){
    socket.emit('game left');
    clearInterval(loopHandle);
  });

  // Chat messages
  $('.chat-submit').submit(function(){
    socket.emit('chat message', $('.message').val());
    $('.message').val('');
    return false;
  });
  socket.off('chat message');
  socket.on('chat message', function(msg){
    $('.chat-messages').append($('<li>').text(msg));
  });
});
