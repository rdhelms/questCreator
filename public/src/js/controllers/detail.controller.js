angular.module('questCreator').controller('detailCtrl', function ($state, GameService) {


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
