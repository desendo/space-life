//game.enemies = new EnemyGroup(planets[0].x,(planets[0].y-planets[0].b.width*0.56-500),300,0,0.05,true,game);

ObjTypes=
    {
        planet:{name:"planet"},
        asteroid:{name:"asteroid"},
        material:{name:"material"},
        equipment:{name:"equipment"},
        ship:{name:"ship"},
        player:{name:"player"}

    };
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
    this.game.interfaceGroup.add(this);
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


var Planet = function (data,game) {
    var x = data.x;
    var y = data.y;
    var size = data.size;
    var name = data.name;
    var gravityRadius = data.gravityRadius;
    var sprite = data.sprite;

    var colGroup = game.spaceBodiesColGroup;
    var colGroups = [game.spaceBodiesColGroup,game.playerColGroup];


    this.init(x,y,size,sprite,gravityRadius,name="Земля 2",colGroup,colGroups,game);

    game.planets.push(this);
    game.spaceObjects.push(this);
    this.b.body.setMaterial(game.planetMaterial);
    this.b.body.onBeginContact.add(this.contactHandler,this);

    this.planetType = this.mars;
};
Planet.prototype = {


    earth: {
        water: "0x"+"#52a8fd".slice(1, 7),
        soil: "0x"+"#449933".slice(1, 7),
        clouds: "0x"+"#cadee3".slice(1, 7),
        mounts: "0x"+"#346925".slice(1, 7),
        ice: "0x"+"#def0fc".slice(1, 7)

    },
    mars: {
        sand: "0x"+"#c45134".slice(1, 7),
        darksand: "0x"+"#bb2720".slice(1, 7)

    }
};
Planet.prototype.init = function (x,y,size,sprite,gravityRadius,name="Земля 2",colGroup,colGroups,game) {

    this.pricesSell={};
    this.pricesBuy={};
    this.dirToShip={};
    this.oldDirToShip= {};
    this.x = x +game.worldSize/2;
    this.y = y +game.worldSize/2;
    this.dirToShip = new Phaser.Point(0,0);
    this.name = name;
    this.game = game;
    this.oldDirToShip = new Phaser.Point(0,0);

    this.orbitGroup = this.game.add.group(this.game.spaceObjectsLayer,"orbit of"+this.name);



    this.size = size;
    this.sprite = sprite;
    this.gravityRadius = gravityRadius;

    var image = game.cache.getImage(sprite);
    var atmRadius = image.width*size;

    this.b = this.game.add.sprite(this.x,this.y,this.sprite);
    this.orbitGroup.add(this.b);
    this.gr = this.game.add.graphics(0,0);
    this.gr.beginFill('0xFFFFFF',0.05);
    this.gr.drawCircle(this.x,this.y ,this.gravityRadius*2);
    this.gr.endFill();
    this.orbitGroup.add(this.gr);

    this.gravRadSquared = (gravityRadius)*(gravityRadius);

    this.b.scale.set(this.size);


    this.b.smoothed=false;
    this.b.anchor.set(0.5);
    this.objType = ObjTypes.planet;
    this.game.physics.p2.enable(this.b, false);

    this.b.body.setCircle(this.b.width/2*1);
    this.b.body.static = true;

    this.b.body.setCollisionGroup(colGroup);
    this.b.body.collides(colGroups,this.meteorStrike,this);
    this.b.body.collides(colGroups);
    this.b.body.parentObject = this;
    this.b.parentObject = this;

    this.pricesSell.fuel=10;
    this.pricesBuy.rock=0.7;


    this.labelPos = this.game.add.text(0, 0, this.name, { font: "30px Roboto mono", fill: "#ffffff" });
    this.labelPos.scale.set(1/this.size);


    this.labelPos.x = 0;
    this.labelPos.y = -this.size;
    this.atm = game.add.sprite(this.x,this.y,this.createAtmosphere());
    this.atm.anchor.set(0.5);

    this.orbitGroup.add(this.atm);
    this.atmRadiusSquared = this.atmRadius*this.atmRadius;
    // this.spr = this.game.add.sprite(this.x,this.y,this.generateSprite());
    // this.spr.anchor.set(0.5);
    this.bmd = game.add.bitmapData(96,96);



    var wb = this.b.width/this.size;

    this.bmd.draw(this.b,wb/2*3,wb/2*3,3,3);

    this.bmd.draw(this.atm,wb/2*3,wb/2*3,3*wb,3*wb);


    //this.bmd.update();

     this.bmd.update();
    //
     this.spr = game.add.sprite(75,this.game.camera.height-75,this.bmd);
     this.spr.anchor.set(0.5);
     this.spr.smoothed =false;
     this.spr.fixedToCamera = true;
     this.spr.visible = false;

};
Planet.prototype.deltaDir = function () {
    return new Phaser.Point(this.deltaDir.x-this.oldDirToShip.x,this.deltaDir.y-this.oldDirToShip.y);

};
Planet.prototype.meteorStrike = function () {
    //console.log("meteor strike");
  var meteor = arguments[1].parentObject;
    if(meteor.objType===ObjTypes.asteroid)
    {
     //   console.log("meteor.objType ",meteor.objType);
        meteor.explode();
    }
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
    atm.drawCircle(0,0,atmRadius*k  );
    atm.drawCircle(0,0,atmRadius*k*0.9  );
    atm.drawCircle(0,0,atmRadius*k*0.8  );
    atm.drawCircle(0,0,atmRadius*k*0.7  );
    atm.endFill();
    atm = atm.generateTexture();

    return atm;
};
Planet.prototype.update = function () {
    var go ={};
    var d=0;
    for (var i = 0,j = this.game.spaceObjects.length;i <j; i++)
  {

      go = this.game.spaceObjects[i];
      if(go.objType!==ObjTypes.planet) {
          d = (go.b.x - this.b.x) * (go.b.x - this.b.x) + (go.b.y - this.b.y) * (go.b.y - this.b.y);
          if (go !== null && (go.objType === ObjTypes.asteroid|| go.objType === ObjTypes.player)&& d < this.gravRadSquared) {
              go.dirToObj = new Phaser.Point(go.b.x - this.b.x, go.b.y - this.b.y);
              go.dirToObj.normalize();
            //  var q = (d + 2500 * this.b.width) / (this.size * this.size * 100000);
              var q = (d +2500*this.b.width) /(this.size*this.size *700000);

              go.b.body.force.x = -go.dirToObj.x / ( q) * go.b.body.mass;
              go.b.body.force.y = -go.dirToObj.y / (q) * go.b.body.mass;
              go.isGrav = true;


          }
          if (go.b.exists === true && d < this.atmRadiusSquared/2) {

              //go.inAtmo = true;

              go.affectByAtmo();


          }
          else {
             if(go.glow) {
                 //console.log(go.glow.visible);
                 //go.glow.visible = false;
             }
          }
      }
  }
};
Planet.prototype.generateSprite= function () {

    var d = 550;
    var r = d/2;
    var g = this.game.add.graphics(0,0);
    g.beginFill(this.earth.water,1);
    g.drawCircle(0,0,d);
    g.beginFill(this.earth.soil,1);
    g.drawPolygon([
        new Phaser.Point(0,0),
        new Phaser.Point(0,-r),
        new Phaser.Point(Math.cos(20)*(r),Math.sin(20)*(-r))
    ]);
    g.endFill();
    return g.generateTexture();

};
Planet.prototype.getSaveData = function() {
    var data = {};
    data.x = this.b.x - this.game.worldSize/2;
    data.y = this.b.y - this.game.worldSize/2;
    data.size = this.size;
    data.sprite = this.b.key;
    data.gravityRadius = this.gravityRadius;
    return data;
};
Planet.prototype.contactHandler = function () {

    if(arguments[0].parentObject) {


        var pos = arguments[4][0].bodyA.position;
        var pt = arguments[4][0].contactPointA;
        var game = arguments[0].parentObject.game;
        var cx = game.physics.p2.mpxi(pos[0] + pt[0]);
        var cy = game.physics.p2.mpxi(pos[1] + pt[1]);


    }
};
var Asteroid = function (data,game) {
    var x = data.x;
    var y = data.y;
    var size = data.size;
    var sprite = data.sprite;
    var frame = data.frame;
    var material = data.material;
    this.init(x,y,size,sprite,game,frame,data,material);


};
Asteroid.prototype = {
    isAtmo : false,
    isGrav : false,
    damping : 0.1,
    objType : ObjTypes.asteroid

};
Asteroid.prototype.init = function (x,y,size,sprite,game,frame,data,material) {

    this.game = game;
    this.x= x + game.worldSize/2;
    this.y = y + game.worldSize/2;
    this.size = size;
    this.health = size*250;
    this.material  = material;

    this.b = this.game.add.sprite(this.x,this.y,sprite);
    this.b.anchor.set(0.5);
    this.b.scale.set(this.size);
    this.b.smoothed= false;

    this.b.frame = frame || randomInteger(0,7);
    this.b.rotation = 2*Math.PI*Math.random();
    this.game.physics.p2.enable(this.b,GLOBAL.IS_DEBUG);
    this.b.body.damping=0.0;
    this.b.body.mass=size;

    this.b.body.setCircle(this.b.width/2*0.8);

    this.b.body.parentObject = this;
    this.b.parentObject = this;
    this.squaredRadius =  (this.b.width/2)*(this.b.width/2);
    this.game.spaceObjectsLayer.add(this.b);
    this.breakeQuant = this.health/10;

    this.accumulatedDamage = 0;

    this.initW = this.b.width;
    this.initialScale= this.b.scale.x;
    this.startHealth= this.health;




    game.spaceObjects.push(this);

    this.b.body.setCollisionGroup(game.spaceBodiesColGroup);
    this.b.body.collides([game.spaceBodiesColGroup, game.playerColGroup]);

    this.addBurningEffect();

};
Asteroid.prototype.addBurningEffect  = function () {
    this.glow = this.game.add.group(this.b);
    this.glow1 = this.game.add.sprite(0,0,'glow',0);
    this.glow2 = this.game.add.sprite(0,0,'glow',1);
    this.glow3 = this.game.add.sprite(0,0,'glow',2);

    this.glow.add(this.glow3);
    this.glow.add(this.glow2);
    this.glow.add(this.glow1);
    var k = 0;
    this.glow.forEach(function (item,i) {
        item.scale.set(0.5+k*0.2);
        item.alpha = 0.0;
        item.smoothed = false;
        item.anchor.set(0.5);
        k++;
    },this);


    this.glow.visible = false;
    this.game.add.tween(this.glow.scale).to( {x: 1.05, y: 1.05}, 40, Phaser.Easing.Back.InOut, true, 0, false).yoyo(true);
};
Asteroid.prototype.affectByAtmo = function () {
    this.glow.visible = true;
    for(var i =0; i < this.glow.children.length; i++) {
        this.game.add.tween(this.glow.children[i]).to({alpha: 0.8},400, Phaser.Easing.Linear.None, true);
    }
};
Asteroid.prototype.getDamage = function (dmg,x,y) {
    //var weapon = bullet.weapon;

    this.accumulatedDamage += dmg * randomInteger(8,12)/10;
    if(this.accumulatedDamage>this.breakeQuant)
    {


        this.b.scale.set(this.initialScale * Math.sqrt(this.health / this.startHealth)*(this.health / this.startHealth));

        // this.b.body.setCircle(this.b.width/2*0.8);
        this.squaredRadius = this.squaredRadius * this.b.width/this.initW *1.05;
        this.health -= this.accumulatedDamage;

        if(x===undefined && y===undefined )
        {
            y = this.b.y;
            x = this.b.x;
        }


        this.game.pickableItems.push(this.spawnMaterial(x,y,Math.round(this.accumulatedDamage * randomInteger(5, 8) / 10), this.material,this));
        this.accumulatedDamage = 0;
        if(this.health < this.breakeQuant*2) {

            this.game.pickableItems.push(this.spawnMaterial(x,y,Math.round(this.health * randomInteger(5, 8) / 10), this.material,  this));
            this.accumulatedDamage = 0;
            this.health = -1;

            this.b.destroy();

        }

    }



};
Asteroid.prototype.update = function () {
    if(!this.isAtmo) {
        //   this.glow.visible = false;
    }
    if(  this.b.body) {
        if (this.isAtmo)
            this.b.body.damping = 0.7;
        else if (this.isGrav)
            this.b.body.damping = 0;
        else

            this.b.body.damping = this.damping || 0;
    }
};
Asteroid.prototype.explode = function () {
    this.b.exists = false;
    this.game.explosionEmiter.x = this.b.x;
    this.game.explosionEmiter.y = this.b.y;
    this.game.explosionEmiter.start(true,500,50,200);
};
Asteroid.prototype.spawnMaterial = function (x,y,materialVolume, materialType, obj) {


    return Object.create(Material).constructor(x,y, this.game,
        materialType,this.game.spaceBodiesColGroup,[this.game.spaceBodiesColGroup,this.game.playerColGroup],materialVolume);

};
Asteroid.prototype.getSaveData = function() {
    var data = {};
    data.x = this.b.x - this.game.worldSize/2;
    data.y = this.b.y - this.game.worldSize/2;
    data.scale = this.b.scale.x;
    data.sprite = this.b.key;
    data.frame = this.b.frame;
    data.initW = this.initW;
    data.size = this.size;
    data.initialScale= this.initialScale;
    data.rotation = this.b.rotation;
    data.breakeQuant = this.breakeQuant ;

    data.accumulatedDamage = this.accumulatedDamage;
    data.health = this.health;
    data.material = this.material;


    return data;


};

