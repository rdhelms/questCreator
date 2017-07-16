angular.module('questCreator').factory('Avatar', function() {
  function Avatar(avatarInfo) {
    this.name = avatarInfo.name;
    this.info = avatarInfo.info;
    this.user_id = avatarInfo.user_id;
    this.action = 'stand';
    this.info.speed = {
      mag: 3,
      x: 0,
      y: 0
    };
    this.info.currentFrameIndex = 0;
    this.info.currentFrame = this.info.animate['walkDown'][this.info.currentFrameIndex];
    this.animateDelay = 10;
    this.animateTime = 0;
    this.scale = 1;
  }

  Avatar.prototype.updatePos = function() {
    this.info.pos.x += this.info.speed.x;
    this.info.pos.y += this.info.speed.y;
  };

  Avatar.prototype.checkAction = function() {
    var self = this;
    if (self.action === 'stand' || self.action === 'walkLeft' || self.action === 'walkUp' || self.action === 'walkRight' || self.action === 'walkDown') {
      switch (self.action) {
          case 'stand':
              self.info.speed.x = 0;
              self.info.speed.y = 0;
              break;
          case 'walkLeft':
              self.info.speed.x = -self.info.speed.mag;
              self.info.speed.y = 0;
              break;
          case 'walkUp':
              self.info.speed.x = 0;
              self.info.speed.y = -self.info.speed.mag;
              break;
          case 'walkRight':
              self.info.speed.x = self.info.speed.mag;
              self.info.speed.y = 0;
              break;
          case 'walkDown':
              self.info.speed.x = 0;
              self.info.speed.y = self.info.speed.mag;
              break;
      }
      if (self.animateTime > self.animateDelay) {
        // Animate the avatar.
        if (self.action !== 'stand') {
          self.info.currentFrame = self.info.animate[self.action][self.info.currentFrameIndex];
          self.info.currentFrameIndex++;
          if (self.info.currentFrameIndex > self.info.animate[self.action].length - 1) {
              self.info.currentFrameIndex = 0;
          }
        }
        self.animateTime = 0;
      }
      self.animateTime++;
    }
  }

  Avatar.prototype.stop = function() {
    this.action = 'stand';
    this.info.speed.x = 0;
    this.info.speed.y = 0;
  };

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
  };

  Avatar.prototype.teleport = function(pos) {
    this.info.pos = pos;
  };

  return Avatar;
});
