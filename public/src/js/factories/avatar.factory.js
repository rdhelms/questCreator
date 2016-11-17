angular.module('questCreator').factory('Avatar', function() {
  function Avatar(avatarInfo) {
    this.name = avatarInfo.name;
    this.obj = avatarInfo.obj;
    this.user_id = avatarInfo.user_id;
    this.current = avatarInfo.current;
    this.action = 'stand';
  };

  Avatar.prototype.updatePos = function() {
    this.obj.pos.x += this.obj.speed.x;
    this.obj.pos.y += this.obj.speed.y;
  }

  return Avatar;
});
