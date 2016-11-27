angular.module('questCreator')
.directive('popup', function(){
  return {
    scope: {
      title: '=popupTitle',
      kill: '@'
    },
    replace: true,
    transclude: true,
    link: function (scope, element, attrs) {
      scope.kill = function(){
        $('#overlay').remove();
      };
    },
    templateUrl: './src/views/popup.html',
    controller: function($scope) {
      $scope.killPopUp = function(){
        $scope.kill();
      };
    }
  };
});
