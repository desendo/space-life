/* global SpaceLifeGame */
(function(SpaceLifeGame) {
  //  'use strict';
    SpaceLifeGame.Preloader = function () {


        this.preloadBar = null;

        this.ready = false;


    };



    SpaceLifeGame.Preloader.prototype = {

        startNewGame: function () {
            this.game.isLoading = false;
            this.state.start('MainState');
        },
        continueGame: function () {
            if(localStorage.getItem('save-quicksave') !== null)
            {
                this.game.isLoading = true;
                this.game.saveGameKey = 'save-quicksave';
                this.state.start('MainState');
            }

        },
        SwitchLang: function()
        {
            var id = arguments[0].langid;
            localStorage.setItem('lang',id);
            location.reload();

        },
        LangSelect : function (game) {
            var centerx = game.camera.width/2;
            var centery = game.camera.height/2;
            var currentLang = localStorage.getItem('lang') || defaultLang;
            var shift = 0;

            for (var lang in T)
            {
                fontLeft.backgroundColor ="";

                if (T[lang].langid ===currentLang)
                {

                    fontLeft.backgroundColor ="rgba(255,255,255,0.5)";
                }


                var text1 = game.add.text(game.camera.width-40,shift,T[lang].langtitle,fontLeft);
                text1.anchor.set(1,0);
                text1.inputEnabled = true;
                text1.langid = lang;
                text1.events.onInputOut.add(function () {
                    arguments[0].style.backgroundColor = arguments[0].oldBack ||"";
                    arguments[0].style.fill = arguments[0].oldFill || "";
                    arguments[0].text+=" ";
                    arguments[0].text=arguments[0].text.trim();
                    arguments[0].game.canvas.style.cursor = "default";
                });
                text1.events.onInputOver.add(function () {

                    arguments[0].oldBack = arguments[0].style.backgroundColor;
                    arguments[0].oldFill = arguments[0].style.fill;

                    arguments[0].style.backgroundColor = "#fdfbff";
                    arguments[0].style.fill = "#000000";
                    arguments[0].text+=" ";
                    arguments[0].text=arguments[0].text.trim();
                    arguments[0].game.canvas.style.cursor = "pointer";


                });
                text1.events.onInputUp.add(this.SwitchLang);
                text1.fixedToCamera = true;
                shift+=20;
            }

        },
        MainMenu: function (game) {

            var h=64;
            var w=192;
            var hs=64;
            var shift=200;
            var lw = 2;
            var centerx = game.camera.width/2;
            var centery = game.camera.height/2;

            var gr = game.add.graphics(0,0);
            gr.lineStyle(lw,"0xDDDDDD");
            gr.beginFill('0xFFFFFF',0);
            gr.drawRect(0,0,w-lw,h-lw);

            gr.lineStyle(2,"0xEDEDED");
            gr.beginFill("0x"+"#78a2d0".slice(1, 7),0.9);
            gr.drawRect(0,h+lw,w-lw,h-lw);
            var texture = gr.generateTexture();
            game.cache.addSpriteSheet('menubuttons', null, texture.baseTexture.source, w, h, 2,0,lw);



            this.newgame = game.add.button(centerx,centery+shift,'menubuttons',this.startNewGame,this,1,0,1,0);
            this.newgame.events.onInputOut.add(function () {arguments[0].children[0].fill ="#ffffff";},this);
            this.newgame.events.onInputOver.add(function () {arguments[0].children[0].fill ="#000000";});
            this.newgame.anchor.set(0.5);


            this.newgameLabel = game.add.text(0,0,T[lang].newgame,menu);
            this.newgameLabel.anchor.set(0.5);
            this.newgameLabel.fixedToCamera = true;
            this.newgame.addChild(this.newgameLabel);
            this.newgame.fixedToCamera = true;

            if(JSON.parse(localStorage.getItem("save-quicksave"))!==null ) {
            this.continuegame = game.add.button(centerx, centery + hs + 10 + shift, 'menubuttons', this.continueGame, this, 1, 0, 1, 1);


                this.continuegame.events.onInputOut.add(function () {
                    arguments[0].children[0].fill = "#ffffff";
                }, this);
                this.continuegame.events.onInputOver.add(function () {
                    arguments[0].children[0].fill = "#000000";
                });

            }
            else
            {
                this.continuegame = game.add.button(centerx, centery + hs + 10 + shift, 'menubuttons', this.continueGame, this, 0, 0, 0, 0);
            }
            this.continuegame.anchor.set(0.5);


            this.continuegameLabel = game.add.text(0, 0, T[lang].continuegame, menu);
            if(JSON.parse(localStorage.getItem("save-quicksave"))===null || JSON.parse(localStorage.getItem("save-quicksave"))===undefined) {
                this.continuegameLabel.style.fill = "#5b5b5b";
                this.continuegameLabel.text += " ";
                this.continuegameLabel.text = this.continuegameLabel.text.trim();
            }
            this.continuegameLabel.anchor.set(0.5);
            this.continuegameLabel.fixedToCamera = true;
            this.continuegame.addChild(this.continuegameLabel);
            this.continuegame.fixedToCamera = true;
            if(JSON.parse(localStorage.getItem("save-quicksave"))!==null ) {
                this.continuegame.tint = "0xffffff";

            }
            else
                this.continuegame.tint = "0x5b5b5b";

            gr.destroy();

        },

        preload: function () {

            lang = localStorage.getItem('lang') || defaultLang;
            this.game.time.advancedTiming = true;

            this.preloadBar = this.add.sprite(0, 400, 'preloaderBar');

            this.load.setPreloadSprite(this.preloadBar);

            this.load.image('background_intro', assets+'background_intro.png');

            this.load.spritesheet('ship1',assets+'sprite_ship1.png',32,32,9,0,0);
            this.load.spritesheet('ship0',assets+'ship0.png',32,32,4,0,0);
            this.load.spritesheet('sidethrust1',assets+'side_thrust1.png',5,5,5,0,0);

            this.load.spritesheet('grahem',assets+'grahem4.png',32,32,4,0,0);
            this.load.spritesheet('grahemdamages',assets+'grahemdamages.png',32,32,6,0,0);
            this.load.spritesheet('shipButton',assets+'shipButtons.png',48,16,16,0,0);
            this.load.spritesheet('pilotback',assets+'pilotback.png',32,32,6,0,0);


            this.load.spritesheet('asteroids1',assets+'asteroids1.png',32,32,8,0,0);
            this.load.spritesheet('glow',assets+'glow.png',32,32,4,0,0);
            this.load.spritesheet('buttons',assets+'buttons.png',75,25,9);
            this.load.spritesheet('spaceicons',assets+'spaceicons.png',20,20,-1,0,0);


            this.load.image('planet',assets+'sprite_planet.png');
            this.load.image('laser',assets+'laser.png');
            this.load.image('rock',assets+'rock.png');
            this.load.image('part',assets+'part.png');
            this.load.image('starsBackground',assets+'sprite_stars.png');
            this.load.image('button',assets+'button.png');

            //equipments
            this.load.spritesheet('lasers',assets+'lasers.png',16,16,3,0,0);
            this.load.spritesheet('engines',assets+'engines.png',16,16,3,0,0);
            this.load.spritesheet('generators',assets+'PowerGenerator.png',16,16,1,0,0);
            this.load.spritesheet('capacitors',assets+'Capacitor.png',16,16,1,0,0);
            this.load.spritesheet('grabbers',assets+'Grabber.png',16,16,1,0,0);
            this.load.spritesheet('radars',assets+'Radar.png',16,16,1,0,0);

            this.load.physics('shipShapesData', assets+'shipHullsShapes.json');
            this.load.shader('noise', 'assets/noise.frag');
            this.load.shader('galaxy1', 'assets/galaxy1.frag');

        },

        create: function () {
            this.back = this.game.add.sprite(0,0);
            this.back.fixedToCamera = true;
            this.back.scale.set(this.game.camera.width/this.back.width,this.game.camera.height/this.back.width);
            this.game.galaxyFilter = new Phaser.Filter(this.game, null, this.game.cache.getShader('galaxy1'));
            this.game.galaxyFilter.setResolution(this.game.camera.width, this.game.camera.height);
            this.back.filters = [this.game.galaxyFilter];
            this.back.alpha =(0.2);
            if(document.getElementById("loading"))
                document.getElementById("loading").parentNode.removeChild(document.getElementById("loading"));//когда все загрузится


             this.version = this.game.add.text(20,0,SpaceLifeGame.version, fontLeft2);
             this.version.anchor.set(0);


            this.gameName = this.game.add.text(this.game.camera.width/2,this.game.camera.height/2-200,T[lang].gamename, fontMenu1);
            this.gameName.anchor.set(0.5);
            this.counter = 0;




            this.preloadBar.cropEnabled = false;
            this.preloadBar.visible = false;
            this.ready = true;
            if (Notification.permission !== "granted") {

                sendNotification('Уведомления', { body: 'Вы разрешили уведомления. Теперь различные игровые события будут выводится через них.',icon: 'favicon-16x16.png', dir: 'auto' });
            }
            this.mainMenu = this.MainMenu(this.game);
            this.langSelect = this.LangSelect(this.game);



            // var bmd = this.game.add.bitmapData(200, 200);
            // bmd.addToWorld(200, 200);
            // var w = 200/2;
            //
            // for(var i=0;i<20;i++) {
            //     bmd.draw('rock', w+40, 40+i*4);
            // }

            // bmd.update();


        },


        update: function () {

            this.game.galaxyFilter.update();
            if(!this.textupdated)
            {
                this.newgameLabel.text+=" ";
                this.newgameLabel.text=this.newgameLabel.text.trim();
                this.textupdated = true;
            }


        },
        render: function () {


        }

    };
})(SpaceLifeGame);