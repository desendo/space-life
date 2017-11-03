/**
 * Created by goblino on 08.10.2017.
 */
/* global Phaser */

var SpaceLifeGame = {
    version : "v "+"0.3.5.0",
    changelog:


    "0.3\nкуча всего лень писать\n" +
    "0.2.3.5\nинтерфейс переделан немного нарисованы кнопочки\n" +
    "" +
    "кровь пилота и кнопка меню" +
    "\n" +
    "0.2.3.3\n" +
    "добавлен пилот и его здоровье" +
    "\n" +

    "0.2.3.2\n" +
    "рефакторинг\n" +
    "\n" +
    "0.2.3.1\n" +
    "автоматическая ширина и высота игры\n" +
    "сделан экран загрузки и старта игры\n" +
    "устранены баги с перезаправкой\n" +
    "выпилен ресет\n",

    /* Here we've just got some global level vars that persist regardless of State swaps */
    score: 0,

    /* If the music in your game needs to play through-out a few State swaps, then you could reference it here */
    music: null,

    /* Your game can check BasicGame.orientated in internal loops to know if it should pause or not */
    orientated: false,

};


(function(SpaceLifeGame) {
    //'use strict';

    SpaceLifeGame.Boot = function (game) {
    };
    SpaceLifeGame.Boot.prototype = {

        preload: function () {
            this.game.canvas.oncontextmenu = function (e) { e.preventDefault(); }

            this.load.image('preloaderBar', assets+'loadingbar.png');
            //this.stage.backgroundColor = '#444';
            this.stage.backgroundColor = '#000';

        },

        create: function () {

            this.input.maxPointers = 1;
            this.stage.disableVisibilityChange = false;


            this.state.start('Preloader');

        },

        gameResized: function (width, height) {

            //  This could be handy if you need to do any extra processing if the game resizes.
            //  A resize could happen if for example swapping orientation on a device.

        },

        enterIncorrectOrientation: function () {

            SpaceLifeGame.orientated = false;

            document.getElementById('orientation').style.display = 'block';

        },

        leaveIncorrectOrientation: function () {

            SpaceLifeGame.orientated = true;

            document.getElementById('orientation').style.display = 'none';

        }

    };
})(SpaceLifeGame);