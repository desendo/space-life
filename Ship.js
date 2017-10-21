/**
 * Created by goblino on 13.10.2017.
 */

function Ship (x,y,game,hull,colGroup,colGroups) {

    this.init(x,y,game,hull,colGroup,colGroups);
    }
Ship.prototype.init =  function (x,y,game,hull,colGroup,colGroups) {
    this.game = game;
    this.eq ={};
    this.eq.hull = hull;

    this.health =this.eq.hull.mass;




    this.b = this.game.add.sprite(x,y,this.eq.hull.sprite);
    this.b.anchor.set(0.5);
    this.b.smoothed=false;
    this.b.scale.set(2);
    this.b.smoothed= false;

    this.game.physics.p2.enable(this.b,GLOBAL.IS_DEBUG);
    this.b.body.damping=this.damping || 0.5;
    this.b.body.setCircle(this.b.width/3,0,0);

    this.b.body.setCollisionGroup(colGroup);
    if(colGroups!==undefined)
        this.b.body.collides(colGroups);

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


    this.vel = 0;
    this.oldVel = 0;
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

                angle = Math.acos(d.x * v.x + d.y * v.y);
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

    this.objType= 'ship';



    this.cargoItemsGroup = this.game.add.group();
    this.installedEquipmentGroup = this.game.add.group();
    this.cargoItemsGroup.fixedToCamera = true;
    this.installedEquipmentGroup.fixedToCamera = true;

    this.planetsTotalGravity = new Phaser.Point(0,0);
    this.knownObjects = [];
    //this.SetStartEq();
    this.initSecondaryEngines();

    //Ship.prototype.constructor.apply(this,arguments);
};
Ship.prototype.initSecondaryEngines = function () {
    console.log("init sec eng",this.b.key);
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

        this.fuel -= this.eq.engine.rotationFuelConsumption * this.rotationThrustCurrent / this.rotationThrust;
        this.isThrottling = true;
    }

};
Ship.prototype.rotateLeft = function () {
    if(this.fuel>0 && this.eq.engine) {
        this.b.body.rotateLeft(this.rotationThrustCurrent);
        this.engineRight.animations.play('thrustRotR', 10, true);

        this.fuel -= this.eq.engine.rotationFuelConsumption * this.rotationThrustCurrent / this.rotationThrust;
        this.isThrottling = true;
    }

};
Ship.prototype.forward = function (q = 1,damping = false) {

    if(!this.b.exists)
    {
        this.b.exists =true;
        this.b.alive =true;
        this.b.visible =true;
    }
    if(this.fuel>0) {

        if (damping)
        {
            this.b.body.thrust(this.thrustCurrentDamp  * q);
            this.fuel -= this.eq.engine.fuelConsumption * this.thrustCurrentDamp / this.thrustMaximum  * q;

        }
        else
        {

            this.b.body.thrust(this.thrustCurrent  * q);
            this.fuel -= this.eq.engine.fuelConsumption * this.thrustCurrent / this.thrustMaximum  * q;

        }

        this.isThrottling = true;

        this.b.animations.play('fly', true);
    }

};
Ship.prototype.backward = function (q = 1,damping = false) {
    if(this.fuel>0) {
        if (damping)
        {
            this.b.body.reverse(this.thrustCurrentDamp / 2 * q);
            this.fuel -= this.eq.engine.fuelConsumption * this.thrustCurrentDamp / this.thrustMaximum / 2 * q;

        }
        else
        {
            this.b.body.reverse(this.thrustCurrent / 2 * q);
            this.fuel -= this.eq.engine.fuelConsumption * this.thrustCurrent / this.thrustMaximum / 2 * q;

        }
        this.isThrottling = true;

        this.b.animations.play('rfly', true);
    }
};
Ship.prototype.sideThrust = function (q = 1,damping = false) {
    if(this.fuel>0 && this.eq.engine) {

        if (q !== 0){
            if (damping) {
                this.b.body.thrustLeft(this.thrustCurrentDamp * q/2);
                this.fuel -= this.eq.engine.fuelConsumption * this.thrustCurrentDamp / this.thrustMaximum  * q/2;
            }
            else {
                this.b.body.thrustLeft(this.thrustCurrent * q/2);
                this.fuel -= this.eq.engine.fuelConsumption * this.thrustCurrent / this.thrustMaximum  * q/2;


            }
            if (q > 0)
                this.isThrottlingRightSide = true;

            else if (q < 0)
                this.isThrottlingLeftSide = true;

            this.isThrottling = true;
        }
        else
        {
            this.isThrottlingLeftSide = false;
            this.isThrottlingRightSide = false;
        }



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

        if( this instanceof Player)
            this.game.userInterface.miniMap.enabled=true;
    }
    else
    {
        if( this instanceof Player) {
            this.game.userInterface.miniMap.enabled = false;
            console.log("radar disabled");
        }
    }

    if(this.eq.power) {
        console.log("enabling power");

        console.log("power enabled");
    }
    else
    {
        //this.game.userInterface.miniMap.enabled=false;
        console.log("power disabled");
    }


};

