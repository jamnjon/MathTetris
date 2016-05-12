# Math Tetris

[Math Tetris live][location]

[location]: http://jamnjon.github.io/MathTetris/



Math Tetris is a javaScript game using canvas, based loosely off of the classic arcade game Tetris. A math problem displays at the top, and you have to solve the problem. In order to input your answer (and make blocks disappear), you click the blocks with the digits, and if you select the solution the blocks will disappear.   
![gameplay](https://github.com/jamnjon/MathTetris/blob/master/pics/demoProblem.png)

## Implementation

The game populates a list of all numbers in all solutions to all questions. Once blocks are generated with all of these numbers, more questions are generated and a new list of all numbers is added to the array.

````javascript
var currentGame = this;
var newQuestions = this.questions.slice(this.numTimesGenerated * 3, this.questions.length);
this.numTimesGenerated++;
newQuestions.forEach(function(question, idx){
this.answers.push(total);
var totString = total.toString();
for(var i = 0; i < totString.length; i++){
  currentGame.nums.push(parseInt(totString[i]));
}
}.bind(this));
````
The blocks (canvas elements) with numbers move down until they hit the bottom or another block. When a block is removed, it checks all blocks above it and starts them moving again.

````javascript
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
````
