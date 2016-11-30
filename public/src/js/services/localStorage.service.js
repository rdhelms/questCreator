angular.module('questCreator').service('StorageService', function (localStorageService) {
  function getSavedGames(gameName) {
    var allSavedGames = localStorageService.get('savedGames') || [];
    var yourSaves = allSavedGames[gameName];
    return yourSaves;
  }

  function setSavedGames(gameName, newSavedGames) {
    var allSavedGames = localStorageService.get('savedGames') || [];
    allSavedGames[gameName] = newSavedGames;
    localStorageService.set('savedGames', allSavedGames);
  }

  function getPlayingGame() {
    return localStorageService.get('currentPlaying') || null;
  }

  function setPlayingGame(gameName) {
    localStorageService.set('currentPlaying', gameName);
  }

  return {
    getSavedGames: getSavedGames,
    setSavedGames: setSavedGames,
    getPlayingGame: getPlayingGame,
    setPlayingGame: setPlayingGame
  };
});
