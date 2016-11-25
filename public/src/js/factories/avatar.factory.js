angular.module('questCreator').factory('Avatar', function() {
  function Avatar(avatarInfo) {
    this.name = avatarInfo.name;
    this.info = avatarInfo.info;
    this.user_id = avatarInfo.user_id;
    this.action = 'stand';
    this.speed = {
      mag: 3,
      x: 0,
      y: 0
    };
  };

  Avatar.prototype.updatePos = function() {
    this.info.pos.x += this.speed.x;
    this.info.pos.y += this.speed.y;
  }

  Avatar.prototype.stop = function() {
    this.action = 'stand';
    this.speed.x = 0;
    this.speed.y = 0;
  }

  Avatar.prototype.collide = function(direction) {
    this.stop();
    switch (direction) {
      case 'left':
        this.info.pos.x += this.speed.mag;
        break;
      case 'right':
        this.info.pos.x -= this.speed.mag;
        break;
      case 'up':
        this.info.pos.y += this.speed.mag;
        break;
      case 'down':
        this.info.pos.y -= this.speed.mag;
        break;
    }
  }

  return Avatar;
});
