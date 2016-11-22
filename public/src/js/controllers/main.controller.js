angular.module('questCreator')
    .controller('mainCtrl', function(socket, $state, UserService, PopupService, $scope) {

    //When the user clicks "Home" on the nav bar view is changed to landing
    this.goHome = function () {
        $state.go('main.landing');
    };

    //When the user clicks "Profile" on the nav bar user information is loaded and view is changed to profile
    this.goToUser = function () {
      if (UserService.get().id) {
        $state.go('main.profile');
      } else {
        alert ("You must login to see your profile page.");
        $scope.signIn();
      }
    };

    // When the user clicks the sign in button, prompt them to sign in to their google account.
    $scope.signIn = function() {
        UserService.signIn();
    };

    // When the user clicks the sign out button, sign them out of their google account
    this.signOut = function() {
        UserService.signOut();
        var user = {
                uid: null,
                token: null,
                username: null,
                picture: null,
                id: null,
                games: null,
                joined: null,
                editGame: null
        };
        UserService.set(user);
        $state.go('main.landing');
    };

    //New user can register a user name
    this.register = function (name) {
        UserService.register(name);
    };

    //If the user chooses not to register, they can cancel out of the process.
    this.cancel = function () {
        $('#user-popup').css('display', 'none');
        UserService.signOut();
    };

});
