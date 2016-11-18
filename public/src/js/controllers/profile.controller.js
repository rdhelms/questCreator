angular.module('questCreator').controller('profileCtrl', function(socket, $state, $scope, UserService) {

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
