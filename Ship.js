/**
 * Created by goblino on 13.10.2017.
 */
Behavior = {};
Behavior.hostility = {

    hostile: "hostile",
    neutral: "neutral",
    friendly: "friendly"


};
Behavior.actions = {
    idle:{name:"idle"}

};
Behavior.behaviors = {

    guardian1 :{
        hostility: Behavior.hostility.hostile,
        defaultAction: Behavior.actions.idle,
        detectionRadius: 800*800,
        shootingRadius: 400*400

    }

};

var AI = function (behavior,par) {

    this.behavior = behavior;
    this.par = par;
    this.init();

};
AI.prototype = {};
AI.prototype.checkIfNear = function(obj,squaredRadius)
{

    return (
        (this.par.b.x-obj.b.x)*(this.par.b.x-obj.b.x)+
        (this.par.b.y-obj.b.y)*(this.par.b.y-obj.b.y))<squaredRadius;

};
AI.prototype.rotateTo = function (target) {

    console.log(this.par.dir," dir");
    var dirToTarget = new Phaser.Point(-this.par.b.x+target.b.x,this.par.b.y-target.b.y);
    dirToTarget.normalize();
    console.log(this.par.dir,dirToTarget);
};
AI.prototype.init = function()
{
console.log("ai inited");
this.counter =0;
this.counter20=20; //20 frames
this.counter60=60;
this.counter10=10;
};
AI.prototype.update = function () {

    if(this.counter20===0)
    {
        console.log("upd20");
        if(this.checkIfNear(this.par.game.ship,this.behavior.shootingRadius))
        {
            this.isShooting = true;
        }
        else
        {
            this.isShooting = false;
        }

        if(this.checkIfNear(this.par.game.ship,this.behavior.detectionRadius))
        {
            this.rotateTo(this.par.game.ship);
        }

        this.counter20=20;
    }
    else
    {
        this.counter20--;
    }

    if(this.par.eq.weapon && this.isShooting)
        this.par.weapon.fire();

};
var MiniHud = function (obj) {
    this.init(obj);
    this.addBars();

};
MiniHud.prototype = {};
MiniHud.prototype.addBars = function () {
    var x = this.par.x;
    var y = this.par.y;

    var g = this.game.add.graphics(0,0);
    g.beginFill('0xffffff',1);
    g.drawRect(0,0,1,1);
    g.endFill();

    this.health = this.game.add.sprite(x,y-50,g.generateTexture());
    this.healthback = this.game.add.sprite(x,y-50,g.generateTexture());

    this.health.scale.set(40,5);
    this.healthback.scale.set(50,5);
    this.healthback.tint = "0x999999";

    this.hud.add(this.healthback);
    this.hud.add(this.health);


    this.hud.forEach(function (obj) {
       obj.anchor.set(0.5);
    });

    this.hud.visible = false;
    //todo добавить перечисление всех объектов в виде полоски и отображеие
};
MiniHud.prototype.init = function (obj) {


    this.game = obj.game || obj.b.game;

    if (obj instanceof Phaser.Sprite)
        this.par = obj;
    else if (obj.b instanceof Phaser.Sprite)
        this.par = obj.b;
    else
        console.log("obj of minihud is not valid. has to be ")
    this.hud = this.game.add.group(this.game.world);

    if (this.par.body!==undefined)
        this.attachedToBody = true;

    this.game = obj.game || this.par.game || game;

    this.hud.pivot.x = this.par.x||0;
    this.hud.pivot.y = this.par.y||0;
    this.hud.position.x = this.par.x||0;
    this.hud.position.y = this.par.y||0;
    this.offsetX = 0;
    this.offsetY = 0;
};
MiniHud.prototype.updatePosition = function () {
    if(this.attachedToBody) {

        this.hud.x = this.par.x + this.offsetX+ this.par.body.velocity.x / 60;
        this.hud.y = this.par.y + this.offsetY+ this.par.body.velocity.y / 60;
    }
    else
    {
        this.hud.x = this.par.b.x + this.offsetX;
        this.hud.y = this.par.b.y + this.offsetY ;
    }
};
MiniHud.prototype.hide = function () {
    console.log("hide");
   this.hud.visible = false;
};
MiniHud.prototype.show = function () {
    this.hud.visible = true;

    console.log("show");

};
function DamagableObj(maxHealth) {
    this.hpmax = maxHealth;
    this.hp = this.hpmax;

};
DamagableObj.prototype.getDamage = function (damage) {
    this.hp-=damage;

    if(this.hp<=0)
    {
        this.Destruct();

    }





};
function Ship (x,y,game,data) {
    var colGroup = game.spaceBodiesColGroup;
    var colGroups = [game.spaceBodiesColGroup,game.playerColGroup];
    DamagableObj.apply(this,[this.eq.hull.mass]);
    this.init(x,y,game,colGroup,colGroups);

};


