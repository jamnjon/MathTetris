var Block = require("./block");
var Question = require('./question');

var Game = function () {
  this.highlighted = [];
  this.numTimesGenerated = 0;
  this.blocks = [];
  this.nums = [];
  this.questions = [];
  this.answers = [];
  this.newQuestions();
  this.currentIndex = 0;
  this.add();
  this.blockCount = 2;
};

Game.prototype.newQuestions = function () {
  for(var i = 0; i < 3; i++){
    this.questions.push(new Question());
  }
  this.getNumsFromQuestions();
};

Game.prototype.getNumsFromQuestions = function () {
  var currentGame = this;
  var newQuestions = this.questions.slice(this.numTimesGenerated * 3, this.questions.length);
  this.numTimesGenerated++;
  newQuestions.forEach(function(question, idx){
    if(question.operation === 'multiply'){
      var total = question.firstNum * question.secondNum;
    } else if(question.operation === 'add'){
      total = question.firstNum + question.secondNum;
    } else if(question.operation === 'subtract'){
      total = question.firstNum - question.secondNum;
    } else{
      total = question.firstNum / question.secondNum;
    }
    this.answers.push(total);
    var totString = total.toString();
    for(var i = 0; i < totString.length; i++){
      currentGame.nums.push(parseInt(totString[i]));
    }
  }.bind(this));
};

Game.BG_COLOR = "#EEEEEE";
Game.DIM_X = 1000;
Game.DIM_Y = 600;
Game.FPS = 32;

Game.prototype.add = function () {
  for (var i = 0; i < 3; i++) {
    var numPos = Math.floor(Math.random() * this.nums.length);
    var duplicate = true;
    while(duplicate){
      duplicate = false;
      var currentBlock = new Block(this.nums[numPos], i);
      this.blocks.forEach(function(block){
        if (block.pos[0] === currentBlock.pos[0] && block.pos[1] === currentBlock.pos[1]){
          duplicate = true;
        }
      });
    }
    this.blocks.push(currentBlock);
    this.nums.splice(numPos,1);

  }

};


Game.prototype.newBlock = function () {
  var numPos = Math.floor(Math.random() * this.nums.length);
  this.blockCount++;
  this.blocks.push(new Block(this.nums[numPos], this.blockCount));
  this.nums.splice(numPos, 1);
};


Game.prototype.checkCollisions = function () {
  var game = this;
  var gameIsOver = false;
  this.blocks.forEach(function (block1) {
    game.blocks.forEach(function (block2) {
      if (block1 == block2) {
        // don't allow self-collision
        return;
      }

      if (block1.isCollidedWith(block2)) {
        block1.collideWith(block2);
        if(block2.maxHeight === 300){
          gameIsOver = true;
        }
      }
    });

  });
  return gameIsOver;
};

Game.prototype.handleClick = function (event) {
  var game = this;
  var clickedBlock = false;
  this.blocks.forEach(function(block){
    if(event.layerX >= block.pos[0] && event.layerX <= block.pos[0]+block.width){
      if(event.layerY >= block.pos[1] && event.layerY <= block.pos[1] + block.height){
        clickedBlock = true;
        block.highlight();
        if (block.highlighted){
          this.highlighted.push(block);
          var curAns = this.answers[this.currentIndex].toString();
          var match = true;

          for (var i = 0; i < curAns.length; i++) {
            if(curAns[i] !== (game.highlighted[i].num).toString()){
              match = false;
            }
            if (curAns.length !== game.highlighted.length){
              match = false;
            }
          }
          if(match){
            this.removeBlocks();
          }
        } else{
          this.highlighted.splice(this.highlighted.indexOf(block.num));
        }
      }
    }
  }.bind(this));
  if(!clickedBlock){
    this.blocks.forEach(function(block){
      block.highlighted = false;
    });
    this.highlighted = [];
  }
};

Game.prototype.removeBlocks = function () {
  this.highlighted.forEach(function(block){
    var curMaxHeight = block.maxHeight;
    var col = block.pos[0];
    var numJumped = 0;
    for (var i = 0; i < this.blocks.length; i++) {
      if(block.idx === this.blocks[i].idx){
        var removeIndex = i;
      } else if(this.blocks[i].pos[0] === col && this.blocks[i].maxHeight < curMaxHeight){
        this.blocks[i].maxHeight += 100;
        this.blocks[i].pos[1]+= 5*numJumped;
        numJumped++;
      }
    }
    this.blocks.splice(removeIndex, 1);
  }.bind(this));
  this.currentIndex++;
  this.highlighted = [];
};

Game.prototype.draw = function (ctx, gameIsOver, gameWon) {
  if(this.nums.length < 1){
    this.newQuestions();
  }
  if(gameIsOver){
    ctx.fillStyle = "#000000";
    ctx.fillRect(0,0, Game.DIM_X, Game.DIM_Y);
    ctx.font="60px Arial";
    ctx.fillStyle = "white";
    ctx.fillText("You Lose", 400, 300);
  } else if(gameWon){
    ctx.fillStyle = "#000000";
    ctx.fillRect(0,0, Game.DIM_X, Game.DIM_Y);
    ctx.font="60px Arial";
    ctx.fillStyle = "white";
    ctx.fillText("You Win!", 400, 300);
  } else{
    ctx.clearRect(0, 0, Game.DIM_X, Game.DIM_Y);
    // var background = new Image();
    // background.src = "http://lowellmakes.com/wp-content/uploads/2014/03/pipix1600x12001hn.png";
    // background.onload = function(){
    //   ctx.drawImage(background,0,0);
    // };
    ctx.fillStyle = Game.BG_COLOR;
    ctx.fillRect(0, 0, Game.DIM_X, Game.DIM_Y);
    this.questions[this.currentIndex].draw(ctx, Game);
    this.blocks.forEach(function (block) {
      block.draw(ctx);
    });
  }

};


Game.prototype.moveObjects = function (delta) {
  this.blocks.forEach(function (block) {
    block.move();
  });
};



Game.prototype.step = function (delta) {
  this.moveObjects(delta);
  return this.checkCollisions();
};


module.exports = Game;
