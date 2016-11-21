angular.module('questCreator')
.service('PopupService', function ($templateRequest, PopupFactory) {

  var path = './src/views/popups/';

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
  }

  function templateSelector(name, scope) {
    // debugger;
    var template = path + templates[name].content;
    var content = $('<ng-include>').attr('src', '\''+ template+ '\'');
    // Creates new popup on the page in specified scope:
    PopupFactory.new(content, templates[name].title, scope);
  }

  function close() {
    $('#overlay').remove();
  }

  return {
    open: templateSelector,
    close: close
  }
});
