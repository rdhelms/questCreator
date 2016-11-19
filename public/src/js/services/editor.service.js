angular.module('questCreator').service('EditorService', function (UserService, $state) {


    var game = null;

    function getGame(name) {
      $.ajax({
        method: 'GET',
        url: 'https://forge-api.herokuapp.com/games/load',
        data: JSON.stringify(name),
        dataType: 'json',
        contentType: 'application/json',
        success: function(response) {
          return response;
        },
        error: function(error) {
          alert('There was a problem loading this game');
        }
      });
    }

    function createNewGame(name) {
      var headerData = {
        user_id: UserService.get().id,
        token: UserService.get().token
      };
      var game = {
        name: name,
        description: "",
        tags: []
      };

      return $.ajax({
        method: 'POST',
        url: 'https://forge-api.herokuapp.com/games/create',
        data: JSON.stringify(game),
        headers: headerData,
        dataType: 'json',
        contentType: 'application/json',
        success: function(response) {
          game = response;
          return game;
        },
        error: function(error) {
          alert('There was a problem creating this game. Please try again.');
          $state.go('main.landing');
        }
      });
    }

    return {
      getGame: getGame,
      createGame: createNewGame

    };
});
