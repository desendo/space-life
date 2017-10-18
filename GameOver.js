/* global SpaceLifeGame */
(function(SpaceLifeGame) {
  //  'use strict';
    SpaceLifeGame.GameOver = function () {

    };



    SpaceLifeGame.GameOver.prototype = {

        preload: function () {
        },

        create: function () {



            this.gameName = this.game.add.text(0,this.game.camera.height,"Игра закончена", fontMenu1_gover);
            this.gameName.anchor.set(0,1);
            this.gameName.fixedToCamera=true;
            this.counter = 0;
            console.log(this.gameName);



            this.gamePressToStart = this.game.add.text(this.game.camera.width,this.game.camera.height-60,"нажмите W для выхода", fontMenu2);

            this.gamePressToStart2 = this.game.add.text(this.game.camera.height,this.game.camera.height,"в главное меню", fontMenu2);
            this.gamePressToStart2.anchor.set(1,1);
            this.gamePressToStart.anchor.set(1,1);

            var gr = this.game.add.graphics();
            gr.beginFill(0xFFFFFF,1);
            gr.drawRect(0,0,this.game.camera.width,this.game.camera.height);
            gr.endFill();
            var spr = this.game.add.sprite(0,0,gr.generateTexture());
            spr.fixedToCamera=true;
            spr.alpha= 1;
            this.game.add.tween(spr).to( { alpha: 0 }, 2000, "Linear", true);
            gr.destroy();

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
                    location.reload();

                }





        },
        render: function () {


        }

    };
})(SpaceLifeGame);