Ship.prototype = Object.create(DamagableObj.prototype);
Ship.prototype.consumeFuel = function (value) {

    if(value >0) {
        this.fuel -= value;
    }
};
Ship.prototype.compensate = function(){


    if (this.vel > 1) {

        var dampQuotient = 1;
        var dumpThreshold = 4;

        if (this.vel < dumpThreshold) {dampQuotient=Math.sqrt(this.vel/dumpThreshold);}


        if (Math.cos(this.turnAngle) > 0) {
            this.backward(Math.cos(this.turnAngle) * dampQuotient ,true);
                this.sideThrust(-Math.sin(this.turnAngle)* dampQuotient ,true);
        }
        else
        {
            this.forward(-Math.cos(this.turnAngle)* dampQuotient ,true);
            this.sideThrust(-Math.sin(this.turnAngle)* dampQuotient ,true);
        }

    }
    else {
        this.sideThrust(0);
    }

};
Ship.prototype.affectByAtmo = function(){

    if(this.vel > 20) {

    }




};
Ship.prototype.update = function () {

    this.isThrottling=false;
    this.isThrottlingBack=false;
    this.isThrottlingLeftSide=false;
    this.isThrottlingRightSide=false;

    if(this.b.exists && this.b.body!==null) {
        this.vel = Math.sqrt(this.b.body.velocity.x * this.b.body.velocity.x + this.b.body.velocity.y * this.b.body.velocity.y);

        this.acc = Math.round(-(+this.oldVel - +this.vel) * 10) / 10;
    }

    this.miniHud.updatePosition();
    if(this.weapon!==undefined && this.weapon!==null) {
        this.updateWeapon();

        this.checkBulletsForHits(this.game.spaceObjects);
    }

};
Ship.prototype.init =  function (x,y,game,colGroup,colGroups) {
    this.game = game;

    this.acc = 0;
    this.vel = 0;
    this.oldVel = 0;

    this.sin = 0;
    this.cos = 1;

    this.health =this.eq.hull.mass;

    this.b = this.game.add.sprite(x,y,this.eq.hull.sprite);
    this.b.inputEnabled = true;

    this.b.anchor.set(0.5);
    this.b.smoothed=false;
    this.b.scale.set(this.eq.hull.scale || 2);


    this.game.physics.p2.enable(this.b,GLOBAL.IS_DEBUG);
    this.b.body.damping=this.damping || 0.5;
    this.b.body.setCircle(this.b.width/3,0,0);

    this.b.body.setCollisionGroup(colGroup);
    this.game.spaceObjects.push(this);
    // if(colGroups!==undefined)
    //     this.b.body.collides(colGroups);


    this.game.spaceObjectsLayer.add(this.b);

    this.b.body.setMaterial(this.game.shipMaterial);


    this.b.parentObject = this;
    this.b.body.parentObject = this;
    Object.defineProperty(this, "mass", {
        get: function() {
            return this.b.body.mass*1000;
        },

        set: function(value) {


            this.b.body.mass = Math.abs(value)/1000;


        }
    });
    this.mass = this.eq.hull.mass;



    this._thrustCurrent= 0;
    Object.defineProperty(this, "velNorm", {
        get: function() {
            return new Phaser.Point(
                this.b.body.velocity.x / this.vel,
                this.b.body.velocity.y / this.vel);
        }
    });
    Object.defineProperty(this, "turnAngle", {
        get: function() {
            var d = this.dir;
            var v = this.velNorm;
            var angle;


            if (this.vel > 5) {

                angle = +Math.acos(d.x * v.x + d.y * v.y);
                if (v.cross(d) < 0)
                    angle = -angle;

                return angle;
            }
            else
                return 0;
        }
    });
    Object.defineProperty(this, "dir", {
        get: function() {
            return (new Phaser.Point(Math.sin(this.b.body.rotation), -Math.cos(this.b.body.rotation)));

        }
    });
    Object.defineProperty(this, "thrustCurrent", {
        get: function() {
            return this._thrustCurrent;

        },
        set: function (val) {
            if (val > this.thrustMaximum)
                val = this.thrustMaximum;
            if (val < 0)
                val = 0;

            this._thrustCurrent = val;
        }
    });
    Object.defineProperty(this, "thrustCurrentDamp", {
        get: function() {
            return this._thrustCurrentDamp||0;

        },
        set: function (val) {
            if (val > this.thrustMaximum)
                val = this.thrustMaximum;
            if (val < 0)
                val = 0;

            this._thrustCurrentDamp = val;
        }
    });




    this.damping = 0;
    this.b.body.damping = this.damping;




    this.b.animations.add('fly',[0,1,2,3],50,true);
    this.b.animations.add('stop',[4],5,true);
    this.b.animations.add('rfly',[5,6,7,8],50,true);

    this.objType= ObjTypes.ship;



    this.cargoItemsGroup = this.game.add.group();
    this.installedEquipmentGroup = this.game.add.group();
    this.cargoItemsGroup.fixedToCamera = true;
    this.installedEquipmentGroup.fixedToCamera = true;

    this.planetsTotalGravity = new Phaser.Point(0,0);
    this.knownObjects = [];

    //this.createPickableObjects();
    this.initSecondaryEngines();
    this.addMiniHud(1);

    this.b.events.onInputOver.add(this.miniHud.show,this.miniHud);
    this.b.events.onInputOut.add(this.miniHud.hide,this.miniHud);


   this.b.body.onBeginContact.add(this.contactHandler,this);
    this.b.body.onEndContact.add(function () {
        if(arguments[0].parentObject && arguments[0].parentObject.objType===ObjTypes.planet) {
            this.touched =false;
        }
    },this);



};
Ship.prototype.contactHandler = function () {


    if(arguments[0].parentObject && arguments[0].parentObject.objType===ObjTypes.planet) {
        this.touched = true;
    }

    if(arguments[0].parentObject) {


        var pos = arguments[4][0].bodyA.position;
        var pt = arguments[4][0].contactPointA;
        var game = arguments[0].parentObject.game;
        var cx = game.physics.p2.mpxi(pos[0] + pt[0]);
        var cy = game.physics.p2.mpxi(pos[1] + pt[1]);

        //arguments[0].parentObject.contactPointX = cx;
        //arguments[0].parentObject.contactPointY = cy;

         game.damageEmiter.x = cx;
         game.damageEmiter.y = cy;
         game.damageEmiter.start(true, 500,100,20);

    }
};
Ship.prototype.Destruct = function(){

    this.isDead=true;
    this.isThrottling = false;
    this.isThrottlingLeftSide = false;
    this.isThrottlingRightSide = false;

    this.game.explosionEmiter.x = this.b.x;
    this.game.explosionEmiter.y = this.b.y;
    this.game.explosionEmiter.start(true, 1500, null, 50);

    this.b.body.velocity.x =0;
    this.b.body.velocity.y =0;
    this.b.exists = false;
    this.b.visible = false;

    if(this.weapon) {
        this.weapon.destruct();
    }




};
Ship.prototype.addMiniHud = function (level) {
  this.miniHud = new MiniHud(this,level);
};
Ship.prototype.updateWeapon = function () {
    if(this.eq.weapon!=null) {


        this.weapon.fireAngle = 180 * this.b.rotation / Math.PI + 270;
        this.weapon.fireFrom = new Phaser.Rectangle(this.b.x - this.sin * 25, this.b.y - this.cos * 25, 1, 1);
        this.weapon.bullets.forEach(function (bullet) {

            bullet.x += bullet.velocityx ;
            bullet.y += bullet.velocityy ;

        })


    }
};
Ship.prototype.checkBulletsForHits = function(gameObjects)    {
    var l = gameObjects.length;
    var gameObject = {};
        for (var i = 0,j = this.weapon.bulletsAmountinPool;i<j;i++ ) {
        var b = this.weapon.bullets[i];
        if(b.visible)
        {

            for(var k = 0;k<l;k++)
            {gameObject = gameObjects[k];
                if (gameObject.b.exists && gameObject.b.body !== null && gameObject!= this) {

                    if (b.armed
                        && Phaser.Rectangle.intersects(gameObject.b.getBounds(),
                            b.getBounds())) {


                        if (gameObject.objType === ObjTypes.asteroid) {

                            if(((gameObject.b.x - b.x)*(gameObject.b.x - b.x)+(gameObject.b.y - b.y)*(gameObject.b.y - b.y)) < gameObject.squaredRadius) {

                                gameObject.getDamage(b.weapon.damagePerShot,b.x,b.y);

                                if(gameObject.b.game!=null && gameObject.b.game.effectsEnabled) {
                                    gameObject.b.game.damageEmiter.x = b.x;
                                    gameObject.b.game.damageEmiter.y = b.y;
                                    gameObject.b.game.damageEmiter.start(true, 500, null, 5);
                                }
                                b.init();
                                if (gameObject.health < 0) {
                                    gameObject = {};
                                }
                            }
                        }
                        if (gameObject.objType === ObjTypes.ship || gameObject.objType === ObjTypes.player) {
                                if (((gameObject.b.x - b.x) * (gameObject.b.x - b.x) + (gameObject.b.y - b.y) * (gameObject.b.y - b.y)) < (gameObject.b.width/2)*(gameObject.b.width/2)) {
                                    if (gameObject.b.game != null && gameObject.b.game.effectsEnabled) {
                                        gameObject.b.game.damageEmiter.x = b.x;
                                        gameObject.b.game.damageEmiter.y = b.y;
                                        gameObject.b.game.damageEmiter.start(true, 500, null, 5);
                                        gameObject.DamageHandler(this.weapon.damagePerShot);
                                        b.init();

                                    }
                                }
                            }
                        }

                    }
                }
            }

        }
    };