function NPC (x,y,game,hull,colGroup,colGroups){
    Ship.apply(this,arguments);
    this.eq.engine = Equipment.Engines.RD300;
    this.calcEquipmentDependedParams();
    this.fuel = 10;
    this.thrustCurrent = 30;

    this.forward();
    this.sideThrust();
    console.log(this.mass);

}
NPC.prototype = Object.create(Ship.prototype);
NPC.prototype.update = function () {
    this.sin = Math.sin(-this.b.rotation);
    this.cos = Math.cos(this.b.rotation);
    this.forward();

};


function Player(x,y,game,hull,colGroup) {
    Ship.apply(this,arguments);
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
    this.initHull(hull);
    this.objType= 'player';
    this.money = 40;
    this.fuel=50;



}
Player.prototype = Object.create(Ship.prototype);
Player.prototype.initHull = function (hull) {
    this.eq.hull = hull;
    this.cargoBayCap = hull.space;
    this.name = hull.name;
};
Player.prototype.SetStartEq = function () {

    var laser1 = this.EquipmentFactory(Equipment.Weapons.Laser1,false);
    var engine = this.EquipmentFactory(Equipment.Engines.RD300,false);
    var grabber = this.EquipmentFactory(Equipment.Grabbers.Grab1,false);
    var radar = this.EquipmentFactory(Equipment.Radars.Radar1,false);


    this.game.userInterface.shipMenu.shipCargo.populateGrid(this.cargoItemsGroup);
    this.game.userInterface.shipMenu.shipView.updateShipView(this.installedEquipmentGroup);
    this.onItemsChange();


};


