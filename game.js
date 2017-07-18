var renderer, scene, camera, pointLight, spotLight;

var fieldWidth = 400, fieldHeight = 200;
var paddleWidth, paddleHeight, paddleDepth, paddleQuality;

var ball, paddle1, paddle2, wall1, wall2;
var paddleTop1, paddleTop2;
var ballDirX = 1, ballDirY = 1, ballSpeed = 2;
var paddle1DirY = 0, paddle2DirY = 0, paddleSpeed = 3;
var paddleTop1DirY =0, paddleTop2DirY = 0;
var paddle1DirX = 0;

var tempCount = 7;

var score1 = 0, score2 = 0;
// set opponent reflexes (0 - easiest, 1 - hardest)
var difficulty = 0.4;

function setup()
{
	// set the scene size
	var WIDTH = 1080,
	  HEIGHT = 720;

	// // set some camera attributes
	var VIEW_ANGLE = 55,
	  ASPECT = WIDTH / HEIGHT,
	  NEAR = 0.1,
	  FAR = 10000;

	var c = document.getElementById("gameCanvas");

	// create a WebGL renderer, camera
	// and a scene
	renderer = new THREE.WebGLRenderer();
	camera =
	  new THREE.PerspectiveCamera(
		VIEW_ANGLE,
		ASPECT,
		NEAR,
		FAR);

	scene = new THREE.Scene();

	// add the camera to the scene
	scene.add(camera);

	// the camera starts at 0,0,0
	// so pull it back
	camera.position.z = 320;
	
	// start the renderer
	renderer.setSize(WIDTH, HEIGHT);

	// attach the render-supplied DOM element
	c.appendChild(renderer.domElement);

	// set up the plane vars
	var planeWidth = fieldWidth,
		planeHeight = fieldHeight,
		planeQuality = 10;
		
	// create the sphere's material
	// The image does not show in Chrome
	var texture = THREE.ImageUtils.loadTexture('table.PNG');
	
	var planeMaterial =
	  new THREE.MeshLambertMaterial(
		{
		  color: 0x808080,
		  map: texture
		});
		
	var plane = new THREE.Mesh(

	  new THREE.PlaneGeometry(
		planeWidth,
		planeHeight,
		planeQuality,
		planeQuality),

	  planeMaterial);
	  
	scene.add(plane);
	plane.receiveShadow = true;	
		
	// set up the sphere vars
	var radius = 5,
		segments = 26,
		rings = 26;
		
	// create the sphere's material
	var backgroundMaterial =
	  new THREE.MeshLambertMaterial(
		{
		  color: 0xF0EAD6
		});
	// Create the paddle material
	var PaddleMaterial =
	  new THREE.MeshLambertMaterial(
		{
		  color: 0x0000FF
		});
	var ballMaterial =
	  new THREE.MeshLambertMaterial(
		{
		  color: 0xFF0002
		});	
	// create a new mesh with
	// sphere geometry - we will cover
	// the sphereMaterial next!
	ball = new THREE.Mesh(
			//change ball to sphere
	  new THREE.CylinderGeometry(7,7,1,20),

	  ballMaterial);

	// add the sphere to the scene
	scene.add(ball);
	ball.position.x = 0;
	ball.position.y = 0;
	ball.position.z = radius/2;
	ball.receiveShadow = true;
    ball.castShadow = true;
	ball.rotation.x+=55;
	
	// set up the paddle vars
	paddleWidth = 12;
	paddleHeight = 12;
	paddleDepth = 4;
	paddleQuality = 160;
		
	paddle1 = new THREE.Mesh(
		new THREE.CylinderGeometry(
			paddleWidth,
			paddleHeight,
			paddleDepth,
			paddleQuality),
		PaddleMaterial);

	// add the sphere to the scene
	scene.add(paddle1);
	paddle1.rotation.x+=55;
	paddle1.receiveShadow = true;
    paddle1.castShadow = true;
	
	//paddle top
	paddletopWidth = 5;
	paddletopBase = 5;
	paddletopHeight = 15;
	paddletopDepth = 32;
	paddleTop1 = new THREE.Mesh(
		new THREE.CylinderGeometry(
			paddletopBase,
			paddletopWidth,
			paddletopHeight,
			paddletopDepth,
			paddleQuality),
	  PaddleMaterial);
	  
	  scene.add(paddleTop1);
	  paddleTop1.rotation.x=55;
	  
	paddle2 = new THREE.Mesh(
		new THREE.CylinderGeometry(
			paddleWidth,
			paddleHeight,
			paddleDepth,
			paddleQuality),

	  PaddleMaterial);
	  
	// add the sphere to the scene
	scene.add(paddle2);
	paddle2.rotation.x+=55;
	paddle2.receiveShadow = true;
    paddle2.castShadow = true;	
	// paddle top 2
	paddleTop2 = new THREE.Mesh(
		new THREE.CylinderGeometry(
			paddletopBase,
			paddletopWidth,
			paddletopHeight,
			paddletopDepth,
			paddleQuality),
	  PaddleMaterial);
	  
	scene.add(paddleTop2);
	paddleTop2.rotation.x=55;
	  
	paddle1.position.x = -fieldWidth/2 + paddleWidth;
	paddle2.position.x = fieldWidth/2 - paddleWidth;
	
	paddleTop1.position.x = -fieldWidth/2 + paddleWidth;
	paddleTop2.position.x = fieldWidth/2 - paddleWidth;
	
	paddle1.position.z = paddleDepth;
	paddle2.position.z = paddleDepth;
	
	paddleTop1.position.z = paddleDepth +2;
	paddleTop2.position.z = paddleDepth +2;

	wall1 = new THREE.Mesh(
		new THREE.CubeGeometry( 
			fieldWidth,
			10,
			20,	
			paddleQuality,
			paddleQuality,
			paddleQuality),

		PaddleMaterial);

	scene.add(wall1);

//	wall1.position.z = fieldWidth;
	wall1.position.y = plane.position.y-105;
	wall1.position.x = plane.position.x;
	wall1.position.z = plane.position.z; 

	wall2 = new THREE.Mesh(
		new THREE.CubeGeometry( 
			fieldWidth,
			10,
			20,
			paddleQuality,
			paddleQuality,
			paddleQuality),

		PaddleMaterial);

	scene.add(wall2);

//	wall1.position.z = fieldWidth;
	wall2.position.y = plane.position.y+105;
	wall2.position.x = plane.position.x;
	wall2.position.z = plane.position.z; 
//	wall1.position.y = fieldWidth;

	// create a point light
	pointLight = new THREE.PointLight(0xFFFFFF);

	// set its position
	pointLight.position.x = -1000;
	pointLight.position.y = 0;
	pointLight.position.z = 1000;
	pointLight.intensity = 2;
	pointLight.distance = 10000;
	// add to the scene
	scene.add(pointLight);
		
    spotLight = new THREE.SpotLight(0xffffff);
    spotLight.position.set(0, 0, 460);
    spotLight.intensity = 3;
    spotLight.castShadow = true;
    scene.add(spotLight);
	
	renderer.shadowMapEnabled = true;
	
	for (var i = 0; i < 10; i++)
	{
		var backdrop = new THREE.Mesh(
			new THREE.TorusKnotGeometry( 
				32, 
				925, 
				32, 
				62, 
				32 ),
				
			backgroundMaterial);
			
		backdrop.rotation.z = i * (360 / 10) * Math.PI/180;
		scene.add(backdrop);	
	}
	
	score1 = 0;
	score2 = 0;
	
	draw();
}

