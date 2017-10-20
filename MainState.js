/**
 * Created by lav010 on 04.09.2017.
 */
;







(function(SpaceLifeGame) {
    SpaceLifeGame.MainState = function (game) {

    };

    var day = 757800;


    var counter= 0;

    var worldSize=1500000;




    var planet;
    var planet2;

    var ship;
    var planets=[];
    var gameObjects = [];
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

        this.game.wheelDelta.setVal = function () {
            this.valueToChange =arguments;


        };

        game = this.game;
        game.globalStatus = '';

        this.game.gameObjects = gameObjects;
        this.game.planets = planets;
        this.game.pickableItems = pickableItems;

        this.game.playerColGroup = playerColGroup;
        this.game.spaceBodiesColGroup = spaceBodiesColGroup;
        this.game.userInterface = userInterface;

        this.game.usrKeys = {};

        this.game.isEnabledMouse=true;



    },
    create:function () {



        this.game.time.advancedTiming = true;
        this.game.world.setBounds(0, 0, worldSize, worldSize);
        this.game.worldSize = worldSize;
        createStarsBackground(starsBackground);

        createGamePhysics();

        var shipMaterial = game.physics.p2.createMaterial('shipMaterial');
        var planetMaterial = game.physics.p2.createMaterial('planetMaterial');

        game.input.mouse.mouseWheelCallback = mouseWheel;
        SetGameControls();
        createGameCollisionGroups();


        planet = Object.create(Planet).constructor(worldSize/2,worldSize/2,18,'planet',1500,'Земля 2',game.spaceBodiesColGroup,[game.spaceBodiesColGroup,game.playerColGroup],game);
        planet2 = Object.create(Planet).constructor(worldSize/2-2000,worldSize/2+4000,12,'planet',900,'Земля 3',game.spaceBodiesColGroup,[game.spaceBodiesColGroup,game.playerColGroup],game);
        this.game.planets.push(planet);
        this.game.planets.push(planet2);
        planet.b.body.setMaterial(planetMaterial);
        planet2.b.body.setMaterial(planetMaterial);
        var pos = new Phaser.Point(planets[0].x,(planets[0].y-planets[0].b.width*0.56-300));


        ship = new Player(pos.x,pos.y,game,Equipment.Hulls.Ship1,game.playerColGroup);

        game.npc1 = new NPC(pos.x-40,pos.y-60,game,Equipment.Hulls.Ship0,game.spaceBodiesColGroup,[game.spaceBodiesColGroup,game.playerColGroup]);
        game.npc2 = new NPC(pos.x+30,pos.y-40,game,Equipment.Hulls.Ship0,game.spaceBodiesColGroup,[game.spaceBodiesColGroup,game.playerColGroup]);

        game.ship = ship;

        game.ship.b.body.setMaterial(shipMaterial);

         ship.b.body.collides(game.spaceBodiesColGroup,ship.colCallback,this);
        //ship.b.body.collides(game.shipsColGroup,function () {console.log("reerr");},this);


        gameObjects.push(game.ship);
        gameObjects.push(game.npc1);
        gameObjects.push(game.npc2);
        gameObjects.push(planet);
        gameObjects.push(planet2);
        //var shipPlanetCM = game.physics.p2.createContactMaterial(shipMaterial, planetMaterial);
        //shipPlanetCM.restitution = 0.0;
        //shipPlanetCM.friction = 100.0;

        this.createCameraFadeOut();



        this.camera.follow(ship.b);
        generateAsteroids(5,3,4,'asteroids1', game, game.spaceBodiesColGroup,[game.spaceBodiesColGroup,game.playerColGroup]);

        //collisions events


        game.userInterface = Object.create(Interface).constructor([150,100,150],game);

        ship.SetStartEq();

        ship.InitShipMenu();



         if (Notification.permission !== "granted") {

            sendNotification('Уведомления', { body: 'Вы разрешили уведомления. Теперь различные игровые события будут выводится через них.',icon: 'favicon-16x16.png', dir: 'auto' });
         }

        //todo перенести эмитеры повреждений в alt.weapon. создать набор стандартных эмитеров, менять их при смете типа повреждения
        this.game.damageEmiter = this.game.add.emitter(ship.b.x,ship.b.y,30);
        this.game.damageEmiter.makeParticles('part');
        this.game.damageEmiter.gravity = 0;
        this.game.damageEmiter.setAlpha(1, 0, 500, Phaser.Easing.Linear.None, false);
        this.game.damageEmiter.forEach(function(p) {p.tint ='0xe94f00';},this);





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

    update: function() {


        planet.updateOrbit();
        this.optimizeRendering();

        ship.playAnimations();
        ship.update();
        ship.readKeyboardInput();
        ship.updateRelationsToPlanets();

        if(ship.weapon) {
            ship.updateWeapon();
            ship.checkBulletsForHits(gameObjects);
        }
        ship.updateOldValues();


        game.userInterface.updateLabels(game);
        this.readKeys();
        this.game.isGameOver = game.userInterface.pilot.hpbar.hp<=0;
        if (this.game.isGameOver)
        {

            game.input.enabled = false;

            this.camera.fade('#ffffff',3000);
            this.camera.onFadeComplete.add(this.fadeComplete,this);

        }


    },
    fadeComplete: function () {


        game.input.enabled = true;

        game.state.start('GameOver');
    },
    readKeys : function () {
        if (game.usrKeys.rotLeftKey.isDown ) {
            ship.accRotateLeft();

        }
        else if (game.usrKeys.rotRightKey.isDown ) {
            ship.accRotateRight();

        }
        else {

            ship.rotationThrustCurrent = 0;
            ship.b.body.setZeroRotation();
            ship.engineLeft.animations.play('stop', 20, true);
            ship.engineRight.animations.play('stop', 20, true);
        }

        this.propulsing = false;
        if (game.usrKeys.forwardKey.isDown && ship.fuel > 0 && ship.thrustCurrent>0) {

            ship.forward();
            this.propulsing = true;

        }
        else if (game.usrKeys.backwardKey.isDown  && ship.fuel > 0 && ship.thrustCurrent>0) {
            ship.backward();
            this.propulsing = true;
        }
        if (this.game.usrKeys.sideLeftKey.isDown && ship.fuel > 0 && ship.thrustCurrent>0 ) {

            ship.sideThrust(1);
            this.propulsing = true;
        }
        if (this.game.usrKeys.sideRightKey.isDown && ship.fuel > 0 && ship.thrustCurrent>0) {

            ship.sideThrust(-1);
            this.propulsing = true;

        }

        if (ship.isFreeFlight && !this.propulsing) {

            ship.b.animations.play('stop', 20, true);
        }
        if (!ship.isFreeFlight && !this.propulsing && ship.fuel > 0 && ship.thrustCurrentDamp>0 ){

            if (ship.vel > 4) {

                if (Math.cos(ship.turnAngle) > 0) {
                    ship.backward(Math.cos(ship.turnAngle),true);
                    if (ship.vel > 4) ship.sideThrust(-Math.sin(ship.turnAngle),true);
                    }
                else
                    {
                    ship.forward(-Math.cos(ship.turnAngle),true);
                    if (ship.vel > 4) ship.sideThrust(-Math.sin(ship.turnAngle),true);

                    }
            }
            else {
                ship.sideThrust(0);
                ship.b.animations.play('stop', 20, true);
            }

        }
        else if (!this.propulsing)
            ship.b.animations.play('stop', 20, true);




    },
    x20: 20,
    x20counter:0,
    optimizeRendering : function () {
        if(this.x20counter===0) {
            this.x20counter = this.x20;
            gameObjects.forEach(function (sprite) {
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

            field.x = randomInteger(worldSize*0.5-2000,worldSize*0.5+2000);
            field.y = randomInteger(worldSize*0.5-2000,worldSize*0.5+2000);
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

                game.gameObjects.push(asteroid);

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