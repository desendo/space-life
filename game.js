


(function(Phaser) {

    var game = new Phaser.Game(1000, 800 , Phaser.AUTO, 'game');
    //var game = new Phaser.Game(window.innerWidth-100 , window.innerHeight-30 , Phaser.AUTO, 'game');






    game.effectsEnabled = true;
    game.state.add('MainState', SpaceLifeGame.MainState);
    game.state.add('Preloader', SpaceLifeGame.Preloader);
    game.state.add('Boot', SpaceLifeGame.Boot);
    game.state.add('GameOver', SpaceLifeGame.GameOver);


    game.state.start('Boot');
    game.gameOver =  function () {
        //

    };
    // game.state.start('MainState');

}(Phaser));