Player.prototype.update = function () {
    this.sin = Math.sin(-this.b.rotation);
    this.cos = Math.cos(this.b.rotation);


    if(this.b.body!==null) {
        this.vel = Math.sqrt(this.b.body.velocity.x * this.b.body.velocity.x + this.b.body.velocity.y * this.b.body.velocity.y);

        this.acc = Math.round(-(+this.oldVel - +this.vel) * 10) / 10;


        this.updateItemsToGrab();

        this.updateRelationsToPlanets();
    }
    this.game.userInterface.shipInterface.shipGrab.enable(this.eq.grabber!==null && this.itemsToGrabToCargo.length > 0);
    this.game.userInterface.shipInterface.shipFuel.enable(this.isLanded && this.money > 0);
    this.game.userInterface.shipInterface.shipSell.enable(this.isLanded && this.cargoItemsGroup.children.length > 0);

    this.isThrottlingRightSide = false;
    this.isThrottlingLeftSide = false;


};
Player.prototype.updateWeapon = function () {
    if(this.eq.weapon!=null) {


        this.weapon.fireAngle = 180 * this.b.rotation / Math.PI + 270;
        this.weapon.fireFrom = new Phaser.Rectangle(this.b.x - this.sin * 25, this.b.y - this.cos * 25, 1, 1);
        this.weapon.bullets.forEach(function (bullet) {

            bullet.x += bullet.velocityx ;
            bullet.y += bullet.velocityy ;

        })
    }
};
Player.prototype.updateRelationsToPlanets = function () {
    this.globalStatus = '';
    this.planetsTotalGravity.x = 0;
    this.planetsTotalGravity.y = 0;
    for (var i = this.game.planets.length; i > 0; i--) {
        var planet = this.game.planets[i-1];
        if (planet.objType === 'planet') {

            var d = this.sqaredDistance(planet.x, planet.y);


            if (d <planet.gravDistSquared ) {
                if(!this.added) {
                    if(this.isLanded) {

                        this.added = true;
                    }

                }
                //var cross = -planet.dirToShip.x*this.dir.y -(-1*planet.dirToShip.y)*this.dir.x;
                // var oldcross = planet.oldDirToShip.x*this.dir.y -(-1*planet.oldDirToShip.y)*this.dir.x;
                // planet.deltaCross = (oldcross.toFixed(4) - cross.toFixed(4));
                // this.deltaCross =planet.deltaCross;

                this.globalStatus = "В гравитационном поле планеты " + planet.name;

                // var q = (d +500*planet.b.width) /(planet.size*planet.size *100000);
                var q = (d +2500*planet.b.width) /(planet.size*planet.size *700000);
                planet.dirToShip.x = (this.b.x -planet.b.x);
                planet.dirToShip.y = (this.b.y -planet.b.y);
                planet.dirToShip.normalize();

                this.planetsTotalGravity.x  += -planet.dirToShip.x /( q)*this.b.body.mass;
                this.planetsTotalGravity.y  += -planet.dirToShip.y /( q)*this.b.body.mass;


                if(d <planet.atmRadiusSquared/2) {
                    this.globalStatus = "В атмосфере планеты " + planet.name;

                    if (this.standingStillCounter ===undefined) this.standingStillCounter=0;

                    this.standingStill = !this.isThrottling && (Math.abs(this.oldVel-this.vel) <0.05)&&Math.abs(this.acc)<0.1;
                    if(this.standingStill)
                    {
                        this.standingStillCounter++;
                    }
                    else if(this.standingStillCounter!=0)
                    {
                        this.standingStillCounter=0;
                    }
                    this.isLanded =  this.standingStill && this.standingStillCounter >60;



                    if(this.isLanded) {
                        this.globalStatus = "На поверхности планеты " + this.planetLanded.name;

                        this.b.exists= false;
                        this.b.visible= true;
                        this.b.alive= true;


                        //this.planetLanded.orbit.bringToTop();
                        this.game.userInterface.labels.labelSpeed.style.backgroundColor = "transparent";
                        this.game.userInterface.labels.labelSpeed.style.fill = "#DDD";
                        this.game.userInterface.labels.labelSpeed.text+=" ";

                    }
                    else
                    {

                        this.game.userInterface.labels.labelSpeed.style.backgroundColor = this.vel>15? "#FF3D1B" : "#35ff00";
                        this.game.userInterface.labels.labelSpeed.style.fill = this.vel>15 ? "black" : "black";
                    }



                    this.b.body.damping = 0.7 +this.damping;
                    this.b.body.angularDamping = 0.7 +this.damping;
                }
                else {
                    this.b.body.damping = this.damping;
                    this.b.body.angularDamping = this.damping;
                    this.game.userInterface.labels.labelSpeed.style.backgroundColor = "transparent";
                    this.game.userInterface.labels.labelSpeed.style.fill = "#DDD";

                }

            }
            else
            {
                this.b.body.angularDamping=this.damping;
                this.b.body.damping=this.damping;
            }


            planet.sqDistToShip = d;
            planet.shipSameSpeed = planet.sqDistToShipOld ===planet.sqDistToShip;
            planet.sqDistToShipOld = planet.sqDistToShip;


        }
    }

    this.b.body.force.x = this.planetsTotalGravity.x;
    this.b.body.force.y = this.planetsTotalGravity.y;

};
Player.prototype.colCallback = function (shipBody,collidedBody) {
    console.log("бум");
    var pilot =shipBody.parentObject.game.userInterface.pilot;
    if(collidedBody.parentObject!==undefined && collidedBody.parentObject.objType==='planet') {
        shipBody.parentObject.planetLanded = collidedBody.parentObject;
        console.log(shipBody.parentObject.oldVel/10+" км/сек");
        if(shipBody.parentObject.oldVel/10>10) {
            pilot.hpbar.setHealth(pilot.hpbar.hp - Math.round(shipBody.parentObject.oldVel/25));
            pilot.updateDamagePicture();
            pilot.say("боль...");
        }
        else if (shipBody.parentObject.oldVel/10>4)
        {
            pilot.say("В пределах нормы");
        }
        else
        {
            pilot.say("Мягкая посадка");
        }
    }
    if(collidedBody.parentObject!==undefined && collidedBody.parentObject.objType==='asteroid') {
        shipBody.parentObject.planetLanded = collidedBody.parentObject;
        console.log("астероид "+ shipBody.parentObject.oldVel/10+" км/сек");
        if(shipBody.parentObject.oldVel/10>10) {
            pilot.hpbar.setHealth(pilot.hpbar.hp - Math.round(shipBody.parentObject.oldVel/50));
            pilot.updateDamagePicture();
            pilot.say("боль");
            //todo сделать систему повреждения пилота и корабля в зависимости от пилота, корабля, скорости и других параметров
        }
        else
        {

            pilot.say("Трясет");
        }
    }

};

