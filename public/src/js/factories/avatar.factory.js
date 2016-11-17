angular.module('questCreator').factory('Avatar', function() {
  function Avatar(avatarInfo) {
    this.name = avatarInfo.name;
    this.obj = avatarInfo.obj;
    this.user_id = avatarInfo.user_id;
    this.current = avatarInfo.current;
  };

  Avatar.prototype.testFunction = function() {
    console.log("This is a prototype function.");
  }

  return Avatar;
});
