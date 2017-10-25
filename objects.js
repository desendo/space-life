//game.enemies = new EnemyGroup(planets[0].x,(planets[0].y-planets[0].b.width*0.56-500),300,0,0.05,true,game);

EnemyGroup = function(positionX, positionY, radius, angle, rotateSpeed, clockwise,game) {

    Phaser.Group.call(this, game);
    this.position = {x:positionX, y:positionY};
    this.radius   = radius;
    this.pivot.x  = positionX;
    this.pivot.y  = positionY;
    this.angle    = angle;

    this.rotateSpeed = rotateSpeed;
    this.clockwise   = clockwise;

    this.addChild(new Enemy(this.position, this.radius, 0.4,game));
    this.addChild(new Enemy(this.position, this.radius, 0.4,game));
    this.addChild(new Enemy(this.position, this.radius, 0.4,game));
    this.addChild(new Enemy(this.position, this.radius, 0.4,game));

    this.update = function(){
    this.children.forEach(function (ch) {
        ch.update();
    })

    }
};

EnemyGroup.prototype = Object.create(Phaser.Group.prototype);
EnemyGroup.prototype.constructor = EnemyGroup;


Enemy = function(position, radius, scale,game) {

    Phaser.Sprite.call(this, game, position.x, position.y, 'ship1');
    game.physics.p2.enable(this, true);
    this.body.setCircle(7);
    this.scale.setTo(scale);
    this.anchor.setTo(0.5);
    this.body.setCollisionGroup(game.spaceBodiesColGroup);
    this.body.static = true;
    this.body.collides(game.playerColGroup);
    this.radius = radius;
    this.angle = 10;
    game.add.existing(this);

    this.update = function(){


    }
};

Enemy.prototype = Object.create(Phaser.Sprite.prototype);
Enemy.prototype.constructor = Enemy;


var Alt = Alt || {};
Alt.Bullet = function (game, x, y, key, frame,origin,weapon) {

    this.weapon= weapon;
    Phaser.Sprite.apply(this,arguments);
    this.visible = true;
    this.x=origin.b.x;
    this.y=origin.b.y;
    var scale = weapon.bulletScale|| 1;
    this.scale.set (1,scale);
    this.anchor.set(0,0.5);
    this.game = game;
    this.origin = origin;
    this.armed = false;
    game.add.existing(this);
    this.init = function () {
        this.x = 0;
        this.y=0;
        this.armed = false;
        this.visible = true;
        this.velocityx=0;
        this.velocityy=0;
    };
    this.init();
    this.spawn = function () {

        this.x = this.origin.b.x;
        this.y=this.origin.b.y;

        this.angle= origin.b.body.angle +90;

        this.velocityx=-this.weapon.bulletSpeed*origin.sin/ 100+origin.b.body.velocity.x/GLOBAL.SPEED;

        this.velocityy=-this.weapon.bulletSpeed*origin.cos/ 100+origin.b.body.velocity.y/GLOBAL.SPEED;



        this.visible=true;
        this.armed = true;

    };





};
Alt.Bullet.prototype = Object.create(Phaser.Sprite.prototype);
Alt.Bullet.constructor = Alt.Bullet;
Alt.Weapon = function (weapon,game,origin) {
    var size = 32;
    this.delay=weapon.delay;
    this.bulletSpeed = weapon.bulletSpeed;
    this.game=game;
    this.timeToFire = 0;
    this.damagePerShot = weapon.damagePerShot;
    this.type = weapon.bullet;
    this.bulletScale = weapon.bulletScale;
    var pool = [];
    for (var i = 0; i < size; i++) {
        var bullet = new Alt.Bullet(game,0,0,this.type,1,origin,this);

        pool[i] = bullet;
    }

    this.bullets = pool;
    this.bulletsAmountinPool = pool.length;


    this.get = function() {


        if(!this.bullets[size - 1].visible);
        {
            this.bullets[size - 1].spawn();
            this.bullets.unshift(this.bullets.pop());
        }
    }




};
Alt.Weapon.prototype.fire = function () {

    if(this.timeToFire>this.game.time.now){return;} // too early

    this.get();

    this.timeToFire = this.game.time.now + this.delay; // wait at least 1 second (1000ms) to next shot

};
Alt.Weapon.prototype.destruct = function () {

    for (var i = 0; i < this.bullets.length; i++) {

        this.bullets[i].destroy();
    }

    return null;

};


