// credit: https://gist.github.com/anri-asaturov/10208667

angular.module('questCreator')
.directive('blurOnEnter', function(){
    return {
        terminal: true,
        link:  function (scope, element, attrs) {
            element.bind("keyup", function (event) {
                if(event.which === 13) {
                    element.blur();
                    // event.preventDefault();
                }
            });
        }
    }
});
