angular.module('questCreator')
.factory('PopupFactory', function ($compile) {

  function create(content, title, scope) {
    var popup = $('<popup>')
      .attr({
        'popup-title': '\"'+ title +'\"'
        }
      )
      .append(content);
    popup = $compile(popup)(scope);
    $(popup).prependTo('body');
  };

  return {
    new: create
  };

});
