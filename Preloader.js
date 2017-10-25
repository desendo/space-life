/* global SpaceLifeGame */
(function(SpaceLifeGame) {
  //  'use strict';
    SpaceLifeGame.Preloader = function () {


        this.preloadBar = null;

        this.ready = false;


    };



    SpaceLifeGame.Preloader.prototype = {

        startNewGame: function () {

            this.state.start('MainState');
        },
        continueGame: function () {
            this.game.continue = true;
            this.state.start('MainState');

        },
        MainMenu: function (game) {

            var h=64;
            var w=192;
            var hs=32;
            var lw = 2;
            var cx = game.camera.width/2;
            var cy = game.camera.height/2;

            var gr = game.add.graphics(0,0);
            gr.lineStyle(lw,"0xDDDDDD");
            gr.beginFill('0xFFFFFF',0);
            gr.drawRect(0,0,w-lw,h-lw);

            gr.lineStyle(2,"0xEDEDED");
            gr.beginFill("0x"+"#78a2d0".slice(1, 7),0.9);
            gr.drawRect(0,h+lw,w-lw,h-lw);
            var texture = gr.generateTexture();
            game.cache.addSpriteSheet('menubuttons', null, texture.baseTexture.source, w, h, 2,0,lw);



            this.newgame = game.add.button(cx,cy-hs,'menubuttons',this.startNewGame,this,1,0,1,0);
            this.newgame.events.onInputOut.add(function () {arguments[0].children[0].fill ="#ffffff";},this);
            this.newgame.events.onInputOver.add(function () {arguments[0].children[0].fill ="#000000";});
            this.newgame.anchor.set(0.5);


            this.newgameT = game.add.text(0,0,T[lang].newgame,menu);
            this.newgameT.anchor.set(0.5);
            this.newgameT.fixedToCamera = true;
            this.newgame.addChild(this.newgameT);
            this.newgame.fixedToCamera = true;

            if(JSON.parse(localStorage.getItem("savegame"))!==null) {
                this.continuegame = game.add.button(cx, cy + hs + 10, 'menubuttons', this.startNewGame, this, 1, 0, 1, 0);
                this.continuegame.events.onInputOut.add(function () {
                    arguments[0].children[0].fill = "#ffffff";
                }, this);
                this.continuegame.events.onInputOver.add(function () {
                    arguments[0].children[0].fill = "#000000";
                });
                this.continuegame.anchor.set(0.5);


                this.continuegameT = game.add.text(0, 0, T[lang].continuegame, menu);
                this.continuegameT.anchor.set(0.5);
                this.continuegameT.fixedToCamera = true;
                this.continuegame.addChild(this.continuegameT);
                this.continuegame.fixedToCamera = true;
            }

            gr.destroy();

        },

        preload: function () {

            this.game.time.advancedTiming = true;

            this.preloadBar = this.add.sprite(0, 400, 'preloaderBar');

            this.load.setPreloadSprite(this.preloadBar);

            this.load.image('background_intro', assets+'background_intro.png');

            this.load.spritesheet('ship1',assets+'sprite_ship1.png',32,32,9,0,0);
            this.load.spritesheet('ship0',assets+'ship0.png',32,32,4,0,0);

            this.load.spritesheet('grahem',assets+'grahem4.png',32,32,4,0,0);
            this.load.spritesheet('grahemdamages',assets+'grahemdamages.png',32,32,6,0,0);
            this.load.spritesheet('shipButton',assets+'shipButtons.png',48,16,16,0,0);
            this.load.spritesheet('pilotback',assets+'pilotback.png',32,32,6,0,0);
            this.load.spritesheet('sidethrust1',assets+'side_thrust1.png',5,5,5,0,0);
            this.load.spritesheet('asteroids1',assets+'asteroids1.png',32,32,8,0,0);
            this.load.spritesheet('buttons',assets+'buttons.png',75,25,9);
            this.load.image('button',assets+'button.png');
            this.load.spritesheet('button1',assets+'button1.png',96,32,3);

            this.load.image('planet',assets+'sprite_planet.png');
            this.load.image('laser',assets+'laser.png');
            this.load.image('rock',assets+'rock.png');
            this.load.image('part',assets+'part.png');

            this.load.spritesheet('lasers',assets+'lasers.png',16,16,3,0,0);
            this.load.spritesheet('engines',assets+'engines.png',16,16,3,0,0);
            this.load.spritesheet('generators',assets+'PowerGenerator.png',16,16,1,0,0);
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
            // this.changelog = this.game.add.text(20,40,SpaceLifeGame.changelog, fontLeft);
            // this.changelog.anchor.set(0);

            this.gameName = this.game.add.text(this.game.camera.width/2,this.game.camera.height/2-200,"Косможизнь", fontMenu1);
            this.gameName.anchor.set(0.5);
            this.counter = 0;



            // this.gamePressToStart = this.game.add.text(this.game.camera.width,this.game.camera.height-60,"нажмите W чтобы начать", fontMenu2);

            // this.gamePressToStart2 = this.game.add.text(this.game.camera.width,this.game.camera.height,"игру про космос", fontMenu2);
            // this.gamePressToStart2.anchor.set(1,1);
            // this.gamePressToStart.anchor.set(1,1);


            this.preloadBar.cropEnabled = false;
            this.preloadBar.visible = false;
            this.ready = true;
            if (Notification.permission !== "granted") {

                sendNotification('Уведомления', { body: 'Вы разрешили уведомления. Теперь различные игровые события будут выводится через них.',icon: 'favicon-16x16.png', dir: 'auto' });
            }
            this.mainMenu = this.MainMenu(this.game);

        },


        update: function () {

            if(!this.textupdated)
            {
                this.newgameT.text+=" ";
                this.newgameT.text=this.newgameT.text.trim();
                this.textupdated = true;
            }
            // if(this.counter >30)
            // {
            //     this.gamePressToStart.visible = !this.gamePressToStart.visible;
            //     this.counter = 0;
            // }
            // else
            //     this.counter++;
            //
            //
            // if(this.game.input.keyboard.isDown(Phaser.KeyCode.W))
            // {
            //              this.state.start('MainState');
            //
            // }

        },
        render: function () {


        }

    };
})(SpaceLifeGame);