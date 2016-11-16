angular.module('questCreator').controller('mainCtrl', function(socket, $state, UserService) {

    //When the user clicks "Home" on the nav bar view is changed to landing
    this.goHome = function () {
        $state.go('main.landing');
    };

    //When the user clicks "Profile" on the nav bar user information is loaded and view is changed to profile
    this.goToUser = function () {
        var games = UserService.games();
        games.done(function () {
          $state.go('main.profile');
        });
    };

    // When the user clicks the sign in button, prompt them to sign in to their google account.
    this.signIn = function() {
        UserService.signIn();
    };

    // When the user clicks the sign out button, sign them out of their google account
    this.signOut = function() {
        UserService.signOut();
        $state.go('main.landing');
    };

    //New user can register a user name
    this.register = function (name) {
        UserService.register(name);
    };

    //If the user chooses not to register, they can cancel out of the process.
    this.cancel = function () {
        $('#register').css('display', 'none');
        UserService.signOut();
    };
});
