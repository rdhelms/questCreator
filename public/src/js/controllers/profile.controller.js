angular.module('questCreator').controller('profileCtrl', function(socket, $state, $scope, UserService) {

    UserService.checkLogin().then(function(response) {

        $scope.games = null;
        $scope.requests = null;

        $scope.user = UserService.get();

        $scope.getJoinedDate = function(date) {
            return new Date(date);
        };

        UserService.getUserGames().done(function(games) {
            $scope.games = games;
            $scope.$apply();
            UserService.getCollabRequests().done(function(requests) {
              for (var i = 0; i < requests.length; i++) {
                for (var j = 0; j < games.length; j++) {
                  if (requests[i].game_id === games[j].id) {
                    requests[i].gameName = games[j].name;
                  }
                }
              }
              $scope.requests = requests;
              $scope.$apply();
            });
            UserService.getCollaborators().done(function(collaborators) {
              for (var i = collaborators.length - 1; i >= 0 ; i--) {
                console.log(collaborators[i].id, $scope.user.id);
                if (collaborators[i].user_id === $scope.user.id) {
                  collaborators.splice(i, 1);
                } else {}
                for (var j = 0; j < games.length; j++) {
                  if (collaborators[i].game_id === games[j].id) {
                    collaborators[i].gameName = games[j].name;
                  }
                }

              }
              $scope.collaborators = collaborators;
              $scope.$apply();
            });
        });



        UserService.getCollaborations().done(function(collaborations) {
            $scope.collaborations = collaborations;
            $scope.$apply();
        });

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
                UserService.getUserGames().done(function(games) {
                    $scope.games = games;
                    $scope.$apply();
                });
            }
        };

        $scope.showCollaborators = function() {

        };

        $scope.showRequests = function() {

        };

        $scope.toggleCollab = function(info) {
            UserService.toggleAccepted(info.game_id, info.user_id);
        };

        $scope.removeRequest = function(collab) {
            UserService.toggleRequested(collab.game_id, collab.user_id);
        };

        $scope.removeCollaborator = function(collaborator) {
            UserService.toggleRequested(collaborator.game_id, collaborator.user_id);
            UserService.toggleAccepted(collaborator.game_id, collaborator.user_id);
        };

    });
});
