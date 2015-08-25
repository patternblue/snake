$(document).ready(theMain);

function theMain(){
	$('#container').append('<table id="playArea"></div>');
	$playArea = $('#playArea');
	var total_width = 960;
	var total_height = 600;
	rows = 40;
	columns = 40;
	var widthOfSquare = total_width/columns;
	var heightOfSquare = total_height/rows;
	$playArea.width(total_width);
	// $playArea.height(total_height);
	$playArea.render();
	// renderSnake();

	$playArea.find('.column').css({
		'width': widthOfSquare,
		'height': heightOfSquare
	});

	var snake1 = new Snake(20, 20, "R");
	var up = 38,
	right = 39,
	down = 40,
	left = 37;

	$playArea.find('.row').eq(snake1.body[0][0]).find('.column').eq(snake1.body[0][1]).html('O');
	$(document).on('keydown', function(event){ 
		console.log(event.which);
		moveSnake(event.which);
	});

};

/////////functions:

function moveSnake(direction){
	console.log("this ran" + direction.which);
};
// add a render function to jQuery prototype
$.fn.render = function(){
	// this.append('<div class="square snake">O</div>');
	// this.empty();
	for (i = 0; i < rows; i++){
		this.append('<tr class="row"></div>');
	};
	for (i = 0; i < columns; i++){
		this.find('.row').append('<td class="column"></div>');
	};
};

// var renderSnake = function(){
// 	$square = $('.square')
// };

// a snake = an array of coordinates (add more pairs to increase his/her body size)
function Snake(xCoord, yCoord, direction){
	this.body = [[xCoord, yCoord]];
	this.direction = direction;
};


// [[,,,],
// [,,,]]



