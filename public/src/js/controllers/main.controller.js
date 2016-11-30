angular.module('questCreator')
    .controller('mainCtrl', function(socket, $state, UserService, PopupService, $scope) {
    var self = this;
    this.loggedIn = null;
    $scope.popupTemp = false;
    //When the user clicks "Home" on the nav bar view is changed to landing
    this.goHome = function () {
        $state.go('main.landing');
    };

    //When the user clicks "Profile" on the nav bar user information is loaded and view is changed to profile
    this.goToUser = function () {
      if (UserService.get().id) {
        $state.go('main.profile');
      } else {
        PopupService.openTemp('signin-to-continue');
        $scope.signIn();
      }
    };

    // When the user clicks the sign in button, prompt them to sign in to their google account.
    this.signIn = function() {
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

    this.createGame = function() {
        var user = UserService.get();
        if (user.id) {
            user.editGame = null;
            UserService.set(user);
            $state.go('main.game.editor.views');
        } else {
            PopupService.openTemp('signin-to-continue', $scope);
            self.signIn();
        }
    };

    //New user can register a user name
    this.register = function (name) {
        UserService.register(name);
    };

    //If the user chooses not to register, they can cancel out of the process.
    this.cancelRegister = function () {
        PopupService.close();
        $state.go('main.landing');
        UserService.signOut();
    };

    this.cancel = function () {
        PopupService.close();
        $state.go('main.landing');
    };

    this.okay = function () {
        PopupService.close();
    };
});
