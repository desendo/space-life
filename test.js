Player_.prototype = {
    sin: 0,
    cos: 0,
    _money: 0,
    globalStatus: '',


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
    _thrustCurrentDamp: 0,
    get thrustCurrentDamp() {
        return this._thrustCurrentDamp;
    },
    set thrustCurrentDamp(val) {
        if (val > this.thrustMaximum)
            val = this.thrustMaximum;
        if (val < 0)
            val = 0;

        this._thrustCurrentDamp = val;

    },
    _thrustCurrent: 0,



};


Player_.prototype.init =  function (x,y,game,hull) {
    console.log("plaeyr init");
    this.game = game;
    this.eq ={};
    this.eq.hull = hull;
    this.b = this.game.add.sprite(x,y,this.eq.hull.sprite);
    this.b.anchor.set(0.5);
    this.b.smoothed=false;
    this.b.scale.set(2);
    this.b.smoothed= false;

    this.game.physics.p2.enable(this.b,GLOBAL.IS_DEBUG);
    this.b.body.damping=this.damping || 0.5;
    this.b.body.setCircle(this.b.width/3,0,0);
    this.b.body.setCollisionGroup(this.game.playerColGroup);

    this.b.parentObject = this;
    this.b.body.parentObject = this;
    Object.defineProperty(this, "mass", {
        get: function() {
            return this.b.body.mass*1000;
        },

        set: function(value) {


            this.b.body.mass = Math.abs(value)/1000;
            console.log("set mass "+this.b.body.mass);

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



    this.damping = 0;
    this.b.body.damping = 0.5;



    this.initHull(hull);

    this.b.animations.add('fly',[0,1,2,3],50,true);
    this.b.animations.add('stop',[4],5,true);
    this.b.animations.add('rfly',[5,6,7,8],50,true);

    this.objType= 'player';



    this.cargoItemsGroup = this.game.add.group();
    this.installedEquipmentGroup = this.game.add.group();
    this.cargoItemsGroup.fixedToCamera = true;
    this.installedEquipmentGroup.fixedToCamera = true;

    this.planetsTotalGravity = new Phaser.Point(0,0);
    this.knownObjects = [];
    this.cargoItems = [];
    //this.SetStartEq();
    this.initSecondaryEngines();


    //

    this.money = 40;
    this.fuel=50;
    this.initEquipment();



    //Ship.prototype.constructor.apply(this,arguments);
};