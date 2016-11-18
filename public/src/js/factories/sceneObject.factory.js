angular.module('questCreator').factory('SceneObject', function() {
  function SceneObject(sceneObjectInfo) {
    this.name = sceneObjectInfo.name;
    this.obj = sceneObjectInfo.obj;
    this.game_id = sceneObjectInfo.game_id;
    this.action = 'none';
    this.allActions = [];
  };

  return SceneObject;
});
