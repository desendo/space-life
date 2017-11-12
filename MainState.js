/**
 * Created by lav010 on 04.09.2017.
 */
;

(function(TheGame) {
    TheGame.MainState = function (game) {};
    var game;

TheGame.MainState.prototype = {

    preload: function() {

      game = this.game;
      game.day = 757800;
      game.counter = 0;
      game.worldSize=1500000;

      game.wheelDelta = {};
      game.wheelDelta.val =0;
      game.wheelDelta.valueToChange = null;
      game.wheelDelta.setVal = function () {
            this.valueToChange =arguments;

        };


      game.globalStatus = '';

      game.spaceObjects = [];
      game.planets = [];
      game.pickableItems = [];

      game.playerColGroup = {};
      game.spaceBodiesColGroup = {};
      game.userInterface = {};

      game.starsBackground ={};
      game.usrKeys = {};

      game.isEnabledMouse=true;



    },
    create:function () {



        game.noiseFilter = new Phaser.Filter(game, null, game.cache.getShader('noise'));
        game.noiseFilter.setResolution(64, 64);

        game.spaceObjectsLayer = this.game.add.group();
        game.time.advancedTiming = true;
        game.world.setBounds(0, 0, game.worldSize, game.worldSize);
        game.eventmanager = new EventManager(this.game);
        game.input.mouse.mouseWheelCallback = mouseWheel;

        createStarsBackground(game.starsBackground);
        createEmmiters(game);
        createGamePhysics();
        SetGameControls();
        createGameCollisionGroups();

        game.userInterface = Object.create(Interface).constructor([150, 100, 150], game);

        if(this.game.isLoading && this.game.saveGameKey!==undefined  && this.game.saveGameKey!==null)
        {
            console.log("loaded", this.game.saveGameKey);
            Load(this.game, localStorage.getItem(this.game.saveGameKey));
            createCameraFadeOut(game);
        }
        else {
            console.log("started new game");
            var initialSave = generateWorld();
            Load(this.game, JSON.stringify(initialSave));
            localStorage.removeItem('save-quicksave');
            createCameraFadeOut(game);

        }
        if(game.ship !==undefined) {

            this.camera.follow(game.ship.b);

        }


        game.onPlayerDead.add(gameOver,this);
        game.onPlayerDead.add(this.game.userInterface.pilot.disConnect,this);

        game.onQuickLoad.add(game.loadGame,game);
        game.onQuickSave.add(game.saveGame,game);


        //this.music = this.game.add.audio('track1', .3, true);
        //this.music.play();

    },
    update: function() {

        game.noiseFilter.update();
        gameObjectsUpdate(game.spaceObjects);
        optimizeRendering(game.spaceObjects);



        if(game.ship!==undefined) {
            game.ship.postUpdate();


            game.userInterface.updateLabels(game);
        }



    },
    render: function () {

        // game.debug.text(SpaceLifeGame.version+" " +" fps: "+this.game.time.fps , 2, 14, "#c8ff00");


    },


    x20: 20,
    x20counter:0,

};

function createCameraFadeOut(game) {
        var gr = game.add.graphics();
        gr.beginFill(0x000000,1);
        gr.drawRect(0,0,game.camera.width,game.camera.height);
        gr.endFill();
        var spr = game.add.sprite(0,0,gr.generateTexture());
        spr.fixedToCamera=true;
        spr.alpha= 1;
        game.add.tween(spr).to( { alpha: 0 }, 2000, "Linear", true);
        gr.destroy();
    }
function gameOver() {
        game.input.enabled = false;
        game.time.events.add(3000, function () {
            this.camera.fade('#ffffff',3000);
            this.camera.onFadeComplete.add(fadeComplete,this);
        },this,this);

    }
function fadeComplete() {

        game.input.enabled = true;

        game.state.start('GameOver');
    }
function gameObjectsUpdate(spaceObjects){
    for (var i= 0,j =spaceObjects.length; i<j;i++ )
    {
        if(spaceObjects[i].update !== undefined && spaceObjects[i].b.visible && spaceObjects[i].b.renderable)
            spaceObjects[i].update();
    }
}
function createEmmiters(game) {

    game.damageEmiter = game.add.emitter(0,0,30);
    game.damageEmiter.makeParticles('part');
    game.damageEmiter.gravity = 0;
    game.damageEmiter.setAlpha(1, 0, 500, Phaser.Easing.Linear.None, false);
    game.damageEmiter.forEach(function(p) {p.tint ='0xe94f00';},this);



    game.explosionEmiter = game.add.emitter(0,0,600);
    game.explosionEmiter.makeParticles('part');
    game.explosionEmiter.gravity = 0;
    game.explosionEmiter.minParticleSpeed.x = -70;
    game.explosionEmiter.minParticleSpeed.y = -70;
    game.explosionEmiter.maxParticleSpeed.x = 70;
    game.explosionEmiter.maxParticleSpeed.y = 70;

    game.explosionEmiter.setAlpha(1, 0, 1500, Phaser.Easing.Quadratic.Out,false);
    game.explosionEmiter.forEach(function(p) {p.tint ='0xffc200';},this);

    game.landEmiter = game.add.emitter(0,0,30);
    game.landEmiter.makeParticles('part');
    game.landEmiter.gravity = 0;
    game.landEmiter.setAlpha(1, 0.5, 1500, Phaser.Easing.Linear.None,false);
    game.landEmiter.forEach(function(p) {p.tint ='0xffc200';},this);

}
function optimizeRendering(spaceObjects) {
        if(this.x20counter===0) {
            this.x20counter = this.x20;
            spaceObjects.forEach(function (sprite) {

                if (
                    sprite.b.x + sprite.b.width < game.camera.x ||

                    sprite.b.y + sprite.b.height < game.camera.y ||
                    sprite.b.x - sprite.b.width > game.camera.x + game.camera.width ||

                    sprite.b.y - sprite.b.height > game.camera.y + game.camera.height
                ) {

                    sprite.b.renderable = false;

                }
                else {
                    sprite.b.renderable = true;

                }
            });


        }
        else {
            this.x20counter--;

        }
    }
function createStarsBackground(starsBackground) {
    starsBackground = game.add.tileSprite(0,
        0,
        game.width,
        game.height,
        'starsBackground');
        starsBackground.fixedToCamera = true;
        starsBackground.scale.set(3);
        starsBackground.smoothed=false;
        starsBackground.update = function () {
        if (game.ship!==undefined) {
            this.tilePosition.x -= game.ship.b.body.velocity.x / 200;
            this.tilePosition.y -= game.ship.b.body.velocity.y / 200;
        }
    };
    game.spaceObjectsLayer.add(starsBackground);

}
function createGamePhysics() {
    game.physics.startSystem(Phaser.Physics.P2JS);
    game.physics.p2.applyDamping = true;
    game.physics.p2.restitution = 0.0;
    game.physics.p2.setImpactEvents(true);
    game.shipMaterial = game.physics.p2.createMaterial('shipMaterial');
    game.planetMaterial = game.physics.p2.createMaterial('planetMaterial');


}
function SetGameControls(reset=true) {

    var userkeys = {};
    //todo сделать пользвоательский интерфейс для возможности изменять клавиши управления
    var keys = {};
    if(!reset) {

        userkeys = JSON.parse(localStorage.getItem("keyboard"));
        if (userkeys=="")
        {
            this.SetGameControls(true);
        }

    }
    else {
        keys.fireButton = Phaser.KeyCode.SPACEBAR;
        keys.grabButton = Phaser.KeyCode.G;
        keys.dropButton = Phaser.KeyCode.H;
        keys.forwardKey = Phaser.KeyCode.W;
        keys.backwardKey = Phaser.KeyCode.S;
        keys.rotLeftKey = Phaser.KeyCode.A;
        keys.rotRightKey = Phaser.KeyCode.D;
        keys.sideLeftKey = Phaser.KeyCode.Q;
        keys.sideRightKey = Phaser.KeyCode.E;
        keys.engineMinusKey = Phaser.KeyCode.Z;
        keys.enginePlusKey = Phaser.KeyCode.X;
        keys.engineDampMinusKey = Phaser.KeyCode.C;
        keys.engineDampPlusKey = Phaser.KeyCode.V;
        keys.switchFreeFlight = Phaser.KeyCode.F;
        keys.openShipMenuKey = Phaser.KeyCode.I;
        keys.quickSave = Phaser.KeyCode.N;
        keys.quickLoad = Phaser.KeyCode.L;


        keys.systemEsc = Phaser.KeyCode.ESC;
        game.input.keyboard.removeKeyCapture(Phaser.Keyboard.ESC);


    }
    for (var propertyName in keys) {
        userkeys[propertyName] = game.input.keyboard.addKey(keys[propertyName]);
    }

    game.input.keyboard.addKeyCapture([Phaser.Keyboard.SPACEBAR]);

    var keysSet = JSON.stringify(keys);
    localStorage.setItem("keyboard",keysSet);
    game.usrKeys = userkeys;


}
function createGameCollisionGroups() {
    game.playerColGroup = game.physics.p2.createCollisionGroup();
    game.spaceBodiesColGroup = game.physics.p2.createCollisionGroup();
    }
function generateWorld(){

    var save = {

    player:{
        x: -1000,
        y: -1000-32*18/2-21,
        simulation: false,

        fuel:20,
        eq : {
            hull: Equipment.Hulls.Ship1,
            weapon: Equipment.Weapons.Laser1,
            radar: Equipment.Radars.Radar1,
            grabber: Equipment.Grabbers.Grab1,
            engine: Equipment.Engines.RD300,
            capacitor: Equipment.EnergyStorages.EnergyBank1,
            generator: Equipment.PowerPlants.PP1,
        },
        cargo:[
            {
                type: ObjTypes.material,
                material: Materials.Asteroids.Minerals.typeS,
                volume:10},
            {
                type: ObjTypes.equipment,
                eq: Equipment.Weapons.Laser2}
            ]


    },
    planets:[
        {
            x: -1000,
            y:-1000,
            size: 18,
            gravityRadius:1500,
            sprite: "planet"
        },
        {
            x: 7000,
            y: 4000,
            size: 12,
            gravityRadius:1500,
            sprite: "planet"
        }
    ],
    ships:[
        {
            x: -1000,
            y: -1000-32*18/2-521,
            fuel:20,
            rotation:180,
            behavior: Behavior.behaviors.guardian1,

            eq : {
                hull: Equipment.Hulls.Ship0,
                weapon: Equipment.Weapons.Laser1,
                radar: Equipment.Radars.Radar1,
                engine: Equipment.Engines.RD300,
            }
        }
    ],
    asteroids:[]

};
    save.asteroids = generateAst(5, 5);
    return save;
}
function generateAst(asteroidsInField, fieldsAmount) {
    var fields = [];
    var asteroids=[];

    var generateField = function (game) {
        var field = {};
        var asteroidSpriteSheet = 'asteroids1';
        field.x=0;
        field.y=0;

        field.x = randomInteger(-8000,8000);
        field.y = randomInteger(-8000,8000);
        field.asteroids = [];
        field.radius = 150;
        var asteroidsAmount = randomInteger(asteroidsInField*0.7,asteroidsInField*1.3);
        for (var i = asteroidsAmount; i >0; i--)
        {
            var angleFromFieldCenter = 2*Math.PI*Math.random();
            var u = Math.random() +Math.random();
            var distFromFieldCenter = u>1 ? 2-u :u;
            distFromFieldCenter *= field.radius;
            var scale = randomInteger(8,20)/10;

            var x = field.x+distFromFieldCenter*Math.cos(angleFromFieldCenter);
            var y = field.y+distFromFieldCenter*Math.sin(angleFromFieldCenter);
            asteroids.push({x:x, y:y,sprite: asteroidSpriteSheet,size:scale,frame: randomInteger(0,7),material: Materials.Asteroids.Minerals.typeM})



        }
        return field;

    };
    fieldsAmount = randomInteger(fieldsAmount-2, fieldsAmount+2);
    for (var i = fieldsAmount; i>0;i-- )
    {
        fields.push(generateField(game));
    }

    return asteroids;


}
function mouseWheel(event) {
        if(game.wheelDelta.valueToChange!== null) {

            var v = game.wheelDelta.valueToChange;
            v[0][v[1]] +=game.input.mouse.wheelDelta*v[2];
        }


    };
})(SpaceLifeGame);