/**
 * Created by lav010 on 23.10.2017.
 */
function EventManager (game)
{
    this.game = game;
    this.game.onPlayerDamage = new  Phaser.Signal();
    this.game.onPlayerDead = new  Phaser.Signal();
    this.game.onPlayerInventoryChanged = new  Phaser.Signal();
    this.game.onPlayerLanded = new  Phaser.Signal();
    this.game.onPlayerUnlanded = new  Phaser.Signal();

    this.game.onCargoFull = new  Phaser.Signal();
    this.game.onQuickSave = new  Phaser.Signal();
    this.game.onQuickLoad = new  Phaser.Signal();

}


