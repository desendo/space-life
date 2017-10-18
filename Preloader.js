/* global SpaceLifeGame */
(function(SpaceLifeGame) {
  //  'use strict';
    SpaceLifeGame.Preloader = function () {


        this.preloadBar = null;

        this.ready = false;

    };



    SpaceLifeGame.Preloader.prototype = {

        preload: function () {
            this.game.time.advancedTiming = true;

            this.preloadBar = this.add.sprite(0, 400, 'preloaderBar');

            this.load.setPreloadSprite(this.preloadBar);

            this.load.image('background_intro', assets+'background_intro.png');

            this.load.spritesheet('ship1',assets+'sprite_ship1.png',32,32,9,0,0);
            this.load.spritesheet('grahem',assets+'grahem4.png',32,32,4,0,0);
            this.load.spritesheet('grahemdamages',assets+'grahemdamages.png',32,32,6,0,0);
            this.load.spritesheet('shipButton',assets+'shipButtons.png',48,16,16,0,0);
            this.load.spritesheet('pilotback',assets+'pilotback.png',32,32,6,0,0);
            this.load.spritesheet('sidethrust1',assets+'side_thrust1.png',5,5,5,0,0);
            this.load.spritesheet('asteroids1',assets+'asteroids1.png',32,32,8,0,0);
            this.load.spritesheet('buttons',assets+'buttons.png',75,25,9);

            this.load.image('planet',assets+'sprite_planet.png');
            this.load.image('laser',assets+'laser.png');
            this.load.image('rock',assets+'rock.png');
            this.load.image('part',assets+'part.png');

            this.load.spritesheet('lasers',assets+'lasers.png',16,16,3,0,0);
            this.load.spritesheet('engines',assets+'engines.png',16,16,3,0,0);
            this.load.spritesheet('generators',assets+'PoweGenerator.png',16,16,1,0,0);
            this.load.spritesheet('capacitors',assets+'Capacitor.png',16,16,1,0,0);
            this.load.spritesheet('grabbers',assets+'Grabber.png',16,16,1,0,0);
            this.load.spritesheet('radars',assets+'Radar.png',16,16,1,0,0);

            this.load.image('starsBackground',assets+'sprite_stars.png');
            this.load.image('button',assets+'button.png');

            this.load.physics('shipShapesData', assets+'shipHullsShapes.json');





        },

        create: function () {

            if(document.getElementById("loading"))
                document.getElementById("loading").parentNode.removeChild(document.getElementById("loading"));//когда все загрузится


            this.version = this.game.add.text(20,0,SpaceLifeGame.version, fontLeft2);
            this.version.anchor.set(0);
            this.changelog = this.game.add.text(20,40,SpaceLifeGame.changelog, fontLeft);
            this.changelog.anchor.set(0);

            this.gameName = this.game.add.text(0,this.game.camera.height,"Косможизнь", fontMenu1);
            this.gameName.anchor.set(0,1);
            this.counter = 0;



            this.gamePressToStart = this.game.add.text(this.game.camera.width,this.game.camera.height-60,"нажмите W чтобы начать", fontMenu2);

            this.gamePressToStart2 = this.game.add.text(this.game.camera.width,this.game.camera.height,"игру про космос", fontMenu2);
            this.gamePressToStart2.anchor.set(1,1);
            this.gamePressToStart.anchor.set(1,1);


            this.preloadBar.cropEnabled = false;
            this.preloadBar.visible = false;
            this.ready = true;


        },


        update: function () {

            if(this.counter >30)
            {
                this.gamePressToStart.visible = !this.gamePressToStart.visible;
                this.counter = 0;
            }
            else
                this.counter++;


            if(this.game.input.keyboard.isDown(Phaser.KeyCode.W))
            {
                         this.state.start('MainState');

            }
            //	You don't actually need to do this, but I find it gives a much smoother game experience.
            //	Basically it will wait for our audio file to be decoded before proceeding to the MainMenu.
            //	You can jump right into the menu if you want and still play the music, but you'll have a few
            //	seconds of delay while the mp3 decodes - so if you need your music to be in-sync with your menu
            //	it's best to wait for it to decode here first, then carry on.

            //	If you don't have any music in your game then put the game.state.start line into the create function and delete
            //	the update function completely.

            //if (this.cache.isSoundDecoded('titleMusic') && this.ready == false)
            //{


            //}

        },
        render: function () {


        }

    };
})(SpaceLifeGame);