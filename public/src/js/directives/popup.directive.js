angular.module('questCreator')
.directive('popup', function(){
  return {
    scope: {
      title: '=popupTitle'
    },
    replace: true,
    transclude: true,
    link: function (scope, element, attrs) {
      scope.kill = function(){
        $('#overlay').remove();
      }
    },
    templateUrl: './src/views/popup.html'
  };
});
