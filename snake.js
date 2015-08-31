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

/////////functions:

function resetGame(playArea, snake, rodent){
	score = 0;
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

// add animal render function to jQuery prototype
$.prototype.renderAnimal = function(animal){	
	this.find('.' + animal.type).html('').removeClass(animal.type);
	// render each body part
	for (i = 0; i < animal.body.length; i++){
		$pinPoint = this.find('.row').eq(animal.body[i][1]).find('.column').eq(animal.body[i][0]);
		// add 'head' class to the first body part of animal
		if (i === 0){
			$pinPoint.html('O').addClass('head');	
		}
		// add animal's class
		// $pinPoint.html('O')
		$pinPoint.addClass(animal.type);
		// $pinPoint.html('O').addClass('snake');
	};
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

function growTail(tail, tailSecondToLast){
	var oldTail = tail.slice();
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
	tailSecondToLast = oldTail;
	return tail;
};

function theMain(){
	$('#container').append('<table id="playArea"></div>');
	$playArea = $('#playArea');
	$playArea.width(total_width);

	var boa = new Animal(snakeX, snakeY, snakeDirection, "snake");
	var rodent = new Animal(rodentX, rodentY, 39, 'rodent');
	resetGame($playArea, boa, rodent);

	var gameLoop = setInterval(function(){
		boa.moveSnake();
		$playArea.renderAnimal(boa);

		// check if snake is out of bounds
		outOfBoundsLR = boa.body[0][0] < 0 || boa.body[0][0] >= columns;
		outOfBoundsUD = boa.body[0][1] < 0 || boa.body[0][1] >= rows;
		if(outOfBoundsLR || outOfBoundsUD){
			outOfBoundsLR = false;
			outOfBoundsUD = false;
			resetGame($playArea, boa, rodent);		
		};

		var head = boa.body[0].slice();
		for (i = 0; i < boa.body.length - 1; i++){
			if(head[0] === boa.body[i][0] && head[1] === boa.body[i][1] && i !== 0){
				console.log('ate myself');
				resetGame($playArea, boa, rodent);			
			};	
		};
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
		console.log(score);
		
		var tail = boa.body[boa.body.length - 1].slice();
		var tailSecondToLast = boa.body[boa.body.length - 2].slice();
		for(i = 0; i < 3; i++){
			boa.body.push(growTail(tail, tailSecondToLast));		
		};
		rodentX = Math.floor(Math.random()*(columns));
		rodentY = Math.floor(Math.random()*(rows));	
		rodent.body = [[rodentX, rodentY]];	
		$(this).renderAnimal(rodent);
	});

};
