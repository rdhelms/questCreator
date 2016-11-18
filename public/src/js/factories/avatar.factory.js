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

  Avatar.prototype.stop = function() {
    this.action = 'stand';
    this.obj.speed.x = 0;
    this.obj.speed.y = 0;
  }

  Avatar.prototype.collide = function(direction) {
    this.stop();
    switch (direction) {
      case 'left':
        this.obj.pos.x += this.obj.speed.mag;
        break;
      case 'right':
        this.obj.pos.x -= this.obj.speed.mag;
        break;
      case 'up':
        this.obj.pos.y += this.obj.speed.mag;
        break;
      case 'down':
        this.obj.pos.y -= this.obj.speed.mag;
        break;
    }
  }

  return Avatar;
});
