$(document).ready(theMain);

var up = 38,
right = 39,
down = 40,
left = 37;

var total_width = 900;
var total_height = 500;
var	columns = 30;
var	rows = 30;
var widthOfSquare = total_width/columns;
var heightOfSquare = total_height/rows;
var snakeX = 20;
var snakeY = 20;
var rodentX = Math.floor(Math.random()*(columns));
var	rodentY = Math.floor(Math.random()*(rows));	
var snakeDirection = 39;
var outOfBoundsLR = false;
var outOfBoundsUD = false;
var score = 0;
var highScore = 0;

/////////functions:

function resetGame(playArea, snake, rodent){
	score = 0;
	playArea.parent().find('#highScore').html('High Score: ' + highScore);
	playArea.parent().find('#score').html('Score: ' + score);
	playArea.render(rows, columns, widthOfSquare, heightOfSquare);
	snake.body = [[snakeX, snakeY], [snakeX - 1, snakeY], [snakeX - 2, snakeY]];
	snake.direction = snakeDirection;
	rodentX = Math.floor(Math.random()*(columns));
	rodentY = Math.floor(Math.random()*(rows));	
	rodent.body = [[rodentX, rodentY]];	
	rodent.direction = 39;
	playArea.renderAnimal(snake);
	playArea.renderAnimal(rodent);
};

// add a render function to jQuery prototype
$.fn.render = function(rows, columns, widthOfSquare, heightOfSquare){
	// empty and re-set play area
	this.empty();
	for (i = 0; i < rows; i++){
		this.append('<tr class="row"></div>');
	};
	for (i = 0; i < columns; i++){
		this.find('.row').append('<td class="column"></div>');
	};
	this.find('.column').css({
		'width': widthOfSquare,
		'height': heightOfSquare
	});
};

// add animal render function to jQuery prototype
$.prototype.renderAnimal = function(animal){	
	this.find('.' + animal.type).html('').removeClass(animal.type).removeClass('head');
	// render each body part
	for (i = 0; i < animal.body.length; i++){
		$pinPoint = this.find('.row').eq(animal.body[i][1]).find('.column').eq(animal.body[i][0]);
		// add 'head' class to the first body part of animal
		if (i === 0 && animal.type === "snake"){
			$pinPoint.html('(O)').addClass('head');	
		}
		if(animal.type === 'rodent'){
			$pinPoint.html('<:3 )~');
		}
		// add animal's class
		$pinPoint.addClass(animal.type);
	};
};

// a snake = an array of coordinates (add more pairs to increase his/her body size)
function Animal(xCoord, yCoord, direction, type){
	this.type = type;
	if (type === 'snake'){
		this.body = [[xCoord, yCoord], [xCoord - 1, yCoord], [xCoord - 2, yCoord]];
	}else{
		this.body = [[xCoord, yCoord]];		
	}
	this.direction = direction;
};

// add a move function to Animal prototype
Animal.prototype.moveSnake = function(){
	var head = this.body[0].slice();
	switch (this.direction){
		case up:
				head[1]--;
			break;
		case right:
				head[0]++;
			break;
		case down:
				head[1]++; 
			break;
		case left:
				head[0]--;
			break;
		default: head = head;
	};
	this.body.unshift(head);
	this.body.pop();
};

Animal.prototype.isOutOfBounds = function(){
	var outOfBoundsLR = this.body[0][0] < 0 || this.body[0][0] >= columns;
	var outOfBoundsUD = this.body[0][1] < 0 || this.body[0][1] >= rows;
	if(outOfBoundsLR || outOfBoundsUD){
		return true;
	}else{
		return false;
	};
};

Animal.prototype.eatsItself = function(){
	var head = this.body[0].slice();
	for (i = 0; i < this.body.length - 1; i++){
		if(head[0] === this.body[i][0] && head[1] === this.body[i][1] && i !== 0){
			return true;			
		};	
	};
	return false;
};

Animal.prototype.growTail = function(){

	var tail = this.body[this.body.length - 1].slice();
	var tailSecondToLast = this.body[this.body.length - 2].slice();

	if (tail[0] === tailSecondToLast[0]){
		// they are on the same column. now check row
		if (tail[1] - tailSecondToLast[1] === 1){
			// tail is below the tailSecondToLast. Add extra block below the tail
			tail[1]++;
		}else{
			tail[1]--;				
		}
	}else{
		// they are on the same row. now check column
		if (tail[0] - tailSecondToLast[0] === 1){
			// tail is to the right of the tailSecondToLast. Add extra block to the right of tail
			tail[0]++;
		}else{
			tail[0]--;				
		}			
	}
	this.body.push(tail);		
};

function theMain(){
	$('#container').append('<header id="scoreBoard"><ul><li id="highScore">High Score: 0</li><li id="score">Score: 0</li></ul></header><table id="playArea"></table>');
	$playArea = $('#playArea');
	$scoreBoard = $('#scoreBoard');
	$playArea.width(total_width);
	$scoreBoard.width(total_width);
	var boa = new Animal(snakeX, snakeY, snakeDirection, "snake");
	var rodent = new Animal(rodentX, rodentY, 39, 'rodent');
	resetGame($playArea, boa, rodent);

	var gameLoop = setInterval(function(){
		boa.moveSnake();
		$playArea.renderAnimal(rodent);
		$playArea.renderAnimal(boa);
		// check if snake is out of bounds
		if(boa.isOutOfBounds()){
			resetGame($playArea, boa, rodent);		
		};

		//check if snake bumped into itself
		if(boa.eatsItself()){
			resetGame($playArea, boa, rodent);
		};

		// remove rodent if snake's head is at rodent's position
		$playArea.find('.snake.rodent.head').removeClass('rodent').trigger('snakeEats');
	}, 75);

	// listen for arrow up/right/down/left events
	$(document).on('keydown', boa, function(event){ 
		if(Math.abs(event.which - boa.direction) !== 2){
			boa.direction = event.which;
		}
	});

	// listen for snakeEats events
	$playArea.on('snakeEats', function(event){ 
		score++;
		if(score > highScore){
			highScore = score;
		}
		$scoreBoard.find('#highScore').html('High Score: ' + highScore);
		$scoreBoard.find('#score').html('Score: ' + score);

		for(i = 0; i < 4; i++){
			boa.growTail();		
		};
		rodentX = Math.floor(Math.random()*(columns));
		rodentY = Math.floor(Math.random()*(rows));	
		rodent.body = [[rodentX, rodentY]];	
		$(this).renderAnimal(rodent);
	});

};