var Planet = function (x,y,size,sprite,gravityDistance,name="Земля 2",colGroup,colGroups,game) {
  this.init(x,y,size,sprite,gravityDistance,name="Земля 2",colGroup,colGroups,game);
};
Planet.prototype.init = function (x,y,size,sprite,gravityDistance,name="Земля 2",colGroup,colGroups,game) {
    this.pricesSell={};
    this.pricesBuy={};
    this.dirToShip={};
    this.oldDirToShip= {};
    this.x=x;
    this.y = y;
    this.dirToShip = new Phaser.Point(0,0);
    this.name = name;
    this.game = game;
    this.oldDirToShip = new Phaser.Point(0,0);



    this.size = size;
    this.sprite = sprite;
    this.gravDist = gravityDistance;

    var image = game.cache.getImage(sprite);
    var atmRadius = image.width*size;

    this.b = this.game.add.sprite(this.x,this.y,this.sprite);
    this.gr = this.game.add.graphics(0,0);
    this.gr.beginFill('0xFFFFFF',0.08);
    this.gr.drawCircle(x,y,this.gravDist*2);
    this.gr.endFill();

    this.gravDistSquared = (gravityDistance)*(gravityDistance);

    this.b.scale.set(this.size);


    this.b.smoothed=false;
    this.b.anchor.set(0.5);
    this.objType = 'planet';
    this.game.physics.p2.enable(this.b, false);

    this.b.body.setCircle(this.b.width/2*1);
    this.b.body.static = true;

    this.b.body.setCollisionGroup(colGroup);
    this.b.body.collides(colGroups);
    this.b.body.parentObject = this;
    this.b.parentObject = this;

    this.pricesSell.fuel=10;
    this.pricesBuy.rock=0.7;


    this.labelPos = this.game.add.text(0, 0, this.name, { font: "30px Roboto mono", fill: "#ffffff" });
    this.labelPos.scale.set(1/this.size);


    this.labelPos.x = 0;
    this.labelPos.y = -this.size;
    this.atm = this.createAtmosphere();
    this.atmRadiusSquared = this.atmRadius*this.atmRadius;
    this.orbit = this.game.add.group(this.game.world);


    this.orbit.centerX=x;

    this.orbit.centerY=y;

};
Planet.prototype.deltaDir = function () {
    return new Phaser.Point(this.deltaDir.x-this.oldDirToShip.x,this.deltaDir.y-this.oldDirToShip.y);

};
Planet.prototype.createAtmosphere = function (atmRadius) {
    var atm = {};
    if (atmRadius===undefined)
    {
        this.atmRadius = this.b.width*1.2;
        atmRadius= this.b.width*1.2;
    }
    else
        this.atmRadius = atmRadius;
    atm = this.game.add.graphics();
    var color = "0x"+"#9499fe".slice(1, 7);
    atm.beginFill(color,0.08);
    var k = 1.4;
    atm.drawCircle(this.x,this.y,atmRadius*k  );
    atm.drawCircle(this.x,this.y,atmRadius*k*0.9  );
    atm.drawCircle(this.x,this.y,atmRadius*k*0.8  );
    atm.drawCircle(this.x,this.y,atmRadius*k*0.7  );
    atm.endFill();
    return atm;
};


var Asteroid = {

    constructor: function (x,y,size,sprite,game)
    {
        this.game = game;
        this.x=x;
        this.y = y;
        this.size = size;
        this.health = size*1000*randomInteger(90,110)/100;

        this.objType = 'asteroid';

        this.b = this.game.add.sprite(this.x,this.y,sprite);
        this.b.anchor.set(0.5);
        this.b.scale.set(this.size*4);
        this.b.smoothed= false;

        this.b.frame = randomInteger(0,7);
        this.b.rotation = 2*Math.PI*Math.random();
        this.game.physics.p2.enable(this.b,false);
        this.b.body.damping=0.0;
        this.b.body.mass=size;

        this.b.body.setCircle(this.b.width/2*0.8);
        this.initW = this.b.width;
        this.b.body.parentObject = this;
        this.b.parentObject = this;
        this.squaredRadius =  (this.b.width/2)*(this.b.width/2);

        this.breakeQuant = this.health/10;
        this.accumulatedDamage = 0;
        this.finalScale= this.b.scale.x;
        this.startHealth= this.health;
        this.totalDamage= 0;

        this.getDamage = function (weapon) {

            this.accumulatedDamage += weapon.damagePerShot * randomInteger(8,12)/10;
            if(this.accumulatedDamage>this.breakeQuant)
            {

                this.totalDamage+=this.accumulatedDamage;
                this.b.scale.set(this.finalScale * this.health / this.startHealth);
               // this.b.body.setCircle(this.b.width/2*0.8);
                this.squaredRadius = this.squaredRadius * this.b.width/this.initW *1.05;
                this.health -= this.accumulatedDamage;


                game.pickableItems.push(this.spawnMaterial(Math.round(this.accumulatedDamage * randomInteger(5, 8) / 10), Materials.asteroid1,this));
                this.accumulatedDamage = 0;
                if(this.health < this.breakeQuant*2) {

                    game.pickableItems.push(this.spawnMaterial(Math.round(this.health * randomInteger(5, 8) / 10), Materials.asteroid1,  this));
                    this.accumulatedDamage = 0;
                    this.health = -1;

                    this.b.destroy();

                }

            }


        };




    },
    spawnMaterial: function (materialVolume, materialType, obj) {

        return Object.create(Material).constructor(this.b.x+randomInteger(-5,5),this.b.y+randomInteger(-5,5), this.game,
            materialType,this.game.spaceBodiesColGroup,[this.game.spaceBodiesColGroup,this.game.playerColGroup],materialVolume);


    }

};

