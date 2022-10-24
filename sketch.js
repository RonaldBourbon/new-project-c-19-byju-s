var mario,mario_running,mario_standing,mario_jumping;
var scenery,sceneryImg;
var obstacles,obstaclesImg;
var invisibleGround;
var gameOver,gameOverImg;
var restart,restartImg;
var music;
var score = 0;

var END = 0;
var PLAY = 1;

var gameState = PLAY;

var score = 0;

function preload() {
   mario_standing = loadAnimation("mario_standing.png");
   mario_running = loadAnimation("mario_standing.png","mario_walking.png");
   mario_jumping = loadAnimation("mario_jumping.png");
   sceneryImg = loadImage("background.png/background.png");
   obstaclesImg = loadImage("obstacle.png");
   gameOverImg = loadImage("gameOver.png");
   restartImg = loadImage("restart.png");
   music = loadSound("happyMusic.mp3");

}

function setup() {
   createCanvas(1294,647);

   scenery = createSprite(647,318.5,100,100);
   scenery.addImage(sceneryImg);
   scenery.scale = 2.5;

   obstaclesGroup = new Group();
   
   invisibleGround = createSprite(120,560,400,10);
   invisibleGround.visible = false;

   mario = createSprite(65,460);
   mario.addAnimation("mario",mario_running);
   mario.addAnimation("stopped_mario",mario_standing);
   mario.scale = 0.25;

   gameOver = createSprite(647,287);
   gameOver.addImage(gameOverImg);
   gameOver.visible = false;

   restart = createSprite(647,370);
   restart.addImage(restartImg);
   restart.visible = false;

   music.loop();
}

   function draw() {
   
   background("black");

   if(gameState === PLAY){
      //mover o chão
      scenery.velocityX = -4;
      //pontuação
      score = score + Math.round(getFrameRate()/60);
      
      if (scenery.x < 0){
        scenery.x = scenery.width/2;
      }
      
      //pular quando a tecla espaço é pressionada
      if(keyDown("space") && mario.y >=390) {
          mario.velocityY = -13;
      }
      
      //acrescentar gravidade
      mario.velocityY = mario.velocityY + 0.8

      //gerar obstáculos no chão
      spawnObstacles();
      
      if(obstaclesGroup.isTouching(mario)){
          gameState = END;
      }
    }
     else if (gameState === END) {
        scenery.velocityX = 0;

        obstaclesGroup.setLifetimeEach(-1);

        mario.velocityY = 0;

        mario.changeAnimation("stopped_mario",mario_standing);
       
        obstaclesGroup.setVelocityXEach(0);

        gameOver.visible = true;

        restart.visible = true;

       if(mousePressedOver(restart)) {
         reset();
       }
     }
   
    //impedir que mario caia
    mario.collide(invisibleGround); 
    invisibleGround.x = mario.x;

    drawSprites();

   textSize(30);
   text("Pontuação: " + score, 1000,80);
}

function spawnObstacles() {
   if (frameCount % 100 === 0){
     var obstacles = createSprite(1300,520,10,40);
     obstacles.velocityX = -6;

     obstacles.lifetime = 300;

     obstacles.addImage(obstaclesImg);
             
     obstacles.scale = 0.35;
    
     obstaclesGroup.add(obstacles);

     obstacles.setCollider("rectangle", 0, 0, 170, 170);
  }
}

function reset() {
   obstaclesGroup.destroyEach();
   gameState = PLAY;
   gameOver.visible = false;
   restart.visible = false;
   score = 0;
   mario.changeAnimation("mario",mario_running);
}