angular.module('questCreator').service('GameService', function () {

    function loadGame(name) {
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

return {
  loadGame: loadGame
};
});