Ship.prototype.initSecondaryEngines = function () {

    var sprite = this.eq.hull.secondaryEnginesSprite;
    var engineRotLeft = this.game.add.sprite(0,0,sprite);
    var engineRotRight = this.game.add.sprite(0,0,sprite);

    var engineMarchLeft = this.game.add.sprite(0,0,sprite);
    var engineMarchRight = this.game.add.sprite(0,0,sprite);

    engineRotLeft.anchor.set(0.5);
    engineRotRight.anchor.set(0.5);

    engineMarchLeft.anchor.set(0.5);
    engineMarchRight.anchor.set(0.5);

    engineRotRight.animations.add('thrustRotR',[0,1],20,true);
    engineRotLeft.animations.add('thrustRotL',[3,4],20,true);

    engineMarchRight.animations.add('thrustR',[0,1],10,true);
    engineMarchLeft.animations.add('thrustL',[3,4],10,true);

    engineRotRight.animations.add('stop',[2],1,true);
    engineRotLeft.animations.add('stop',[2],1,true);

    engineMarchRight.animations.add('stop',[2],1,true);
    engineMarchLeft.animations.add('stop',[2],1,true);

    engineRotRight.animations.play('stop',true);
    engineRotLeft.animations.play('stop',true);
    engineMarchRight.animations.play('stop',true);
    engineMarchLeft.animations.play('stop',true);

    this.b.addChild(engineRotLeft);
    this.b.addChild(engineRotRight);
    this.b.addChild(engineMarchLeft);
    this.b.addChild(engineMarchRight);


    engineRotLeft.x = -7;
    engineRotRight.x = 7;
    engineRotLeft.y = -7;
    engineRotRight.y = -7;
    engineRotLeft.angle=20;
    engineRotRight.angle=-20;

    engineMarchLeft.scale.set(1.2);
    engineMarchRight.scale.set(1.2);
    engineMarchRight.smoothed= false;
    engineMarchLeft.smoothed= false;

    engineMarchLeft.x = -12;
    engineMarchRight.x = 12;
    engineMarchLeft.y = 3;
    engineMarchRight.y = 3;
    engineMarchLeft.angle=0;
    engineMarchRight.angle=0;

    this.engineRight = engineRotRight;
    this.engineMarchRight = engineMarchRight;
    this.engineLeft = engineRotLeft;
    this.engineMarchLeft = engineMarchLeft;
};
Ship.prototype.playAnimations = function () {


    if (this.isThrottlingRightSide)
    {
       this.engineMarchRight.animations.play('thrustR', 20, true);

    }

    else
        this.engineMarchRight.animations.play('stop',true);

    if (this.isThrottlingBack || this.isThrottling )

    {

        if(this.isThrottlingBack)
        {
            this.b.animations.play('rfly',true);

        }
        if(this.isThrottling)
        {


            this.b.animations.play('fly',true);
        }

    }
    else
    {

        this.b.animations.play('stop', true);

    }
    if (this.isThrottlingLeftSide)
    {
        this.engineMarchLeft.animations.play('thrustL', 20, true);

    }
    else
        this.engineMarchLeft.animations.play('stop',true);

    if(this.fuel<=0) {
        this.b.animations.play('stop', true);
        this.engineMarchRight.animations.play('stop',true);
        this.engineMarchLeft.animations.play('stop',true);
    }

};
Ship.prototype.accRotateLeft = function () {
    if(this.eq.engine) {
        if (this.rotationThrustCurrent < this.rotationThrust) {
            this.rotationThrustCurrent += (this.rotationThrustCurrent + 0.01) / this.rotationThrust * 2 + 1;
        }

        this.rotateLeft();
    }
};
Ship.prototype.accRotateRight = function () {

    if(this.eq.engine) {
        if (this.rotationThrustCurrent < this.rotationThrust) {
            this.rotationThrustCurrent += (this.rotationThrustCurrent + 0.01) / this.rotationThrust * 2 + 1;
        }
        this.rotateRight();
    }
};
Ship.prototype.rotateRight = function () {
    if(this.fuel>0 && this.eq.engine) {
        this.b.body.rotateRight(this.rotationThrustCurrent);
        this.engineLeft.animations.play('thrustRotL', 10, true);

        this.consumeFuel(this.eq.engine.rotationFuelConsumption * this.rotationThrustCurrent / this.rotationThrust);

    }

};
Ship.prototype.rotateLeft = function () {
    if(this.fuel>0 && this.eq.engine) {
        this.b.body.rotateLeft(this.rotationThrustCurrent);
        this.engineRight.animations.play('thrustRotR', 10, true);

        this.consumeFuel(this.eq.engine.rotationFuelConsumption * this.rotationThrustCurrent / this.rotationThrust);

    }

};
Ship.prototype.forward = function (q = 1,damping = false) {

    if(this.isLanded && !this.isDead)
    {

        this.unLand();
    }

    if(this.fuel>0 ) {
        //this.isLanded=false;
        if (damping)
        {
            this.b.body.thrust(this.thrustCurrentDamp  * q);
            this.consumeFuel(this.eq.engine.fuelConsumption * this.thrustCurrentDamp / this.thrustMaximum  * q);

        }
        else
        {
            this.b.body.thrust(this.thrustCurrent  * q);
            this.consumeFuel(this.eq.engine.fuelConsumption * this.thrustCurrent / this.thrustMaximum  * q);

        }

        this.isThrottling = true;


    }

};
Ship.prototype.backward = function (q = 1,damping = false) {
    if(this.fuel>0 ) {
        if (damping)
        {
            this.b.body.reverse(this.thrustCurrentDamp / 2 * q);
            this.consumeFuel( this.eq.engine.fuelConsumption * this.thrustCurrentDamp / this.thrustMaximum / 2 * q);

        }
        else
        {
            this.b.body.reverse(this.thrustCurrent / 2 * q);
            this.consumeFuel(this.eq.engine.fuelConsumption * this.thrustCurrent / this.thrustMaximum / 2 * q);

        }
        this.isThrottlingBack = true;


    }
};
Ship.prototype.sideThrust = function (q = 1,damping = false) {
    if(this.fuel>0 && this.eq.engine) {

        if (q !== 0){
            if (damping) {
                this.b.body.thrustLeft(this.thrustCurrentDamp * q/2);
                this.consumeFuel(this.eq.engine.fuelConsumption * this.thrustCurrentDamp / this.thrustMaximum  * q/2);
            }
            else {
                this.b.body.thrustLeft(this.thrustCurrent * q/2);
                this.consumeFuel(this.eq.engine.fuelConsumption * this.thrustCurrent / this.thrustMaximum  * q/2);


            }
            if (q > 0) {
                this.isThrottlingRightSide = true;

            }

            else if (q < 0)
                this.isThrottlingLeftSide = true;


        }
        else
        {

            this.isThrottlingLeftSide = false;
            this.isThrottlingRightSide = false;
        }



    }
    else
    {

        this.isThrottlingLeftSide = false;
        this.isThrottlingRightSide = false;
    }

};
Ship.prototype.calcEquipmentDependedParams = function () {


    if(this.eq.engine) {

        this.thrustMaximum = this.eq.engine.thrustMax;
        this.rotationThrust = this.eq.engine.rotationMax;
        this.thrustCurrent = (this.thrustCurrentOld<this.thrustMaximum ? this.thrustCurrentOld : this.thrustMaximum )|| this.thrustMaximum*1;
        this.thrustCurrentDamp = (this.thrustCurrentDampOld<this.thrustMaximum ? this.thrustCurrentDampOld: this.thrustMaximum )|| this.thrustMaximum*1;

    }
    else
    {
        this.thrustCurrentOld = this.thrustCurrent;
        this.thrustCurrentDampOld = this.thrustCurrentDamp;
        this.thrustMaximum = 0;
        this.rotationThrust = 0;
        this.thrustCurrent = this.thrustMaximum/2;
        this.thrustCurrentDamp = this.thrustMaximum/2;
    }

    if(this.eq.weapon) {

        this.weapon = this.weapon || new Alt.Weapon(this.eq.weapon,this.game,this);

    }
    else {

        if(this.weapon)
        {

            this.weapon.destruct();
            this.weapon = null;

        }

    }

    if(this.eq.grabber) {

        this.grabber = this.createGrabber();
    }
    else
    {
        this.grabber = null;
        this.grabRadius = 0;
    }

    if(this.eq.radar) {


            this.game.userInterface.miniMap.enabled = true;
            this.game.onRadarEnabled.dispatch(this);

    }
    else
    {

            this.game.userInterface.miniMap.enabled = false;
            this.game.onRadarDisabled.dispatch(this);

    }

    if(this.eq.generator) {
        //console.log("enabling generator");

        this.game.onGeneratorEnabled.dispatch(this);

//        console.log("generator enabled");
    }
    else
    {
        this.game.onGeneratorDisabled.dispatch(this);
    }
    if(this.eq.capacitor) {
  //      console.log("enabling capacitor");
        this.game.onCapacitorEnabled.dispatch(this);
    //    console.log("capacitor enabled");
    }
    else
    {
        this.game.onCapacitorDisabled.dispatch(this);
    }


};
Ship.prototype.loadData = function (data) {

    for (var i in data) {
        this[i] = data[i];
        //console.log(data[i]);
    }

    this.hull = Equipment.Hulls[data.eq.hull.id];

};
Ship.prototype.getSaveData = function () {

    var savedata = {};
    savedata.x = this.b.x - this.game.worldSize/2;
    savedata.y = this.b.y - this.game.worldSize/2;
    savedata.rotation = this.b.body.rotation;
    savedata.simulation = this.b.exists;


    savedata.velocityx = this.b.body.velocity.x;
    savedata.velocityy = this.b.body.velocity.y;
    savedata.isFreeFlight = this.isFreeFlight;
    return savedata;
};
Ship.prototype.loadPhysicsFromData = function (data) {
    this.b.body.velocity.x = data.velocityx || 0;
    this.b.body.velocity.y = data.velocityy || 0;
    this.b.body.rotation = data.rotation || 0;
    console.log(this.objType, data.rotation);
};
function NPC (data,game){

    this.loadData(data);
    this.x = game.worldSize/2 + this.x;
    this.y = game.worldSize/2 + this.y;

    Ship.apply(this, [this.x || 0, this.y || 0, game] );
    this.loadPhysicsFromData(data);
    this.ai = new AI(Behavior.behaviors.guardian1,this);

    this.b.body.collides(this.game.spaceBodiesColGroup, this.colCallback, this);
    this.eq.engine = Equipment.Engines.RD300;
    this.eq.weapon = Equipment.Weapons.Laser1;
    this.calcEquipmentDependedParams();
    this.fuel = 20;
    this.weapon.fire();

}
NPC.prototype = Object.create(Ship.prototype);
NPC.prototype.update = function () {
    if(this.b.exists) {
        Ship.prototype.update.apply(this);
        this.sin = Math.sin(-this.b.rotation);
        this.cos = Math.cos(this.b.rotation);
        if(this.ai)
            this.ai.update();

       //this.forward();
    }
};
NPC.prototype.colCallback = function () {

};
NPC.prototype.getSaveData = function () {

    var savedata ={};
    savedata = Ship.prototype.getSaveData.apply(this);
    savedata.fuel = this.fuel;
    savedata.money = this.money;

    savedata.simulation = this.b.exists;



    return savedata;



};

