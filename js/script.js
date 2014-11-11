	$(document).ready(function(){
		var game={};
		game.width=600;
		game.height=600;

		game.keys = [];
		game.speedstep=5000;
		game.maxspeed=10;


			game.player = {
			x:game.width/2-50,
			y:5,
			width:5,
			height:5,
			speed:2,
			rendered:false,
			keypressed:false,
			lastspeedstep:false
		};
	
		game.contextBackground = document.getElementById("backgroundCanvas").getContext("2d");
		game.contextPlayer 	   = document.getElementById("playerCanavas").getContext("2d");
			$(document).keydown(function(e){
			game.keys[e.keyCode ? e.keyCode : e.which]=true;
		});
		$(document).keyup(function(e){
			delete game.keys[e.keyCode ? e.keyCode : e.which];
		});


		function init(){
			loop();
		}

		function update(){
			if(game.keys[37]){
				game.player.keypressed=37;
			}
			if(game.keys[39]){
				game.player.keypressed=39;
			}
			if(game.keys[38]){
				game.player.keypressed=38;
			}
            if(game.keys[40]){
				game.player.keypressed=40;
			}
			//////////////////////////////

			if(game.player.keypressed){
				if(!game.player.lastspeedstep)
					game.player.lastspeedstep=new Date();
				if(game.player.keypressed===37){
					if(game.player.x>5)
					game.player.x-=game.player.speed;
					game.player.rendered=false;
				}
				if(game.player.keypressed===39){
					if(game.player.x<game.width-game.player.width-5)
					game.player.x+=game.player.speed;
					game.player.rendered=false;
				}
				if(game.player.keypressed===38){
					if(game.player.y>5)
					game.player.y-=game.player.speed;
					game.player.rendered=false;
				}
	            if(game.player.keypressed===40){
					if(game.player.y<game.height-game.player.height-5)
					game.player.y+=game.player.speed;
					game.player.rendered=false;
				}
				if(((new Date()) - game.player.lastspeedstep >= game.speedstep)&&(game.player.speed<game.maxspeed)){
					game.player.speed++;
					game.player.lastspeedstep=new Date();
				}
			}
			console.log(game.player.speed);

		}
		function render(){
			
			game.contextPlayer.fillStyle = "white";
			if(!game.player.rendered)
			{	game.contextPlayer.clearRect(0,0,game.width,game.height);
				game.contextPlayer.fillRect(game.player.x,game.player.y,game.player.width,game.player.height);
				game.player.rendered=true;
			console.log("render...");
			}
		}
			function loop(){
			requestAnimFrame(function(){
				loop();
			});
			update();
			render();		
		}

		init();

	});

	window.requestAnimFrame = (function(){
  return  window.requestAnimationFrame       ||
          window.webkitRequestAnimationFrame ||
          window.mozRequestAnimationFrame    ||
          window.oRequestAnimationFrame    	 ||
          window.msRequestAnimationFrame     ||
          function( callback ){
            window.setTimeout(callback, 1000 / 60);
          };
})();