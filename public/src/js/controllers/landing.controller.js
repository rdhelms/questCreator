angular.module('questCreator').controller('landingCtrl', function($state, $scope, UserService, GameService, PopupService) {

    this.searching = false;
    var self = this;

    this.allGames = GameService.getGames().done(function(response) {
        $scope.$apply();
    });

    $scope.createGame = function() {
        var user = UserService.get();
        if (user.id) {
            user.editGame = null;
            UserService.set(user);
            $state.go('main.game.editor.views');
        } else {
            PopupService.openTemp('signin-to-continue');
              $scope.signIn();
        }
    };

    $scope.goToGameDetail = function(game) {
        GameService.setGameDetail(game);
        $state.go('main.game.detail');
    };

    this.searchGames = function (keyword) {
        this.searching = true;
        this.allGames = GameService.searchGames(keyword).done(function (response) {
          $scope.$apply();
        });
    };

    this.showAll = function () {
        this.searching = false;
        this.allGames = GameService.getGames().done(function(response) {
            $scope.$apply();
        });
    };
});
