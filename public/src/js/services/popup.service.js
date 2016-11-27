angular.module('questCreator')
.service('PopupService', function ($templateRequest, PopupFactory, $rootScope) {

  var path = './src/views/popups/';
  var pathTemp = './src/views/temps/';

  var templates = {
    'welcome': {
      title: 'Welcome!',
      content: 'welcome.html'
    },

    'user-register': {
      title: 'Hey, you\'re new!',
      content: 'user-register.html'
    },
    'edit-game': {
      title: 'Awesome! Now you\'re editing:',
      content: 'edit-game.html'
    },
    'create-game': {
      title: 'Name your game:',
      content: 'create-game.html'
    },
  };

  var templatesTemp = {
  };

  function templateSelector(name, scope) {
    scope = scope || $rootScope.$$childHead;
    var template = path + templates[name].content;
    var content = $('<ng-include>').attr('src', '\''+ template+ '\'');
    // Creates new popup on the page in specified scope:
    $rootScope.$$childHead.popupTemp = false;
    PopupFactory.new(content, templates[name].title, scope);
  }

  function templateSelectorTemp(name, scope) {
    scope = scope || $rootScope.$$childHead;
    var template = path + templates[name].content;
    var content = $('<ng-include>').attr('src', '\''+ template+ '\'');
    $rootScope.$$childHead.popupTemp = true;
    PopupFactory.new(content, templates[name].title, scope);
      setTimeout(function () {
        close();
      }, 1500);
      // $rootScope.$$childHead.popupTemp = false;
  }

  function close() {
    $('#overlay').remove();
  }



  return {
    open: templateSelector,
    openTemp: templateSelectorTemp,
    close: close
  };
});
