angular.module('questCreator').factory('Background', function() {
  function Background(backgroundInfo) {
    this.name = backgroundInfo.name;
    this.obj = backgroundInfo.obj;
    this.game_id = backgroundInfo.game_id;
  };

  return Background;
});
