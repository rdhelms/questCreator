angular.module('questCreator').factory('Avatar', function() {
  function Avatar(avatarInfo) {
    this.name = avatarInfo.name;
    this.info = avatarInfo.info;
    this.user_id = avatarInfo.user_id;
    this.current = avatarInfo.current;
    this.action = 'stand';
  };

  Avatar.prototype.updatePos = function() {
    this.info.pos.x += this.info.speed.x;
    this.info.pos.y += this.info.speed.y;
  }

  Avatar.prototype.stop = function() {
    this.action = 'stand';
    this.info.speed.x = 0;
    this.info.speed.y = 0;
  }

  Avatar.prototype.collide = function(direction) {
    this.stop();
    switch (direction) {
      case 'left':
        this.info.pos.x += this.info.speed.mag;
        break;
      case 'right':
        this.info.pos.x -= this.info.speed.mag;
        break;
      case 'up':
        this.info.pos.y += this.info.speed.mag;
        break;
      case 'down':
        this.info.pos.y -= this.info.speed.mag;
        break;
    }
  }

  return Avatar;
});
