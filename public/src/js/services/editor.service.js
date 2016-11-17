angular.module('questCreator').service('EditorService', function (UserService, $state) {


    var game = null;

    function getGameAssets(name) {

    }

    function createNewGame(name) {
      var header = {
        user_id: UserService.get().id,
        token: UserService.get().token
      };
      var game = {
        name: name,
        description: "",
        tags: []
      };
      console.log(header, game);
      $.ajax({
        method: 'POST',
        url: 'https://forge-api.herokuapp.com/games/create',
        data: JSON.stringify(game),
        headers: header,
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
      getGame: getGameAssets,
      createGame: createNewGame

    };
});
