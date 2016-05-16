
var GameView = function (game, ctx) {
  console.log('test');
  this.ctx = ctx;
  this.game = game;
  this.incremented = true;
  this.newQuestions = true;
  this.won = false;
};

GameView.prototype.start = function () {
  this.lastTime = 0;
  //start the animation
  requestAnimationFrame(this.animate.bind(this));
};

GameView.prototype.animate = function(time){
  if(Math.floor(time / 1000) % 3 === 0){
    if(!this.incremented){
      this.game.newBlock();
      this.incremented = true;
    }
  } else{
    this.incremented = false;
  }
  if(Math.floor(time / 1000) % 90 === 0 && time > 1000){
    this.won = true;
  }
  var timeDelta = time - this.lastTime;

  var gameLost = this.game.step(timeDelta);
  this.game.draw(this.ctx, gameLost, this.won);
  this.lastTime = time;

  //every call to animate requests causes another call to animate
  if(!this.won && !gameLost){
    requestAnimationFrame(this.animate.bind(this));
  }
};

module.exports = GameView;