function Player(data, game) {


    this.loadData(data);

    this.x = game.worldSize/2 + this.x;
    this.y = game.worldSize/2 + this.y;

    Ship.apply(this, [this.x || 0, this.y || 0, game] );
    this.loadPhysicsFromData(data);
    if (!this.simulation)
    {
        this.b.exists = false;
        this.b.alive = true;
        this.b.visible = true;
    }




    Object.defineProperty(this, "money", {
        get: function() {
            if (this._money > 0)
                return this._money;
            else
                return 0;

        },
        set: function (value) {
            if (value >= 0)
                this._money = value;
        }
    });
    this.initHull();
    this.objType= ObjTypes.player;


    this.createPickableObjects();
    this.InitShipMenu();

    this.game.onPlayerInventoryChanged.add(this.calcVolumeAndMass,this);

    this.b.body.collides(this.game.spaceBodiesColGroup, this.colCallback, this);
    this.pressedQL = false;
    this.pressedQS = false;
    this.pressedESC = false;

    this._isLanded = false;
    Object.defineProperty(this, "isLanded", {
        get: function() {

            return this._isLanded;

        },
        set: function (value) {
            if(value)
                this.game.onPlayerLanded.dispatch(this.planetLanded);
            else
                this.game.onPlayerUnlanded.dispatch(this.planetLanded);
            this._isLanded = value;
        }
    });


}
Player.prototype = Object.create(Ship.prototype);

