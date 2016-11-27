angular.module('questCreator').controller('detailCtrl', function ($state, GameService, UserService, PopupService) {

    this.playGame = function (name) {
        $state.go('main.game.play');
    };

    this.game = GameService.getGameDetail();

    this.sendCollabRequest = function (gameId) {
      var request = UserService.validateCollabRequest(gameId).done(function (response) {
        if (response.message){
          UserService.sendCollabRequest(gameId);
          PopupService.openTemp('alert-request-sent');
        } else if (response.requested && !response.accepted) {
          PopupService.openTemp('alert-already-requested');
        } else if (!response.requested && !response.accepted) {
          PopupService.open('alert-request-resent');
          UserService.requestAgain(gameId);
        } else if (response.requested && response.accepted) {
          PopupService.open('alert-already-collab');
        } else {
          PopupService.openTemp('fail-request-collab');
        }
      });
    };

    //This is for testing only
    this.players = [
      {
        name: 'billy badass',
        score: 72,
        timeToComplete: '00:45:06'
      }, {
        name: 'jaime presley',
        score: 28,
        timeToComplete: 'incomplete'
      }, {
        name: 'rob helms',
        score: 56,
        timeToComplete: '02:32:06'
      }, {
        name: 'mr. toups',
        score: 61,
        timeToComplete: '01:28:15'
      }, {
        name: 'nate',
        score: 36,
        timeToComplete: 'incomplete'
      }, {
        name: 'fitch',
        score: 73,
        timeToComplete: '03:45:04'
      }];
});
