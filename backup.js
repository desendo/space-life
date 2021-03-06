/**
 * Created by lav010 on 16.10.2017.
 */
var Material = {
    constructor: function (x,y,size,material,volume,colGroup,colGroups,game)
    {
        this.material = material;
        this.droped=0;
        this.grabbed=0;
        this.x=x+randomInteger(-5,5);
        this.y = y+randomInteger(-5,5);
        this.name = name;
        this.game = game;
        this.size = size;
        this.volume = volume;
        this.objType = 'material';

        this.info = {};
        this.info.volume = this.volume;
        this.info.type = this.material.type;
        this.info.title = this.material .title;
        this.info.mass = this.volume*this.material.density/10;
        this.info.summary = this.info.title+"\nместо:"+this.info.volume+"куб.м.\n"+"масса:"+this.info.mass + "т.";

        this.mass  =this.info.mass;
        this.b = this.game.add.sprite(this.x,this.y,this.material.sprite);
        this.game.interfaceGroup.add(this.b);
        this.b.events.onInputOver.add(this.game.userInterface.mouseTooltip.aboveItem, this);
        this.b.events.onInputOut.add(this.game.userInterface.mouseTooltip.outOfItem, this);
        this.b.events.onInputDown.add(this.game.userInterface.mouseTooltip.clickToItem, this);

        this.b.parentObject = this;
        this.b.scale.set(this.size);

        this.b.smoothed=false;
        this.b.anchor.set(0.5);
        this.b.sendToBack();
        this.game.physics.p2.enable(this.b, false);

        this.b.body.setRectangleFromSprite();
        this.b.body.dynamic= true;
        this.b.body.damping = 0.95;
        this.b.body.angularDamping  = 0.95;
        this.b.body.setCollisionGroup(colGroup);
        this.b.body.collides(colGroups);
        this.b.body.mass=0.1;
        this.b.body.velocity.x=randomInteger(-5,5)/10;
        this.b.body.velocity.y=randomInteger(-5,5)/10;

        return this;
    }


};

var EquipmentObject =
    {

        constructor: function (x, y, game, type, colGroup, colGroups) {

            this.game = game;

            this.eqType = type;
            this.mass = type.mass;
            this.volume = type.volume;

            this.b = game.add.sprite(x, y, type.sprite, type.frame);
            this.b.tint = type.tint || '0xFFFFFF';
            this.b.anchor.set(0.5);
            this.b.scale.set(type.size || 1);
            this.oldScale = type.size || 1;
            this.b.smoothed = false;
            this.objType = 'equipment';

            this.info = {};
            this.info.volume = this.volume;
            this.info.type = this.eqType.type;
            this.info.title = this.eqType.title;
            this.info.mass = this.mass;
            this.info.summary = this.info.title+"\nместо:"+this.info.volume+"куб.м.\n"+"масса:"+this.info.mass + "т.";

            this.b.events.onInputOver.add(game.userInterface.mouseTooltip.aboveItem, this);
            this.b.events.onInputOut.add(game.userInterface.mouseTooltip.outOfItem, this);
            this.b.events.onInputDown.add(game.userInterface.mouseTooltip.clickToItem, this);

            this.game.physics.p2.enable(this.b, false);
            this.b.body.damping = 0.95;
            this.b.body.mass = this.eqType.mass/1000;
            this.b.body.setCircle(this.b.width / 2, 0, 0);

            this.b.body.setCollisionGroup(colGroup);
            this.b.body.collides(colGroups);

            this.b.parentObject = this;
            this.b.sendToBack();
            return this;

        }
    };






function generateAsteroids (asteroidsInField,
                            fieldsAmountMin,
                            fieldsAmountMax,
                            asteroidSpriteSheet,game,
                            asteroidsColGroup,colGroupsToCollide) {

    var fields = [];
    var worldSize = game.world.width;

    var generateField = function (game) {
        var field = {};
        field.x=0;
        field.y=0;

        field.x = randomInteger(worldSize*0.5-8000,worldSize*0.5+8000);
        field.y = randomInteger(worldSize*0.5-8000,worldSize*0.5+8000);
        field.asteroids = [];
        field.radius = 150;
        var asteroidsAmount = randomInteger(asteroidsInField*0.7,asteroidsInField*1.3);
        for (var i = asteroidsAmount; i >0; i--)
        {
            var angleFromFieldCenter = 2*Math.PI*Math.random();
            var u = Math.random() +Math.random();
            var distFromFieldCenter = u>1 ? 2-u :u;
            distFromFieldCenter *= field.radius;
            var scale = randomInteger(2,5)/10;
            var asteroid = Object.create(Asteroid);
            asteroid.constructor(field.x+distFromFieldCenter*Math.cos(angleFromFieldCenter),field.y+distFromFieldCenter*Math.sin(angleFromFieldCenter),scale,asteroidSpriteSheet,game);

            field.asteroids.push(asteroid);

            game.spaceObjects.push(asteroid);

            asteroid.b.body.setCollisionGroup(asteroidsColGroup);
            asteroid.b.body.collides(colGroupsToCollide);


        }
        return field;

    };
    var fieldsAmount = randomInteger(fieldsAmountMin, fieldsAmountMax);

    for (var i = fieldsAmount; i>0;i-- )
    {
        fields.push(generateField(game));
    }
    return fields;
};