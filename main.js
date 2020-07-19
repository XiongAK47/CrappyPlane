破烂小飞机-Js


var w = c.canvas.width;
var h = c.canvas.height;
var state = 0;

//
var scolor = 200;

var booms = [];
function boomDraw(){
  for(var i = 0;i<booms.length;i++){
    booms[i].draw();
  }
}
function boomspush(x,y){
  booms.push(new boom(x,y));
}
function boomChange(){
  for(var i = 0;i<booms.length;i++){
    booms[i].changeSize();
  }
}
function boomDel(){
  for(var i = 0;i<booms.length;i++){
    if(booms[i].size<=0){
      booms.splice(i,1);
    }
  }
}
function boom(x,y){
  
  this.size = 0;
  this.sizeup = true;
  
  this.changeSize = function(){
  if(this.size<30&&this.sizeup===true){
  this.size+=4;
  }
  if(this.size>=30){
    this.sizeup = false;
  }
  if(this.sizeup===false){
    this.size--;
    }
  };
  this.x = x;
  this.y = y;
  this.dx = [];
  this.dy = [];
  for(var i = 0;i<6;i++){
    this.dx[i] = Math.random()*50;
    this.dy[i] = Math.random()*50;    
  }
  
  this.draw = function(){
    for(var i=0;i<6;i++){
      c.save();
      c.translate(this.x+this.dx[i],this.y+this.dy[i]);
    c.beginPath();
 c.arc(0,0,this.size,0,2*Math.PI);
      var ds2 = this.size*10%255;
    c.fillStyle = "rgba(255,"+ds2+",0,0.7)";
    c.fill();
    c.restore();   
      }
    };
}


/*function partical(boom){
  this.bm = boom;
   this.x = boom.x;
   this.y = boom.y;
  
}*/



function start(){
  
  this.color = scolor%255;
  this.r = this.color*1%255;
  this.g = this.color*2%255;
  this.b = this.color*3%255;
  

  
  c.font = '24pt sans-serif';
  
  var xstart = Math.abs(w/2-15-mouse.x);
  var ystart = Math.abs(h/2-10-mouse.y);
  if(ystart<17.5&&xstart<65){
    c.fillStyle = "green";
  }
  c.strokeRect(w/2-80,h/2-20,130,35);
  c.fillText("打赏作者",w/2-80,h/2+10);
  c.fillStyle = "black";
  
  var xpay = Math.abs(w/2-15-mouse.x);
  var ypay = Math.abs(h/2+45-mouse.y); 
  
  if(ypay<17.5&&xpay<65){
    c.fillStyle = "green";
    if(isMouseDown === true){
      state = 1;
    }
    
  }
  c.strokeRect(w/2-80,h/2+30,130,35);
  c.fillText("开始游戏",w/2-80,h/2+60);
  c.fillStyle = "black";
  
  c.font = '42pt sans-serif';

  c.fillStyle = "rgba("+this.r+","+this.g+","+this.b+",1)";
  c.fillText("飞机大战",w/2-130,h/2-120);
  
  c.fillStyle = "black";
  c.font = '8pt sans-serif';
}

var missiles = [];
var fires = [];
function firesDraw(){
  for(var i=0;i<fires.length;i++){
    fires[i].draw();
    if(fires[i].size-1>0){
      fires[i].sizeChange();
    }else{
      fires.splice(i,1);
    }
  }
}
function fire(x,y){
  this.size = 10;
  this.time = 0;
  this.sizeChange = function(){
    if(this.time%4===0){
      this.size--;
    }
    this.time++;
  };
  this.draw = function(){
  c.beginPath();
  this.ds2 = this.size*10%255;
  c.fillStyle = "rgba(255,"+this.ds2+",0,0.7)";
  c.arc(x,y,this.size,0,Math.PI*2);
  c.fill();
  };
  
}
function missile(x,y,em){
  
  this.x = x;
  this.y = y;
  this.die = false;
  this.time = 0;
  
  this.fires = [];
  this.detect = function(){
    this.em = em;
		this.aimx = em.x;
		this.aimy = em.y;
		this.dx = -(this.x - this.aimx)/20;    
		this.dy = -(this.y - this.aimy)/20;
    this.x+=this.dx;
    this.y+=this.dy;
    this.a = -Math.atan(this.dx/this.dy);
    if(this.time%4===0){
      fires.push(new fire(this.x,this.y,10));
      
    }
    if(this.dx>0&&this.dy>0){
      this.a+=Math.PI;
    }
    if(this.dx<0&&this.dy>0){
      this.a+=Math.PI;
    }
    this.time++;
   };
  this.draw = function(){
    
    c.save(); 
    c.beginPath();
    c.translate(this.x,this.y);
    c.rotate(this.a);

    c.moveTo(0,-30);
    c.lineTo(-5,-20);
    c.lineTo(-5,0);
		c.lineTo(5,0);
		c.lineTo(5,-20);
		c.lineTo(0,-30);
		c.fill();
		c.fillStyle = "red";
		c.fillRect(-5,-20,10,10);
		c.fillStyle = "black";

		c.beginPath();
		c.moveTo(-5,0);
    c.lineTo(-2,5);
    c.lineTo(2,5);
    c.lineTo(5,0);
    c.fill();
    c.restore();
  };
}
function missilesDraw(){
  for(var i = 0;i<missiles.length;i++){
    missiles[i].draw();
  }
}

