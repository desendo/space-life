/**
 * Created by goblino on 13.10.2017.
 */
var Ship = function (params) {
    if(params)
        for (var p in params) {
        if(params[p])
            this[p] = params[p];
    }
};



Ship.prototype.init= function (x,y,game,colGroup,colGroups,hull)  {
    this.x = x;
    this.y = y;
    this.game = game;
    this.colGroup = colGroups;
    this.colGroups = colGroups;
    this.eq.hull = hull || Equipment.Hulls.Ship0;

};


var NPCShip = function (params) {
 Ship.apply(this,arguments);

};
NPCShip.prototype = Object.create(Ship.prototype);
var nps = new NPCShip();
console.log(nps.mass);
var npcShip = new NPCShip({
    x:0,
    y:0

});

var Player = {};


Player = {
    sin: 0,
    cos: 0,
    _money: 0,
    globalStatus: '',
    get mass() {
        return this.b.body.mass*1000;
    },
    set mass(value) {

        this.b.body.mass = value/1000;
    },


    get money() {
        if (this._money > 0)
            return this._money;
        else
            return 0;
    },
    set money(value) {
        if (value >= 0)
            this._money = value;


    },
    eq: {
        engine: null,
        weapon: null,
        hull: null,
        grabber: null,
        power: null,
        radar: null
    },

    isFreeFlight: false,
    fuelCap: 50,
    cargoBayCap: 1000,
    cargoBay: 0,
    fuel: 0,
    game: {},
    isThrottling: false,
    isLanded: false,


    pressedSwitchFreeflight: false,

    colorGrey: "#3C3B40",
    colorMiddle: "#9D9CA6",
    colorLight: "#EDECF5",
    colorFlue: "#0F41A6",
    colorMetal: "#5283A3",


    radarRadius: 9000000,
    knownObjects: [],
    grabRadius: 0,
    vel: 0,
    oldVel: 0,
    damping: 0,
    deltaCross: 0,
    planetLanded: {},
    _thrustCurrentDamp:0,
    get thrustCurrentDamp()
    {
        return this._thrustCurrentDamp;
    },
    set thrustCurrentDamp(val)
    {
        if (val>this.thrustMaximum)
            val = this.thrustMaximum;
        if (val<0)
            val = 0;

        this._thrustCurrentDamp = val;
    },
    _thrustCurrent: 0,
    get thrustCurrent()
    {
        return this._thrustCurrent;
    },
    set thrustCurrent(val)
    {
      if (val>this.thrustMaximum)
          val = this.thrustMaximum;
       if (val<0)
          val = 0;

        this._thrustCurrent = val;
    },

    get dir() {
        return (new Phaser.Point(Math.sin(this.b.body.rotation), -Math.cos(this.b.body.rotation)));
    },
    get velNorm(){
        return new Phaser.Point(
            this.b.body.velocity.x/this.vel,
            this.b.body.velocity.y/this.vel);
    },
    get turnAngle(){
        var d = this.dir;
        var v = this.velNorm;
        var angle;

        if (this.vel>5) {

            angle = Math.acos(d.x * v.x + d.y * v.y);
            if(v.cross(d)<0)
                angle = -angle;
            return angle;
        }
        else
            return 0;
//        angle(v1, v2) = acos( (v1x * v2x + v1y * v2y) / (sqrt(v1x^2+v1y^2) * sqrt(v2x^2+v2y^2)) )

        // angle = acos(dotProduct(Va.normalize(), Vb.normalize()));
        // cross = crossProduct(Va, Vb);
        // if (dotProduct(Vn, cross) < 0) { // Or > 0
        //     angle = -angle;
        // }


    },

    constructor: function (x,y,game,hull)  {


        this.x=x;
        this.y = y;
        this.game = game;
        this.initHull(hull);



        this.b = this.game.add.sprite(this.x,this.y,this.eq.hull.sprite);
        this.b.anchor.set(0.5);
        this.b.animations.add('fly',[0,1,2,3],50,true);
        this.b.animations.add('stop',[4],5,true);
        this.b.animations.add('rfly',[5,6,7,8],50,true);




        this.b.scale.set(this.size);
        this.b.smoothed=false;

        this.b.scale.set(2);
        this.b.smoothed= false;
        this.objType= 'player';


        this.game.physics.p2.enable(this.b,false);
        this.b.body.damping=this.damping;

        this.b.body.setCircle(this.b.width/3,0,0);
        this.b.body.parentObject = this;
        this.b.parentObject = this;

        this.mass = this.eq.hull.mass;

        this.planetsTotalGravity = new Phaser.Point(0,0);
        this.knownObjects = [];
        this.cargoItems = [];

        this.cargoItemsGroup = this.game.add.group();
        this.installedEquipmentGroup = this.game.add.group();
        this.cargoItemsGroup.fixedToCamera = true;
        this.installedEquipmentGroup.fixedToCamera = true;
        this.b.body.setCollisionGroup(this.game.playerColGroup);

        //this.SetStartEq();
        this.initSecondaryEngines();


       //

        this.money = 40;
        this.fuel=50;
        this.initEquipment();



        return this;
    },
    EquipmentFactory: function (eq,pushToCargo) {

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

    },
    SetStartEq: function () {

        var laser1 = this.EquipmentFactory(Equipment.Weapons.Laser1,false);
        var engine = this.EquipmentFactory(Equipment.Engines.RD300,false);
        var grabber = this.EquipmentFactory(Equipment.Grabbers.Grab1,false);
        var radar = this.EquipmentFactory(Equipment.Radars.Radar1,false);


        this.game.userInterface.shipMenu.shipCargo.populateGrid(this.cargoItemsGroup);
        this.game.userInterface.shipMenu.shipView.updateShipView(this.installedEquipmentGroup);
        this.onItemsChange();


    },
    initHull: function (hull) {
        this.eq.hull = hull;
        this.cargoBayCap = hull.space;
        this.name = hull.name;
    },

    initEquipment: function () {
        this.eq.engine = null;

        this.eq.weapon = null;
        this.eq.grabber = null;
    },
    calcEquipmentDependedParams: function () {


        if(this.eq.engine) {

            this.thrustMaximum = this.eq.engine.thrustMax;
            this.rotationThrust = this.eq.engine.rotationMax;
            this.thrustCurrent = this.thrustMaximum/2;
            this.thrustCurrentDamp = this.thrustMaximum/2;

        }
        else
        {
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

            this.game.userInterface.miniMap.enabled=true;

        }
        else
        {
            this.game.userInterface.miniMap.enabled=false;
            console.log("radar disabled");
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


    },
    onItemsChange: function () {
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


    },
    initSecondaryEngines: function () {
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
    },


    update: function () {
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


    },
    putItemToCargo: function (item) {

        this.cargoItemsGroup.add(item.b);



    },
    grabItems: function () {

        var grabbedItems = 0;
        for (var i = 0,j=this.itemsToGrabToCargo.length; i<j; i++)
        {
            if((this.cargoBay + this.itemsToGrabToCargo[i].volume)<this.cargoBayCap)
            {
                console.log(this.itemsToGrabToCargo[i].volume);

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



    },

    dropItem: function (item) {

        this.cargoItemsGroup.remove(item.b);
        this.installedEquipmentGroup.remove(item.b);
        this.game.world.add(item.b);


        item.b.reset(this.b.x,this.b.y+5);
        item.b.scale.set(item.originalSize);
        item.b.sendToBack();
        this.onItemsChange();
        this.calcEquipmentDependedParams();


    },
    installItem: function (item) {
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




    },
    uninstallItem: function (item) {
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


    },
    sellMaterials: function () {
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

    },

    sellItem: function (items,price) {
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

    },
    InitShipMenu: function () {


        this.game.userInterface.shipInterface.shipGrab.events.onInputOut.add(function () {

            arguments[0].game.ship.grabber.visible = false;

        });
        this.game.userInterface.shipInterface.shipGrab.events.onInputOver.add(function () {


            arguments[0].game.ship.grabber.visible = true;

        });

    },
    createGrabber : function () {

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

    },
    updateItemsToGrab: function (){

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

    },
    checkItemIsInNearGrabRange: function (item) {
        //check item is in square
        return (item.b.x < (this.b.x+this.grabRadius) &&
        item.b.x > (this.b.x-this.grabRadius) &&
        item.b.y < (this.b.y+this.grabRadius) &&
        item.b.y > (this.b.y-this.grabRadius));

    },
    checkItemReadyToGrab: function (item) {
        //check item is in circle

        return (((item.b.x-this.b.x)*(item.b.x-this.b.x)+(item.b.y-this.b.y)*(item.b.y-this.b.y))
        < this.grabRadius*this.grabRadius);

    },
    playAnimations: function () {


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

    },
    readKeyboardInput: function () {

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







    },

    updateWeapon: function () {
        if(this.eq.weapon!=null) {


            this.weapon.fireAngle = 180 * this.b.rotation / Math.PI + 270;
            this.weapon.fireFrom = new Phaser.Rectangle(this.b.x - this.sin * 25, this.b.y - this.cos * 25, 1, 1);
            this.weapon.bullets.forEach(function (bullet) {

                bullet.x += bullet.velocityx / 100;
                bullet.y += bullet.velocityy / 100;

            })
        }
    },
    checkBulletsForHits: function(gameObjects)
    {

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


    },
    accRotateLeft: function () {
        if(this.eq.engine) {
            if (this.rotationThrustCurrent < this.rotationThrust) {
                this.rotationThrustCurrent += (this.rotationThrustCurrent + 0.01) / this.rotationThrust * 2 + 1;
            }

            this.rotateLeft();
        }
    },
    accRotateRight: function () {

        if(this.eq.engine) {
            if (this.rotationThrustCurrent < this.rotationThrust) {
                this.rotationThrustCurrent += (this.rotationThrustCurrent + 0.01) / this.rotationThrust * 2 + 1;
            }
            this.rotateRight();
        }
    },
    rotateRight: function () {
        if(this.fuel>0 && this.eq.engine) {
            this.b.body.rotateRight(this.rotationThrustCurrent);
            this.engineLeft.animations.play('thrustRotL', 10, true);

            this.fuel -= this.eq.engine.rotationFuelConsumption * this.rotationThrustCurrent / this.rotationThrust;
            this.isThrottling = true;
        }

    },
    rotateLeft: function () {
        if(this.fuel>0 && this.eq.engine) {
            this.b.body.rotateLeft(this.rotationThrustCurrent);
            this.engineRight.animations.play('thrustRotR', 10, true);

            this.fuel -= this.eq.engine.rotationFuelConsumption * this.rotationThrustCurrent / this.rotationThrust;
            this.isThrottling = true;
        }

    },
    forward: function (q = 1,damping = false) {
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

    },
    backward: function (q = 1,damping = false) {
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
    },

    sideThrust: function (q = 1,damping = false) {
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

    },
    fillFuel: function () {

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
    },


    controlByMouse: function (pointer) {


    },

    updateRelationsToPlanets: function () {
        this.globalStatus = '';
        this.planetsTotalGravity.x = 0;
        this.planetsTotalGravity.y = 0;
        for (var i = this.game.planets.length; i > 0; i--) {
            var planet = this.game.planets[i-1];
            if (planet.objType === 'planet') {

                var d = this.sqaredDistance(planet.x, planet.y);


                if (d <planet.gravDistSquared ) {
                    if(!this.added) {

                        //planet.orbit.add(this.b);



                        this.added = true;
                        //this.game.world.addChild(planet.b);
                    }
                    //var cross = -planet.dirToShip.x*this.dir.y -(-1*planet.dirToShip.y)*this.dir.x;
                    // var oldcross = planet.oldDirToShip.x*this.dir.y -(-1*planet.oldDirToShip.y)*this.dir.x;
                    // planet.deltaCross = (oldcross.toFixed(4) - cross.toFixed(4));
                    // this.deltaCross =planet.deltaCross;

                    this.globalStatus = "В гравитационном поле планеты " + planet.name;

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

                            //this.b.body.removeNextStep = true;
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

    },
    updateOldValues: function () {
        for (var i = this.game.planets.length; i > 0; i--) {
            var planet = this.game.planets[i - 1];
            if (planet.objType === 'planet') {
                planet.oldDirToShip.x = planet.dirToShip.x;
                planet.oldDirToShip.y = planet.dirToShip.y;
            }
        }
        this.oldVel = this.vel;
        this.isThrottling=false;


    },
    sqaredDistance : function (x, y) {
        var dist = (this.b.x-x)* (this.b.x-x)+ (this.b.y-y)* (this.b.y-y);
        return dist;

    },
    updateRadar: function (miniMap) {
        this.game.gameObjects.forEach(function (gameObject) {
            if(!this.knownObjects.includes(gameObject) && this.sqaredDistance(gameObject.b.x,gameObject.b.y)<this.radarRadius)
            {
                this.knownObjects.push(gameObject);
            }

        });

    },
    colCallback: function (shipBody,collidedBody) {
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

    },


    b:{}
};
Player.prototype = Object.create(Ship.prototype);
