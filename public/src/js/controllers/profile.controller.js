angular.module('questCreator').controller('profileCtrl', function(socket, $state, $scope, UserService) {

  this.user = UserService.get();

  this.getJoinedDate = function(date) {
    return new Date(date);
};

});
