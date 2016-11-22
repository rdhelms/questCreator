angular.module('questCreator').controller('profileCtrl', function(socket, $state, $scope, UserService) {

    UserService.checkLogin().then(function(response) {

        $scope.games = null;

        $scope.user = UserService.get();

        $scope.getJoinedDate = function(date) {
            return new Date(date);
        };

        UserService.getUserGames().done(function(games) {
            $scope.games = games;
            $scope.$apply();
        });

        UserService.getCollabRequests().done(function(requests) {
            $scope.requests = requests;
            $scope.$apply();
        });

        UserService.getCollaborators().done(function(collaborators) {
            $scope.collaborators = collaborators;
            $scope.$apply();
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
            UserService.toggleAccepted(info.game, info.requester);
        };

        $scope.removeRequest = function(collab) {
            UserService.toggleRequested(collab.game);
        };

        $scope.removeCollaborator = function(collaborator) {
            UserService.toggleRequested(collaborator.game, collaborator.requester);
            UserService.toggleAccepted(collaborator.game, collaborator.requester);
        };

    });
});
