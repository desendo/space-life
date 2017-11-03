/**
 * Created by lav010 on 02.11.2017.
 */
function Load(game,json) {

    var data = JSON.parse(json);
    console.log(data.asteroids);

    data.planets.forEach(function (p) {
        var planet = new Planet(p, game);

    });
    data.asteroids.forEach(function (a) {
        var asteroid = new Asteroid(a, game);

    });

    game.ship = new Player(data.player, game);


};