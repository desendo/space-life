/**
 * Created by lav010 on 02.11.2017.
 */
function Load(game,data) {

    data = JSON.parse(data);

data.planets.forEach(function (p) {

    //var planet = new Planet(game.worldSize / 2 + p.x, game.worldSize / 2 +p.y, p.size, p.sprite , p.gravityRadius, 'Земля 2', game.spaceBodiesColGroup, [game.spaceBodiesColGroup, game.playerColGroup], game);
    var planet = new Planet(p, game);
    game.spaceObjectsLayer.add(planet.b);
    game.planets.push(planet);
    game.spaceObjects.push(planet);
    planet.b.body.setMaterial(game.planetMaterial);


})
};