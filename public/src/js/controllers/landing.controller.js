angular.module('questCreator').controller('landingCtrl', function($state, $scope, UserService, GameService) {

    this.allGames = GameService.getGames();

    $scope.createGame = function() {
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

    $scope.goToGameDetail = function(game) {
        GameService.setGameDetail(game);
        $state.go('main.game.detail');
    };

    //This is for testing only
    $scope.games = [{
        thumbnail: "http://cdn.akamai.steamstatic.com/steam/apps/345390/extras/KQ_CC-PC_Bundle-Art_Capsule_Main.png?t=1477527248",
        name: "King's Quest Collection",
        creator: "billy badass",
        players: 6,
        created_at: new Date(),
        responseText: "something",
        totalPoints: 75
    }, {
        thumbnail: "http://cdn.akamai.steamstatic.com/steam/apps/345390/extras/KQ_CC-PC_Bundle-Art_Capsule_Main.png?t=1477527248",
        name: "King's Quest Collection",
        creator: "billy badass",
        players: 6,
        created_at: new Date(),
        responseText: "something",
        totalPoints: 75
    }, {
        thumbnail: "http://cdn.akamai.steamstatic.com/steam/apps/345390/extras/KQ_CC-PC_Bundle-Art_Capsule_Main.png?t=1477527248",
        name: "King's Quest Collection",
        creator: "billy badass",
        players: 6,
        created_at: new Date(),
        responseText: "something",
        totalPoints: 75
    }, {
        thumbnail: "http://cdn.akamai.steamstatic.com/steam/apps/345390/extras/KQ_CC-PC_Bundle-Art_Capsule_Main.png?t=1477527248",
        name: "King's Quest Collection",
        creator: "billy badass",
        players: 6,
        created_at: new Date(),
        responseText: "something",
        totalPoints: 75
    }, {
        thumbnail: "http://cdn.akamai.steamstatic.com/steam/apps/345390/extras/KQ_CC-PC_Bundle-Art_Capsule_Main.png?t=1477527248",
        name: "King's Quest Collection",
        creator: "billy badass",
        players: 6,
        created_at: new Date(),
        responseText: "something",
        totalPoints: 75
    }, {
        thumbnail: "http://cdn.akamai.steamstatic.com/steam/apps/345390/extras/KQ_CC-PC_Bundle-Art_Capsule_Main.png?t=1477527248",
        name: "King's Quest Collection",
        creator: "billy badass",
        players: 6,
        created_at: new Date(),
        responseText: "something",
        totalPoints: 75
    }, {
        thumbnail: "http://cdn.akamai.steamstatic.com/steam/apps/345390/extras/KQ_CC-PC_Bundle-Art_Capsule_Main.png?t=1477527248",
        name: "King's Quest Collection",
        creator: "billy badass",
        players: 6,
        created_at: new Date(),
        responseText: "something",
        totalPoints: 75
    }, {
        thumbnail: "http://cdn.akamai.steamstatic.com/steam/apps/345390/extras/KQ_CC-PC_Bundle-Art_Capsule_Main.png?t=1477527248",
        name: "King's Quest Collection",
        creator: "billy badass",
        players: 6,
        created_at: new Date(),
        responseText: "something",
        totalPoints: 75
    }, {
        thumbnail: "http://cdn.akamai.steamstatic.com/steam/apps/345390/extras/KQ_CC-PC_Bundle-Art_Capsule_Main.png?t=1477527248",
        name: "King's Quest Collection",
        creator: "billy badass",
        players: 6,
        created_at: new Date(),
        responseText: "something",
        totalPoints: 75
    }];

    $scope.assets = [{
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
    }];

});