Player.prototype.initHull = function () {

    this.cargoBayCap = this.eq.hull.space;
    this.name = this.eq.hull.name;
};
Player.prototype.createPickableObjects = function () {

    for (var equipment in this.eq)
    {
        if(equipment !=='hull') {
            var e = this.eq[equipment];
            this.EquipmentFactory(e,false)
        }
    }
    for(var i =0; i<this.cargo.length;i++)
    {

        var item=null;
        if(this.cargo[i].type.name === ObjTypes.material.name)

        {


            item = Object.create(Material).constructor(0,0, this.game,
                this.cargo[i].material,this.game.spaceBodiesColGroup,[this.game.spaceBodiesColGroup,this.game.playerColGroup],this.cargo[i].volume);
            this.cargoItemsGroup.add(item.b);
            this.game.pickableItems.push(item);
        }

        if(this.cargo[i].type.name === ObjTypes.equipment.name)
        {
            this.EquipmentFactory(this.cargo[i].eq,true);

        }



    }


    this.game.userInterface.shipMenu.shipCargo.updateCargoView(this);
    this.game.userInterface.shipMenu.shipView.createShipView(this);
    this.game.userInterface.shipMenu.shipView.updateShipView(this);


    this.calcVolumeAndMass();


};
Player.prototype.getSaveData = function () {
    var getEq = function(player) {
        var eq={};
        for(var i = 0; i< player.installedEquipmentGroup.children.length;i++)
        {
            var obj = player.installedEquipmentGroup.children[i].parentObject;
             eq[obj.type.name] = obj.equipment;

        }

        eq.hull= player.hull;
        return eq;
    };
    var getCargo = function(player) {

        var cargo = player.cargoItemsGroup.children.map(function (item) {
            if(item.parentObject.objType === ObjTypes.material) {
                return {type: item.parentObject.objType , material: item.parentObject.material,volume:item.parentObject.volume };
            }
            if(item.parentObject.objType === ObjTypes.equipment) {
                return {type: item.parentObject.objType , eq: item.parentObject.equipment,};
            }
        });
        return cargo
    };


    var savedata ={};
    savedata = Ship.prototype.getSaveData.apply(this);
    savedata.eq = getEq(this);
    savedata.cargo = getCargo(this);
    savedata.fuel = this.fuel;
    savedata.money = this.money;
    savedata.simulation = this.b.exists;


    return savedata;



};
Player.prototype.readKeys = function () {
    var game = this.game;

    if (game.usrKeys.quickLoad.isDown && !this.pressedQL) game.onQuickLoad.dispatch();
    this.pressedQL = game.usrKeys.quickLoad.isDown;

    if (game.usrKeys.systemEsc.isDown && !this.pressedESC) game.onEscPressed.dispatch();
    this.pressedESC = game.usrKeys.quickLoad.isDown;

    if(!this.isDead) {
        if (game.usrKeys.quickSave.isDown && !this.pressedQS) game.onQuickSave.dispatch();
        this.pressedQS = game.usrKeys.quickSave.isDown;

        if (game.usrKeys.rotLeftKey.isDown) {
            this.accRotateLeft();
        }
        else if (game.usrKeys.rotRightKey.isDown) {
            this.accRotateRight();

        }
        else {

            this.rotationThrustCurrent = 0;
            this.b.body.setZeroRotation();
            this.engineLeft.animations.play('stop', 20, true);
            this.engineRight.animations.play('stop', 20, true);
        }

        this.propulsing = false;

        if (game.usrKeys.forwardKey.isDown && this.fuel > 0 && this.thrustCurrent > 0) {
            this.forward();
            this.propulsing = true;

        }
        else if (game.usrKeys.backwardKey.isDown && this.fuel > 0 && this.thrustCurrent > 0) {
            this.backward();
            this.propulsing = true;
        }
        if (this.game.usrKeys.sideLeftKey.isDown && this.fuel > 0 && this.thrustCurrent > 0) {

            this.sideThrust(1);
            this.propulsing = true;
        }
        if (this.game.usrKeys.sideRightKey.isDown && this.fuel > 0 && this.thrustCurrent > 0) {

            this.sideThrust(-1);
            this.propulsing = true;

        }
    }

};
Ship.prototype.DamageHandler = function (dmg) {



    this.getDamage(dmg);
    if(this instanceof Player) {
        this.game.onPlayerDamage.dispatch({hull: this.hp});
    }
    else
    {
        console.log(this.hp);
    }


};
Player.prototype.colCallback = function (shipBody,collidedBody) {



    var mass = collidedBody.mass;
    if(collidedBody.mass>100000)
    {
        mass = shipBody.mass*50;

    }
    var velSq = (collidedBody.velocity.x - shipBody.velocity.x)*(collidedBody.velocity.x - shipBody.velocity.x)/100+
        (collidedBody.velocity.y - shipBody.velocity.y)*(collidedBody.velocity.y - shipBody.velocity.y)/100;

    if(collidedBody.parentObject!==undefined && collidedBody.parentObject.objType===ObjTypes.planet) {

        var velSq = shipBody.parentObject.oldVel*shipBody.parentObject.oldVel/100;
    }
    var collisionEnergy = velSq *mass;


    if(shipBody.parentObject.isStarting!==true && velSq>1 && collidedBody.parentObject.objType!==ObjTypes.equipment) {
        //console.log("Energy: "+collisionEnergy +", vel: "+velSq +", mass: "+mass);
        shipBody.parentObject.DamageHandler(Math.floor(collisionEnergy) );

    }
    if(collidedBody.parentObject!==undefined && !shipBody.parentObject.isDead && collidedBody.parentObject.objType===ObjTypes.planet)
    {

        shipBody.parentObject.Land(collidedBody.parentObject);

    }

    // this.game.damageEmiter.x = this.contactPointX;
    // this.game.damageEmiter.y = this.contactPointY;
    // this.game.damageEmiter.start(true, 500,100,20);




};
Player.prototype.Land = function (planet = null) {

    this.isLanded = true;

    this.b.exists   = false;
    this.b.exists   = true;
    // this.b.alive    = true;
    // this.b.visible  = true;

    this.planetLanded = planet;
    //this.game.onPlayerLanded.dispatch(this.planetLanded,true );
    this.isStarting = false;
    this.vel = 0;
    this.oldVel = 0;

};
Player.prototype.unLand = function () {
    //this.game.onPlayerLanded.active = false;
    this.game.onPlayerUnlanded.dispatch(this.planetLanded,false);
    this.isStarting = true;


    this.game.time.events.add(1000, function () {
        this.game.onPlayerLanded.active = true;
        this.isStarting = false;
    },this,this);

    this.b.exists = true;
    this.isLanded = false;

    this.planetLanded = null;

};
Player.prototype.update = function (){

    Ship.prototype.update.apply(this);

    this.sin = Math.sin(-this.b.rotation);
    this.cos = Math.cos(this.b.rotation);


    if(this.b.exists && this.b.body!==null) {

        this.updateItemsToGrab();

        this.updateRelationsToPlanets();

        this.game.userInterface.shipInterface.shipGrab.enable(this.eq.grabber !== null && this.itemsToGrabToCargo.length > 0);
        //this.game.userInterface.shipInterface.shipFuel.enable(this.isLanded && this.money > 0);
        //this.game.userInterface.shipInterface.shipSell.enable(this.isLanded && this.cargoItemsGroup.children.length > 0);
    }
    this.readKeys();
    this.readKeyboardInput();
    if (!this.isFreeFlight && !this.propulsing && this.fuel > 0 && this.thrustCurrentDamp>0 && !this.isLanded && !this.touched){

        this.compensate();
    }
    this.playAnimations();


};
Player.prototype.updateRelationsToPlanets = function () {
    this.globalStatus = '';


};
Player.prototype.calcVolumeAndMass = function () {

    var mass = this.eq.hull.mass;
    var volume = 0;
    var ship = this;
    this.cargoItemsGroup.forEach(
        function (item) {

            var m = Math.floor(item.parentObject.mass);
            var v = Math.floor(item.parentObject.volume);

            mass += m;
            volume += v;

            //  item.bringToTop();
        }
    );
    this.installedEquipmentGroup.forEach(
        function (item) {
            var m = Math.floor(+item.parentObject.mass);

            mass += m;

        }
        ,this);
    this.mass = mass;
    this.cargoBay = volume;


};
Player.prototype.EquipmentFactory = function (config,pushToCargo) {

        var equipment =
            Object.create(EquipmentObject).constructor(this.b.x, this.b.y, this.game, config,
                this.game.spaceBodiesColGroup,
                [this.game.spaceBodiesColGroup, this.game.playerColGroup]);
        this.game.pickableItems.push(equipment);
        if (pushToCargo!==undefined) {
            if(pushToCargo)
                this.putItemToCargo(equipment);
            else
                this.installItem(equipment);
        }

    };
