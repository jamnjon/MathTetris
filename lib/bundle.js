/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	var Game = __webpack_require__(1);
	var GameView = __webpack_require__(4);
	
	document.addEventListener("DOMContentLoaded", function(){
	  var canvasEl = document.getElementsByTagName("canvas")[0];
	  canvasEl.width = Game.DIM_X;
	  canvasEl.height = Game.DIM_Y;
	
	  var ctx = canvasEl.getContext("2d");
	  var game = new Game();
	  canvasEl.addEventListener('click', function(event){
	    game.handleClick(event);
	  }, false);
	  new GameView(game, ctx).start();
	});
	
	
	// var BinaryToDec = function(num){
	//   var numString = num.toString();
	//   var sum = 0;
	//   var pow = 0;
	//   while(numString.length > 0){
	//     var curNum = numString[numString.length - 1];
	//     if(parseInt(curNum)){
	//       sum+= Math.pow(2,pow);
	//     }
	//     pow++;
	//     numString = numString.slice(0,numString.length - 1);
	//   }
	//   return sum;
	// };


/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	var Block = __webpack_require__(2);
	var Question = __webpack_require__(3);
	
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


/***/ },
/* 2 */
/***/ function(module, exports) {

	var Block = function(num, idx){
	  this.height = 98;
	  this.width = 123;
	  this.color = Block.COLORS[Math.floor(Math.random() * Block.COLORS.length)];
	  this.pos = [Math.floor(Math.random() * 8) * 125,97];
	  this.maxHeight = 600;
	  this.num = num;
	  this.highlighted = false;
	  this.idx = idx;
	};
	
	Block.COLORS = ["#FF0000", "#FF00E0", "#2C9C96", "#00FF00", "#0000FF"];
	
	Block.prototype.draw = function (ctx) {
	  ctx.fillStyle = this.color;
	
	  ctx.beginPath();
	  ctx.rect(
	    this.pos[0], this.pos[1],this.width, this.height);
	  ctx.fill();
	  if(this.highlighted){
	    ctx.lineWidth = 5;
	    ctx.stroke();
	  }
	
	
	  ctx.font="30px Arial";
	  ctx.fillStyle = "white";
	  ctx.fillText(this.num, this.pos[0] + 55, this.pos[1] + 50);
	
	};
	
	Block.prototype.highlight = function () {
	  if(this.highlighted){
	    this.highlighted = false;
	  } else{
	    this.highlighted = true;
	  }
	};
	
	Block.prototype.isCollidedWith = function (otherBlock) {
	  if(otherBlock.pos[0] === this.pos[0]){
	    if(this.pos[1] + 100 === otherBlock.pos[1]){
	      return true;
	    }
	  }
	  return false;
	};
	
	Block.prototype.collideWith = function (otherBlock) {
	    this.maxHeight = otherBlock.pos[1] - 2;
	  // }
	};
	
	Block.prototype.unCollideWith = function () {
	  this.maxHeight = 600;
	};
	
	Block.prototype.move = function () {
	  if(this.pos[1] < this.maxHeight - this.height){
	    this.pos[1] += 1;
	  }
	};
	
	module.exports = Block;


/***/ },
/* 3 */
/***/ function(module, exports) {

	var Question = function(){
	var operations = ['add', 'subtract', 'multiply', 'divide', 'binary'];
	this.operation = operations[Math.floor(Math.random()*4)];
	this.firstNum = this.generateFirstNum();
	this.secondNum = this.generateSecondNum();
	};
	
	Question.prototype.generateFirstNum = function () {
	  if(this.operation === 'binary'){
	    
	  }
	  if(this.operation !== 'multiply'){
	    return Math.floor(Math.random() * 200 + 1);
	  } else {
	    return Math.floor(Math.random() * 20);
	  }
	};
	
	Question.prototype.generateSecondNum = function () {
	  if(this.operation === 'multiply'){
	    return Math.floor(Math.random() * 20);
	  } else if(this.operation === 'subtract'){
	    var secNum = 250;
	    while(secNum > this.firstNum){
	      secNum = Math.floor(Math.random() * 200);
	    }
	    return secNum;
	  } else if(this.operation === 'add'){
	    return Math.floor(Math.random() * 200);
	  } else if(this.operation === 'binary'){
	
	  }else{
	    var denoms = this.findDenoms();
	    return denoms[Math.floor(Math.random() * denoms.length)];
	  }
	};
	
	Question.prototype.findDenoms = function () {
	  var denoms = [];
	  for(var i = 1; i <= this.firstNum; i++){
	    if (this.firstNum % i === 0){
	      denoms.push(i);
	    }
	  }
	  return denoms;
	};
	
	Question.prototype.draw = function (ctx, Game) {
	  var question = "";
	  if(this.operation === 'multiply'){
	    var op = ' x ';
	  } else if(this.operation === 'add'){
	    op = ' + ';
	  } else if(this.operation === 'subtract'){
	    op = ' - ';
	  } else{
	    op = ' / ';
	  }
	  question += this.firstNum + op + this.secondNum + " = ";
	  ctx.fillStyle = "#000000";
	  ctx.fillRect(0,0,Game.DIM_X, 100);
	  ctx.font="30px Arial";
	  ctx.fillStyle = "white";
	  ctx.fillText(question, 450, 60);
	};
	
	
	module.exports = Question;


/***/ },
/* 4 */
/***/ function(module, exports) {

	
	var GameView = function (game, ctx) {
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


/***/ }
/******/ ]);
//# sourceMappingURL=bundle.js.map