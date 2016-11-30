angular.module('questCreator').controller('landingCtrl', function($state, $scope, UserService, GameService, PopupService) {

    this.searching = false;
    var self = this;

    GameService.getGames().done(function(response) {
      self.allGames = response;
      console.log(self.allGames);
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
      if (!$scope.main.loggedIn) {
        PopupService.openTemp('signin-to-continue');
        $scope.main.signIn();
      }
        GameService.setGameDetail(game);
        $state.go('main.game.detail');
    };

    this.searchGames = function (keyword) {
        this.searching = true;
        GameService.searchGames(keyword).done(function (response) {
          self.allGames = response;
          console.log(self.allGames);
          $scope.$apply();
        });
    };

    this.showAll = function () {
        this.searching = false;
        GameService.getGames().done(function(response) {
          self.allGames = response;
            $scope.$apply();
        });
    };
});
