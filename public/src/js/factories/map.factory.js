angular.module('questCreator').factory('Map', function() {
  function Map(name) {
    this.name = name;
    this.scenes = [];
    /*
      Structure of scenes array:
      [ [ scenes[0][0], scenes[0][1], scenes[0][2], scenes[0][3] ],
        [ scenes[1][0], scenes[1][1], scenes[1][2], scenes[1][3] ],
        [ scenes[2][0], scenes[2][1], scenes[2][2], scenes[2][3] ] ]
    */
  };

  return Map;
});
