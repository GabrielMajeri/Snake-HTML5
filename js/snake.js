var ctx, cwidth, cheight;

var score, length;

var xpos, ypos, snakeheight, snakewidth, dir;

var xapple, yapple;

var frameTime = 60, speed = 5;

var lastPositions = [];

$( document ).ready( function(){
	ctx = $('#snake-canvas');
	cwidth = ctx.width(); 
	cheight = ctx.height();
	
	
	initGame( ctx );
});

function keyHandle()
{
	$(document).on('keydown', function(e) {
		var code = e.keyCode || e.which;
			if(code == 65 || code == 37 ) {
				if( dir != "right" )
					dir = "left" ;
				
				$("#akey").addClass("selected-key");
			}
			else if (code == 68 || code == 39)
			{
				if( dir != "left" )
					dir = "right";
				
				$("#dkey").addClass("selected-key");
			}
			else if(code == 87 || code == 38)
			{
				if( dir != "down" )
					dir = "up";
				
				$("#wkey").addClass("selected-key");
			}
			else if(code == 83 || code == 40)
			{
				if( dir != "up" )
					dir = "down";
				
				$("#skey").addClass("selected-key");
			}
	});
	
	$(document).on('keyup', resetKeys);
}

function resetKeys()
{
	$("#wkey").removeClass( "selected-key" );
	$("#akey").removeClass( "selected-key" );
	$("#dkey").removeClass( "selected-key" );
	$("#skey").removeClass( "selected-key" );
}

function snakeGrow()
{
	if( length < 80 )
		length++;
}

function snakeShrink()
{
	if( length > 1 )
		length--;
}

function initGame()
{
	console.log("[LOG] Initializing game.");
	
	// we init variables
	score = 0; length = 1; snakewidth = 30; snakeheight = 30; xpos = cwidth/2 - snakewidth; ypos = cheight/2 - snakeheight; dir = "left";
	xapple = -10; yapple = -10;
	
	// init last pos array
	for( var i = 0; i < 81; i++)
	{
		lastPositions[i] = [];
		for( var j = 0; j < 2; j++)
			lastPositions[i][j] = 0;
	}
	
	lastPositions[0][0] = xpos; lastPositions[0][1] = ypos;
	
	// we clear the background
	console.log("[LOG] Clearing canvas and drawing background.");
	fillBackground( '#bfbfbf' );
	
	// keybinds
	keyHandle();
	
	// run the game logic once to init
	gameLoop();
	
	// open game logic	
	setInterval(gameLoop, 1000/frameTime);
	moveLoop();
}

function gameLoop()
{
	fillBackground( '#bfbfbf' );
	drawSnake();
	drawApple();
	drawScore();
	checkWallHit();
	checkCollision();
	
}

function moveLoop()
{
	snakeMove( dir );
	setTimeout( moveLoop, 1000/speed );
}

function drawScore()
{
	ctx.drawText({
	  fillStyle: '#55a',
	  strokeStyle: '#00f',
	  strokeWidth: 0,
	  x: 75, y: 25,
	  fontSize: 36,
	  fontFamily: 'Segoe UI, Times New Roman, sans-serif',
	  text: "Score: " + score
	});
	
	ctx.drawText({
	  fillStyle: '#55a',
	  strokeStyle: '#00f',
	  strokeWidth: 0,
	  x: 85, y: 60,
	  fontSize: 36,
	  fontFamily: 'Segoe UI, Times New Roman, sans-serif',
	  text: "Length: " + length
	});
}

function checkWallHit()
{
	if( xpos < 0 || xpos > cwidth || ypos < 0 || ypos > cheight)
		gameEnd();
}

function checkCollision()
{
	// apple check
	if( ( (xpos-20 < xapple) && (xapple < (xpos + snakewidth + 20)) ) && ( (ypos-20 < yapple) && ( yapple < (ypos + snakeheight + 20) ) ) )
	{	
		score++; 
		snakeGrow(); 
		xapple = -10; 
		yapple = -10; 
		speed+=0.5; 
	}
	
	for( var j = 1; j < length; j++)
	{
		if( xpos == lastPositions[j][0] && ypos == lastPositions[j][1] )
			gameEnd();
	}
		
	
}

function drawSnake()
{
	// we draw the whole snake
	for( var i = 0; i < length; i ++ )
		drawSnakePart( lastPositions[i][0], lastPositions[i][1] );
}

function drawSnakePart( x, y )
{
	ctx.drawImage({
	  source: 'img/snake.png',
	  x: x, y: y,
	  width: snakewidth,
	  height: snakeheight,
	  fromCenter: false
	});
}

function fillBackground( color )
{

	ctx.drawRect({ fillStyle: color, x: 0,y: 0, width: cwidth, height: cheight, fromCenter: false});
}

function snakeMove( direction )
{
	if(direction == "left")
		xpos = xpos - snakewidth;
	else if(direction == "right")
		xpos = xpos + snakewidth;
	else if(direction == "up")
		ypos = ypos - snakeheight;
	else
		ypos = ypos + snakeheight;
	
	arrInsert(xpos, ypos);
}

function arrInsert( x, y )
{
	for( var i = length; i > 0 ; i--)
		lastPositions[i][0] = lastPositions[i-1][0], lastPositions[i][1] = lastPositions[i-1][1];
		
	lastPositions[0][0] = xpos;
	lastPositions[0][1] = ypos;
}

function gameEnd()
{
	console.log("[LOG] Player lost game.");
	dir = "left";
	score = 0;
	length = 1;	
	xpos = cwidth/2 - snakewidth;
	ypos = cheight/2 - snakeheight
	lastPositions[0][0] = xpos;
	lastPositions[0][1] = ypos;
	speed = 5;
}

function drawApple()
{
	if( xapple < 0 && yapple < 0 )
		genApple();
	
	ctx.drawImage({
	  source: 'img/apple.png',
	  x: xapple, y: yapple,
	  width: snakewidth,
	  height: snakeheight,
	  fromCenter: false
	});
}

function genApple()
{
	xapple = Math.random() * (cwidth - 120) + 50;
	yapple = Math.random() * (cheight - 120) + 50;
}