var Materials = Materials || {};

Materials =
    {
      asteroid1:
          {
              name: "asteroid1",
              typeName: PickableObjectTypes.material,
              title: "камень",
              sprite: "rock",
              density: 12,
              descr: "часть обычного на вид астероида, может содержать полезные ископаемые " +
              "в том числе и очень редкие. для подробной информации необходимо произвести" +
              " исследование этого типа астероидов",

          }
    };


var Item =
    {
        constructor: function (x,y,game,config,colGroup,colGroups) {

            this.x=x;
            this.y = y;
            this.game = game;
            this.config = config;
            this.size = this.size|| 2;
            this.colGroup = colGroup;
            this.colGroups = colGroups;
            this.createSprite();
            this.createBody();
            this.setToolTip();
            return this;
        },
        createSprite: function () {

            this.b = this.game.add.sprite(this.x,this.y,this.config.sprite,this.config.frame||0);
            this.b.tint = this.config.tint || '0xFFFFFF';
            this.b.parentObject = this;
            this.b.scale.set(this.size);
            this.originalSize = this.size;
            this.b.smoothed=false;
            this.b.anchor.set(0.5);
            this.b.sendToBack();

        },
        createBody: function () {
            this.game.physics.p2.enable(this.b, GLOBAL.IS_DEBUG || false);
            this.b.body.setRectangleFromSprite();
            this.b.body.dynamic= true;
            this.b.body.damping = 0.95;
            this.b.body.angularDamping  = 0.95;
            this.b.body.setCollisionGroup(this.colGroup);
            this.b.body.collides(this.colGroups);
            this.b.body.mass=0.1;
            this.b.body.velocity.x=randomInteger(-5,5)/10;
            this.b.body.velocity.y=randomInteger(-5,5)/10;

        },
        setToolTip: function () {
            this.setInfo();
            this.b.events.onInputOver.add(this.game.userInterface.mouseTooltip.aboveItem, this);
            this.b.events.onInputOut.add(this.game.userInterface.mouseTooltip.outOfItem, this);
            this.b.events.onInputDown.add(this.game.userInterface.mouseTooltip.clickToItem, this);
        },
        setInfo: function () {
          this.info = {};
          this.info.volume = this.volume || this.equipment.volume;

          this.info.type = this.config.typeName ;

          this.info.title = this.config.title;
          this.info.mass = this.mass ||this.config.mass ;
          this.info.summary = this.info.title+"\n"+this.info.volume+"куб.м.\n"+this.info.mass + "т.";

        }
    };

var Material = Object.create(Item);
Material.constructor = function (x,y,game,config,colGroup,colGroups,volume) {
    this.material = config;
    this.volume = volume || 10;
    this.mass = this.material.density/10 * this.volume;
    Item.constructor.apply(this,arguments);

    return this;
};
var EquipmentObject = Object.create(Item);
EquipmentObject.constructor = function (x, y, game, config, colGroup, colGroups)
{   this.size = 1;
    this.equipment = config;
    this.mass = config.mass;
    this.volume = config.volume || 10;
    Item.constructor.apply(this,arguments);
    return this;
};