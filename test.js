/**
 * Created by goblino on 08.10.2017.
 */
/* global Phaser */
/* global BasicGame */


/*
 CREDITS and NOTES:

 #####################################
 ##########IMPORTANT!!!!!!!!##########
 #####################################
 To use the tint method is necessary a version of Phaser.js equal to 2.3 or more!!!!!!!!



 Credits:
 http://opengameart.org/content/lpc-medieval-fantasy-avatarBody-sprites

 */



(function(BasicGame) {
    'use strict';

    BasicGame.Game = function () {

        //  When a State is added to Phaser it automatically has the following properties set on it, even if they already exist:

        /*this.game;        //  a reference to the currently running game
         this.add;       //  used to add sprites, text, groups, etc
         this.camera;    //  a reference to the game camera
         this.cache;     //  the game cache
         this.input;     //  the global input manager (you can access this.input.keyboard, this.input.mouse, as well from it)
         this.load;      //  for preloading assets
         this.math;      //  lots of useful common math operations
         this.sound;     //  the sound manager - add a sound, play one, set-up markers, etc
         this.stage;     //  the game stage
         this.time;      //  the clock
         this.tweens;    //  the tween manager
         this.world;     //  the game world
         this.particles; //  the particle manager
         this.physics;   //  the physics manager
         this.rnd;       //  the repeatable random number generator
         */
        //  You can use any of these from any function within this State.
        //  But do consider them as being 'reserved words', i.e. don't create a property for your own game called "world" or you'll over-write the world reference.
    };



    var options = 0;
    var textstep=0;
    var tweenType=1;
    var startPoints=200;

    BasicGame.Game.prototype = {
        create: function () {

            this.game.physics.startSystem(Phaser.Physics.ARCADE);
            this.game.physics.arcade.gravity.y = 0;

            this.world.setBounds(0, 0, 960, 640);

            var style = { font: "65px Arial", fill: "#ffffff", align: "center" };
            this.textGradArray = new Array();
            this.tweenArray = new Array();
            this.tweenAPoints = new Array();
            this.victory=0;

            var styleMyMsgOnScreen = {font: '55px Fontdiner Swanky', align: 'left', fontWeight: 'bold', stroke: '#000000', strokeThickness: 9};

            this.textGrad = this.add.text(this.world.centerX, this.world.centerY-200, '', styleMyMsgOnScreen);
            this.textGrad.anchor.set(0.5);
            this.game.physics.arcade.enable([ this.textGrad ]);
            this.textGrad.body.velocity.setTo(0, 0);



            for(var u=1;u<=15;u++){
                this.textGradArray[u] = this.add.text(this.world.centerX, this.world.centerY-200, '', styleMyMsgOnScreen);
                this.textGradArray[u].anchor.set(0.5);
            }






            //Music and sound fx
            //Comment when you test in local
            //Uncomment when you test in a web server
            //this.music = this.game.add.audio('bgmusic');


            //Background intro pre-game for the "PLAY" button (here the background and the button to tap are
            //two different entities)
            this.background_intro = this.add.button(1536, 1536,  'background_intro');
            this.background_intro.fixedToCamera = true;
            this.background_intro.cameraOffset.x = 0;
            this.background_intro.cameraOffset.y = 0;

            var styleIntroMSG = {font: '50px Arial', fill: '#ff0000', align: 'center', fontWeight: 'bold', stroke: '#000000', strokeThickness: 5};
            this.IntroMSGtext = this.add.text(this.world.centerX, this.world.centerY+20, "", styleIntroMSG);
            this.IntroMSGtext.anchor.set(0.5);
            this.IntroMSGtext.fixedToCamera = true;





            this.buttonA = this.add.button(150, 500,  'exit', function () {
                if(this.victory==1){
                    this.emitter.destroy();
                    this.textGrad.setText('');
                    this.victory=0;
                }
                this.game.tweens.removeAll();
                this.textGrad.setText('KILLING SPREE! ');
                this.grdGrad = this.textGrad.context.createLinearGradient(0, 0, 0, this.textGrad.canvas.height);
                this.grdGrad.addColorStop(0, '#cccccc');
                this.grdGrad.addColorStop(1, '#000000');
                this.textGrad.fill = this.grdGrad;
                this.textGrad.stroke = "#ff0000";
                this.textGrad.strokeThickness = 10;
                this.textGrad.fontSize = 75;
                this.textGrad.alpha = 0;
                this.textGrad.body.velocity.setTo(0, 0);
                this.textGrad.y=this.world.centerY-200
                this.textGrad.x=this.world.centerX
                this.tweenA = this.game.add.tween(this.textGrad).to( { alpha: 1 }, 300, Phaser.Easing.Linear.None, true,1);
                this.tweenA.onComplete.add(tweenChooseEvent, this);

            }, this);

            this.buttonA.anchor.set(0.5);

            this.buttonA.cameraOffset.x = 10;

            this.buttonA.cameraOffset.y = 500;



            this.buttonB = this.add.button(300, 500,  'exit', function () {



                textstep=textstep+1;

                if(this.victory==1){
                    this.emitter.destroy();
                    this.textGrad.setText('');
                    this.victory=0;
                }

                if(textstep>=10) textstep=0;

                console.log(textstep);


                this.explosioncoin = this.game.add.emitter(this.world.centerX, this.world.centerY-200, 200);

                this.explosioncoin.makeParticles("coin");
                this.explosioncoin.gravity = 200;
                this.explosioncoin.setXSpeed(-150, 150);
                this.explosioncoin.setYSpeed(-150, 150);
                this.explosioncoin.setAlpha(0.5, 1);
                this.explosioncoin.minParticleScale = 0.2;
                this.explosioncoin.maxParticleScale = 0.5;
                this.explosioncoin.start(true, 3000, null, 200);
                this.textGrad.y=this.world.centerY-200
                this.textGrad.x=this.world.centerX
                this.grdGradCoin = this.textGrad.context.createLinearGradient(0, 0, 0, this.textGrad.canvas.height);

                this.grdGradCoin.addColorStop(0, '#ffff66');

                this.grdGradCoin.addColorStop(1, '#ff0000');

                this.textGrad.fill = this.grdGradCoin;


                this.textGrad.stroke = "#000000";
                this.textGrad.strokeThickness = 10;

                this.textGrad.alpha = 1;
                this.textGrad.fontSize = 110;
                this.textGrad.body.velocity.setTo(0, 0);
                this.textGrad.setText('YOU WIN! ');

                this.game.tweens.removeAll();



            }, this);

            this.buttonB.anchor.set(0.5);

            this.buttonB.cameraOffset.x = 350;

            this.buttonB.cameraOffset.y = 500;



            this.buttonC = this.add.button(450, 500,  'exit', function () {



                textstep=textstep+1;

                if(this.victory==1){
                    this.emitter.destroy();
                    this.textGrad.setText('');
                    this.victory=0;
                }

                if(textstep>=10) textstep=0;

                console.log(textstep);


                for(var h=1;h<=3;h++){
                    this.explosionheart = this.game.add.emitter(this.world.centerX-400+(h*200), this.world.centerY-200, 200);

                    this.explosionheart.makeParticles("heart");
                    this.explosionheart.gravity = 200;
                    this.explosionheart.setXSpeed(-150, 150);
                    this.explosionheart.setYSpeed(-150, 150);
                    this.explosionheart.setAlpha(0.5, 1);
                    this.explosionheart.minParticleScale = 0.2;
                    this.explosionheart.maxParticleScale = 0.5;
                    this.explosionheart.start(true, 3000, null, 200);
                }
                this.textGrad.y=this.world.centerY-200
                this.textGrad.x=this.world.centerX
                this.textGrad.setText('LUCKY MOMENT ');

                this.textGrad.alpha = 1;



                this.grdGrad = this.textGrad.context.createLinearGradient(0, 0, 0, this.textGrad.canvas.height);

                this.grdGrad.addColorStop(0, '#8ae234');

                this.grdGrad.addColorStop(1, '#cc0000');

                this.textGrad.fill = this.grdGrad;

                this.textGrad.stroke = "#ff0000";
                this.textGrad.fontSize = 75;
                this.textGrad.strokeThickness = 16;
                this.textGrad.body.velocity.setTo(0, 0);
                //  Apply the shadow to the Stroke only
                this.textGrad.setShadow(2, 2, "#333333", 2, false, true);
                this.game.tweens.removeAll();

            }, this);
            this.buttonC.anchor.set(0.5);
            this.buttonC.cameraOffset.x = 590;
            this.buttonC.cameraOffset.y = 500;

            this.buttonD = this.add.button(150, 595,  'exit', function () {

                textstep=textstep+1;
                if(this.victory==1){
                    this.emitter.destroy();
                    this.textGrad.setText('');
                    this.victory=0;
                }
                this.game.tweens.removeAll();
                if(textstep>=10) textstep=0;
                console.log(textstep);
                tweenType=1;
                this.textGrad.y=this.world.centerY-200

                this.textGrad.setText('  '+Math.abs(startPoints+10)+' Points   ');

                this.textGrad.fill = "#ffff66";
                this.textGrad.stroke = "#ce5c00";
                this.textGrad.strokeThickness = 10;
                this.textGrad.fontSize = 85;
                this.textGrad.alpha = 0;
                this.textGrad.body.velocity.setTo(0, 0);
                this.textGrad.x=this.world.centerX;
                this.tweenPoints1 = this.game.add.tween(this.textGrad).to( { alpha: 1 }, 75, Phaser.Easing.Linear.None, true,1);
                this.tweenPoints1.onComplete.add(tweenChooseEvent1, this);

            }, this);

            this.buttonD.anchor.set(0.5);
            this.buttonD.cameraOffset.x = 10;
            this.buttonD.cameraOffset.y = 595;

            this.buttonE = this.add.button(300, 595,  'exit', function () {

                textstep=textstep+1;
                if(this.victory==1){
                    this.emitter.destroy();
                    this.textGrad.setText('');
                    this.victory=0;
                }
                if(textstep>=10) textstep=0;
                console.log(textstep);
                tweenType=2;

                this.textGrad.setText('  '+Math.abs(startPoints+10)+' Points   ');
                this.textGrad.y=this.world.centerY-200;

                this.textGrad.fill = "#ce5c00";
                this.textGrad.stroke = "#ffff66";
                this.textGrad.strokeThickness = 10;
                this.textGrad.fontSize = 85;
                this.textGrad.alpha = 1;
                this.myTextPosition=this.textGrad.y+50;
                this.textGrad.body.velocity.setTo(0, 0);
                this.textGrad.x=this.world.centerX;
                this.tweenPoints1 = this.game.add.tween(this.textGrad).to( { y: this.myTextPosition }, 75, Phaser.Easing.Linear.None, true,1);
                this.tweenPoints1.onComplete.add(tweenChooseEvent1, this);


            }, this);


            function tweenChooseEvent(){
                this.game.add.tween(this.textGrad).to( { alpha: 0 }, 1200, Phaser.Easing.Linear.None, true,1);
            }

            this.buttonE.anchor.set(0.5);
            this.buttonE.cameraOffset.x = 470;
            this.buttonE.cameraOffset.y = 595;



            /*
             Points manage
             */
            function tweenChooseEvent1(){ this.textGrad.y=this.world.centerY-200;
                if(tweenType==1) this.tweenPoints1ChooseEvent = this.game.add.tween(this.textGrad).to( { alpha: 0 }, 75, Phaser.Easing.Linear.None, true,1);
                if(tweenType==2) this.tweenPoints1ChooseEvent = this.game.add.tween(this.textGrad).to( { y: this.myTextPosition }, 75, Phaser.Easing.Linear.None, true,1);
                this.tweenPoints1ChooseEvent.onComplete.addOnce(tweenPoints2, this);
            }
            function tweenPoints2(){
                this.textGrad.setText(Math.abs(startPoints+20)+' Points');
                this.tweenPoints2 = this.game.add.tween(this.textGrad).to( { alpha: 1 }, 75, Phaser.Easing.Linear.None, true,1);
                this.tweenPoints2.onComplete.add(tweenChooseEvent2, this);
            }
            function tweenChooseEvent2(){ this.textGrad.y=this.world.centerY-200;
                if(tweenType==1) this.tweenPoints2ChooseEvent = this.game.add.tween(this.textGrad).to( { alpha: 0 }, 75, Phaser.Easing.Linear.None, true,1);
                if(tweenType==2) this.tweenPoints2ChooseEvent = this.game.add.tween(this.textGrad).to( { y: this.myTextPosition }, 75, Phaser.Easing.Linear.None, true,1);
                this.tweenPoints2ChooseEvent.onComplete.addOnce(tweenPoints3, this);
            }
            function tweenPoints3(){
                this.textGrad.setText(Math.abs(startPoints+30)+' Points');
                this.tweenPoints3 = this.game.add.tween(this.textGrad).to( { alpha: 1 }, 75, Phaser.Easing.Linear.None, true,1);
                this.tweenPoints3.onComplete.add(tweenChooseEvent3, this);
            }
            function tweenChooseEvent3(){ this.textGrad.y=this.world.centerY-200;
                if(tweenType==1) this.tweenPoints3ChooseEvent = this.game.add.tween(this.textGrad).to( { alpha: 0 }, 75, Phaser.Easing.Linear.None, true,1);
                if(tweenType==2) this.tweenPoints3ChooseEvent = this.game.add.tween(this.textGrad).to( { y: this.myTextPosition }, 75, Phaser.Easing.Linear.None, true,1);
                this.tweenPoints3ChooseEvent.onComplete.addOnce(tweenPoints4, this);
            }
            function tweenPoints4(){
                this.textGrad.setText(Math.abs(startPoints+40)+' Points');
                this.tweenPoints4 = this.game.add.tween(this.textGrad).to( { alpha: 1 }, 75, Phaser.Easing.Linear.None, true,1);
                this.tweenPoints4.onComplete.add(tweenChooseEvent4, this);
            }
            function tweenChooseEvent4(){ this.textGrad.y=this.world.centerY-200;
                if(tweenType==1) this.tweenPoints4ChooseEvent = this.game.add.tween(this.textGrad).to( { alpha: 0 }, 75, Phaser.Easing.Linear.None, true,1);
                if(tweenType==2) this.tweenPoints4ChooseEvent = this.game.add.tween(this.textGrad).to( { y: this.myTextPosition }, 75, Phaser.Easing.Linear.None, true,1);
                this.tweenPoints4ChooseEvent.onComplete.addOnce(tweenPoints5, this);
            }
            function tweenPoints5(){
                this.textGrad.setText(Math.abs(startPoints+50)+' Points');
                this.tweenPoints5 = this.game.add.tween(this.textGrad).to( { alpha: 1 }, 75, Phaser.Easing.Linear.None, true,1);
                this.tweenPoints5.onComplete.add(tweenChooseEvent5, this);
            }
            function tweenChooseEvent5(){ this.textGrad.y=this.world.centerY-200;
                if(tweenType==1) this.tweenPoints5ChooseEvent = this.game.add.tween(this.textGrad).to( { alpha: 0 }, 75, Phaser.Easing.Linear.None, true,1);
                if(tweenType==2) this.tweenPoints5ChooseEvent = this.game.add.tween(this.textGrad).to( { y: this.myTextPosition }, 75, Phaser.Easing.Linear.None, true,1);
                this.tweenPoints5ChooseEvent.onComplete.addOnce(tweenPoints6, this);
            }
            function tweenPoints6(){
                this.textGrad.setText(Math.abs(startPoints+60)+' Points');
                this.tweenPoints6 = this.game.add.tween(this.textGrad).to( { alpha: 1 }, 75, Phaser.Easing.Linear.None, true,1);
                this.tweenPoints6.onComplete.add(tweenChooseEvent6, this);
            }
            function tweenChooseEvent6(){ this.textGrad.y=this.world.centerY-200;
                if(tweenType==1) this.tweenPoints6ChooseEvent = this.game.add.tween(this.textGrad).to( { alpha: 0 }, 75, Phaser.Easing.Linear.None, true,1);
                if(tweenType==2) this.tweenPoints6ChooseEvent = this.game.add.tween(this.textGrad).to( { y: this.myTextPosition }, 75, Phaser.Easing.Linear.None, true,1);
                this.tweenPoints6ChooseEvent.onComplete.addOnce(tweenPoints7, this);
            }
            function tweenPoints7(){
                this.textGrad.setText(Math.abs(startPoints+70)+' Points');
                this.tweenPoints7 = this.game.add.tween(this.textGrad).to( { alpha: 1 }, 75, Phaser.Easing.Linear.None, true,1);
                this.tweenPoints7.onComplete.add(tweenChooseEvent7, this);
            }
            function tweenChooseEvent7(){ this.textGrad.y=this.world.centerY-200;
                if(tweenType==1) this.tweenPoints7ChooseEvent = this.game.add.tween(this.textGrad).to( { alpha: 0 }, 75, Phaser.Easing.Linear.None, true,1);
                if(tweenType==2) this.tweenPoints7ChooseEvent = this.game.add.tween(this.textGrad).to( { y: this.myTextPosition }, 75, Phaser.Easing.Linear.None, true,1);
                this.tweenPoints7ChooseEvent.onComplete.addOnce(tweenPoints8, this);
            }
            function tweenPoints8(){
                this.textGrad.setText(Math.abs(startPoints+80)+' Points');
                this.tweenPoints8 = this.game.add.tween(this.textGrad).to( { alpha: 1 }, 75, Phaser.Easing.Linear.None, true,1);
                this.tweenPoints8.onComplete.add(tweenChooseEvent8, this);
            }
            function tweenChooseEvent8(){ this.textGrad.y=this.world.centerY-200;
                if(tweenType==1) this.tweenPoints8ChooseEvent = this.game.add.tween(this.textGrad).to( { alpha: 0 }, 75, Phaser.Easing.Linear.None, true,1);
                if(tweenType==2) this.tweenPoints8ChooseEvent = this.game.add.tween(this.textGrad).to( { y: this.myTextPosition }, 75, Phaser.Easing.Linear.None, true,1);
                this.tweenPoints8ChooseEvent.onComplete.addOnce(tweenPoints9, this);
            }
            function tweenPoints9(){
                this.textGrad.setText(Math.abs(startPoints+90)+' Points');
                this.tweenPoints9 = this.game.add.tween(this.textGrad).to( { alpha: 1 }, 75, Phaser.Easing.Linear.None, true,1);
                this.tweenPoints9.onComplete.add(tweenChooseEvent9, this);
            }
            function tweenChooseEvent9(){ this.textGrad.y=this.world.centerY-200;
                if(tweenType==1) this.tweenPoints9ChooseEvent = this.game.add.tween(this.textGrad).to( { alpha: 0 }, 75, Phaser.Easing.Linear.None, true,1);
                if(tweenType==2) this.tweenPoints9ChooseEvent = this.game.add.tween(this.textGrad).to( { y: this.myTextPosition }, 75, Phaser.Easing.Linear.None, true,1);
                this.tweenPoints9ChooseEvent.onComplete.addOnce(tweenPoints10, this);
            }
            function tweenPoints10(){
                this.textGrad.setText(Math.abs(startPoints+100)+' Points');
                this.tweenPoints10 = this.game.add.tween(this.textGrad).to( { alpha: 1 }, 75, Phaser.Easing.Linear.None, true,1);
                this.tweenPoints10.onComplete.add(tweenChooseEvent10, this);
            }
            function tweenChooseEvent10(){ this.textGrad.y=this.world.centerY-200;
                if(tweenType==1) this.tweenPoints10ChooseEvent = this.game.add.tween(this.textGrad).to( { alpha: 0 }, 1000, Phaser.Easing.Linear.None, true,1);
                if(tweenType==2) this.tweenPoints10ChooseEvent = this.game.add.tween(this.textGrad).to( { y: this.myTextPosition }, 75, Phaser.Easing.Linear.None, true,1);
                this.textGrad.y=this.world.centerY-200;
            }





            this.buttonF = this.add.button(450, 595,  'exit', function () {

                if(this.victory==1){
                    this.emitter.destroy();
                    this.textGrad.setText('');
                    this.victory=0;
                }
                textstep=textstep+1;
                this.game.tweens.removeAll();
                this.textGrad.setText('');
                if(textstep>=10) textstep=0;
                console.log(textstep);
                this.flagArray=1;
                //this.u=1;




            }, this);

            this.buttonF.anchor.set(0.5);
            this.buttonF.cameraOffset.x = 590;
            this.buttonF.cameraOffset.y = 595;



            this.buttonG = this.add.button(600, 500,  'exit', function () {

                if(this.victory==0){
                    textstep=textstep+1;
                    this.game.tweens.removeAll();
                    this.textGrad.setText('');
                    if(textstep>=10) textstep=0;
                    this.emitter = this.game.add.emitter(this.game.world.centerX, this.game.world.centerY-200, 250);
                    this.emitter.makeParticles('star', [0, 1, 2, 3, 4, 5]);
                    this.emitter.minParticleSpeed.setTo(-400, -400);
                    this.emitter.maxParticleSpeed.setTo(400, 400);
                    this.emitter.minParticleScale = 1.2;
                    this.emitter.maxParticleScale = 1.5;
                    this.emitter.gravity = 0;

                    this.emitter.start(true, 4000, 1,50);

                    this.textGrad.y=this.world.centerY-200
                    this.textGrad.x=this.world.centerX
                    this.textGrad.setText('VICTORY');

                    this.textGrad.alpha = 0.8;



                    this.grdGrad = this.textGrad.context.createLinearGradient(0, 0, 0, this.textGrad.canvas.height);

                    this.grdGrad.addColorStop(0, '#8ae234');

                    this.grdGrad.addColorStop(1, '#eeeeec');

                    this.textGrad.fill = '#ffffff';

                    this.textGrad.stroke = "#555753";
                    this.textGrad.fontSize = 155;
                    this.textGrad.strokeThickness = 16;
                    this.textGrad.body.velocity.setTo(0, 0);
                    //  Apply the shadow to the Stroke only
                    this.textGrad.setShadow(2, 2, "#333333", 2, false, true);

                    this.victory=1;

                }


            }, this);

            this.buttonG.anchor.set(0.5);
            this.buttonG.cameraOffset.x = 590;
            this.buttonG.cameraOffset.y = 500;



            this.buttonH = this.add.button(750, 500,  'exit', function () {
                if(this.victory==1){
                    this.emitter.destroy();
                    this.textGrad.setText('');
                    this.victory=0;
                }
                this.game.tweens.removeAll();
                this.textGrad.setText('OUT OF TIME! ');
                this.grdGrad = this.textGrad.context.createLinearGradient(0, 0, 0, this.textGrad.canvas.height);
                this.grdGrad.addColorStop(0, '#2e3436');
                this.grdGrad.addColorStop(1, '#000000');
                this.textGrad.fill = this.grdGrad;
                this.textGrad.stroke = "#ad7fa8";
                this.textGrad.strokeThickness = 10;
                this.textGrad.fontSize = 75;
                this.textGrad.alpha = 0;
                this.textGrad.angle=180;
                this.textGrad.body.velocity.setTo(0, 0);
                this.textGrad.y=this.world.centerY-200
                this.textGrad.x=this.world.centerX
                this.tweenA = this.game.add.tween(this.textGrad).to( { alpha: 1 }, 300, Phaser.Easing.Linear.None, true,1);
                this.tweenC = this.game.add.tween(this.textGrad).to( { angle: 0 }, 300, Phaser.Easing.Linear.None, true,1);
                this.tweenA.onComplete.add(tweenChooseEvent, this);

            }, this);

            this.buttonH.anchor.set(0.5);

            this.buttonH.cameraOffset.x = 750;

            this.buttonH.cameraOffset.y = 500;




            this.buttonI = this.add.button(600, 595,  'exit', function () {
                if(this.victory==1){
                    this.emitter.destroy();
                    this.textGrad.setText('');
                    this.victory=0;
                }


                this.game.tweens.removeAll();


                this.textGrad.setText('LEVEL UP! ');
                this.grdGrad = this.textGrad.context.createLinearGradient(0, 0, 0, this.textGrad.canvas.height);
                this.grdGrad.addColorStop(0, '#729fcf');
                this.grdGrad.addColorStop(1, '#3465a4');
                this.textGrad.fill = this.grdGrad;
                this.textGrad.stroke = "#ffffff";
                this.textGrad.strokeThickness = 10;
                this.textGrad.fontSize = 75;
                this.textGrad.alpha = 1;

                this.textGrad.y=this.world.centerY-200
                this.textGrad.x=this.world.centerX


                this.textGrad.body.velocity.setTo(200, 200);
                this.textGrad.body.collideWorldBounds = true;
                this.textGrad.body.bounce.set(1);


            }, this);

            this.buttonI.anchor.set(0.5);

            this.buttonI.cameraOffset.x = 600;

            this.buttonI.cameraOffset.y = 595;





            this.buttonL = this.add.button(750, 595,  'exit', function () {
                //window.open('http://www.magratheaworks.net/RPG/index.html','_self');
                if(this.victory==0){


                    this.emitter = this.game.add.emitter(this.game.world.centerX, this.game.world.centerY-100, 200);

                    this.game.tweens.removeAll();
                    this.emitter.makeParticles('smoke');

                    this.emitter.setRotation(1, 1);
                    //this.emitter.setAlpha(0.7, 1);
                    this.emitter.setScale(1.5, 2);
                    this.emitter.gravity = -200;
                    this.emitter.start(false, 5000, 200);

                    this.textGrad.body.velocity.setTo(0, 0);
                    this.textGrad.setText('Suspence');
                    this.grdGrad = this.textGrad.context.createLinearGradient(0, 0, 0, this.textGrad.canvas.height);
                    this.grdGrad.addColorStop(0, '#a40000');
                    this.grdGrad.addColorStop(1, '#cc0000');
                    this.textGrad.fill = this.grdGrad;
                    this.textGrad.y=this.world.centerY-200
                    this.textGrad.x=this.world.centerX
                    this.textGrad.stroke = "#babdb6";
                    this.textGrad.strokeThickness = 10;
                    this.textGrad.fontSize = 105;
                    this.textGrad.alpha = 1;
                    this.victory=1;
                }

            }, this);

            this.buttonL.anchor.set(0.5);

            this.buttonL.cameraOffset.x = 600;

            this.buttonL.cameraOffset.y = 595;



            function textArrayStart(){
                if(this.flagArray<=15 && this.flagArray>=1){
                    this.styleMyMsgOnScreenArray = {font: '85px Dancing Script', align: 'left', fontWeight: 'bold', stroke: '#000000', strokeThickness: 9};

                    this.textGradArray[this.flagArray] = this.add.text(this.world.centerX+this.game.rnd.integerInRange(-100, 100), this.world.centerY+this.game.rnd.integerInRange(-100, 100), '', this.styleMyMsgOnScreenArray);
                    this.textGradArray[this.flagArray].anchor.set(0.5);
                    this.textGradArray[this.flagArray].setText(''+Math.abs(this.flagArray*100)+'');
                    this.grdGradArray = this.textGrad.context.createLinearGradient(0, 0, 0, this.textGrad.canvas.height);
                    this.grdGradArray.addColorStop(0, '#ef2929');
                    this.grdGradArray.addColorStop(1, '#fcaf3e');
                    this.textGradArray[this.flagArray].fill = this.grdGradArray;


                    this.textGradArray[this.flagArray].stroke = "#f3f3f3";
                    this.textGradArray[this.flagArray].fontSize = 255;
                    this.textGradArray[this.flagArray].strokeThickness = 20;
                    this.tweenArray[this.flagArray]=this.game.add.tween(this.textGradArray[this.flagArray].scale).to( { x: 0.5, y: 0.5 }, 75, Phaser.Easing.Linear.None, true,1);

                    this.flagArray+=1;
                    if(this.flagArray==15) this.flagArray=0;

                }

            }

            function textArrayEnd(){
                for(var u=1;u<=15;u++){
                    this.game.add.tween(this.textGradArray[u]).to( { alpha: 0 }, 1000, Phaser.Easing.Linear.None, true,1);

                }

            }


            function victoryEnd(){
                if(this.victory==1){
                    this.emitter.destroy();
                    this.textGrad.setText('');
                    this.victory=0;
                }
            }






            //This is the "PLAY" button that appear after the quest section (second button to tap)
            this.introButton = this.add.button(203, 120, 'introbutton', function () {
                this.introButton.cameraOffset.x = -1350;
                this.introButton.cameraOffset.y = -1310;

                this.background_intro.cameraOffset.x = -1250;
                this.background_intro.cameraOffset.y = -1130;


                this.IntroMSGtext.text = "";
                this.IntroMSGtext.cameraOffset.x = -10000;
                this.IntroMSGtext.cameraOffset.y = -10000;

                //Comment when you test in local
                //Uncomment when you test in a web server
                //this.music.play('',0,1,true);

                //Manage the FullScreen
                if (this.scale.isFullScreen)
                {
                    this.scale.stopFullScreen();
                }
                else
                {
                    this.scale.startFullScreen(false);
                }


                options=2;

            }, this);

            this.introButton.fixedToCamera = true;
            this.introButton.cameraOffset.x = 230;
            this.introButton.cameraOffset.y = 120;




            var style = {font: '15px Arial', fill: '#ffffff', align: 'left', fontWeight: 'bold', stroke: '#000000', strokeThickness: 6};



            this.game.time.events.loop(250, textArrayStart, this);
            this.game.time.events.loop(1000, textArrayEnd, this);
            this.game.time.events.loop(7000, victoryEnd, this);



        },
        updateDebugText: function(){



        },



        update: function() {


            if(options==2){






                this.world.bringToTop(this.textGrad);




            }

            //The area before the game (the description of the area)
            if(options==0){

                this.background_intro.bringToTop();

                this.introButton.bringToTop();

                this.world.bringToTop(this.IntroMSGtext);

                this.IntroMSGtext.text = "\nCUSTOMIZED\n FONTS\n Tap here";


            }




        }

    };

})(BasicGame);
