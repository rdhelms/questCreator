(function() {
  "use strict";

  angular.module('questCreator', ['ui.router', 'LocalStorageModule'])
        .config(function($stateProvider, $urlRouterProvider) {
          $urlRouterProvider.otherwise('/');

          $stateProvider.state('main', {
            abstract: true,
            url: '/',
            templateUrl: './src/views/main.html',
            controller: 'mainCtrl as main'
          }).state('main.landing', {
            // landing page
            url: '',
            templateUrl: './src/views/landing.html',
            controller: 'landingCtrl as landing'
          }).state('main.game', {
            // url: ':name'
            url: 'game',
            templateUrl: './src/views/game.html',
            controller: 'gameCtrl as game'
          }).state('main.game.detail', {
            url: '/detail',
            templateUrl: './src/views/game/detail.html',
            controller: 'detailCtrl as detail'
          }).state('main.game.play', {
            url: '/play',
            templateUrl: './src/views/game/play.html',
            controller: 'playCtrl as play'
          }).state('main.game.editor', {
            // "/game/editor"
            abstract: true,
            url: '/editor',
            templateUrl: './src/views/game/editor.html',
            controller: 'editorCtrl as editor',
          }).state('main.game.editor.views', {
            url: '/',
            views: {
              'maps': {
                templateUrl: './src/views/game/editor/map.html',
                controller: 'mapCtrl as map'
              },
              'scenes': {
                templateUrl: './src/views/game/editor/scene.html',
                controller: 'sceneCtrl as scene'
              },
              'backgrounds': {
                templateUrl: './src/views/game/editor/bg.html',
                controller: 'bgCtrl as bg'
              },
              'objects': {
                templateUrl: './src/views/game/editor/obj.html',
                controller: 'objCtrl as obj'
              },
              'entities': {
                templateUrl: './src/views/game/editor/ent.html',
                controller: 'entCtrl as ent'
              },
              'scripts': {
                templateUrl: './src/views/game/editor/scripts.html',
                controller: 'scriptsCtrl as scripts'
              }
            }
          }).state('main.profile', {
            url: 'profile',
            templateUrl: './src/views/profile.html',
            controller: 'profileCtrl as profile'
          });
        });

})();
;angular.module('questCreator').factory('Avatar', function() {
  function Avatar(avatarInfo) {
    this.name = avatarInfo.name;
    this.obj = avatarInfo.obj;
    this.user_id = avatarInfo.user_id;
    this.current = avatarInfo.current;
    this.action = 'stand';
  };

  Avatar.prototype.updatePos = function() {
    this.obj.pos.x += this.obj.speed.x;
    this.obj.pos.y += this.obj.speed.y;
  }

  Avatar.prototype.stop = function() {
    this.action = 'stand';
    this.obj.speed.x = 0;
    this.obj.speed.y = 0;
  }

  Avatar.prototype.collide = function(direction) {
    this.stop();
    switch (direction) {
      case 'left':
        this.obj.pos.x += this.obj.speed.mag;
        break;
      case 'right':
        this.obj.pos.x -= this.obj.speed.mag;
        break;
      case 'up':
        this.obj.pos.y += this.obj.speed.mag;
        break;
      case 'down':
        this.obj.pos.y -= this.obj.speed.mag;
        break;
    }
  }

  return Avatar;
});
;angular.module('questCreator').factory('Background', function() {
  function Background(backgroundInfo) {
    this.name = backgroundInfo.name;
    this.obj = backgroundInfo.obj;
    this.game_id = backgroundInfo.game_id;
  };

  return Background;
});
;angular.module('questCreator').factory('Entity', function() {
  function Entity(entityInfo) {
    this.name = entityInfo.name;
    this.obj = entityInfo.obj;
    this.game_id = entityInfo.game_id;
    this.action = 'walkRight';
  };

  Entity.prototype.updatePos = function() {
    this.obj.pos.x += this.obj.speed.x;
    this.obj.pos.y += this.obj.speed.y;
  }

  Entity.prototype.stop = function() {
    this.action = 'stand';
    this.obj.speed.x = 0;
    this.obj.speed.y = 0;
  }

  Entity.prototype.collide = function(direction) {
    this.stop();
    switch (direction) {
      case 'left':
        this.obj.pos.x += this.obj.speed.mag;
        break;
      case 'right':
        this.obj.pos.x -= this.obj.speed.mag;
        break;
      case 'up':
        this.obj.pos.y += this.obj.speed.mag;
        break;
      case 'down':
        this.obj.pos.y -= this.obj.speed.mag;
        break;
    }
  }

  return Entity;
});
;angular.module('questCreator').factory('SceneObject', function() {
  function SceneObject(sceneObjectInfo) {
    this.name = sceneObjectInfo.name;
    this.obj = sceneObjectInfo.obj;
    this.game_id = sceneObjectInfo.game_id;
    this.action = 'none';
    this.allActions = [];
  };

  return SceneObject;
});
;angular.module('questCreator').service('EditorService', function (UserService, $state) {


    var game = null;

    function getGameAssets(name) {

    }

    function createNewGame(name) {
      var header = {
        user_id: UserService.get().id,
        token: UserService.get().token
      };
      var game = {
        name: name,
        description: "",
        tags: []
      };
      console.log(header, game);
      $.ajax({
        method: 'POST',
        url: 'https://forge-api.herokuapp.com/games/create',
        data: JSON.stringify(game),
        headers: header,
        dataType: 'json',
        contentType: 'application/json',
        success: function(response) {
          game = response;
          return game;
        },
        error: function(error) {
          alert('There was a problem creating this game. Please try again.');
          $state.go('main.landing');
        }
      });
    }

    return {
      getGame: getGameAssets,
      createGame: createNewGame

    };
});
;angular.module('questCreator').service('GameService', function () {

    function loadGame(name) {
      $.ajax({
        method: 'GET',
        url: 'https://forge-api.herokuapp.com/games/load',
        data: JSON.stringify(name),
        dataType: 'json',
        contentType: 'application/json',
        success: function(response) {
          return response;
        },
        error: function(error) {
          alert('There was a problem loading this game');
        }
      });
}

return {
  loadGame: loadGame
};
});
;angular.module('questCreator').service('socket', function() {
  var socket = io();

  return {
    on: function(eventName, callback){
      socket.on(eventName, callback);
    },
    emit: function(eventName, data) {
      socket.emit(eventName, data);
    },
    off: function(eventName, data) {
      socket.off(eventName, data);
    }
  };
});
;angular.module('questCreator').service('UserService', function () {
    var user = {
            uid: null,
            token: null,
            username: null,
            picture: null,
            id: null,
            games: null,
            joined: null,
            editGame: null
    };

    //Get the current values for user data
    function getUser() {
      return user;
    }

    function setUser(adjUser) {
      user = adjUser;
    }

    function setGameEdit(name) {
      user.editGame = name;
    }

    var apiKey = 'AIzaSyCe__2EGSmwp0DR-qKGqpYwawfmRsTLBEs';
    var clientId = '730683845367-tjrrmvelul60250evn5i74uka4ustuln.apps.googleusercontent.com';

    var auth2;
    // When the api has loaded, run the init function.
    gapi.load('client:auth2', initAuth);

    // Get authorization from the user to access profile info
    function initAuth() {
        gapi.client.setApiKey(apiKey); // Define the apiKey for requests
        gapi.auth2.init({ // Define the clientId and the scopes for requests
            client_id: clientId,
            scope: 'profile'
        }).then(function() {
            auth2 = gapi.auth2.getAuthInstance(); // Store authInstance for easier accessibility
            console.log("Session authorized");
            auth2.isSignedIn.listen(updateSignInStatus);
            updateSignInStatus(auth2.isSignedIn.get());
        });
    }

    function updateSignInStatus(isSignedIn) {
        if (isSignedIn) {
            $('#login').hide();
            $('#logout').show();
            console.log("Signed In!");
            getLogin();
        } else {
            $('#login').show();
            $('#logout').hide();
            console.log("Signed Out!");
        }
    }

    // Sign the user in to their google account when the sign in button is clicked
    function signIn() {
        auth2.signIn({
            prompt: 'login'
        });
    }

    // Sign the user out of their google account when the sign out button is clicked
    function signOut() {
        auth2.signOut();
    }

    // Get the name of the user who signed in.
    function getLogin() {
        var requestUser = gapi.client.request({
            path: 'https://people.googleapis.com/v1/people/me',
            method: 'GET'
        });
        requestUser.then(function(response) {
            user.picture = response.result.photos[0].url;
            user.uid = auth2.currentUser.Ab.El;
            user.token = auth2.currentUser.Ab.Zi.access_token;
            $.ajax({
                method: 'PATCH',
                url: 'https://forge-api.herokuapp.com/users/login',
                data: {
                    uid: user.uid,
                    token: user.token
                },
                success: function(response) {
                  user.joined = response.created_at;
                    user.username = response.username;
                    user.id = response.id;
                    $('#welcome').css('display', 'flex');
                    setTimeout(function() {
                        $('#welcome').css('display', 'none');
                    }, 2000);
                },
                error: function(error) {
                    if (error.status === 404) {
                        $('#register-form').css('display', 'flex');
                    } else if (error.status === 0) {
                      // Do nothing
                    } else {
                        alert('There was a problem logging in. Please try again');
                        signOut();
                    }
                }
            });
        });
    }

    function registerUser (username) {
      user.username = username;
        $.ajax({
            method: 'POST',
            url: 'https://forge-api.herokuapp.com/users/create',
            data: {
                username: user.username,
                uid: user.uid,
                token: user.token
            },
            success: function(response) {
              user.id = response.id;
              $('#register-form').css('display', 'none');
              setTimeout(function() {
                  $('#welcome').css('display', 'none');
              }, 2000);
            },
            error: function(error) {
              $('#register-form').css('display', 'none');
              alert('There was a problem logging in. Please try again');
              signOut();
            }
          });
    }

    function getUserGames() {
      if (!user.id) {
        alert('Please Login or Register');
        signIn();
      } else {
      return $.ajax({
          method: 'GET',
          url: 'https://forge-api.herokuapp.com/games/user-games',
          headers: {
            user_id: user.id,
            token: user.token
          },
          success: function(response) {

          },
          error: function(error) {
            alert('There was a problem loading the profile. Please try again.');
          }
        });
    }
}
    return {
      get: getUser,
      set: setUser,
      setGameEdit: setGameEdit,
      games: getUserGames,
      register: registerUser,
      signOut: signOut,
      signIn: signIn
    };
});
;angular.module('questCreator').controller('bgCtrl', function($state) {

});
;angular.module('questCreator').controller('chatCtrl', function(socket, $state) {
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
;angular.module('questCreator').controller('detailCtrl', function ($state, GameService) {


    this.playGame = function (name) {
        var gameToPlay = GameService.loadGame(name);
        $state.go('main.game.play');
    };

    //This is for testing only
    this.game = {
      thumbnail: "http://cdn.akamai.steamstatic.com/steam/apps/345390/extras/KQ_CC-PC_Bundle-Art_Capsule_Main.png?t=1477527248",
      name: "King's Quest Collection",
      creator: "billy badass",
      players: 6,
      created_at: new Date(),
      responseText: "something"
    };

});
;angular.module('questCreator').controller('editorCtrl', function($scope, $state, EditorService, UserService) {

  this.currentLargeView = 'maps';
  this.currentSmallView = 'objects';

  this.backgroundName = "Testing Background";
  $('.asset').draggable({
    helper: 'clone',
    start: function(event, ui) {
      $(ui.helper).addClass('grabbed');
    },
    stop: function(event, ui) {
      $(ui.helper).css({'transition': 'transform ease 100ms'}).removeClass('grabbed');
    }
  });
  $('#bg-canvas').droppable({
    drop: function(event, ui) {
      console.log('ui', ui);
      var clone = $(ui.draggable).clone();
      clone.draggable();
      $(this).append(clone);
    }
  });

  $scope.gameToEdit = UserService.get().editGame;

  $scope.editGame = function () {
      EditorService.getGame($scope.gameToEdit);
      $('.edit-game').hide();
  };

  $scope.createNewGame = function (name) {
      EditorService.createGame(name);
      $('.create-game').hide();
      $scope.gameToEdit = name;
      UserService.setGameEdit(name);
  };

  $scope.cancel = function () {
    $state.go('main.profile');
  };

});
;angular.module('questCreator').controller('entCtrl', function($state) {

});
;angular.module('questCreator').controller('gameCtrl', function(socket, $state, $scope) {
});
;angular.module('questCreator').controller('landingCtrl', function($state, $scope, UserService) {

  $scope.createGame = function () {
      var user = UserService.get();
      if (user.id) {
        user.editGame = null;
        UserService.set(user);
        $state.go('main.game.editor.views');
      } else {
        alert('Please Sign In or Register.');
        $scope.signIn();
      }
  };

  //This is for testing only
  $scope.games = [{
      thumbnail: "http://cdn.akamai.steamstatic.com/steam/apps/345390/extras/KQ_CC-PC_Bundle-Art_Capsule_Main.png?t=1477527248",
      name: "King's Quest Collection",
      creator: "billy badass",
      players: 6,
      created_at: new Date(),
      responseText: "something"
  }, {
      thumbnail: "http://cdn.akamai.steamstatic.com/steam/apps/345390/extras/KQ_CC-PC_Bundle-Art_Capsule_Main.png?t=1477527248",
      name: "King's Quest Collection",
      creator: "billy badass",
      players: 6,
      created_at: new Date(),
      responseText: "something"
  }, {
      thumbnail: "http://cdn.akamai.steamstatic.com/steam/apps/345390/extras/KQ_CC-PC_Bundle-Art_Capsule_Main.png?t=1477527248",
      name: "King's Quest Collection",
      creator: "billy badass",
      players: 6,
      created_at: new Date(),
      responseText: "something"
  }, {
      thumbnail: "http://cdn.akamai.steamstatic.com/steam/apps/345390/extras/KQ_CC-PC_Bundle-Art_Capsule_Main.png?t=1477527248",
      name: "King's Quest Collection",
      creator: "billy badass",
      players: 6,
      created_at: new Date(),
      responseText: "something"
  }, {
      thumbnail: "http://cdn.akamai.steamstatic.com/steam/apps/345390/extras/KQ_CC-PC_Bundle-Art_Capsule_Main.png?t=1477527248",
      name: "King's Quest Collection",
      creator: "billy badass",
      players: 6,
      created_at: new Date(),
      responseText: "something"
  }, {
      thumbnail: "http://cdn.akamai.steamstatic.com/steam/apps/345390/extras/KQ_CC-PC_Bundle-Art_Capsule_Main.png?t=1477527248",
      name: "King's Quest Collection",
      creator: "billy badass",
      players: 6,
      created_at: new Date(),
      responseText: "something"
  }, {
      thumbnail: "http://cdn.akamai.steamstatic.com/steam/apps/345390/extras/KQ_CC-PC_Bundle-Art_Capsule_Main.png?t=1477527248",
      name: "King's Quest Collection",
      creator: "billy badass",
      players: 6,
      created_at: new Date(),
      responseText: "something"
  }, {
      thumbnail: "http://cdn.akamai.steamstatic.com/steam/apps/345390/extras/KQ_CC-PC_Bundle-Art_Capsule_Main.png?t=1477527248",
      name: "King's Quest Collection",
      creator: "billy badass",
      players: 6,
      created_at: new Date(),
      responseText: "something"
  }, {
      thumbnail: "http://cdn.akamai.steamstatic.com/steam/apps/345390/extras/KQ_CC-PC_Bundle-Art_Capsule_Main.png?t=1477527248",
      name: "King's Quest Collection",
      creator: "billy badass",
      players: 6,
      created_at: new Date(),
      responseText: "something"
  }];

  $scope.assets = [
    {
      name: 'asset'
    }, {
      name: 'asset2'
    }, {
      name: 'asset3'
    }, {
      name: 'asset4'
    }, {
      name: 'asset5'
    }, {
      name: 'asset6'
    }, {
      name: 'asset7'
    }, {
      name: 'asset8'
    }, {
      name: 'asset9'
    }, {
      name: 'asset10'
    }, {
      name: 'asset11'
    }, {
      name: 'asset12'
    }, {
      name: 'asset13'
    }, {
      name: 'asset14'
    }, {
      name: 'asset15'
    }, {
      name: 'asset16'
    }, {
      name: 'asset17'
    }, {
      name: 'asset18'
    }, {
      name: 'asset19'
    }, {
      name: 'asset20'
    }
  ];

});
;angular.module('questCreator').controller('mainCtrl', function(socket, $state, $scope, UserService) {

    //When the user clicks "Home" on the nav bar view is changed to landing
    this.goHome = function () {
        $state.go('main.landing');
    };

    //When the user clicks "Profile" on the nav bar user information is loaded and view is changed to profile
    this.goToUser = function () {
        var games = UserService.games();
        games.done(function () {
          $state.go('main.profile');
        });
    };

    // When the user clicks the sign in button, prompt them to sign in to their google account.
    $scope.signIn = function() {
        UserService.signIn();
    };

    // When the user clicks the sign out button, sign them out of their google account
    this.signOut = function() {
        UserService.signOut();
        var user = {
                uid: null,
                token: null,
                username: null,
                picture: null,
                id: null,
                games: null,
                joined: null,
                editGame: null
        };
        UserService.set(user);
        $state.go('main.landing');
    };

    //New user can register a user name
    this.register = function (name) {
        UserService.register(name);
    };

    //If the user chooses not to register, they can cancel out of the process.
    this.cancel = function () {
        $('#user-popup').css('display', 'none');
        UserService.signOut();
    };
});
;angular.module('questCreator').controller('mapCtrl', function($state) {

});
;angular.module('questCreator').controller('objCtrl', function($state) {

});
;angular.module('questCreator').controller('playCtrl', function(socket, Avatar, Background, SceneObject, Entity, UserService, $state, $scope) {
  var gameCanvas = document.getElementById('play-canvas');
  var gameCtx = gameCanvas.getContext('2d');
  var gameWidth = 700;
  var gameHeight = 500;

  var avatar = null;
  var background = null;
  var sceneObject = null;
  var entity = null;

  var avatarLoaded = false;
  var backgroundLoaded = false;
  var sceneObjectLoaded = false;
  var entityLoaded = false;

  var typing = {
    show: false,
    phrase: ''
  };
  var responding = {
    show: false,
    phrase: ''
  };
  var inventory = {
    show: false,
    contents: ''
  }
  var pause = false;
  var startTime = new Date();

  // Testing creation of avatar
  var avatarTest = {
    name: 'Avatar Test',
    obj: {
      // The x and y coordinate of the top left corner of the avatar
      pos: {
        x: 100,
        y: 100
      },
      // The character's speed
      speed: {
        mag: 3,
        x: 0,
        y: 0
      },
      // The animate object contains all the possible character actions with all of the frames to be drawn for each action.
      animate: {
        // Key: possible action, Value: array of frames
        walkLeft: [
          // Each frame array element is an array of square objects to be drawn
          // Frame 1 - walk left
          [{
            x: 100,
            y: 100,
            width: 30,
            height: 30,
            color: 'blue'
          }, {
            x: 110,
            y: 150,
            width: 30,
            height: 30,
            color: 'green'
          }],
          // Frame 2 - walk left
          [{
            x: 110,
            y: 100,
            width: 30,
            height: 30,
            color: 'blue'
          }, {
            x: 100,
            y: 150,
            width: 30,
            height: 30,
            color: 'green'
          }]
        ],
        walkRight: [
          // Frame 1 - walk right
          [{
            x: 150,
            y: 100,
            width: 30,
            height: 30,
            color: 'blue'
          }, {
            x: 140,
            y: 150,
            width: 30,
            height: 30,
            color: 'green'
          }],
          // Frame 2 - walk right
          [{
            x: 140,
            y: 100,
            width: 30,
            height: 30,
            color: 'blue'
          }, {
            x: 150,
            y: 150,
            width: 30,
            height: 30,
            color: 'green'
          }]
        ],
        walkUp: [
          // Frame 1 - walk up
          [{
            x: 100,
            y: 110,
            width: 30,
            height: 30,
            color: 'red'
          }, {
            x: 150,
            y: 100,
            width: 30,
            height: 30,
            color: 'yellow'
          }],
          // Frame 2 - walk up
          [{
            x: 100,
            y: 100,
            width: 30,
            height: 30,
            color: 'red'
          }, {
            x: 150,
            y: 110,
            width: 30,
            height: 30,
            color: 'yellow'
          }]
        ],
        walkDown: [
          // Frame 1 - walk down
          [{
            x: 100,
            y: 140,
            width: 30,
            height: 30,
            color: 'red'
          }, {
            x: 150,
            y: 150,
            width: 30,
            height: 30,
            color: 'yellow'
          }],
          // Frame 2 - walk down
          [{
            x: 100,
            y: 150,
            width: 30,
            height: 30,
            color: 'red'
          }, {
            x: 150,
            y: 140,
            width: 30,
            height: 30,
            color: 'yellow'
          }]
        ],
        swimLeft: [
          // Frame 1 - swim left
          [{
            x: 100,
            y: 100,
            width: 30,
            height: 30,
            color: 'lightblue'
          }, {
            x: 150,
            y: 150,
            width: 30,
            height: 30,
            color: 'lightblue'
          }],
          // Frame 2 - swim left
          [{
            x: 100,
            y: 100,
            width: 30,
            height: 30,
            color: 'gray'
          }, {
            x: 150,
            y: 150,
            width: 30,
            height: 30,
            color: 'gray'
          }]
        ],
        swimRight: [
          // Frame 1 - swim right
          [{
            x: 100,
            y: 100,
            width: 30,
            height: 30,
            color: 'lightblue'
          }, {
            x: 150,
            y: 150,
            width: 30,
            height: 30,
            color: 'lightblue'
          }],
          // Frame 2 - swim right
          [{
            x: 100,
            y: 100,
            width: 30,
            height: 30,
            color: 'gray'
          }, {
            x: 150,
            y: 150,
            width: 30,
            height: 30,
            color: 'gray'
          }]
        ],
        swimUp: [
          // Frame 1 - swim up
          [{
            x: 100,
            y: 100,
            width: 30,
            height: 30,
            color: 'lightblue'
          }, {
            x: 150,
            y: 150,
            width: 30,
            height: 30,
            color: 'lightblue'
          }],
          // Frame 2 - swim up
          [{
            x: 100,
            y: 100,
            width: 30,
            height: 30,
            color: 'gray'
          }, {
            x: 150,
            y: 150,
            width: 30,
            height: 30,
            color: 'gray'
          }]
        ],
        swimDown: [
          // Frame 1 - swim down
          [{
            x: 100,
            y: 100,
            width: 30,
            height: 30,
            color: 'lightblue'
          }, {
            x: 150,
            y: 150,
            width: 30,
            height: 30,
            color: 'lightblue'
          }],
          // Frame 2 - swim down
          [{
            x: 100,
            y: 100,
            width: 30,
            height: 30,
            color: 'gray'
          }, {
            x: 150,
            y: 150,
            width: 30,
            height: 30,
            color: 'gray'
          }]
        ]
        // Other actions could go here
      },
      // The collision map is how the game can know whether the character has collided with another object or event trigger. It is an array of invisible (or gray for now) squares.
      collisionMap: [
        {
          x: 100,
          y: 180,
          width: 80,
          height: 10,
          color: 'gray'
        }, {
          x: 100,
          y: 185,
          width: 80,
          height: 10,
          color: 'gray'
        }
      ]
    },
    current: false
  };

  // Testing creation of background
  var backgroundTest = {
    name: 'Beige Background',
    obj: {
      image: [{
        x: 0,
        y: 0,
        width: gameWidth,
        height: gameHeight,
        color: 'beige'
      }, {
        x: 150,
        y: 150,
        width: 50,
        height: 50,
        color: 'yellow'
      }],
      collisionMap: [{
        type: 'wall',
        x: 150,
        y: 200,
        width: 50,
        height: 20,
        color: 'gray'
      }]
    },
    game_id: 1,
    tags: ['Testing Stuff', 'Plain beige'],
    public: true
  };

  // Testing creation of object
  var sceneObjectTest = {
    name: 'Object Test',
    obj: {
      // The x and y coordinate of the top left corner of the object
      pos: {
        x: 400,
        y: 300
      },
      // The animate object contains all the possible object actions with all of the frames to be drawn for each action.
      animate: {
        // Key: possible action, Value: array of frames
        wave: [
          // Each frame array element is an array of square objects to be drawn
          // Frame 1 - wave
          [{
            x: 0,
            y: 0,
            width: 10,
            height: 100,
            color: 'brown'
          }, {
            x: 0,
            y: 0,
            width: 50,
            height: 10,
            color: 'red'
          }, {
            x: 50,
            y: 10,
            width: 50,
            height: 10,
            color: 'red'
          }],
          // Frame 2 - wave
          [{
            x: 0,
            y: 0,
            width: 10,
            height: 100,
            color: 'brown'
          }, {
            x: 0,
            y: 10,
            width: 50,
            height: 10,
            color: 'red'
          }, {
            x: 50,
            y: 0,
            width: 50,
            height: 10,
            color: 'red'
          }]
        ],
        // Other actions could go here
      },
      // The collision map is how the game can know whether the character has collided with another object or event trigger. It is an array of invisible (or gray for now) squares.
      collisionMap: [
        {
          x: -10,
          y: 100,
          width: 10,
          height: 10,
          color: 'gray'
        }, {
          x: 0,
          y: 100,
          width: 10,
          height: 10,
          color: 'gray'
        }, {
          x: 0,
          y: 100,
          width: 10,
          height: 10,
          color: 'gray'
        }
      ]
    },
    game_id: 1,
    tags: ['Object thing', 'Really fun new object'],
    public: false
  };

  // Testing creation of entity
  var entityTest = {
    name: 'AI Entity Test',
    obj: {
      // The x and y coordinate of the top left corner of the avatar
      pos: {
        x: 50,
        y: 220
      },
      // The character's speed
      speed: {
        mag: 3,
        x: 0,
        y: 0
      },
      // The animate object contains all the possible character actions with all of the frames to be drawn for each action.
      animate: {
        // Key: possible action, Value: array of frames
        stand: [
          // Each frame array element is an array of square objects to be drawn
          // Frame 1 - walk left
          [{
            x: 100,
            y: 100,
            width: 30,
            height: 30,
            color: 'orange'
          }, {
            x: 150,
            y: 100,
            width: 30,
            height: 30,
            color: 'purple'
          }],
          // Frame 2 - walk left
          [{
            x: 110,
            y: 100,
            width: 30,
            height: 30,
            color: 'orange'
          }, {
            x: 140,
            y: 100,
            width: 30,
            height: 30,
            color: 'purple'
          }]
        ],
        walkLeft: [
          // Each frame array element is an array of square objects to be drawn
          // Frame 1 - walk left
          [{
            x: 100,
            y: 100,
            width: 30,
            height: 30,
            color: 'purple'
          }, {
            x: 110,
            y: 150,
            width: 30,
            height: 30,
            color: 'orange'
          }],
          // Frame 2 - walk left
          [{
            x: 110,
            y: 100,
            width: 30,
            height: 30,
            color: 'purple'
          }, {
            x: 100,
            y: 150,
            width: 30,
            height: 30,
            color: 'orange'
          }]
        ],
        walkRight: [
          // Frame 1 - walk right
          [{
            x: 150,
            y: 100,
            width: 30,
            height: 30,
            color: 'purple'
          }, {
            x: 140,
            y: 150,
            width: 30,
            height: 30,
            color: 'orange'
          }],
          // Frame 2 - walk right
          [{
            x: 140,
            y: 100,
            width: 30,
            height: 30,
            color: 'purple'
          }, {
            x: 150,
            y: 150,
            width: 30,
            height: 30,
            color: 'orange'
          }]
        ],
        walkUp: [
          // Frame 1 - walk up
          [{
            x: 100,
            y: 110,
            width: 30,
            height: 30,
            color: 'purple'
          }, {
            x: 150,
            y: 100,
            width: 30,
            height: 30,
            color: 'orange'
          }],
          // Frame 2 - walk up
          [{
            x: 100,
            y: 100,
            width: 30,
            height: 30,
            color: 'purple'
          }, {
            x: 150,
            y: 110,
            width: 30,
            height: 30,
            color: 'orange'
          }]
        ],
        walkDown: [
          // Frame 1 - walk down
          [{
            x: 100,
            y: 140,
            width: 30,
            height: 30,
            color: 'purple'
          }, {
            x: 150,
            y: 150,
            width: 30,
            height: 30,
            color: 'orange'
          }],
          // Frame 2 - walk down
          [{
            x: 100,
            y: 150,
            width: 30,
            height: 30,
            color: 'purple'
          }, {
            x: 150,
            y: 140,
            width: 30,
            height: 30,
            color: 'orange'
          }]
        ],
        swimLeft: [
          // Frame 1 - swim left
          [{
            x: 100,
            y: 100,
            width: 30,
            height: 30,
            color: 'lightblue'
          }, {
            x: 150,
            y: 150,
            width: 30,
            height: 30,
            color: 'lightblue'
          }],
          // Frame 2 - swim left
          [{
            x: 100,
            y: 100,
            width: 30,
            height: 30,
            color: 'gray'
          }, {
            x: 150,
            y: 150,
            width: 30,
            height: 30,
            color: 'gray'
          }]
        ],
        swimRight: [
          // Frame 1 - swim right
          [{
            x: 100,
            y: 100,
            width: 30,
            height: 30,
            color: 'lightblue'
          }, {
            x: 150,
            y: 150,
            width: 30,
            height: 30,
            color: 'lightblue'
          }],
          // Frame 2 - swim right
          [{
            x: 100,
            y: 100,
            width: 30,
            height: 30,
            color: 'gray'
          }, {
            x: 150,
            y: 150,
            width: 30,
            height: 30,
            color: 'gray'
          }]
        ],
        swimUp: [
          // Frame 1 - swim up
          [{
            x: 100,
            y: 100,
            width: 30,
            height: 30,
            color: 'lightblue'
          }, {
            x: 150,
            y: 150,
            width: 30,
            height: 30,
            color: 'lightblue'
          }],
          // Frame 2 - swim up
          [{
            x: 100,
            y: 100,
            width: 30,
            height: 30,
            color: 'gray'
          }, {
            x: 150,
            y: 150,
            width: 30,
            height: 30,
            color: 'gray'
          }]
        ],
        swimDown: [
          // Frame 1 - swim down
          [{
            x: 100,
            y: 100,
            width: 30,
            height: 30,
            color: 'lightblue'
          }, {
            x: 150,
            y: 150,
            width: 30,
            height: 30,
            color: 'lightblue'
          }],
          // Frame 2 - swim down
          [{
            x: 100,
            y: 100,
            width: 30,
            height: 30,
            color: 'gray'
          }, {
            x: 150,
            y: 150,
            width: 30,
            height: 30,
            color: 'gray'
          }]
        ]
        // Other actions could go here
      },
      // The collision map is how the game can know whether the character has collided with another object or event trigger. It is an array of invisible (or gray for now) squares.
      collisionMap: [
        {
          x: 100,
          y: 180,
          width: 80,
          height: 10,
          color: 'gray'
        }, {
          x: 100,
          y: 185,
          width: 80,
          height: 10,
          color: 'gray'
        }
      ]
    },
    game_id: 1,
    tags: ['Entity thing', 'Awesome entity ftw'],
    public: false
  };

  // Testing creation of scene
  var sceneTest = {
    name: 'Scene Test 3',
    description: 'This is the opening scene for my game.',
    obj: {},
    game_id: 1,
    map_id: 1
  };

  // Testing creation of map
  var mapTest = {
    game_id: 1,
    name: 'Map Test 2',
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
    name: 'Game Test 2',
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
    },
    tags: ['The best game', 'fun stuff', "Everybody's favorite"],
    public: false,
  };

  $('.createAvatarBgObjEntityBtn').click(function() {
    var headerData = {
      user_id: UserService.get().id,
      token: UserService.get().token
    };
    $.ajax({
      method: 'POST',
      url: 'https://forge-api.herokuapp.com/characters/create',
      headers: headerData,
      data: JSON.stringify(avatarTest),
      dataType: 'json',
      contentType: 'application/json',
      success: function(response) {
        avatar = new Avatar(response);
        avatar.obj.currentFrame = avatar.obj.animate.walkLeft[0];
        avatarLoaded = true;
        setInterval(checkAvatarAction, 75);
      },
      error: function(error) {
        console.log(error);
      }
    });
    $.ajax({
      method: 'POST',
      url: 'https://forge-api.herokuapp.com/backgrounds/create',
      headers: headerData,
      data: JSON.stringify(backgroundTest),
      dataType: 'json',
      contentType: 'application/json',
      success: function(response) {
        background = new Background(response);
        backgroundLoaded = true;
      },
      error: function(error) {
        console.log(error);
      }
    });
    $.ajax({
      method: 'POST',
      url: 'https://forge-api.herokuapp.com/obstacles/create',
      headers: headerData,
      data: JSON.stringify(sceneObjectTest),
      dataType: 'json',
      contentType: 'application/json',
      success: function(response) {
        sceneObject = new SceneObject(response);
        sceneObject.allActions = Object.keys(sceneObject.obj.animate);
        sceneObject.action = sceneObject.allActions[0]; // The first action
        sceneObject.obj.currentFrame = sceneObject.obj.animate[sceneObject.action][0]; // The first frame of the first action, whatever it is.
        sceneObjectLoaded = true;
        setInterval(checkSceneObjectAction, 75);
      },
      error: function(error) {
        console.log(error);
      }
    });
    $.ajax({
      method: 'POST',
      url: 'https://forge-api.herokuapp.com/entities/create',
      headers: headerData,
      data: JSON.stringify(entityTest),
      dataType: 'json',
      contentType: 'application/json',
      success: function(response) {
        entity = new Entity(response);
        console.log(entity);
        entity.obj.currentFrame = entity.obj.animate[entity.action][0];
        entityLoaded = true;
        setInterval(checkEntityAction, 75);
      },
      error: function(error) {
        console.log(error);
      }
    });
  });

  $('.createSceneBtn').click(function() {
    var headerData = {
      user_id: UserService.get().id,
      token: UserService.get().token
    };
    $.ajax({
      method: 'POST',
      url: 'https://forge-api.herokuapp.com/scenes/create',
      headers: headerData,
      data: JSON.stringify(sceneTest),
      dataType: 'json',
      contentType: 'application/json',
      success: function(response) {
        console.log(response);
      },
      error: function(error) {
        console.log(error);
      }
    });
  })

  $('.createMapBtn').click(function() {
    var headerData = {
      user_id: UserService.get().id,
      token: UserService.get().token
    };
    $.ajax({
      method: 'POST',
      url: 'https://forge-api.herokuapp.com/maps/create',
      headers: headerData,
      data: JSON.stringify(mapTest),
      dataType: 'json',
      contentType: 'application/json',
      success: function(response) {
        console.log(response);
      },
      error: function(error) {
        console.log(error);
      }
    });
  })

  $('.createGameBtn').click(function() {
    var headerData = {
      user_id: UserService.get().id,
      token: UserService.get().token
    };
    $.ajax({
      method: 'POST',
      url: 'https://forge-api.herokuapp.com/games/create',
      headers: headerData,
      data: JSON.stringify(gameTest),
      dataType: 'json',
      contentType: 'application/json',
      success: function(response) {
        console.log(response);
      },
      error: function(error) {
        console.log(error);
      }
    });
  })

  $('body').off('keyup').on('keyup', function(event) {
    var keyCode = event.which;
    if (keyCode === 37) {
      avatar.action = (avatar.action === 'walkLeft') ? 'stand' : 'walkLeft';
      avatar.obj.speed.x = (avatar.obj.speed.x === -1 * avatar.obj.speed.mag) ? 0 : -1 * avatar.obj.speed.mag;
      avatar.obj.speed.y = 0;
    } else if (keyCode === 38) {
      avatar.action = (avatar.action === 'walkUp') ? 'stand' : 'walkUp';
      avatar.obj.speed.x = 0;
      avatar.obj.speed.y = (avatar.obj.speed.y === -1 * avatar.obj.speed.mag) ? 0 : -1 * avatar.obj.speed.mag;
    } else if (keyCode === 39) {
      avatar.action = (avatar.action === 'walkRight') ? 'stand' : 'walkRight';
      avatar.obj.speed.x = (avatar.obj.speed.x === avatar.obj.speed.mag) ? 0 : avatar.obj.speed.mag;
      avatar.obj.speed.y = 0;
    } else if (keyCode === 40) {
      avatar.action = (avatar.action === 'walkDown') ? 'stand' : 'walkDown';
      avatar.obj.speed.x = 0;
      avatar.obj.speed.y = (avatar.obj.speed.y === avatar.obj.speed.mag) ? 0 : avatar.obj.speed.mag;
    }
  });

  $('body').off('keypress').on('keypress', function(event) {
    var keyCode = event.which;
    if (typing.show && keyCode >= 32 && keyCode <= 220 && !responding.show && $('.active').length === 0) {
      pause = true;
      var char = String.fromCharCode(keyCode);
      typing.phrase += char;
      $('.typing').text(typing.phrase);
    } else if (keyCode === 13) {
      // Enter
        if (typing.show) { // If the user is finishing typing
          typing.show = false;
          $('.typing').hide();
          var userPhrase = typing.phrase;
          typing.phrase = '';
          checkTyping(userPhrase);
        } else if (responding.show) { // If the user is finished reading a response
          responding.show = false;
          $('.dialog').hide();
          responding.phrase = '';
        } else if (inventory.show) { // If the user is finished looking at inventory
          // $('.inventoryContainer').hide();
          // this.inventory.show = false;
        }
        if (!responding.show && !inventory.show && $('.active').length === 0) { // Resume the game if all windows have been closed
          pause = false;
        }
    } else if (keyCode === 32) {
      // Space
      if (!typing.show) {
        typing.phrase = '>';
        typing.show = true;
        $('.typing').text(typing.phrase).show();
      }
    }
  });

  function checkTyping(phrase) {
    if (phrase.includes('look')) {
      responding.phrase = "This is a description of your current scene. I hope it's helpful.";
    } else {
      responding.phrase = "I don't understand that.";
    }
    $('.dialog').text(responding.phrase).show();
    responding.show = true;
    pause = true;
  }

  function checkAvatarCollisions() {
    var collision = {
      found: false,
      direction: 'none',
      type: 'none'
    };
    avatar.obj.collisionMap.forEach(function(avatarSquare) {  // Loop through all the avatar squares
      var avatarLeft = avatarSquare.x + avatar.obj.pos.x;
      var avatarRight = avatarSquare.x + avatarSquare.width + avatar.obj.pos.x;
      var avatarTop = avatarSquare.y + avatar.obj.pos.y;
      var avatarBottom = avatarSquare.y + avatarSquare.height + avatar.obj.pos.y;
      background.obj.collisionMap.forEach(function(bgSquare) {  // Loop through all the background's squares
        var bgLeft = bgSquare.x;
        var bgRight = bgSquare.x + bgSquare.width;
        var bgTop = bgSquare.y;
        var bgBottom = bgSquare.y + bgSquare.height;
        // Pattern: check the left, right, top, and bottom edges of the current avatar square against the right, left, bottom, and top edges of the current bg square (in those exact orders).
        if (avatarLeft <= bgRight && avatarRight >= bgLeft && avatarTop <= bgBottom && avatarBottom >= bgTop) {
          collision.found = true;
          collision.type = 'wall';
          if (avatar.obj.speed.x > 0) {
            collision.direction = 'right';
          } else if (avatar.obj.speed.x < 0) {
            collision.direction = 'left';
          } else if (avatar.obj.speed.y < 0) {
            collision.direction = 'up';
          } else if (avatar.obj.speed.y > 0) {
            collision.direction = 'down';
          }
        }
      });
      sceneObject.obj.collisionMap.forEach(function(objSquare) {  // Loop through all the scene object's squares
        var objLeft = objSquare.x + sceneObject.obj.pos.x;
        var objRight = objSquare.x + objSquare.width + sceneObject.obj.pos.x;
        var objTop = objSquare.y + sceneObject.obj.pos.y;
        var objBottom = objSquare.y + objSquare.height + sceneObject.obj.pos.y;
        // Pattern: check the left, right, top, and bottom edges of the current avatar square against the right, left, bottom, and top edges of the current scene object square (in those exact orders).
        if (avatarLeft <= objRight && avatarRight >= objLeft && avatarTop <= objBottom && avatarBottom >= objTop) {
          collision.found = true;
          collision.type = 'wall';
          if (avatar.obj.speed.x > 0) {
            collision.direction = 'right';
          } else if (avatar.obj.speed.x < 0) {
            collision.direction = 'left';
          } else if (avatar.obj.speed.y < 0) {
            collision.direction = 'up';
          } else if (avatar.obj.speed.y > 0) {
            collision.direction = 'down';
          }
        }
      });
      entity.obj.collisionMap.forEach(function(entitySquare) {  // Loop through all the scene object's squares
        var entityLeft = entitySquare.x + entity.obj.pos.x;
        var entityRight = entitySquare.x + entitySquare.width + entity.obj.pos.x;
        var entityTop = entitySquare.y + entity.obj.pos.y;
        var entityBottom = entitySquare.y + entitySquare.height + entity.obj.pos.y;
        // Pattern: check the left, right, top, and bottom edges of the current avatar square against the right, left, bottom, and top edges of the current scene object square (in those exact orders).
        if (avatarLeft <= entityRight && avatarRight >= entityLeft && avatarTop <= entityBottom && avatarBottom >= entityTop) {
          collision.found = true;
          collision.type = 'wall';
          if (avatar.obj.speed.x > 0) {
            collision.direction = 'right';
          } else if (avatar.obj.speed.x < 0) {
            collision.direction = 'left';
          } else if (avatar.obj.speed.y < 0) {
            collision.direction = 'up';
          } else if (avatar.obj.speed.y > 0) {
            collision.direction = 'down';
          }
        }
      });
    });

    if (collision.found) {
      switch (collision.type) {
        case 'wall':
          avatar.collide(collision.direction);
          break;
      }
      collision = {
        found: false,
        direction: 'none',
        type: 'none'
      };
    }
  }

  function checkEntityCollisions() {
    var collision = {
      found: false,
      direction: 'none',
      type: 'none'
    };
    entity.obj.collisionMap.forEach(function(entitySquare) {  // Loop through all the entity squares
      var entityLeft = entitySquare.x + entity.obj.pos.x;
      var entityRight = entitySquare.x + entitySquare.width + entity.obj.pos.x;
      var entityTop = entitySquare.y + entity.obj.pos.y;
      var entityBottom = entitySquare.y + entitySquare.height + entity.obj.pos.y;
      background.obj.collisionMap.forEach(function(bgSquare) {  // Loop through all the background's squares
        var bgLeft = bgSquare.x;
        var bgRight = bgSquare.x + bgSquare.width;
        var bgTop = bgSquare.y;
        var bgBottom = bgSquare.y + bgSquare.height;
        // Pattern: check the left, right, top, and bottom edges of the current entity square against the right, left, bottom, and top edges of the current bg square (in those exact orders).
        if (entityLeft <= bgRight && entityRight >= bgLeft && entityTop <= bgBottom && entityBottom >= bgTop) {
          collision.found = true;
          collision.type = 'wall';
          if (entity.obj.speed.x > 0) {
            collision.direction = 'right';
          } else if (entity.obj.speed.x < 0) {
            collision.direction = 'left';
          } else if (entity.obj.speed.y < 0) {
            collision.direction = 'up';
          } else if (entity.obj.speed.y > 0) {
            collision.direction = 'down';
          }
        }
      });
      sceneObject.obj.collisionMap.forEach(function(objSquare) {  // Loop through all the scene object's squares
        var objLeft = objSquare.x + sceneObject.obj.pos.x;
        var objRight = objSquare.x + objSquare.width + sceneObject.obj.pos.x;
        var objTop = objSquare.y + sceneObject.obj.pos.y;
        var objBottom = objSquare.y + objSquare.height + sceneObject.obj.pos.y;
        // Pattern: check the left, right, top, and bottom edges of the current entity square against the right, left, bottom, and top edges of the current scene object square (in those exact orders).
        if (entityLeft <= objRight && entityRight >= objLeft && entityTop <= objBottom && entityBottom >= objTop) {
          collision.found = true;
          collision.type = 'wall';
          if (entity.obj.speed.x > 0) {
            collision.direction = 'right';
          } else if (entity.obj.speed.x < 0) {
            collision.direction = 'left';
          } else if (entity.obj.speed.y < 0) {
            collision.direction = 'up';
          } else if (entity.obj.speed.y > 0) {
            collision.direction = 'down';
          }
        }
      });
      avatar.obj.collisionMap.forEach(function(avatarSquare) {  // Loop through all the scene object's squares
        var avatarLeft = avatarSquare.x + avatar.obj.pos.x;
        var avatarRight = avatarSquare.x + avatarSquare.width + avatar.obj.pos.x;
        var avatarTop = avatarSquare.y + avatar.obj.pos.y;
        var avatarBottom = avatarSquare.y + avatarSquare.height + avatar.obj.pos.y;
        // Pattern: check the left, right, top, and bottom edges of the current entity square against the right, left, bottom, and top edges of the current scene object square (in those exact orders).
        if (entityLeft <= avatarRight && entityRight >= avatarLeft && entityTop <= avatarBottom && entityBottom >= avatarTop) {
          collision.found = true;
          collision.type = 'wall';
          if (entity.obj.speed.x > 0) {
            collision.direction = 'right';
          } else if (entity.obj.speed.x < 0) {
            collision.direction = 'left';
          } else if (entity.obj.speed.y < 0) {
            collision.direction = 'up';
          } else if (entity.obj.speed.y > 0) {
            collision.direction = 'down';
          }
        }
      });
    });

    if (collision.found) {
      switch (collision.type) {
        case 'wall':
          entity.collide(collision.direction);
          break;
      }
      collision = {
        found: false,
        direction: 'none',
        type: 'none'
      };
    }
  }

  function updateAvatar() {
    avatar.updatePos();
  }

  function updateEntity() {
    entity.updatePos();
  }

  // NOTE: these frame index variables should probably belong to the individual avatar, object, or entity in the factory
  var currentAvatarFrameIndex = 0;
  function checkAvatarAction() {
    if (avatar.action === 'walkLeft' || avatar.action === 'walkUp' || avatar.action === 'walkRight' || avatar.action === 'walkDown') {
      if (currentAvatarFrameIndex > avatar.obj.animate[avatar.action].length - 1) {
        currentAvatarFrameIndex = 0;
      }
      avatar.obj.currentFrame = avatar.obj.animate[avatar.action][currentAvatarFrameIndex];
      currentAvatarFrameIndex++;
    } else {
      // Do nothing, or set frame to a given specific frame.
      // avatar.obj.currentFrame = avatar.obj.animate.walkLeft[0];
    }
  }

  var currentSceneObjFrameIndex = 0;
  function checkSceneObjectAction() {
    // Animate the object.
    if (currentSceneObjFrameIndex > sceneObject.obj.animate[sceneObject.allActions[0]].length - 1) {
      currentSceneObjFrameIndex = 0;
    }
    sceneObject.obj.currentFrame = sceneObject.obj.animate[sceneObject.allActions[0]][currentSceneObjFrameIndex];
    currentSceneObjFrameIndex++;
  }

  var currentEntityFrameIndex = 0;
  function checkEntityAction() {
    if (entity.action === 'stand' || entity.action === 'walkLeft' || entity.action === 'walkUp' || entity.action === 'walkRight' || entity.action === 'walkDown') {
      switch (entity.action) {
        case 'walkLeft':
          entity.obj.speed.x = -1;
          entity.obj.speed.y = 0;
          break;
        case 'walkUp':
          entity.obj.speed.x = 0;
          entity.obj.speed.y = -1;
          break;
        case 'walkRight':
          entity.obj.speed.x = 1;
          entity.obj.speed.y = 0;
          break;
        case 'walkDown':
          entity.obj.speed.x = 0;
          entity.obj.speed.y = 1;
          break;
      }
      // Animate the entity.
      if (currentEntityFrameIndex > entity.obj.animate[entity.action].length - 1) {
        currentEntityFrameIndex = 0;
      }
      entity.obj.currentFrame = entity.obj.animate[entity.action][currentEntityFrameIndex];
      currentEntityFrameIndex++;
    }
  }

  function drawAvatar() {
    // Save the drawing context
    gameCtx.save();
    // Translate the canvas origin to be the top left of the avatar
    gameCtx.translate(avatar.obj.pos.x, avatar.obj.pos.y);
    // Draw the squares from the avatar's current frame
    avatar.obj.currentFrame.forEach(function(square) {
      gameCtx.fillStyle = square.color;
      gameCtx.fillRect(square.x, square.y, square.width, square.height);
    });
    gameCtx.globalAlpha = 0.2;
    // Draw the avatar's collision map (purely for testing)
    avatar.obj.collisionMap.forEach(function(square) {
      gameCtx.fillStyle = square.color;
      gameCtx.fillRect(square.x, square.y, square.width, square.height);
    });
    gameCtx.restore();
  }

  function drawBackground() {
    // Save the drawing context
    gameCtx.save();
    // Draw the squares from the background object.
    gameCtx.globalCompositeOperation = "destination-over";
    for (var index = background.obj.image.length - 1; index >= 0; index--) {
      var square = background.obj.image[index];
      gameCtx.fillStyle = square.color;
      gameCtx.fillRect(square.x, square.y, square.width, square.height);
    }
    gameCtx.globalCompositeOperation = "source-over";
    gameCtx.globalAlpha = 0.2;
    // Draw the background's collision map (purely for testing)
    background.obj.collisionMap.forEach(function(square) {
      gameCtx.fillStyle = square.color;
      gameCtx.fillRect(square.x, square.y, square.width, square.height);
    });
    gameCtx.restore();
  }

  function drawObjects() {
    // Save the drawing context
    gameCtx.save();
    // Translate the canvas origin to be the top left of the sceneObject
    gameCtx.translate(sceneObject.obj.pos.x, sceneObject.obj.pos.y);
    // Draw the squares from the sceneObject's current frame
    gameCtx.globalCompositeOperation = "destination-over";  // If object is behind character.
    // gameCtx.globalCompositeOperation = "source-over";    // If object is in front of character.
    sceneObject.obj.currentFrame.forEach(function(square) {
      gameCtx.fillStyle = square.color;
      gameCtx.fillRect(square.x, square.y, square.width, square.height);
    });
    gameCtx.globalAlpha = 0.2;
    // Draw the sceneObject's collision map (purely for testing)
    sceneObject.obj.collisionMap.forEach(function(square) {
      gameCtx.fillStyle = square.color;
      gameCtx.fillRect(square.x, square.y, square.width, square.height);
    });
    gameCtx.restore();
  }

  function drawEntities() {
    // Save the drawing context
    gameCtx.save();
    // Translate the canvas origin to be the top left of the entity
    gameCtx.translate(entity.obj.pos.x, entity.obj.pos.y);
    // Draw the squares from the entity's current frame
    gameCtx.globalCompositeOperation = "destination-over";  // If object is behind character.
    // gameCtx.globalCompositeOperation = "source-over";    // If object is in front of character.
    entity.obj.currentFrame.forEach(function(square) {
      gameCtx.fillStyle = square.color;
      gameCtx.fillRect(square.x, square.y, square.width, square.height);
    });
    gameCtx.globalAlpha = 0.2;
    // Draw the entity's collision map (purely for testing)
    entity.obj.collisionMap.forEach(function(square) {
      gameCtx.fillStyle = square.color;
      gameCtx.fillRect(square.x, square.y, square.width, square.height);
    });
    gameCtx.restore();
  }

  function clearCanvas() {
    gameCtx.clearRect(0, 0, gameWidth, gameHeight);
  }

  var initialized = false;
  function runGame() {
    clearCanvas();
    // Draw avatar if it has been loaded
    if (avatarLoaded && backgroundLoaded && sceneObjectLoaded && entityLoaded && !initialized) {
      sceneTest.obj = {
        avatar: avatar,
        background: background,
        objects: [sceneObject],
        entities: [entity]
      };
      avatar = sceneTest.obj.avatar;
      background = sceneTest.obj.background;
      sceneObject = sceneTest.obj.objects[0];
      entity = sceneTest.obj.entities[0];
      initialized = true;
      console.log(sceneTest);
      console.log(JSON.stringify(sceneTest.obj));
    }
    if (initialized) {
      checkAvatarCollisions();
      checkEntityCollisions();
      updateAvatar();
      updateEntity();
      drawAvatar();
      drawEntities();
      drawObjects();
      drawBackground();
    }
    requestAnimationFrame(runGame);
  }
  requestAnimationFrame(runGame);

  /*
  // Socket functionality
  var socketId;
  var charInfo;
  var allPlayers = [];

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
  */
});
;angular.module('questCreator').controller('profileCtrl', function(socket, $state, $scope, UserService) {

  // var gameCanvas = document.getElementById('play-canvas');
  // var gameCtx = gameCanvas.getContext('2d');
  // var gameWidth = 500;
  // var gameHeight = 700;
  //
  // function drawAvatar() {
  //   // Save the drawing context
  //   gameCtx.save();
  //   // Translate the canvas origin to be the top left of the avatar
  //   gameCtx.translate(avatar.pos.x, avatar.pos.y);
  //   // Draw the squares from the avatar's current frame AND the collision map.
  //   avatar.currentFrame.forEach(function(square) {
  //     gameCtx.fillStyle = square.color;
  //     gameCtx.fillRect(square.x, square.y, square.width, square.height);
  //   });
  //   gameCtx.restore();
  //   gameCtx.fillStyle = "blue";
  //   gameCtx.fillRect(0,0,100,100);
  // }
  //
    $scope.createGame = function() {
        $state.go('main.game.editor.views');
    };

    $scope.editGame = function (name) {
        $scope.user.editGame = name;
        UserService.set($scope.user);
        $state.go('main.game.editor.views');
    };

    setTimeout(function() {
        $scope.user = UserService.get();
        // $scope.games = UserService.games();

        $scope.getJoinedDate = function(date) {
            return new Date(date);
        };
        $scope.$apply();
    }, 1000);

    //This is for testing only
    $scope.games = [{
        thumbnail: "http://cdn.akamai.steamstatic.com/steam/apps/345390/extras/KQ_CC-PC_Bundle-Art_Capsule_Main.png?t=1477527248",
        name: "King's Quest Collection",
        creator: "billy badass",
        players: 6,
        created_at: new Date(),
        responseText: "something"
    }, {
        thumbnail: "http://cdn.akamai.steamstatic.com/steam/apps/345390/extras/KQ_CC-PC_Bundle-Art_Capsule_Main.png?t=1477527248",
        name: "King's Quest Collection",
        creator: "billy badass",
        players: 6,
        created_at: new Date(),
        responseText: "something"
    }, {
        thumbnail: "http://cdn.akamai.steamstatic.com/steam/apps/345390/extras/KQ_CC-PC_Bundle-Art_Capsule_Main.png?t=1477527248",
        name: "King's Quest Collection",
        creator: "billy badass",
        players: 6,
        created_at: new Date(),
        responseText: "something"
    }, {
        thumbnail: "http://cdn.akamai.steamstatic.com/steam/apps/345390/extras/KQ_CC-PC_Bundle-Art_Capsule_Main.png?t=1477527248",
        name: "King's Quest Collection",
        creator: "billy badass",
        players: 6,
        created_at: new Date(),
        responseText: "something"
    }, {
        thumbnail: "http://cdn.akamai.steamstatic.com/steam/apps/345390/extras/KQ_CC-PC_Bundle-Art_Capsule_Main.png?t=1477527248",
        name: "King's Quest Collection",
        creator: "billy badass",
        players: 6,
        created_at: new Date(),
        responseText: "something"
    }];

    $scope.avatarTest = {
        walkLeft: [
            // Frame 1 - walk left
            [{
                x: 100,
                y: 100,
                width: 30,
                height: 30,
                color: 'blue'
            }, {
                x: 150,
                y: 150,
                width: 30,
                height: 30,
                color: 'green'
            }],
            // Frame 2 - walk left
            [{
                x: 100,
                y: 100,
                width: 30,
                height: 30,
                color: 'red'
            }, {
                x: 150,
                y: 150,
                width: 30,
                height: 30,
                color: 'yellow'
            }]
        ],
        walkRight: [
            // Frame 1 - walk right
            [{
                x: 100,
                y: 100,
                width: 30,
                height: 30,
                color: 'blue'
            }, {
                x: 150,
                y: 150,
                width: 30,
                height: 30,
                color: 'green'
            }],
            // Frame 2 - walk right
            [{
                x: 100,
                y: 100,
                width: 30,
                height: 30,
                color: 'red'
            }, {
                x: 150,
                y: 150,
                width: 30,
                height: 30,
                color: 'yellow'
            }]
        ],
        walkUp: [
            // Frame 1 - walk up
            [{
                x: 100,
                y: 100,
                width: 30,
                height: 30,
                color: 'blue'
            }, {
                x: 150,
                y: 150,
                width: 30,
                height: 30,
                color: 'green'
            }],
            // Frame 2 - walk up
            [{
                x: 100,
                y: 100,
                width: 30,
                height: 30,
                color: 'red'
            }, {
                x: 150,
                y: 150,
                width: 30,
                height: 30,
                color: 'yellow'
            }]
        ],
        walkDown: [
            // Frame 1 - walk down
            [{
                x: 100,
                y: 100,
                width: 30,
                height: 30,
                color: 'blue'
            }, {
                x: 150,
                y: 150,
                width: 30,
                height: 30,
                color: 'green'
            }],
            // Frame 2 - walk down
            [{
                x: 100,
                y: 100,
                width: 30,
                height: 30,
                color: 'red'
            }, {
                x: 150,
                y: 150,
                width: 30,
                height: 30,
                color: 'yellow'
            }]
        ],
        swimLeft: [
            // Frame 1 - swim left
            [{
                x: 100,
                y: 100,
                width: 30,
                height: 30,
                color: 'lightblue'
            }, {
                x: 150,
                y: 150,
                width: 30,
                height: 30,
                color: 'lightblue'
            }],
            // Frame 2 - swim left
            [{
                x: 100,
                y: 100,
                width: 30,
                height: 30,
                color: 'gray'
            }, {
                x: 150,
                y: 150,
                width: 30,
                height: 30,
                color: 'gray'
            }]
        ],
        swimRight: [
            // Frame 1 - swim right
            [{
                x: 100,
                y: 100,
                width: 30,
                height: 30,
                color: 'lightblue'
            }, {
                x: 150,
                y: 150,
                width: 30,
                height: 30,
                color: 'lightblue'
            }],
            // Frame 2 - swim right
            [{
                x: 100,
                y: 100,
                width: 30,
                height: 30,
                color: 'gray'
            }, {
                x: 150,
                y: 150,
                width: 30,
                height: 30,
                color: 'gray'
            }]
        ],
        swimUp: [
            // Frame 1 - swim up
            [{
                x: 100,
                y: 100,
                width: 30,
                height: 30,
                color: 'lightblue'
            }, {
                x: 150,
                y: 150,
                width: 30,
                height: 30,
                color: 'lightblue'
            }],
            // Frame 2 - swim up
            [{
                x: 100,
                y: 100,
                width: 30,
                height: 30,
                color: 'gray'
            }, {
                x: 150,
                y: 150,
                width: 30,
                height: 30,
                color: 'gray'
            }]
        ],
        swimDown: [
            // Frame 1 - swim down
            [{
                x: 100,
                y: 100,
                width: 30,
                height: 30,
                color: 'lightblue'
            }, {
                x: 150,
                y: 150,
                width: 30,
                height: 30,
                color: 'lightblue'
            }],
            // Frame 2 - swim down
            [{
                x: 100,
                y: 100,
                width: 30,
                height: 30,
                color: 'gray'
            }, {
                x: 150,
                y: 150,
                width: 30,
                height: 30,
                color: 'gray'
            }]
        ]
    };
});
;angular.module('questCreator').controller('sceneCtrl', function(socket, $state, $scope) {
    var self = this;      // To help with scope issues
    var drawHandle = -1;  // Interval handle for drawing rate
    var moveHandle = -1;  // Interval handle for movement of mouse (possibly does not need to be global)
    var mouseX = 0;
    var mouseY = 0;
    var mouseMoveEvent;       // Global variable to track mouse movement events
    var touchMoveEvent;       // Global variable to track touch movement events
    var mobileWidth = 850;    // Width for mobile screen sizes
    var tabletWidth = 1100;   // Width for tablet screen sizes
    var tabletScale = 1.4;
    var mobileScaleX = 2.5;
    var mobileScaleY = 1.6;
    var moveType = '';    // Either mouse or touch
    var moved = false;    // Whether mouse has moved or not
    var moving = {        // Direction that the main character should be moving.
      left: false,
      right: false,
      up: false,
      down: false
    };
    var drawing = {       // Type of object being drawn. Default: background.
      // mobile: false,
      // static: false,
      background: true
    };
    var pixelWidth = 10;
    var pixelHeight = 10;
    var undoBackgroundArray = [];   //Array to keep track of background objects that were undone.
    // var undoObstacleArray = [];   //Array to keep track of obstacle objects that were undone.
    // var undoCharacterArray = [];   //Array to keep track of character objects that were undone.
    this.speedRange = 5;     // How fast mobile objects should move.
    // this.radiusRange = 5;  // Value of radius input in draw.html
    // this.widthRangeBackground = 50;   // Value of width input in draw.html
    // this.heightRangeBackground = 50;  // Value of height input in draw.html
    // this.widthRangeObstacle = 50;     // Value of width input in draw.html
    // this.heightRangeObstacle = 50;    // Value of height input in draw.html
    this.currentColor = "#005500";    // Value of color input in draw.html
    // this.currentScene = Scenes.fetchCurrentScene() || {}; // Scene selected from scenes controller
    // this.currentBackground = Backgrounds.fetchCurrentBackground() || {};  // Background selected from scenes controller
    this.myCanvas = document.getElementById('bg-canvas');  // Canvas html element
    this.canvasPos = {    // Canvas top and left coordinates on page
      x: self.myCanvas.getBoundingClientRect().left,
      y: self.myCanvas.getBoundingClientRect().top
    };
    this.draw = this.myCanvas.getContext('2d'); // Canvas context
    // this.sceneName =  this.currentScene.name || '';       // Current selected Scene name
    // this.allMobileCircles = this.currentScene.mobileArr || [];  // Array of all mobile objects in current scene
    // this.allObstacleSquares = this.currentScene.staticArr || [];  // Array of all static objects in current scene
    // this.backgroundName = this.currentBackground.name || '';  // Current selected Background name
    // this.allBackgroundSquares = this.currentBackground.staticArr || []; // Array of all static objects in current background
    this.backgroundName = 'Testing Background';
    this.allBackgroundSquares = [];

    /*
    *   Rectangle object constructor
    *   @params
    *     x: horizontal coord of top left corner
    *     y: vertical coord of top left corner
    *     width: width of rectangle
    *     height: height of rectangle
    *     color: color of rectangle
    *   @methods
    *     draw: draw the rectangle on the canvas using its position, size, and color.
    */
    function Square(x, y, width, height, color) {
      this.x = x;
      this.y = y;
      this.width = width;
      this.height = height;
      this.color = color;
      this.draw = function() {
        self.draw.fillStyle = this.color;
        if (window.innerWidth <= mobileWidth) { // Mobile size
          self.draw.fillRect(this.x * mobileScaleX, this.y * mobileScaleY, this.width, this.height);
        } else if (window.innerWidth <= tabletWidth) { // Tablet size
          self.draw.fillRect(this.x * tabletScale, this.y / tabletScale, this.width, this.height);
        } else {  // Desktop size
          self.draw.fillRect(this.x, this.y, this.width, this.height);
        }
      }
    }

    // /*
    // *   Circle object constructor
    // *   @params
    // *     x: horizontal coord of center of circle
    // *     y: vertical coord of center of circle
    // *     radius: radius of circle
    // *     color: color of circle
    // *   @methods
    // *     draw: draw the circle on the canvas using its position, size, and color.
    // */
    // function Circle(x, y, radius, color) {
    //   this.x = x;
    //   this.y = y;
    //   this.radius = radius;
    //   this.color = color;
    //   this.draw = function() {
    //     self.draw.beginPath();
    //     self.draw.fillStyle = this.color;
    //     if (window.innerWidth <= mobileWidth) { // Mobile size
    //       self.draw.arc(this.x * mobileScaleX, this.y * mobileScaleY, this.radius, 0, 2 * Math.PI);
    //     } else if (window.innerWidth <= tabletWidth) { // Tablet size
    //       self.draw.arc(this.x * tabletScale, this.y / tabletScale, this.radius, 0, 2 * Math.PI);
    //     } else {
    //       self.draw.arc(this.x, this.y, this.radius, 0, 2 * Math.PI);
    //     }
    //     self.draw.fill();
    //     // Example for future reference: Can also draw using an image. Image should first be loaded on the page.
    //     // draw.drawImage(imgElem, this.x, this.y, this.radius, this.radius);
    //   }
    // }

    // Called when the mouse button is pressed.
    // Starts the interval to run every 100ms while the mouse button is still held down.
    // Only start the interval if it is not already running.
    function mouseDown(event) {
      if (drawHandle === -1) {
        drawHandle = setInterval(mousePressed, 100);
      }
    }

    // Called when the mouse button is released.
    // If the interval is running, then clear it and reset it.
    function mouseUp(event) {
      if (drawHandle !== -1) {
        clearInterval(drawHandle);
        drawHandle = -1;
      }
    }

    // Runs every 100ms after the mouse button is pressed until it is released.
    // Purpose is to draw the object that the user has chosen every 100ms AND if the mouse has moved from its previous location.
    function mousePressed() {
        self.canvasPos = {  // Get the most recent canvas position in case the window has been resized.
          x: self.myCanvas.getBoundingClientRect().left,
          y: self.myCanvas.getBoundingClientRect().top
        };
        // if (moved && drawing.mobile) { // Create, draw, and record a new mobile object
        //   var radius = parseInt(self.radiusRange);
        //   var color = self.currentColor;
        //   if (moveType === 'mouse') {
        //     var newCircle = new Circle(mouseMoveEvent.clientX - self.canvasPos.x, mouseMoveEvent.clientY - self.canvasPos.y, radius, color);
        //     newCircle.draw();
        //     self.allMobileCircles.push(newCircle);
        //   } else if (moveType === 'touch') {
        //     var newCircle = new Circle(touchMoveEvent.clientX - self.canvasPos.x, touchMoveEvent.clientY - self.canvasPos.y, radius, color);
        //     newCircle.draw();
        //     self.allMobileCircles.push(newCircle);
        //   }
        //   moved = false;
        // } else if (moved && drawing.static) {  // Create, draw, and record a new static object
        //   var width = parseInt(self.widthRangeObstacle);
        //   var height = parseInt(self.heightRangeObstacle);
        //   var color = self.currentColor;
        //   if (moveType === 'mouse') {
        //     var newSquare = new Square(mouseMoveEvent.clientX - width / 2 - self.canvasPos.x, mouseMoveEvent.clientY - height / 2 - self.canvasPos.y, width, height, color);
        //     newSquare.draw();
        //     self.allObstacleSquares.push(newSquare);
        //   } else if (moveType === 'touch') {
        //     var newSquare = new Square(touchMoveEvent.clientX - width / 2 - self.canvasPos.x, touchMoveEvent.clientY - height / 2 - self.canvasPos.y, width, height, color);
        //     newSquare.draw();
        //     self.allObstacleSquares.push(newSquare);
        //   }
        //   moved = false;
        // } else if (moved && drawing.background) { // Create, draw, and record a new background object
        //   var width = parseInt(self.widthRangeBackground);
        //   var height = parseInt(self.heightRangeBackground);
        //   var color = self.currentColor;
        //   if (moveType === 'mouse') {
        //     var newSquare = new Square(mouseMoveEvent.clientX - width / 2 - self.canvasPos.x, mouseMoveEvent.clientY - height / 2 - self.canvasPos.y, width, height, color);
        //     newSquare.draw();
        //     self.allBackgroundSquares.push(newSquare);
        //   } else if (moveType === 'touch') {
        //     var newSquare = new Square(touchMoveEvent.clientX - width / 2 - self.canvasPos.x, touchMoveEvent.clientY - height / 2 - self.canvasPos.y, width, height, color);
        //     newSquare.draw();
        //     self.allBackgroundSquares.push(newSquare);
        //   }
        //   moved = false;
        // }
      if (moved && drawing.background) { // Create, draw, and record a new background object
        var width = pixelWidth;
        var height = pixelHeight;
        var color = self.currentColor;
        if (moveType === 'mouse') {
          var newSquareX = mouseX - self.canvasPos.x;
          var newSquareY = mouseY - self.canvasPos.y;
          var exists = false;
          self.allBackgroundSquares.forEach(function(square) {
            if (square.x === newSquareX && square.y === newSquareY) {
              exists = true;
            }
          });
          if (!exists) {
            var newSquare = new Square(mouseX - self.canvasPos.x, mouseY - self.canvasPos.y, width, height, color);
            newSquare.draw();
            self.allBackgroundSquares.push(newSquare);
          }
        } else if (moveType === 'touch') {
          var newSquare = new Square(touchMoveEvent.clientX - width / 2 - self.canvasPos.x, touchMoveEvent.clientY - height / 2 - self.canvasPos.y, width, height, color);
          newSquare.draw();
          self.allBackgroundSquares.push(newSquare);
        }
        moved = false;
      }
    }

    // // Check for collisions between all of the mobile objects and all of the obstacle objects.
    // // The collision is categorized according to which direction the obstacle is found.
    // function findCollisions() {
    //   var foundCollision = {  // By default, there is no collision found in any direction.
    //     left: false,
    //     right: false,
    //     up: false,
    //     down: false
    //   };
    //   self.allMobileCircles.forEach(function(circle) {  // Loop through all the mobile objects
    //     self.allObstacleSquares.forEach(function(square) {  // Loop through all the obstacle objects
    //       // Pattern: check the left, right, top, and bottom edges of the current mobile object against the right, left, bottom, and top edges of the current obstacle (in those exact orders).
    //       if (circle.x - circle.radius <= square.x + square.width && circle.x - circle.radius >= square.x && circle.y >= square.y && circle.y <= square.y + square.height) {
    //         foundCollision.left = true;
    //         moving.left = false;
    //       }
    //       if (circle.x + circle.radius <= square.x + square.width && circle.x + circle.radius >= square.x && circle.y >= square.y && circle.y <= square.y + square.height) {
    //         foundCollision.right = true;
    //         moving.right = false;
    //       }
    //       if (circle.x <= square.x + square.width && circle.x >= square.x && circle.y - circle.radius >= square.y && circle.y - circle.radius <= square.y + square.height) {
    //         foundCollision.up = true;
    //         moving.up = false;
    //       }
    //       if (circle.x <= square.x + square.width && circle.x >= square.x && circle.y + circle.radius >= square.y && circle.y + circle.radius <= square.y + square.height) {
    //         foundCollision.down = true;
    //         moving.down = false;
    //       }
    //     });
    //     // Check for collisions with the canvas border as well. Take resizing screen sizes into account.
    //     var canvasEdgeRight;
    //     var canvasEdgeBottom;
    //     if (window.innerWidth <= mobileWidth) {
    //       canvasEdgeRight = self.myCanvas.width / mobileScaleX;
    //       canvasEdgeBottom = self.myCanvas.height / mobileScaleY;
    //     } else if (window.innerWidth <= tabletWidth) {
    //       canvasEdgeRight = self.myCanvas.width / tabletScale;
    //       canvasEdgeBottom = self.myCanvas.height * tabletScale;
    //     } else {
    //       canvasEdgeRight = self.myCanvas.width;
    //       canvasEdgeBottom = self.myCanvas.height;
    //     }
    //     if (circle.x <= 0) {
    //       foundCollision.left = true;
    //       moving.left = false;
    //     }
    //     if (circle.x >= canvasEdgeRight) {
    //       foundCollision.right = true;
    //       moving.right = false;
    //     }
    //     if (circle.y <= 0) {
    //       foundCollision.up = true;
    //       moving.up = false;
    //     }
    //     if (circle.y >= canvasEdgeBottom) {
    //       foundCollision.down = true;
    //       moving.down = false;
    //     }
    //   });
    //   return foundCollision;
    // }

    // // Called when any key is pressed.
    // function handleKeyDown(event) {
    //   // If the user presses the left, right, up, or down arrow keys, toggle the movement direction accordingly
    //   if (event.keyCode === 37) { // Left Key
    //     event.preventDefault();
    //     moving = {
    //       left: !moving.left,
    //       up: false,
    //       right: false,
    //       down: false
    //     };
    //   } else if (event.keyCode === 38) { // Up Key
    //     event.preventDefault();
    //     moving = {
    //       left: false,
    //       up: !moving.up,
    //       right: false,
    //       down: false
    //     };
    //   } else if (event.keyCode === 39) { // Right Key
    //     event.preventDefault();
    //     moving = {
    //       left: false,
    //       up: false,
    //       right: !moving.right,
    //       down: false
    //     };
    //   } else if (event.keyCode === 40) { // Down Key
    //     event.preventDefault();
    //     moving = {
    //       left: false,
    //       up: false,
    //       right: false,
    //       down: !moving.down
    //     };
    //   } else {    // For all other keys, stop all movement.
    //     moving = {
    //       left: false,
    //       up: false,
    //       right: false,
    //       down: false
    //     }
    //   }
    //   // If any of the arrow keys have been pressed, run the moveMobileCircles function every 20ms.
    //   // Otherwise, stop running the moveMobileCircles function.
    //   if ( moving.left || moving.up || moving.right || moving.down ) {
    //     clearInterval(moveHandle);
    //     moveHandle = setInterval(moveMobileCircles, 20);
    //   } else {
    //     clearInterval(moveHandle);
    //   }
    // }

    // // Runs every 20ms after an arrow key has been pressed.
    // function moveMobileCircles() {
    //   // Depending on movement direction and collision detection, do the following:
    //   // 1) Clear the canvas.
    //   // 2) Redraw background and obstacle objects.
    //   // 3) Shift the circles in the corresponding direction.
    //   // 4) Redraw the circles.
    //   // Note: Checking collision detection and checking movement direction may be redundant.
    //   if (moving.left && !findCollisions().left) {
    //     self.draw.clearRect(0, 0, self.myCanvas.width, self.myCanvas.height);
    //     drawBackgroundSquares();
    //     drawObstacleSquares();
    //     self.allMobileCircles.forEach(function(circle) {
    //       circle.x -= parseInt(self.speedRange);
    //       circle.draw();
    //     });
    //   } else if (moving.right && !findCollisions().right) {
    //     self.draw.clearRect(0, 0, self.myCanvas.width, self.myCanvas.height);
    //     drawBackgroundSquares();
    //     drawObstacleSquares();
    //     self.allMobileCircles.forEach(function(circle) {
    //       circle.x += parseInt(self.speedRange);
    //       circle.draw();
    //     });
    //   } else if (moving.up && !findCollisions().up) {
    //     self.draw.clearRect(0, 0, self.myCanvas.width, self.myCanvas.height);
    //     drawBackgroundSquares();
    //     drawObstacleSquares();
    //     self.allMobileCircles.forEach(function(circle) {
    //       circle.y -= parseInt(self.speedRange);
    //       circle.draw();
    //     });
    //   } else if (moving.down && !findCollisions().down) {
    //     self.draw.clearRect(0, 0, self.myCanvas.width, self.myCanvas.height);
    //     drawBackgroundSquares();
    //     drawObstacleSquares();
    //     self.allMobileCircles.forEach(function(circle) {
    //       circle.y += parseInt(self.speedRange);
    //       circle.draw();
    //     });
    //   }
    // }

    // Loop through the array of background objects and draw them all.
    function drawBackgroundSquares() {
      for (var index = 0; index < self.allBackgroundSquares.length; index++) {
        var square = self.allBackgroundSquares[index];
        square.draw();
      }
    }

    // // Loop through the array of obstacle objects and draw them all.
    // function drawObstacleSquares() {
    //   for (var index = 0; index < self.allObstacleSquares.length; index++) {
    //     var square = self.allObstacleSquares[index];
    //     square.draw();
    //   }
    // }

    // // Loop through the array of mobile objects and draw them all.
    // function drawMobileCircles() {
    //   for (var index = 0; index < self.allMobileCircles.length; index++) {
    //     var circle = self.allMobileCircles[index];
    //     circle.draw();
    //   }
    // }

    // // When the Draw Character button is clicked, change the drawing setting to mobile.
    // $('.characterDraw').click(function() {
    //   drawing = {
    //     mobile: true,
    //     static: false,
    //     background: false
    //   };
    //   $('.option').removeClass('active');
    //   $(this).addClass('active');
    // });

    // // When the Draw Obstacles button is clicked, change the drawing setting to static.
    // $('.objectDraw').click(function() {
    //   drawing = {
    //     mobile: false,
    //     static: true,
    //     background: false
    //   }
    //   $('.option').removeClass('active');
    //   $(this).addClass('active');
    // });

    // // When the Draw Background button is clicked, change the drawing setting to background.
    // $('.backgroundDraw').click(function() {
    //   drawing = {
    //     mobile: false,
    //     static: false,
    //     background: true
    //   }
    //   $('.option').removeClass('active');
    //   $(this).addClass('active');
    // });

    // When the user clicks the undo button, remove the last element from the object array and push it to the undo array, based on current drawing type. Then redraw canvas.
    $('#undo').click(function() {
      // if (drawing.mobile && self.allMobileCircles.length > 0) {
      //   var lastObj = self.allMobileCircles.pop();
      //   undoCharacterArray.push(lastObj);
      // } else if (drawing.static && self.allObstacleSquares.length > 0) {
      //   var lastObj = self.allObstacleSquares.pop();
      //   undoObstacleArray.push(lastObj);
      // } else if (drawing.background && self.allBackgroundSquares.length > 0) {
      //   var lastObj = self.allBackgroundSquares.pop();
      //   undoBackgroundArray.push(lastObj);
      // }
      if (drawing.background && self.allBackgroundSquares.length > 0) {
        var lastObj = self.allBackgroundSquares.pop();
        undoBackgroundArray.push(lastObj);
      }
      self.draw.clearRect(0, 0, self.myCanvas.width, self.myCanvas.height);
      drawBackgroundSquares();
      // drawObstacleSquares();
      // drawMobileCircles();
    });

    // When the user clicks the redo button, remove the last element from the undo array and push it to the object array, based on current drawing type. Then redraw canvas.
    $('#redo').click(function() {
      // if (drawing.mobile && undoCharacterArray.length > 0) {
      //   var lastObj = undoCharacterArray.pop();
      //   self.allMobileCircles.push(lastObj);
      // } else if (drawing.static && undoObstacleArray.length > 0) {
      //   var lastObj = undoObstacleArray.pop();
      //   self.allObstacleSquares.push(lastObj);
      // } else if (drawing.background && undoBackgroundArray.length > 0) {
      //   var lastObj = undoBackgroundArray.pop();
      //   self.allBackgroundSquares.push(lastObj);
      // }
      if (drawing.background && undoBackgroundArray.length > 0) {
        var lastObj = undoBackgroundArray.pop();
        self.allBackgroundSquares.push(lastObj);
      }
      self.draw.clearRect(0, 0, self.myCanvas.width, self.myCanvas.height);
      drawBackgroundSquares();
      // drawObstacleSquares();
      // drawMobileCircles();
    });

    // When the Clear Canvas button is clicked, make the current Background and current Scene empty objects and reload the view.
    // Note: may need extra testing here.
    $('#clear').click(function() {
      canvasWidth = self.myCanvas.width;
      canvasHeight = self.myCanvas.height;
      // self.allObstacleSquares = [];
      // self.allMobileCircles = [];
      self.draw.clearRect(0, 0, canvasWidth, canvasHeight);
      self.allBackgroundSquares = [];
      var undoBackgroundArray = [];
      // var undoObstacleArray = [];
      // var undoCharacterArray = [];
      // Scenes.selectScene({})
      // Backgrounds.selectBackground({});
      // $state.reload();
    });

    // // When the Save Scene button is clicked:
    // // 1) Clear the canvas and redraw only the Obstacles and Character. (ensures thumbnail is scene ONLY)
    // // 2) Create and store a new scene object and make it the current Scene.
    // // 3) Clear the canvas again and this time redraw Background, Obstacles, and Character.
    // $('.saveScene').click(function() {
    //   self.draw.clearRect(0, 0, self.myCanvas.width, self.myCanvas.height);
    //   drawObstacleSquares();
    //   drawMobileCircles();
    //   var newScene = Scenes.create({
    //     name: self.sceneName,
    //     staticArr: self.allObstacleSquares,
    //     mobileArr: self.allMobileCircles,
    //     thumbnail: self.myCanvas.toDataURL()
    //   });
    //   Scenes.selectScene(newScene);
    //   self.draw.clearRect(0, 0, self.myCanvas.width, self.myCanvas.height);
    //   drawBackgroundSquares();
    //   drawObstacleSquares();
    //   drawMobileCircles();
    // });

    // // When the Publish Scene button is clicked, post it to the database.
    // $('.publishScene').click(function() {
    //   // Trying to decide whether to save AND publish or just publish...
    //   self.draw.clearRect(0, 0, self.myCanvas.width, self.myCanvas.height);
    //   drawObstacleSquares();
    //   drawMobileCircles();
    //   var newScene = Scenes.create({
    //     name: self.sceneName,
    //     staticArr: self.allObstacleSquares,
    //     mobileArr: self.allMobileCircles,
    //     thumbnail: self.myCanvas.toDataURL()
    //   });
    //   Scenes.selectScene(newScene);
    //   self.draw.clearRect(0, 0, self.myCanvas.width, self.myCanvas.height);
    //   drawBackgroundSquares();
    //   drawObstacleSquares();
    //   drawMobileCircles();
    //   Scenes.publishScene(newScene);
    // });

    // When the Save Background button is clicked:
    // 1) Clear the canvas and redraw only the Background. (ensures thumbnail is background ONLY)
    // 2) Create and store a new background object and make it the current Background.
    // 3) Finally, draw the Obstacles and Character.
    $('#save').click(function() {
      console.log(self.allBackgroundSquares);
      // self.draw.clearRect(0, 0, self.myCanvas.width, self.myCanvas.height);
      // drawBackgroundSquares();
      // var newBackground = Backgrounds.create({
      //   name: self.backgroundName,
      //   staticArr: self.allBackgroundSquares,
      //   thumbnail: self.myCanvas.toDataURL()
      // });
      // Backgrounds.selectBackground(newBackground);
      // drawObstacleSquares();
      // drawMobileCircles();
    });

    // // When the Publish Background button is clicked, post it to the database.
    // $('.publishBackground').click(function() {
    //   // Trying to decide whether to save AND publish or just publish...
    //   self.draw.clearRect(0, 0, self.myCanvas.width, self.myCanvas.height);
    //   drawBackgroundSquares();
    //   var newBackground = Backgrounds.create({
    //     name: self.backgroundName,
    //     staticArr: self.allBackgroundSquares,
    //     thumbnail: self.myCanvas.toDataURL()
    //   });
    //   Backgrounds.selectBackground(newBackground);
    //   drawObstacleSquares();
    //   drawMobileCircles();
    //   Backgrounds.publishBackground(newBackground);
    // });

    // When a key is pressed, run the handleKeyDown function.
    // $(document).on('keydown', handleKeyDown);

    // When the mouse is pressed, released, moved, or leaves the canvas, run the corresponding function.
    $(self.myCanvas).on('mousedown', mouseDown);
    $(self.myCanvas).on('mouseup', mouseUp);
    $(self.myCanvas).on('mouseleave', mouseUp);
    $(self.myCanvas).on('mousemove', function(event) {
      newMouseX = Math.round((event.clientX - pixelWidth / 2) / pixelWidth) * pixelWidth;
      newMouseY = Math.round((event.clientY - pixelHeight / 2) / pixelHeight) * pixelHeight;
      if (newMouseX !== mouseX || newMouseY !== mouseY) {
        mouseX = newMouseX;
        mouseY = newMouseY;
        moveType = 'mouse';
        mouseMoveEvent = event;
        moved = true;
      }
    });

    // // Construct initial full background objects (including methods) from the retrieved partial objects.
    // // Idea - offload object methods to prototype? Possibly make this step unnecessary?
    // function constructBackgroundSquares() {
    //   var oldBackgroundSquares = self.allBackgroundSquares;
    //   var newBackgroundSquares = [];
    //   oldBackgroundSquares.forEach(function(square) {
    //     var newBackgroundSquare = new Square(square.x, square.y, square.width, square.height, square.color);
    //     newBackgroundSquares.push(newBackgroundSquare);
    //   });
    //   self.allBackgroundSquares = newBackgroundSquares;
    // }
    // // Construct mobile objects just like background objects.
    // function constructCircles() {
    //   var oldCircles = self.allMobileCircles;
    //   var newCircles = [];
    //   oldCircles.forEach(function(circle) {
    //     var newCircle = new Circle(circle.x, circle.y, circle.radius, circle.color);
    //     newCircles.push(newCircle);
    //   });
    //   self.allMobileCircles = newCircles;
    // }
    // // Construct static objects just like background and mobile objects.
    // function constructSquares() {
    //   var oldSquares = self.allObstacleSquares;
    //   var newSquares = [];
    //   oldSquares.forEach(function(square) {
    //     var newSquare = new Square(square.x, square.y, square.width, square.height, square.color);
    //     newSquares.push(newSquare);
    //   });
    //   self.allObstacleSquares = newSquares;
    // }

    // Call all object constructing functions.
    // constructBackgroundSquares();
    // constructCircles();
    // constructSquares();
    // Draw all the objects now that they have been made.
    // drawBackgroundSquares();
    // drawMobileCircles();
    // drawObstacleSquares();

    // Experimental touch screen support
    // When the mouse is pressed, released, moved, or leaves the canvas, run the corresponding function.
    $(self.myCanvas).on('touchstart', mouseDown);
    $(self.myCanvas).on('touchend', mouseUp);
    $(self.myCanvas).on('touchcancel', mouseUp);
    $(self.myCanvas).on('touchmove', function(event) {
      moveType = 'touch';
      event.preventDefault();
      touchMoveEvent = event.touches[0];
      moved = true;
    });

    console.log("here");
});
;angular.module('questCreator').controller('scriptsCtrl', function($state) {

});