Player.prototype.onItemsChange = function () {
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

Player.prototype.EquipmentFactory = function (eq,pushToCargo) {

        var equipment =
            Object.create(EquipmentObject).constructor(this.b.x, this.b.y, this.game, eq,
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
                    this.onItemsChange();
                }

            }
            else
            {
                this.game.userInterface.labels.labelCargo.style.backgroundColor = "#ff9300";
                this.game.userInterface.labels.labelCargo.style.fill = "#030329";
                this.game.userInterface.labels.labelCargo.text+=" ";
                this.game.time.events.add(500, function () {
                    this.game.userInterface.labels.labelCargo.style.backgroundColor = "";
                    this.game.userInterface.labels.labelCargo.style.fill = "#ddd";
                    this.game.userInterface.labels.labelCargo.text+=" ";
                },this,this);
            }

        };

        if (grabbedItems>0)

        {
            console.log("grabbed ",grabbedItems);
            console.log("in cargo ",this.cargoItemsGroup.length);

            this.onItemsChange();
            this.game.userInterface.shipMenu.shipCargo.populateGrid(this.cargoItemsGroup);
        }
        this.itemsToGrabToCargo.length=0;



    };
Player.prototype.dropItem = function (item) {

        this.cargoItemsGroup.remove(item.b);
        this.installedEquipmentGroup.remove(item.b);
        this.game.world.add(item.b);


        item.b.reset(this.b.x,this.b.y+5);
        item.b.scale.set(item.originalSize);
        item.b.sendToBack();

        this.onItemsChange();
        this.calcEquipmentDependedParams();


    };

Player.prototype.installItem = function (item) {
        var ship = this;

        var status="";
        var itemCfg = item.config;
        for (var s in ship.eq.hull.equipmentSlots)
        {
            var slot = ship.eq.hull.equipmentSlots[s];

            if(!slot.occupied) {

                if (slot.type === itemCfg.type) {
                        slot.occupied = true;
                        slot.installedEquipment = item.b;
                        ship.eq[itemCfg.type.name] = item.config;
                        this.installedEquipmentGroup.add(item.b);
                        this.calcEquipmentDependedParams();
                        return "ok";


                }

            }

        }
        for (var s in ship.eq.hull.equipmentSlots)
        {
            var slot = ship.eq.hull.equipmentSlots[s];

            if(!slot.occupied) {


                if (slot.type === Equipment.Types.any &&
                    itemCfg.type !== Equipment.Types.weapon &&
                    itemCfg.type !== Equipment.Types.engine) {

                    slot.occupied = true;
                    slot.installedEquipment = item.b;

                    ship.eq[itemCfg.type.name] = item.config;
                    this.installedEquipmentGroup.add(item.b);
                    this.calcEquipmentDependedParams();
                    return "ok";


                }

            }

        }
        return "нет подходящих слотов";




    };