Player.prototype.putItemToCargo = function (item) {

        this.cargoItemsGroup.add(item.b);



    };
Player.prototype.grabItems = function () {

        var grabbedItems = 0;
        for (var i = 0,j=this.itemsToGrabToCargo.length; i<j; i++)
        {
            if((this.cargoBay + this.itemsToGrabToCargo[i].volume)<this.cargoBayCap)
            {


                var m = ~~this.itemsToGrabToCargo[i].mass;

                if(m>0) {
                    grabbedItems++;
                    this.putItemToCargo(this.itemsToGrabToCargo[i]);
                    this.game.onPlayerInventoryChanged.dispatch(this);
                }

            }
            else
            {
                this.game.onCargoFull.dispatch();

            }

        };

        if (grabbedItems>0)

        {

            this.game.onPlayerInventoryChanged.dispatch(this);

        }
        this.itemsToGrabToCargo.length=0;



    };
Player.prototype.dropItem = function (item) {

        this.cargoItemsGroup.remove(item.b);
        this.installedEquipmentGroup.remove(item.b);
        this.game.world.add(item.b);


        item.b.reset(this.b.x,this.b.y+25);
        item.b.scale.set(item.originalSize);
        item.b.sendToBack();
        item.b.input.disableDrag();

        this.calcVolumeAndMass();
        this.calcEquipmentDependedParams();
       // this.game.onPlayerInventoryChanged.dispatch(this);


    };
