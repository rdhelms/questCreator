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



angular.module('questCreator')
.directive('popupContent', function(){

  var popups = {
    'editor': 'editor.html',
  }

  return {
    restrict: 'E',
    replace: true,
    transclude: true,
    templateUrl: function(){
    return './src/views/popups/' + popups[0]

    }

  }
});
