angular.module('questCreator').controller('mainCtrl', function(socket, $state, UserService) {

    this.goToUser = function () {
        var games = UserService.games();
        games.done(function () {
          $state.go('main.profile');
        });

    };


    // When the user clicks the sign in button, prompt them to sign in to their google account.
    $('#login').click(function() {
        UserService.signIn();
    });

    // When the user clicks the sign out button, sign them out of their google account
    $('#logout').click(function() {
        UserService.signOut();
    });

});