Player.prototype.uninstallItem = function (item) {
        // console.log("initiating uninstall for ", item);
        var ship = this;
        var itemCfg = item.config;
        // console.log("enum slots");
        for (var s in ship.eq.hull.equipmentSlots)
        {

             // console.log("slots: "+ s +" "+ ship.eq.hull.equipmentSlots[s].occupied);
            // if(ship.eq.hull.equipmentSlots[s].occupied) {
            //     console.log("installed", ship.eq.hull.equipmentSlots[s].installedEquipment);
            //     console.log("itme ", item);
            // }

            if ((ship.eq.hull.equipmentSlots[s].installedEquipment)===
                (item.b ))
            {
                //console.log("match ", item.parentObject);
                ship.eq.hull.equipmentSlots[s].occupied = false;
                ship.eq.hull.equipmentSlots[s].installedEquipment = null;


                var t = ship.eq.hull.equipmentSlots[s].type.name;
                ship.eq[itemCfg.type.name] = null;
                console.log("uninstalled", itemCfg.type.name);

            }

        }

        this.installedEquipmentGroup.remove(item.b);
        this.cargoItemsGroup.add(item.b);
        this.onItemsChange();
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

            //this.game.userInterface.shipMenu.shipCargo.populateGrid(this.cargoItems);
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
        this.onItemsChange();

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
        else console.log("no grabber installd/ init highlight failed");

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

    if (this.game.usrKeys.switchFreeFlight.isDown && !this.pressedSwitchFreeflight)
    {
        this.isFreeFlight =!this.isFreeFlight;
        this.pressedSwitchFreeflight = true;

    }
    if (!this.game.usrKeys.switchFreeFlight.isDown)
    {
        this.pressedSwitchFreeflight = false;
    }

    if (this.game.usrKeys.fireButton.isDown)
    {

        if(this.eq.weapon) {
            this.weapon.fire();
        }

    }
    if (this.game.usrKeys.grabButton.isDown)
    {
        this.grabItems();

    }
    if (this.game.usrKeys.dropButton.isDown)
    {
        console.log(this.eq);
    }

    if (this.game.usrKeys.openShipMenuKey.isDown)
    {


    }

    if (this.game.usrKeys.openShipMenuKey.isDown && !this.pressedopenShipMenuKey)
    {
        this.game.userInterface.OpenShipMenu();
        this.pressedopenShipMenuKey = true;

    }
    if (!this.game.usrKeys.openShipMenuKey.isDown)
    {
        this.pressedopenShipMenuKey = false;
    }
    if (this.game.usrKeys.engineMinusKey.isDown)
    {
        if(this.thrustCurrent>0)
            this.thrustCurrent--;
    }
    else if (this.game.usrKeys.enginePlusKey.isDown)
    {
        if(this.thrustCurrent<this.thrustMaximum)
            this.thrustCurrent++;

    }


    if (this.game.usrKeys.engineDampMinusKey.isDown)
    {
        if(this.thrustCurrentDamp>0)
            this.thrustCurrentDamp--;

    }
    else if (this.game.usrKeys.engineDampPlusKey.isDown)
    {
        if(this.thrustCurrentDamp<this.thrustMaximum)
            this.thrustCurrentDamp++;

    }







};
Player.prototype.checkBulletsForHits = function(gameObjects)    {

    for (var i = 0,j = this.weapon.bulletsAmountinPool;i<j;i++ ) {
        var b = this.weapon.bullets[i];
        if(b.visible)
        {
            gameObjects.forEach(function (gameObject) {


                if (gameObject.b.body !== null) {

                    if (b.armed
                        && Phaser.Rectangle.intersects(gameObject.b.getBounds(),
                            b.getBounds())) {

                        if (gameObject.objType === 'asteroid') {

                            if(((gameObject.b.x - b.x)*(gameObject.b.x - b.x)+(gameObject.b.y - b.y)*(gameObject.b.y - b.y)) < gameObject.squaredRadius) {

                                gameObject.getDamage(b.weapon);

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
                    }
                }

            })
        }
    }


};
Player.prototype.controlByMouse = function (pointer) {


    };
Player.prototype.updateOldValues = function () {
        for (var i = this.game.planets.length; i > 0; i--) {
            var planet = this.game.planets[i - 1];
            if (planet.objType === 'planet') {
                planet.oldDirToShip.x = planet.dirToShip.x;
                planet.oldDirToShip.y = planet.dirToShip.y;
            }
        }
        this.oldVel = this.vel;
        this.isThrottling=false;


    };
Player.prototype.sqaredDistance  = function (x, y) {
        var dist = (this.b.x-x)* (this.b.x-x)+ (this.b.y-y)* (this.b.y-y);
        return dist;

    };
Player.prototype.updateRadar = function (miniMap) {
    this.game.gameObjects.forEach(function (gameObject) {
        if(!this.knownObjects.includes(gameObject) && this.sqaredDistance(gameObject.b.x,gameObject.b.y)<this.radarRadius)
        {
            this.knownObjects.push(gameObject);
        }

    });

};

