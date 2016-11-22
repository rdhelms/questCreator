// credit: https://gist.github.com/anri-asaturov/10208667

angular.module('questCreator')
.directive('blurOnEnter', function(){
    return {
        link:  function (scope, element, attrs) {
            element.bind("keypress", function (event) {
              console.log("in directive");
                if(event.which === 13) {
                    console.log('blurrin');
                    element.blur();
                    event.preventDefault();
                }
            });
        }
    }
});