function missilesDet(){
  for(var i = 0;i<missiles.length;i++){
    if(missiles[i].die === false){
    missiles[i].detect();
    }else{
      missiles.splice(i,1);
    }
  }
}

function missilesSelect(){
  if(enemies.length>0){
  this.num = 0;
  
  this.cx = w;
  this.cy = h;
//坐标原点  
  this.zx = mouse.x;
  this.zy = mouse.y; 
  
  for(var i = 0;i<enemies.length;i++){
    this.x = enemies[i].x;
    this.y = enemies[i].y;
  //距离
    this.sx = this.zx-this.x;
    this.sy = this.zy-this.y;
    this.cox = this.zx-this.cx;
    this.coy = this.zy-this.cy;
  //距离平方
    this.sxs = this.sx * this.sx;
    this.sys = this.sy * this.sy;
    this.csx = this.cox*this.cox;
    this.csy = this.coy*this.coy;
  //相加
    this.ss = this.sxs+this.sys;
    this.cs = this.csx+this.csy;
    
    if(this.ss<=this.cs){
      this.cx = this.sx;
      this.cy = this.sy;
      this.num = i;
    }
  }
  missiles.push(new missile(this.zx,this.zy,enemies[this.num]));                         
 }
}
//子弹----------------------------------------------
var bullets = [];
function bullet(pl){
  
  this.dy = 10; 
  this.plane = pl;
  this.x = pl.x+17;
  this.y = pl.y-11;
  this.die = false;
  this.dying = function(){
    this.die = true;
  };
  this.draw = function(){
    var dc = 255-score/50%255;
    c.fillStyle = "rgba(255,"+dc+",0,1)";
    c.save();
    c.translate(this.x,this.y);
    c.fillRect(0,0,2,4);
    c.fillRect(23,0,2,4);
    c.restore();
  
  };
  this.move = function(){ 
    if(this.y-this.dy >= 0&&this.die!==true){
      this.y -= this.dy;
    }else{
      this.dying();
    }
  };
}

//绘制子弹-------------------------------------------
function bulletsDraw(pl){
  for(var i = 0;i < bullets.length;i++){
    bullets[i].draw();
  }
}
//移动子弹-------------------------------------------
function bulletsMove(){
  for(var i = 0;i < bullets.length;i++){
    bullets[i].move();
  }
}
//子弹删除-------------------------------------------
function bulletsDel(){
  for(var i = 0;i < bullets.length;i++){
    if (bullets[i].y > h || bullets[i].die===true){
      bullets.splice(i,1);
    }
  }
}

var live;
var score;
var level;
var diy;
function Start(){
 live = 100;
 score = 0;
 level = 100;
 diy = 1;
}

function world(){
 diy = score/100;
}

var fireSpace = 0;//开火间隔
function Plane(x,y){

  this.fireSpace =fireSpace;//开火间隔
  this.level  = level;//飞机等级
  this.die = false;
  this.live = live;
  this.score = score;
  this.dying = function(){
    if(this.live <= 0){
      this.die = true;
    }
  };
  this.levelUp = function(){
    /*if(this.score/10>1){
      this.score = this.score/10;
      this.level++;
    }
    level= this.level;*/
  };
  
  this.draw = function(){
    if(this.die === false){
    this.x = x;
    this.y = y;
      c.save();
      c.translate(this.x,this.y);
//画飞机--------------------------------------------    
	c.beginPath();
	c.moveTo(0,0);
	c.lineTo(60,0);
	c.lineTo(50,-10);
	c.lineTo(10,-10);
	c.lineTo(0,0);
  c.fillStyle= "rgba(0,99,19,1)";
	c.fill();
  c.fillStyle= "black";
	c.fillRect(15,-11,5,1);
	c.fillRect(38,-11,5,1);
  
  c.fillStyle= "rgba(0,99,19,1)";

	c.fillRect(25,-20,8,40);
	c.fillRect(14,20,30,5);
	c.fillStyle= "black";
  c.strokeRect(0,-35,60,5);
    if(this.live>60){
  c.fillStyle = "green";
    }
    if(this.live<=60&&this.live>50){
  c.fillStyle = "yellow";
    }
    if(this.live<=50&&this.live>40){
  c.fillStyle = "orange";
    }
    if(this.live<=40&&this.live>0){
  c.fillStyle = "red";
    }
  c.fillRect(0,-35,this.live/10*6,5);
  c.fillStyle= "black";
  c.restore();
  if(isMouseDown === true){
       c.fillStyle = "red";
       c.fillText("Firing",10,30);
       c.fillStyle = "black";
     }
    c.fillText("PlaneLocation: "+mouse.x+","+mouse.y+"",w-110, 10); 
      c.fillText("Score: "+score+"",w-110, 50); 
    c.fillText("live: "+this.live+"",10, 10);
    c.fillText("level: "+level+"",10, 20);
      
  }
  };
// 开火---------------------------------------------
  this.fire = function(){
    if(isMouseDown===true&&this.fireSpace%4===0){
      for(var i = 0;i<=2;i++){
      bullets.push(new bullet(this));     
    }
  }   
    fireSpace++;
 };
  this.missile = function(){
    if(spaceDown===true&&this.fireSpace%10===0){
        
       missilesSelect();
      
    }
  };
}

