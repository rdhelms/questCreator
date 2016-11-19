angular.module('questCreator')
.service('PopupService', function ($templateRequest, PopupFactory) {

  var path = './src/views/popups/';

  // Keyname is the popup's "Title"
  // and property is it's url relative to the above path
  //
  // So passing "Welcome!" to this service will put the text "Welcome!"
  // into the title bar of the popup, with the contents of "welcome.html"
  // in the popup's body.
  var templates = {
    'editorGreeting': {
      title: 'Name your Game',
      content: 'edit-game.html'
    },
    'welcome': {
      title: 'Welcome!',
      content: 'welcome.html'
    },
    'newUser': {
      title: 'Hey, you\'re new!',
      content: 'user-register.html'
    }
  }

  function templateSelector(name, scope) {
    // debugger;
    var template = path + templates[name].content;
    var content = $('<ng-include>').attr('src', '\''+ template+ '\'');
    // Creates new popup on the page in specified scope:
    PopupFactory.new(content, templates[name].title, scope);
  }

  return {
    type: templateSelector
  }
});
