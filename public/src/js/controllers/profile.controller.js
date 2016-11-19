angular.module('questCreator').controller('profileCtrl', function(socket, $state, $scope, UserService) {

    $scope.createGame = function() {
        $state.go('main.game.editor.views');
    };

    $scope.editGame = function (name) {
        $scope.user.editGame = name;
        UserService.set($scope.user);
        $state.go('main.game.editor.views');
    };

    $scope.archiveGame = function (name) {
        var agree = confirm("Are you sure you wanna Archive" + name + "? That means no one will be able to play it and all player information will be lost.  You can retrieve it later, but that's such a headache.");
        if (agree) {
          UserService.archive(name);
        }
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
