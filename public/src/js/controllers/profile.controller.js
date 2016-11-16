angular.module('questCreator').controller('profileCtrl', function(socket, $state, $scope, UserService) {
setTimeout(function () {

  $scope.user = UserService.get();
  $scope.games = UserService.games();

  $scope.getJoinedDate = function(date) {
    return new Date(date);
};
$scope.$apply();
},1000);

});
