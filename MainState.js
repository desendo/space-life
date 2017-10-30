/**
 * Created by lav010 on 04.09.2017.
 */
;


(function(SpaceLifeGame) {
    SpaceLifeGame.MainState = function (game) {};

    var day = 757800;

    var worldSize=1500000;




    var planet;
    var planet2;

    var ship;
    var planets=[];
    var spaceObjects = [];
    var pickableItems = [];



    var playerColGroup ;
    var spaceBodiesColGroup;

    var starsBackground;




    var game;

    var userInterface;


SpaceLifeGame.MainState.prototype = {



    preload: function() {


        this.game.canvas.oncontextmenu = function (e) { e.preventDefault(); }
        this.game.counter = 0;
        this.game.day = day;
        this.game.wheelDelta = {};
        this.game.wheelDelta.val =0;
        this.game.wheelDelta.valueToChange = null;
        this.game.load.shader('noise', 'assets/shader1.frag');

        this.game.wheelDelta.setVal = function () {
            this.valueToChange =arguments;

        };

        game = this.game;
        game.globalStatus = '';

        this.game.spaceObjects = spaceObjects;
        this.game.planets = planets;
        this.game.pickableItems = pickableItems;

        this.game.playerColGroup = playerColGroup;
        this.game.spaceBodiesColGroup = spaceBodiesColGroup;
        this.game.userInterface = userInterface;

        this.game.usrKeys = {};

        this.game.isEnabledMouse=true;



    },
    create:function () {



        this.game.noiseFilter = new Phaser.Filter(game, null, game.cache.getShader('noise'));
        this.game.noiseFilter.setResolution(64, 64);








        this.game.spaceObjectsLayer = this.game.add.group();
        this.game.time.advancedTiming = true;
        this.game.world.setBounds(0, 0, worldSize, worldSize);
        this.game.worldSize = worldSize;
        this.game.eventmanager = new EventManager(this.game);


        createStarsBackground(starsBackground);

        createGamePhysics();

        var shipMaterial = game.physics.p2.createMaterial('shipMaterial');
        var planetMaterial = game.physics.p2.createMaterial('planetMaterial');

        game.input.mouse.mouseWheelCallback = mouseWheel;
        SetGameControls();
        createGameCollisionGroups();
        game.userInterface = Object.create(Interface).constructor([150, 100, 150], game);
        if(this.game.continue)
        {
            console.log(this.game.continue);
        }
        else {
            planet = new Planet(worldSize / 2, worldSize / 2, 18, 'planet', 1500, 'Земля 2', game.spaceBodiesColGroup, [game.spaceBodiesColGroup, game.playerColGroup], game);
            planet2 = new Planet(worldSize / 2 + 50000, worldSize / 2 + 4000, 12, 'planet', 900, 'Земля 3', game.spaceBodiesColGroup, [game.spaceBodiesColGroup, game.playerColGroup], game);
            this.game.spaceObjectsLayer.add(planet.b);
            this.game.spaceObjectsLayer.add(planet2.b);
            this.game.planets.push(planet);
            this.game.planets.push(planet2);
            planet.b.body.setMaterial(planetMaterial);
            planet2.b.body.setMaterial(planetMaterial);



            var pos = new Phaser.Point(planets[0].x, (planets[0].y - planets[0].b.width * 0.56 - 300));

            ship = new Player(pos.x, pos.y, game, Equipment.Hulls.Ship1, game.playerColGroup);
            this.game.spaceObjectsLayer.add(ship.b);
            ship.SetStartEq();
            // game.npc1 = new NPC(pos.x - 40, pos.y - 60, game, Equipment.Hulls.Ship0, game.spaceBodiesColGroup, [game.spaceBodiesColGroup, game.playerColGroup]);
            // game.npc2 = new NPC(pos.x + 30, pos.y - 40, game, Equipment.Hulls.Ship0, game.spaceBodiesColGroup, [game.spaceBodiesColGroup, game.playerColGroup]);
            game.ship = ship;

            game.ship.b.body.setMaterial(shipMaterial);
            ship.b.body.collides(game.spaceBodiesColGroup, ship.colCallback, this);


            spaceObjects.push(game.ship);
            // spaceObjects.push(game.npc1);
            // spaceObjects.push(game.npc2);
            spaceObjects.push(planet);
            spaceObjects.push(planet2);

            this.createCameraFadeOut();


            this.camera.follow(ship.b);
            generateAsteroids(5, 3, 4, 'asteroids1', game, game.spaceBodiesColGroup, [game.spaceBodiesColGroup, game.playerColGroup]);

            //collisions events




            ship.InitShipMenu();
            this.game.interfaceGroup.z=-100;



        }

        this.game.damageEmiter = this.game.add.emitter(ship.b.x,ship.b.y,30);
        this.game.damageEmiter.makeParticles('part');
        this.game.damageEmiter.gravity = 0;
        this.game.damageEmiter.setAlpha(1, 0, 500, Phaser.Easing.Linear.None, false);
        this.game.damageEmiter.forEach(function(p) {p.tint ='0xe94f00';},this);



        this.game.explosionEmiter = this.game.add.emitter(ship.b.x,ship.b.y,600);
        this.game.explosionEmiter.makeParticles('part');
        this.game.explosionEmiter.gravity = 0;
        // this.game.explosionEmiter.minParticleSpeed=0.2;
        // this.game.explosionEmiter.maxParticleSpeed=0.5;
        this.game.explosionEmiter.setAlpha(1, 0.5, 1500, Phaser.Easing.Linear.None,false);
        this.game.explosionEmiter.forEach(function(p) {p.tint ='0xffc200';},this);

        this.game.landEmiter = this.game.add.emitter(ship.b.x,ship.b.y,30);
        this.game.landEmiter.makeParticles('part');
        this.game.landEmiter.gravity = 0;
        this.game.landEmiter.setAlpha(1, 0.5, 1500, Phaser.Easing.Linear.None,false);
        this.game.landEmiter.forEach(function(p) {p.tint ='0xffc200';},this);

        this.game.onPlayerDead.add(this.gameOver,this);
        this.game.onPlayerDead.add(this.game.userInterface.pilot.disConnect,this);



    },

    createCameraFadeOut: function () {
        var gr = this.game.add.graphics();
        gr.beginFill(0x000000,1);
        gr.drawRect(0,0,this.game.camera.width,this.game.camera.height);
        gr.endFill();
        var spr = this.game.add.sprite(0,0,gr.generateTexture());
        spr.fixedToCamera=true;
        spr.alpha= 1;
        this.game.add.tween(spr).to( { alpha: 0 }, 2000, "Linear", true);
        gr.destroy();
    },

    gameOver: function () {
        game.input.enabled = false;
        this.game.time.events.add(3000, function () {
            this.camera.fade('#ffffff',3000);
            this.camera.onFadeComplete.add(this.fadeComplete,this);
        },this,this);

    },
    update: function() {

        this.game.noiseFilter.update();
        this.gameObjectsUpdate();
        this.optimizeRendering();

        //ship.playAnimations();

       // ship.readKeyboardInput();
        //ship.updateRelationsToPlanets();


        ship.postUpdate();


        game.userInterface.updateLabels(game);




    },
    fadeComplete: function () {

        game.input.enabled = true;

        game.state.start('GameOver');
    },
    x20: 20,
    x20counter:0,
    optimizeRendering : function () {
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
    },
    render: function () {

        this.game.debug.text(SpaceLifeGame.version+" " +" fps: "+this.game.time.fps , 2, 14, "#c8ff00");


    },
    gameObjectsUpdate: function()
    {
        for (var i= 0,j =spaceObjects.length; i<j;i++ )
        {
            if(spaceObjects[i].update !== undefined && spaceObjects[i].b.visible && spaceObjects[i].b.renderable)
                spaceObjects[i].update();
        }
    }

};






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
        this.tilePosition.x -= ship.b.body.velocity.x/200;
        this.tilePosition.y -= ship.b.body.velocity.y/200;
    };
    game.spaceObjectsLayer.add(starsBackground);

}

function createGamePhysics() {
    game.physics.startSystem(Phaser.Physics.P2JS);
    game.physics.p2.applyDamping = true;
    game.physics.p2.restitution = 0.0;
    game.physics.p2.setImpactEvents(true);


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


    }
    for (var propertyName in keys) {
        userkeys[propertyName] = game.input.keyboard.addKey(keys[propertyName]);
    }

    game.input.keyboard.addKeyCapture([Phaser.Keyboard.SPACEBAR]);

    var v = JSON.stringify(keys);
    localStorage.setItem("keyboard",v);
    game.usrKeys = userkeys;


}
function createGameCollisionGroups() {
    game.playerColGroup = game.physics.p2.createCollisionGroup();
    game.spaceBodiesColGroup = game.physics.p2.createCollisionGroup();
    }


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

    function mouseWheel(event) {
        if(game.wheelDelta.valueToChange!== null) {

            var v = game.wheelDelta.valueToChange;
            v[0][v[1]] +=game.input.mouse.wheelDelta*v[2];
        }


    };

})(SpaceLifeGame);