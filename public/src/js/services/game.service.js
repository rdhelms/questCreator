angular.module('questCreator').service('GameService', function () {

    var gameDetail = {
      // thumbnail: "http://cdn.akamai.steamstatic.com/steam/apps/345390/extras/KQ_CC-PC_Bundle-Art_Capsule_Main.png?t=1477527248",
      // name: "King's Quest Collection",
      // creator: "billy badass",
      // players: 6,
      // created_at: new Date(),
      // responseText: "something",
      // totalPoints: 75
    };

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

function getGameDetail() {
  return gameDetail;
}

function setGameDetail(game) {
  gameDetail = game;
}

return {
  loadGame: loadGame,
  getGameDetail: getGameDetail,
  setGameDetail: setGameDetail
};
});