Player.prototype.Destruct = function () {
    Ship.prototype.Destruct.apply(this, arguments);
    this.game.explosionEmiter.x = this.b.x;
    this.game.explosionEmiter.y = this.b.y;
    this.game.explosionEmiter.start(true, 500, null, 60);

    this.game.onPlayerDead.dispatch();
    };
Player.prototype.installItem = function (item) {


        for (var s in this.eq.hull.slots)
        {
            var slot = this.eq.hull.slots[s];

            if(!slot.occupied) {

                if (slot.type.name === item.type.name) {

                        slot.occupied = true;
                        slot.installedEquipment = item.b;

                        this.eq[item.type.name] = item.config;

                        this.installedEquipmentGroup.add(item.b);

                        this.calcEquipmentDependedParams();
                        return true;


                }

            }

        }
        for (var s in this.eq.hull.slots)
        {
            var slot = this.eq.hull.slots[s];

            if(!slot.occupied) {

                if (slot.type.name === Equipment.Types.any.name &&
                    item.type.name !== Equipment.Types.weapon.name &&
                    item.type.name !== Equipment.Types.engine.name) {

                    slot.occupied = true;
                    slot.installedEquipment = item.b;

                    this.eq[item.type.name] = item.config;
                    this.installedEquipmentGroup.add(item.b);
                    this.calcEquipmentDependedParams();
                    return true;


                }

            }

        }
        return false;




    };
Player.prototype.uninstallItem = function (item) {

        var ship = this;
        var itemCfg = item.config;

        for (var s in ship.eq.hull.slots)
        {



            if ((ship.eq.hull.slots[s].installedEquipment)===
                (item.b ))
            {

                ship.eq.hull.slots[s].occupied = false;
                ship.eq.hull.slots[s].installedEquipment = null;


                var t = ship.eq.hull.slots[s].type.name;
                ship.eq[itemCfg.type.name] = null;


            }

        }

        this.installedEquipmentGroup.remove(item.b);
        this.cargoItemsGroup.add(item.b);
        this.calcVolumeAndMass();
        this.calcEquipmentDependedParams();


    };
Player.prototype.sellMaterials = function () {
        if(this.planetLanded!==undefined && this.planetLanded.pricesBuy.rock!==undefined) {


            var planet = this.planetLanded;
            var items = [];
            var itemsTotal=0;
            var price = planet.pricesBuy.rock;
            for (var i = 0; i < this.cargoItemsGroup.children.length; i++)
            {



                if (this.cargoItemsGroup.children[i].parentObject.config.typeName === PickableObjectTypes.material )
                {
                    itemsTotal += price * this.cargoItemsGroup.children[i].parentObject.volume;
                    items.push(this.cargoItemsGroup.children[i]);

                }

            }
            if(itemsTotal>0)
            this.sellItem(items, itemsTotal);

            //this.game.userInterface.shipMenu.shipCargo.updateCargoView(this.cargoItems);
        }

    };