//敌人---------------------------------------------
var enemies=[];

function detecting(){
  var dl = score/2+50;
  for(var i = 0;i < enemies.length;i++){
    var y1 = Math.abs(enemies[i].y-mouse.y);
    var x1 = Math.abs(enemies[i].x-mouse.x); 
    if(y1<10&&x1<60){ 
      live -= 10;
      enemies[i].live=0;
    }
    for(var j1 = 0;j1<bullets.length;j1++){
      var y2 = Math.abs(enemies[i].y-bullets[j1].y);
      var x2 = Math.abs(enemies[i].x-bullets[j1].x);     
      if(y2<4&&x2<60){
        bullets[j1].dying();
        c.font = '24pt sans-serif';
      c.fillText("-"+dl+"",enemies[i].x,enemies[i].y-30);
        enemies[i].live-= dl;
        c.font = '8pt sans-serif';
      }
    }
    for(var j2 = 0;j2<missiles.length;j2++){
      var y3 = enemies[i].y-missiles[j2].y;
      var x3 = enemies[i].x-missiles[j2].x;
      var ya3 = Math.abs(y3);
      var xa3 = Math.abs(x3);
      if(ya3<30&&xa3<30){
         enemies[i].live=0;
         missiles[j2].die = true;
      }
        
    }
    
    if (enemies[i].live <= 0 ) {
      boomspush(enemies[i].x,enemies[i].y);
        // This plane is dead, so remove it from 
        // global array 
      var ds = (enemies[i].type+1)*100;
         score+=ds;
         enemies.splice(i,1);
         
    }
  }
}

function enemiesDraw(){
  for(var i = 0;i < enemies.length;i++){
   
    enemies[i].draw();
    
    
  }
}

function enemiesMove(){
  for(var i = 0;i < enemies.length;i++){
    if(enemies[i].y+enemies[i].dy*2<=h){
    enemies[i].move();
    }else{
      enemies.splice(i,1);
    }
  }
}

function enemiesSummon(){
    var dx = 10;
    this.dx = dx;
    for(var i = 0;i<5;i++){
      enemies.push(new enemy(this.dx));
      this.dx += 80;
    }
}

