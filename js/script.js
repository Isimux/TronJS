'use strict';


$(document).ready(function () {
	
	//Variable game qui contient tout les attribues du jeux
    var game = {};

    //Deux variable pour la largeur et la longeur du Canavas 
    game.width = 600;
    game.height = 600;

    //Tableau pour listes les touches pressé
    game.keys = [];

    //Période pour l'incrémentation de la vitesse
    game.speedstep = 5000;

    //Limite de la vitesse du joueur
    game.maxspeed = 10;

    //Variable Qui contient les attribues du joueur
    game.player = {
        x: game.width / 2 - 50,
        y: 5,
        width: 5,
        height: 5,
        speed: 2,
        rendered: false,
        keypressed: false,
        lastspeedstep: false,
        trace: []
    };

    //Référence des élément HTML
    game.contextBackground = document.getElementById("backgroundCanvas").getContext("2d");
    game.contextPlayer = document.getElementById("playerCanavas").getContext("2d");
    
	/*
	* Fonctions JQuerry liée au evenement des touches
    */
	$(document).keydown(function (e) {
        game.keys[(e.keyCode && e.keyCode) || e.which] = true;
    });
    $(document).keyup(function (e) {
        delete game.keys[(e.keyCode && e.keyCode) || e.which];
    });

    /*
	 * Fonction qui contient la logique de jeux
    */
    
    /*
    * up = 38
    * down = 40
    * left = 37
    * right = 39
    */
    function update() {
        if (game.keys[37] && (game.player.keypressed !== 39)) {
            game.player.keypressed = 37;
        }
        if (game.keys[39]&& (game.player.keypressed !== 37)) {
            game.player.keypressed = 39;
        }
        if (game.keys[38]&& (game.player.keypressed !== 40)) {
            game.player.keypressed = 38;
        }
        if (game.keys[40]&& (game.player.keypressed !== 38)) {
            game.player.keypressed = 40;
        }
        //////////////////////////////

        if (game.player.keypressed) {
            if (!game.player.lastspeedstep) {
                game.player.lastspeedstep = new Date();
            }
            
            if (game.player.keypressed === 37) {
                if (game.player.x > 5) {
                    game.player.x -= game.player.speed;
                    game.player.rendered = false;
                }
            }
            if (game.player.keypressed === 39) {
                if (game.player.x < game.width - game.player.width - 5) {
                    game.player.x += game.player.speed;
                    game.player.rendered = false;
                }
            }
            if (game.player.keypressed === 38) {
                if (game.player.y > 5) {
                    game.player.y -= game.player.speed;
                    game.player.rendered = false;
                }
                else { game.player.y = 5; }
            }
            if (game.player.keypressed === 40) {
                if (game.player.y < game.height - game.player.height - 5) {
                    game.player.y += game.player.speed;
                    game.player.rendered = false;
                }
                else { game.player.y = game.height - game.player.height - 5; }
            }
            
            //position checking
            if(game.player.x < 5) game.player.x = 5;
            else if (game.player.x > game.width - game.player.width - 5) { game.player.x = game.width - game.player.width - 5; }
            else if (game.player.y < 5) { game.player.y = 5; }
            else if (game.player.y > game.height - game.player.height - 5) { game.player.y = game.height - game.player.height - 5; }
            
            //check collision
            var collision = (function(arr, player) {
                var col = false;                
                for (var i=0; i < arr.length-1; i++) {
                    col = !(
                        ( ( player.y + player.height ) < ( arr[i].y ) ) ||
                        ( player.y > ( arr[i].y + player.height ) ) ||
                        ( ( player.x + player.width ) < arr[i].x ) ||
                        ( player.x > ( arr[i].x + player.width ) )
                    );
                    if (col) return true;
                }
                return false;
            }(game.player.trace, game.player));
            console.log(collision);
            
            if (((new Date()) - game.player.lastspeedstep >= game.speedstep) && (game.player.speed < game.maxspeed)) {
                game.player.speed += 1;
                game.player.lastspeedstep = new Date();
            }
            
            //save the trace
            if(!game.player.trace.length || 
               ((Math.abs(game.player.x - game.player.trace[game.player.trace.length-1].x) >= game.player.width) ||
                (Math.abs(game.player.y - game.player.trace[game.player.trace.length-1].y) >= game.player.height))) {
                game.player.trace.push({x: game.player.x, y: game.player.y });
            }
        }
    }

    /*
	* Fonction de dessin sur le Canavas
    */
	function render() {

        game.contextPlayer.fillStyle = "white";
        if (!game.player.rendered) {
            game.contextPlayer.clearRect(0, 0, game.width, game.height);
            game.contextPlayer.fillRect(game.player.x, game.player.y, game.player.width, game.player.height);
            
            //render trace
            for(var i in game.player.trace) {
                game.contextPlayer.fillRect(game.player.trace[i].x, game.player.trace[i].y, game.player.width, game.player.height);
            }
            
            game.player.rendered = true;
            console.log("render...");
        }
    }

    /*
	* Fonction qui boucle l'exécution
    */
	function loop() {
        requestAnimFrame(function () {
            loop();
        });
        update();
        render();
    }

    /*
    * Fonction d'initalisation
    */
    (function init() {
        loop();
    }());

});

//Support de comatibilité des navigateurs
window.requestAnimFrame = (function () {
    return window.requestAnimationFrame ||
        window.webkitRequestAnimationFrame ||
        window.mozRequestAnimationFrame ||
        window.oRequestAnimationFrame ||
        window.msRequestAnimationFrame ||
        function (callback) {
            window.setTimeout(callback, 1000 / 30);
        };
}());