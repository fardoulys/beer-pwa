// module aliases
var Engine = Matter.Engine;
var Body = Matter.Body;
// Render = Matter.Render,
var World = Matter.World;
var Bodies = Matter.Bodies;

// create an engine
var engine;
var world;
var dropplets = [];
var left_wall,
  right_wall;

// liquid settings
var foam;
var foam_angle;
var directional_gx, directional_gy;
var pour_limit;
var opposite, adjacent;

// gravity
var gx = 0,
  gy = 0;
var rot;
var magic_constant = 6.2452399669;
// console.log(ww + ' ' + wh);
var max = 180;
var min = 40;
var numDroplets = Math.random() * (max - min) + min;
var beer, glass, foamimg, opening, glug;

// preload sound and camera
function preload() {
  beer = loadImage("./images/beers/texture1.png");
  glass = loadImage("./images/beers/glass.jpg");
  foamimg = loadImage("./images/beers/foam.jpg");
  opening = loadSound("./sound/opening.mp3");
  glug = loadSound("./sound/glug.mp3");
}

function glugStart() {
  if (glug.isPlaying()) { // .isPlaying() returns a boolean
    glug.stop();
  } else {
    glug.play();
  }
}

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
  opening.play();

  // create engine
  engine = Engine.create();

  world = engine.world;

  // run engine
  Engine.run(engine);


  // foam and walls
  left_wall = Bodies.rectangle(-width / 2 - 50, 0, 100, height, {
    isStatic: true
  });
  right_wall = Bodies.rectangle(width / 2 + 50, 0, 100, height, {
    isStatic: true
  });
  bottom_wall = Bodies.rectangle(0, height / 2 + 100, width, 100, {
    isStatic: true
  });
  foam = Bodies.rectangle(0, 0, 1500, 50, {
    isStatic: true
  });

  // for(var i = 0; i < 200; i++){
  //   dropplets.push(new Dropplet(300, 10, drop_r));
  // }

  World.add(world, [foam, bottom_wall, left_wall, right_wall]);

  for (var i = 0; i < numDroplets; i++) {
    dropplets.push(new Dropplet(0, -height / 2 + 10));
  }

}


// function mouseDragged() {
//   dropplets.push(new Dropplet(mouseX, mouseY, drop_r));
// }

function draw() {
  background(80);

  // update foam bubbles
  for (var i = 0; i < dropplets.length; i++) {
    dropplets[i].show();
    if (gx > 1) {
      directional_gx = 0.0001;
    } else if (gx < -1) {
      directional_gx = -0.0001;
    } else {
      directional_gx = 0;
    }
    if (gx > 1) {
      directional_gy = -0.00019;
    } else if (gx < -1) {
      directional_gy = -0.00019;
    } else {
      directional_gy = 0;
    }
    dropplets[i].relate_gravity(directional_gx, directional_gy); // make dropplet gravity relative to angle of liquid
  }

  // lower liquid level if the tilt is past the top corners
  opposite = (height / 2 + foam.position.y - 25);
  adjacent = (width / 2);

  pour_limit = Math.atan(opposite / adjacent);

  // update foam angle
  if (gx < -9.3 || gx > 9.3) {
    foam_angle = -(gx / magic_constant);
  } else {
    foam_angle = -1 * ((gx - (0.6 * (gx / 2))) / magic_constant); // don't touch this line, it is actual magic pls just leave it be...
  }
  // Body.setAngle(foam, -foam_angle);
  if (foam.angle < -pour_limit) {
    Body.translate(foam, {
      x: 0.5,
      y: 0.5
    });
    //glug.play();
  } else if (foam.angle > pour_limit) {
    Body.translate(foam, {
      x: -0.5,
      y: 0.5
    });
  }
  if (foam.angle < 0.01 && foam.angle > -0.01) {
    Body.setPosition(foam, {
      x: 0,
      y: foam.position.y
    });
    glugStart();
  }

  if (foam.angle < foam_angle) {
    Body.rotate(foam, 0.015);


  } else if (foam.angle > foam_angle) {
    Body.rotate(foam, -0.015);


  }
  push();
  translate(foam.position.x, foam.position.y);
  rotate(foam.angle);
  rectMode(CENTER);
  texture(beer);

  rect(0, 475, 5000, 1000);
  pop();


}


function gyroCallBack(data) {
  // gyroData = data;
  gx = data.dm.gx;
  gy = data.dm.gy;
  // $('.x').html("gx " + gx);
  // $('.y').html("gy " + gy);
}