function enemy(startX){
  var sml = Math.random()*i/100;
  this.type = 0;
  if(sml>11){
    this.type =5;
    this.live = 500000;
  }
  if(sml<=11&&sml>9){
    this.type =4;
    this.live = 200000;
  }
  if(sml<=9&&sml>7){
    this.type =3;
    this.live = 50000;
  }
  if(sml<=7&&sml>5){
    this.type =2;
    this.live = 20000;
  }

  if(sml<=5&&sml>2){
    this.type =1;
    this.live = 10000;
  }

  if(sml<=2){
    this.live = 100;
  }

  this.liveLine = this.live/10;
  this.specialmove = 0;
  this.x = startX+30;
  this.drx = this.x-30;
  this.y = 0;
  this.dy = Math.random()*(i/100+1);
  this.t = Math.random();
  if(this.t>0.5){
  this.dx = Math.random();
  }else{
    this.dx = -Math.random();
  }
  this.die = false;
  this.dying = function(){
    this.die = true;
  };
  this.startX = startX;
  
//画飞机--------------------------------------------  
  this.draw = function(){
    c.save();
    c.translate(this.drx,this.y);
    
    c.beginPath();
    
		c.moveTo(0,0);
		c.lineTo(60,0);
		c.lineTo(50,10);
		c.lineTo(10,10);
		c.lineTo(0,0);
    if(this.type === 0){
    c.fillStyle= "green";
    }
    if(this.type == 5){
    c.fillStyle= "rgba(255,255,50,1)";
    }
    if(this.type == 4){
    c.fillStyle= "rgba(255,0,0,1)";
    }
    if(this.type == 3){
    c.fillStyle= "rgba(200,99,19,1)";
    }
    if(this.type == 2){
    c.fillStyle= "purple";
    }
    if(this.type == 1){
    c.fillStyle= "blue";
    }
		c.fill();
		c.fillRect(25,-20,8,40);
		c.fillRect(14,-20,30,5);
    c.fillStyle= "black";
		c.fillRect(15,11,5,1);
		c.fillRect(38,11,5,1);
    c.strokeRect(0,-35,60,5);
    c.fillStyle = "red";
    c.fillRect(0,-35,this.live/this.liveLine*6,5);
    c.restore();
    /*if(this.x+2>=w){
        this.spacialmove = 1;
      }*/
 };
//移动--------------------------------------------
  this.move = function(){
    if(this.y+this.dy<h&&this.die===false){
       this.y+=this.dy;
      if(this.x+this.dx+30>w&&this.x+this.dx-30<0){
        this.dx = -this.dx;
      }
       this.x+=this.dx;
       this.drx+=this.dx;
      //special move



    } // this.y includes the latest plane y
          
    if ( this.y + this.dy>= h){
      // delete this from global enemies[]
      this.die = true;
      this.life = 0;

    }
   };
}

function gameOver(){
  if(live<=0){
    state++;
  }
}

   
//检测鼠标------------------------------------------
var isMouseDown = false;
	c.canvas.onmousedown = 
  function(evt) { isMouseDown = true; };
	c.canvas.onmouseup = 
  function(evt) { isMouseDown = false; };

var mouse = {x: 0, y: 0};
	c.canvas.onmousemove = 
  function(evt) {
    mouse.x = evt.clientX;//鼠标x
    mouse.y = evt.clientY;//鼠标y
  };

//KEYBORD_SPACE DETECTING
var spaceDown = false;
document.onkeydown = keydown;
document.onkeyup = function(evt){ spaceDown = false;};

function keydown(evt){
evt = (evt) ? evt : event;
if (evt.keyCode) {
  if(evt.keyCode == 32){
     spaceDown = true; 
  }
 }
}

var cmTID;
var i = 0;
var timeStep0 = 20;
var timeStep1 = 20;//绘制时间差

function updateAll(){
  
  if(state === 0){
    scolor++;
    c.clearRect(0,0,w,h);
    start();
     editionPaint();
     clearTimeout(cmTID);
     cmTID = setTimeout(updateAll, timeStep0); 
  }
  
  if(state == 1){
  var dp = new Plane(mouse.x-25,mouse.y);
  i++;
  world();
  c.clearRect(0,0,w,h);
  //c.fillRect(0,0,w,h);
  ////监测程序
  c.fillStyle = "black";
  c.fillText("敌人数量："+enemies.length+"",w-80,20);
  c.fillText("子弹数量："+bullets.length+"",w-80,30);
  c.fillText("游戏时间："+i/50+"",w-80,40);
  
  //飞机	
  dp.draw();
  dp.fire();
  dp.missile();
  dp.levelUp();
  //子弹
  bulletsDraw(dp);  
  bulletsMove();
  bulletsDel();
  detecting();
    
  missilesDraw();
  missilesDet();
  //敌人
  if(i%50===0){//出现频率
  enemiesSummon();
  }
  enemiesMove();
  enemiesDraw();
  
  
    boomDraw();
    boomChange();
    boomDel();
    
    firesDraw();    
   gameOver();

    editionPaint();
  clearTimeout(cmTID);
  cmTID = setTimeout(updateAll, timeStep1); 
    if(state == 2){
  
    c.font = '48pt sans-serif';
    //c.textAlign = 'center';
    c.fillText("你失败了",w/2-150,h/2);
    c.font = '24pt sans-serif';
    c.fillText("敌人数量："+enemies.length+"",w/2-80,h/2-100);
    c.fillText("子弹数量："+bullets.length+"",w/2-80,h/2-50);
    c.fillText("游戏时间："+i/50+"",w/2-80,h/2-150);
       editionPaint();
   }
  }
}

function editionPaint(){
  var e1 = 3;
  var e2 = 1;
  var e3 = 4;
  c.font = '10pt sans-serif';
  c.fillStyle = "black";
  c.fillText("v"+e1+"."+e2+"."+e3+"",w-60,h-10);
  c.font = '8pt sans-serif';
}
Start();

updateAll();

