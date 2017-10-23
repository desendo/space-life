/**
 * Created by lav010 on 23.10.2017.
 */
function EventManager (game)
{
    this.game = game;
    this.game.onPlayerDamage = new  Phaser.Signal();
    this.game.onPlayerDead = new  Phaser.Signal();

}


