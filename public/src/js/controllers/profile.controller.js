angular.module('questCreator').controller('profileCtrl', function(socket, $state, $scope, UserService) {

    UserService.checkLogin().then(function(response) {

      $scope.user = null;
      $scope.games = null;

      UserService.get().then(function(user) {
        $scope.user = user;
        $scope.$apply();
      });

      $scope.getJoinedDate = function(date) {
          return new Date(date);
      };

      UserService.getUserGames().done(function(games) {
          $scope.games = games;
          $scope.$apply();
      });

      // $scope.collaborators = UserService.getCollabRequests().done(function (collaborators) {
      //   $scope.$apply();
      // });

      $scope.createGame = function() {
          $scope.user.editGame = null;
          UserService.set($scope.user);
          $state.go('main.game.editor.views');
      };

      $scope.editGame = function(name) {
          $scope.user.editGame = name;
          UserService.set($scope.user);
          $state.go('main.game.editor.views');
      };

      $scope.archiveGame = function(game) {
          var agree = confirm("Are you sure you wanna archive '" + game.name + "'? That means no one will be able to play it and all player information will be lost. You will NOT be able to retrieve this later");
          if (agree) {
              UserService.archive(game.id);
          }
      };

      $scope.showCollaborators = function () {

      };

      $scope.toggleCollab = function (collab) {
        UserService.toggleAccepted(collab.game);
      };

      $scope.removeRequest = function (collab) {
        UserService.toggleRequested(collab.game);
      };
    });
});
