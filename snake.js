$(document).ready(theMain);

var up = 38,
right = 39,
down = 40,
left = 37;

var total_width = 960;
var total_height = 600;
var	columns = 40;
var	rows = 40;
var widthOfSquare = total_width/columns;
var heightOfSquare = total_height/rows;
var snakeX = 20;
var snakeY = 20;
var rodentX = Math.floor(Math.random()*(columns + 1));
var rodentY = Math.floor(Math.random()*(rows + 1));
var snakeDirection = 39;
var outOfBoundsLR = false;
var outOfBoundsUD = false;
var runThis = true;
var runThat = true;

function theMain(){
	$('#container').append('<table id="playArea"></div>');
	$playArea = $('#playArea');
	$playArea.width(total_width);

	var animals = resetGame($playArea, snakeX, snakeY, snakeDirection);
	var boa = animals[0];
	var rodent = animals[1];

	var gameLoop = setInterval(function(){
		boa.moveSnake();
		$playArea.renderAnimal(boa);
		outOfBoundsLR = boa.body[0][0] < 0 || boa.body[0][0] > columns;
		outOfBoundsUD = boa.body[0][1] < 0 || boa.body[0][1] > rows;
		if(outOfBoundsLR || outOfBoundsUD){
			outOfBoundsLR = false;
			outOfBoundsUD = false;
			animals = resetGame($playArea, snakeX, snakeY, snakeDirection);
			boa = animals[0];
			rodent = animals[1];			
		};
	}, 100);

	$(document).on('keydown', boa, function(event){ 
		if(Math.abs(event.which - boa.direction) !== 2){
			boa.direction = event.which;
		}
	});

};

/////////functions:

function resetGame(playArea, snakeX, snakeY, direction){
	playArea.render(rows, columns, widthOfSquare, heightOfSquare);
	var boa = new Animal(snakeX, snakeY, snakeDirection, "snake");
	rodentX = Math.floor(Math.random()*(columns + 1));
	rodentY = Math.floor(Math.random()*(rows + 1));	
	var rodent = new Animal(rodentX, rodentY, 39, 'rodent');
	playArea.renderAnimal(boa);
	playArea.renderAnimal(rodent);
	return [boa, rodent];
};

$.prototype.renderAnimal = function(animal){	
	// console.log(animal.type);
	this.find('.column').html('').removeClass(animal.type);
	// console.log(animal.body.length);
	// console.log(animal.body[0][1]);
	for (i = 0; i < animal.body.length; i++){
		$pinPoint = this.find('.row').eq(animal.body[i][1]).find('.column').eq(animal.body[i][0]);
		$pinPoint.html('O').addClass(animal.type);
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