var time = 0;

function draw()
{	
	time++;	
	renderer.render(scene, camera);
	requestAnimationFrame(draw);
	
	ballPhysics();
	paddlePhysics();
	playerPaddleMovement();
	opponentPaddleMovement();
	
	cameraPhysics();
}

function ballPhysics()
{
	
	// if puck hits off the wall near the player
	if(ball.position.x <= -fieldWidth/2 && (ball.position.y <=  100 && ball.position.y >= 30 || 
			ball.position.y <= -30 && ball.position.y >= -100))
	{	
		ballDirX = -ballDirX;
	}
	// if puck goes through the goal post near the player 
	else if(ball.position.x <= -fieldWidth/2 && ball.position.y < 30 && ball.position.y > -30)
	{
		score2++;
		document.getElementById("scores").innerHTML = score1 + "-" + score2;
		if(score2 == 7){
			alert("You lost, try to be better buddy");
			location.reload();
			// break;
		}
		resetBall(2);
	}
	
	// if puck hits off the wall near the CPU
	if(ball.position.x >=  fieldWidth/2 && (ball.position.y <=  100 && ball.position.y >= 30 || 
			ball.position.y <= -30 && ball.position.y >= -100))
	{	
		ballDirX = -ballDirX;
	}
	// if puck goes through the goal post near the CPU 
	else if(ball.position.x >= fieldWidth/2 && ball.position.y < 30 && ball.position.y > -30)
	{
		score1++;
		document.getElementById("scores").innerHTML = score1 + "-" + score2;
		if(score1 == 7){
			alert("You did it, Your going to the State Championship Game");
			location.reload();
			// break;
		}
		resetBall(2);
	}
	
	// if ball hits right wall
	if (ball.position.y <= -fieldHeight/2)
	{
		ballDirY = -ballDirY;
	}
	
	// if ball hits left wall
	if (ball.position.y >= fieldHeight/2)
	{
		ballDirY = -ballDirY;
	}
	
	ball.position.x += ballDirX * ballSpeed;
	ball.position.y += ballDirY * ballSpeed;
	
	
	if (ballDirY > 2.2 || ballDirY < -2.2)
	{
		tempCount = tempCount - .5
		if(tempCount > 0)
			ball.position.z += .5;
		if(tempCount < 0)
		{
			ball.position.z = ball.position.z - .5;
			if(ball.position.z < 5/2)
			{
				tempCount = 7;
				if(ballDirY > 0)
					ballDirY = Math.random() * (3.4 - 1.5) + 1.5;
				else
					ballDirY = Math.random() * (-1.5 - (-3.4)) + (-3.4);
			}
		}
	}
	
	if (ballDirY > ballSpeed * 2)
	{
		ballDirY = ballSpeed * 2;
	}
	else if (ballDirY < -ballSpeed * 2)
	{
		ballDirY = -ballSpeed * 2;
	}
}