Player.prototype.sellItem = function (items,price) {
        if (Array.isArray(items))
            for (var i = 0; i<items.length;i++) {
                this.cargoItemsGroup.remove(items[i]);
                this.installedEquipmentGroup.remove(items[i]);
            }
        else
            {
                this.cargoItemsGroup.remove(items);
                this.installedEquipmentGroup.remove(items);
            }
        this.money+=price;
        this.calcVolumeAndMass();

    };
Player.prototype.InitShipMenu = function () {


        this.game.userInterface.shipInterface.shipGrab.events.onInputOut.add(function () {

            arguments[0].game.ship.grabber.visible = false;

        });
        this.game.userInterface.shipInterface.shipGrab.events.onInputOver.add(function () {


            arguments[0].game.ship.grabber.visible = true;

        });

    };
Player.prototype.createGrabber  = function () {

        if (this.eq.grabber) {
            var grabHL={};

            grabHL = this.game.add.graphics();
            grabHL.lineStyle(1, interfaceColor3, 0.2);
            grabHL.beginFill(interfaceColor3, 0.1);
            grabHL.drawCircle(0, 0, this.eq.grabber.radius);
            this.grabRadius=this.eq.grabber.radius;
            grabHL.endFill();
            this.b.addChild(grabHL);
            grabHL.visible = false;
            return grabHL;
        }
        else console.log("no grabber installed. init highlight failed");

    };
Player.prototype.updateItemsToGrab = function (){

        var itemsToGrab = [];

        for (var i = this.game.pickableItems.length; i > 0; i--) {

            if (this.game.pickableItems[i-1].b.visible && this.game.pickableItems[i-1].b.exists && this.checkItemIsInNearGrabRange(this.game.pickableItems[i-1])) {

                if (this.checkItemReadyToGrab(this.game.pickableItems[i-1]))
                {
                    itemsToGrab.push(this.game.pickableItems[i-1]);
                }
            }
        }

        this.itemsToGrabToCargo = itemsToGrab;

    };
Player.prototype.checkItemIsInNearGrabRange = function (item) {
        //check item is in square
        return (item.b.x < (this.b.x+this.grabRadius) &&
        item.b.x > (this.b.x-this.grabRadius) &&
        item.b.y < (this.b.y+this.grabRadius) &&
        item.b.y > (this.b.y-this.grabRadius));

    };
Player.prototype.checkItemReadyToGrab = function (item) {
        //check item is in circle

        return (((item.b.x-this.b.x)*(item.b.x-this.b.x)+(item.b.y-this.b.y)*(item.b.y-this.b.y))
        < this.grabRadius*this.grabRadius);

    };
Player.prototype.fillFuel = function () {

        if(this.planetLanded!==undefined && this.planetLanded.pricesSell.fuel) {

            if(this.money>0) {

                var price = this.planetLanded.pricesSell.fuel;
                var wasFuel = this.fuel;
                var needFuel = this.fuelCap - this.fuel;

                if (needFuel < this.money / price) {
                    this.fuel += needFuel;
                    this.money -= (needFuel * price);
                }
                else {

                    this.fuel += this.money / price;
                    this.money = 0;
                }
            }
            else
            {
                this.game.userInterface.pilot.say("Денег нет");
            }
        }
    };
Player.prototype.readKeyboardInput = function () {

if(this.game.input.enabled && !this.isDead) {
    if (this.game.usrKeys.switchFreeFlight.isDown && !this.pressedSwitchFreeflight) {
        this.isFreeFlight = !this.isFreeFlight;
        this.pressedSwitchFreeflight = true;

    }
    if (!this.game.usrKeys.switchFreeFlight.isDown) {
        this.pressedSwitchFreeflight = false;
    }

    if (this.game.usrKeys.fireButton.isDown) {

        if (this.eq.weapon) {
            this.weapon.fire();
        }

    }
    if (this.game.usrKeys.grabButton.isDown) {
        this.grabItems();

    }
    if (this.game.usrKeys.dropButton.isDown) {
        //console.log(this.b);
    }

    if (this.game.usrKeys.openShipMenuKey.isDown) {


    }

    if (this.game.usrKeys.openShipMenuKey.isDown && !this.pressedopenShipMenuKey) {
        this.game.userInterface.OpenShipMenu();
        this.pressedopenShipMenuKey = true;

    }
    if (!this.game.usrKeys.openShipMenuKey.isDown) {
        this.pressedopenShipMenuKey = false;
    }
    if (this.game.usrKeys.engineMinusKey.isDown) {
        if (this.thrustCurrent > 0)
            this.thrustCurrent--;
    }
    else if (this.game.usrKeys.enginePlusKey.isDown) {
        if (this.thrustCurrent < this.thrustMaximum)
            this.thrustCurrent++;

    }


    if (this.game.usrKeys.engineDampMinusKey.isDown) {
        if (this.thrustCurrentDamp > 0)
            this.thrustCurrentDamp--;

    }
    else if (this.game.usrKeys.engineDampPlusKey.isDown) {
        if (this.thrustCurrentDamp < this.thrustMaximum)
            this.thrustCurrentDamp++;

    }


}
};
Player.prototype.postUpdate = function () {
        for (var i = this.game.planets.length; i > 0; i--) {
            var planet = this.game.planets[i - 1];
            if (planet.objType === ObjTypes.planet) {
                planet.oldDirToShip.x = planet.dirToShip.x;
                planet.oldDirToShip.y = planet.dirToShip.y;
            }
        }
        this.oldVel = this.vel;



    };
Player.prototype.sqaredDistance  = function (x, y) {
        var dist = (this.b.x-x)* (this.b.x-x)+ (this.b.y-y)* (this.b.y-y);
        return dist;

    };
Player.prototype.updateRadar = function (miniMap) {
    this.game.spaceObjects.forEach(function (gameObject) {
        if(!this.knownObjects.includes(gameObject)
            && this.sqaredDistance(gameObject.b.x,gameObject.b.y)<this.squa)
        {
            this.knownObjects.push(gameObject);
        }

    });

};