angular.module('questCreator')
.factory('PopupFactory', function ($compile, $q) {

  function create(content, title, scope) {
    // var defer = $q.defer();

    var popup = $('<popup>')
      .attr({
        'popup-title': '\"'+ title +'\"'
      }
      )
      .append(content);
    popup = $compile(popup)(scope);
    $(popup).prependTo('body');
    // return defer.promise;
  }

  return {
    new: create
  };

});
