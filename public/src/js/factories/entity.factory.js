angular.module('questCreator').factory('Entity', function() {
  function Entity(entity) {
    this.name = entity.name;
    this.game_id = entity.game_id;
    this.action = 'walkLeft';
    this.info = entity.info;
    this.info.speed = {
      mag: 3,
      x: 0,
      y: 0
    };
    this.info.currentFrameIndex = 0;
    this.info.currentFrame = this.info.animate[this.action][this.info.currentFrameIndex];
    this.animateDelay = 20;
    this.animateTime = 0;
    this.scale = 1;
  };

  Entity.prototype.updatePos = function() {
    this.info.pos.x += this.info.speed.x;
    this.info.pos.y += this.info.speed.y;
  }

  Entity.prototype.checkAction = function() {
    var self = this;
    if (self.animateTime > self.animateDelay) {
      if (self.action === 'stand' || self.action === 'walkLeft' || self.action === 'walkUp' || self.action === 'walkRight' || self.action === 'walkDown') {
          switch (self.action) {
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
          // Animate the entity.
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

  Entity.prototype.stop = function() {
    this.action = 'walkRight';
    this.info.speed.x = 0;
    this.info.speed.y = 0;
  }

  Entity.prototype.wander = function() {
    this.info.speed.x = 0;
    this.info.speed.y = 0;
    // Entities bounce instead of stopping.
    var randomAction = (Math.floor(Math.random() * 4));
    switch (randomAction) {
      case 0:
        this.action = 'walkLeft';
        break;
      case 1:
        this.action = 'walkRight';
        break;
      case 2:
        this.action = 'walkUp';
        break;
      case 3:
        this.action = 'walkDown';
        break;
    }
  }

  Entity.prototype.collide = function(direction) {
    this.wander();
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

  return Entity;
});
