angular.module('questCreator')
.service('PopupService', function ($templateRequest, PopupFactory, $rootScope) {

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
    'edit-username': {
      title: 'Change your name:',
      content: 'edit-username.html'
    },
    'edit-game': {
      title: 'Awesome! Now you\'re editing:',
      content: 'edit-game.html'
    },
    'create-game': {
      title: 'Name your game:',
      content: 'create-game.html'
    },
    'signin-to-continue': {
      title: 'Please...',
      content: 'signin-to-continue.html'
    },
    'loading-screen': {
      title: 'Loading...',
      content: 'loading-screen.html'
    },
    'fail-user-load': {
      title: 'Oops!',
      content: 'fail-user-load.html'
    },
    'fail-user-games': {
      title: 'Oops!',
      content: 'fail-user-games.html'
    },
    'fail-collab-load': {
      title: 'Oops!',
      content: 'fail-collab-load.html'
    },
    'fail-game-load': {
      title: 'Oops!',
      content: 'fail-game-load.html'
    },
    'fail-games-load': {
      title: 'Oops!',
      content: 'fail-games-load.html'
    },
    'fail-game-create': {
      title: 'Oops!',
      content: 'fail-game-create.html'
    },
    'fail-request-collab': {
      title: 'Oops!',
      content: 'fail-request-collab.html'
    },
    'fail-assets-load': {
      title: 'Oops!',
      content: 'fail-assets-load.html'
    },
    'fail-game-archive': {
      title: 'Oops!',
      content: 'fail-game-archive.html'
    },
    'alert-request-sent': {
      title: 'Delivered:',
      content: 'alert-request-sent.html'
    },
    'alert-request-resent': {
      title: 'Delivered:',
      content: 'alert-request-resent.html'
    },
    'alert-already-requested': {
      title: 'Chill:',
      content: 'alert-already-requested.html'
    },
    'alert-already-collab': {
      title: 'Wait a minute...',
      content: 'alert-already-collab.html'
    },
    'alert-game-archived': {
      title: 'Done',
      content: 'alert-game-archived.html'
    },
    'event-prompt': {
      title: 'Choose event type:',
      content: 'event-prompt.html'
    }
  };

  function templateSelector(name, scope) {
    scope = scope || $rootScope.$$childHead;
    var template = path + templates[name].content;
    var content = $('<ng-include>').attr('src', '\''+ template+ '\'');
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
