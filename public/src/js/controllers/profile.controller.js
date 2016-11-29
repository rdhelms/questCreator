angular.module('questCreator').controller('profileCtrl', function(socket, $state, $scope, UserService, PopupService) {

    $scope.showReqs = false;
    $scope.showCollabs = false;
    $scope.requestActive = false;
    $scope.collabActive = false;
    $scope.games = null;
    $scope.requests = null;
    $scope.avatars = null;
    $scope.large = null;

    UserService.checkLogin().then(function(response) {
        PopupService.open('loading-screen');
        $scope.user = UserService.get();

        $scope.getJoinedDate = function(date) {
            return new Date(date);
        };

        function getGameName(requests, games) {
            for (var i = 0; i < requests.length; i++) {
                for (var j = 0; j < games.length; j++) {
                    if (requests[i].game_id === games[j].id) {
                        requests[i].gameName = games[j].name;
                    }
                }
            }
            $scope.requests = requests;
            $scope.$apply();
        }

        function filterCollaborators(collaborators, games) {
            for (var i = collaborators.length - 1; i >= 0; i--) {
                if (collaborators[i].user_id === $scope.user.id) {
                    collaborators.splice(i, 1);
                } else {
                    for (var j = 0; j < games.length; j++) {
                        if (collaborators[i].game_id === games[j].id) {
                            collaborators[i].gameName = games[j].name;
                        }
                    }
                }
                $scope.collaborators = collaborators;
                $scope.$apply();
            }
        }

        UserService.getUserGames().done(function(games) {
            $scope.games = games;
            $scope.$apply();
            UserService.getCollabRequests().done(function(requests) {
                getGameName(requests, games);
            });
            UserService.getCollaborators().done(function(collaborators) {
                filterCollaborators(collaborators, games);
            });

            UserService.getAvatars().done(function(avatars) {
                $scope.avatars = avatars;
                console.log(avatars);
                for (var i = 0; i < avatars.length; i++) {
                    if (avatars[i].current)
                        $scope.large = avatars[i];
                    $scope.$apply();
                }
                PopupService.close();
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

        $scope.archiveGame = function(game, index) {
            var agree = confirm("Are you sure you wanna archive '" + game.name + "'? That means no one will be able to play it and all player information will be lost. You will NOT be able to retrieve this later");
            if (agree) {
                console.log('before', $scope.games);
                UserService.archive(game.id).done(function(response) {
                    $scope.games.splice(index, 1);
                    $scope.$apply();
                });
            }
        };

        $scope.showCollaborators = function() {
            $scope.collabActive = !$scope.collabActive;
            $scope.showCollabs = !$scope.showCollabs;
        };

        $scope.showRequests = function() {
            $scope.requestActive = !$scope.requestActive;
            $scope.showReqs = !$scope.showReqs;
        };

        $scope.toggleCollab = function(info) {
            UserService.toggleAccepted(info.game_id, info.user_id);
            var games = $scope.games;
            UserService.getCollabRequests().done(function(requests) {
                getGameName(requests, games);
            });
            UserService.getCollaborators().done(function(collaborators) {
                filterCollaborators(collaborators, games);
            });
        };

        $scope.removeRequest = function(collab, index) {
            UserService.toggleRequested(collab.game_id, collab.user_id).done(function(response) {
                $scope.requests.splice(index, 1);
                $scope.$apply();
            });
        };

        $scope.removeCollaborator = function(collaborator, index) {
            if (collaborator.requested) {
                UserService.toggleRequested(collaborator.game_id, collaborator.user_id);
            }
            UserService.toggleAccepted(collaborator.game_id, collaborator.user_id).done(function(response) {
                $scope.collaborators.splice(index, 1);
                $scope.$apply();
            });
        };

        $scope.highlightAvatar = function(avatar, index) {
            $scope.large = avatar;
        };

        $scope.updateDefault = function() {
            if ($scope.large) {
                for (var i = 0; i < $scope.avatars.length; i++) {
                    if ($scope.avatars[i].current && $scope.avatars[i].id !== $scope.large.id) {
                        $scope.avatars[i].current = false;
                        UserService.updateAvatar(false, $scope.avatars[i].id);
                    }
                    if ($scope.avatars[i].id === $scope.large.id) {
                        $scope.avatars[i].current = $scope.large.current;
                    }
                }
                UserService.updateAvatar($scope.large.current, $scope.large.id);
            }
        };

        $scope.openToEdit = function () {
            PopupService.open('edit-username', $scope);
        };

        $scope.cancel = function () {
          PopupService.close();
        };

        $scope.editUsername = function (newName) {
          console.log('here');
          PopupService.close();
          $scope.user.username = newName;
          UserService.editUsername(newName);
        };
    });
});