function opponentPaddleMovement()
{
	// Lerp towards the ball on the y plane
	paddle2DirY = (ball.position.y - paddle2.position.y) * difficulty;
	paddleTop2DirY = (ball.position.y - paddleTop2.position.y) * difficulty;
	
	// in case the Lerp function produces a value above max paddle speed, we clamp it
	if (Math.abs(paddle2DirY) <= paddleSpeed)
	{	
		paddle2.position.y += paddle2DirY;
		paddleTop2.position.y += paddleTop2DirY;
	}
	else
	{
		// if set at 1.8 it is unbeatable
		// try to find a decent number to set it at,
		// so it catches most unless it is hit real hard
		if (paddle2DirY > paddleSpeed)
		{
			paddle2.position.y += paddleSpeed + difficulty;
			paddleTop2.position.y += paddleSpeed + difficulty;
		}
		else if (paddle2DirY < -paddleSpeed)
		{
			paddle2.position.y -= paddleSpeed + difficulty;
			paddleTop2.position.y -= paddleSpeed + difficulty;
		}
	}
}

function playerPaddleMovement()
{
	// move left
	if (Key.isDown(Key.A))		
	{
		if (paddle1.position.y < fieldHeight * 0.45)
		{
			paddle1DirY = paddleSpeed * 0.7;
			paddleTop1DirY = paddleSpeed * -0.7;	
		}
		else
		{
			paddle1DirY = 0;
			paddleTop1DirY = 0;
		}
		paddleTop1.position.y -= paddleTop1DirY;
	}	
	// move right
	else if (Key.isDown(Key.D))
	{
		if (paddle1.position.y > -fieldHeight * 0.45)
		{
			paddle1DirY = -paddleSpeed * 0.7;
			paddleTop1DirY = -paddleSpeed * 0.7;
		}
		else
		{
			paddle1DirY = 0;
			paddleTop1DirY = 0;
		}
		paddleTop1.position.y += paddleTop1DirY;
	}
	
	// Under construction
	// move forward
	/*
	else if (Key.isDown(Key.W))
	{
		if(paddle1DirX.position.x < fieldWidth * 0.45)
			paddle1DirX = paddleSpeed *.5;
		else
		{
			paddle1DirX = 0;
			paddle1.scale.
		}
		
	}
	*/
	// add space button for a "power hit"
	//else if(Key.isDown(Key.SPACE))
		
	
	// else don't move paddle
	else
	{
		paddle1DirY = 0;
		paddleTop1DirY = 0;
	}
	
	paddle1.scale.z += (1 - paddle1.scale.z) * 0.2;
	
	paddle1.position.y += paddle1DirY;
}

function cameraPhysics()
{
	// move to behind the player's paddle
	camera.position.x = paddle1.position.x - 125;
	camera.position.y = paddle1.position.y;
	camera.position.z = paddle1.position.z + 100;
	
	// rotate to face towards the opponent
	camera.rotation.y = -60 * Math.PI/180;
	camera.rotation.z = -90 * Math.PI/180;
}

function paddlePhysics()
{
	// PLAYER PADDLE LOGIC
	
	// if ball is aligned with paddle1 on x plane
	if (ball.position.x <= paddle1.position.x + paddleWidth
		&&  ball.position.x >= paddle1.position.x)
	{
		// and if ball is aligned with paddle1 on y plane
		if (ball.position.y <= paddle1.position.y + paddleHeight/2
			&&  ball.position.y >= paddle1.position.y - paddleHeight/2)
		{
			// and if ball is travelling towards player (-ve direction)
			if (ballDirX < 0)
			{
				ballDirX = -ballDirX;
				if (paddle1DirY > 0.5)
				{
					ballDirY -= paddle1DirY * 0.7;
				}
			}
		}
	}
	
	// OPPONENT PADDLE LOGIC	
	
	// if ball is aligned with paddle2 on x plane
	if (ball.position.x <= paddle2.position.x + paddleWidth
		&&  ball.position.x >= paddle2.position.x)
	{
		// and if ball is aligned with paddle2 on y plane
		if (ball.position.y <= paddle2.position.y + paddleHeight/2
			&&  ball.position.y >= paddle2.position.y - paddleHeight/2)
		{
			// and if ball is travelling towards opponent (+ve direction)
			if (ballDirX > 0)
			{
				ballDirX = -ballDirX;
				if (paddle2DirY > 0.5)
				{
					ballDirY -= paddle2DirY * 0.7;
				}
			}
		}
	}
}

function resetBall(loser)
{
	ball.position.x = 0;
	ball.position.y = 0;
	if (loser == 1)
	{
		ballDirX = 1;
	}
	else
	{
		ballDirX = -1;
	}
	ballDirY = 1;
}