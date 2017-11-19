/**
 * Created by lav010 on 02.11.2017.
 */
Phaser.Game.prototype.saveGame = function(key) {
    if (key === undefined) key = 'quicksave';
    var save = this.getSaveData();
    localStorage.setItem('save-'+key, save);
    console.log("saved");

};

Phaser.Game.prototype.loadGame = function(key) {
    if (key === undefined) key = 'quicksave';

    if(localStorage.getItem('save-'+key)!== undefined && localStorage.getItem('save-'+key)!== null) {
        var state = localStorage.getItem('save-' + key);
        if (state) {
            state = JSON.parse(state);
        }

        this.isLoading = true;
        this.saveGameKey = 'save-' + key;
        this.state.start('MainState', true, false);
    }
    else
        sendNotification("ошибка загрузки",{body:"Отсутствует сохранение "+key+" в localStorage"});

};


Phaser.Game.prototype.getSaveData = function () {
    var saveObj = {};
    saveObj.planets = [];
    saveObj.asteroids = [];
    saveObj.items = [];
    saveObj.ships = [];
    for (var i = 0; i< this.spaceObjects.length;i++)
    {
        if(this.spaceObjects[i].objType === ObjTypes.player)
        {
            saveObj.player = this.spaceObjects[i].getSaveData();
        }
        else if(this.spaceObjects[i].objType === ObjTypes.planet)
        {
            saveObj.planets.push(this.spaceObjects[i].getSaveData());
        }
        else if(this.spaceObjects[i].objType === ObjTypes.asteroid)
        {
            saveObj.asteroids.push(this.spaceObjects[i].getSaveData());
        }
        else if(this.spaceObjects[i].objType === ObjTypes.ship)
        {
            saveObj.ships.push(this.spaceObjects[i].getSaveData());
        }
        else
            console.log(this.spaceObjects[i]);

    }
    //saveObj.planets = this.planets.map(function (planet) {
      //  return planet.getSaveData();
    //});
    return JSON.stringify(saveObj);
};

function Load(game,json) {

    var data = JSON.parse(json);


    data.planets.forEach(function (p) {
        var planet = new Planet(p, game);
    });
    data.asteroids.forEach(function (a) {

        var asteroid = new Asteroid(a, game);
        console.log("loadin фыеукщшвы");
    });
    data.ships.forEach(function (a) {

        var ship = new NPC(a, game);


    });

    game.ship = new Player(data.player, game);

}

