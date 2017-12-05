var Interface = {
    constructor: function (sizes,game) {

        this.game = game;
        this.game.interfaceGroup = game.add.group();

        this.sizes = sizes;
        this.status = '';

        this.mouseTooltip = new Interface.MouseTooltip(this);

        this.miniMap = new Interface.MiniMap(sizes[0],this);
        this.miniPlanet = new Interface.MiniPlanet(sizes[0],this);

      //  this.pilot = new Interface.Pilot('grahem',this);
        this.miniShip = new Interface.MiniShip(sizes[2],this);
        this.labels = new Interface.Labels(this);

        this.shipInterface = new Interface.ShipIconsButtons(sizes,this);
        this.shipMenu = new Interface.ShipMenu(this);



        this.game.onPlayerInit.add(this.updateIndicators,this);
        this.game.onPlayerDamage.add(this.updateIndicators,this);
        this.game.onPlayerInventoryChanged.add(this.shipMenu.data.InventoryChangeHandler,this);
        this.game.onCargoFull.add(function () {
            if(!this.labels.labelCargo.isBlinking) {
                this.labels.blinkLabel(this.labels.labelCargo);
            }
        },this);

        this.game.onPlayerLanded.add(this.landedHandler,this);
        this.game.onPlayerUnlanded.add(this.unlandedHandler,this);
        this.game.onEscPressed.add(this.escHandler,this);

        return this;
    },
    unlandedHandler: function () {
        this.miniMap.visible = true;

        this.miniPlanet.hide();

    },
    landedHandler: function () {
        var isLanding = arguments[1];


            this.miniMap.visible = false;

            this.miniPlanet.show(arguments[0]);



    },
    escHandler : function () {
        if(this.shipMenu.visible)
            this.OpenShipMenu();
    },
    updateIndicators: function (params) {


        if(params.maxHP!==undefined)
        {

            this.labels.hullBar.setMaxHealth(params.maxHP);
            this.labels.hullBar.setHealth(params.maxHP);

        }

        if(params.hull!==undefined)
        {


            this.labels.hullBar.setHealth(params.hull);
        }



    },
    MouseTooltip: function (parent) {
        this.game = parent.game;

        var mouseTooltip = {};
        mouseTooltip.w = 250;
        mouseTooltip.h = 70;
        var gr = this.game.add.graphics(0,0);
        //gr.lineStyle(2,"0x0F41A6");
        gr.beginFill("0x5283A3");
        gr.drawRect(0,0,mouseTooltip.w,mouseTooltip.h);
        gr.endFill();
        mouseTooltip.bg = gr.generateTexture();
        gr.destroy();
        mouseTooltip.back = this.game.add.sprite(0,0,mouseTooltip.bg);
        mouseTooltip.back.anchor.set(0);
        mouseTooltip.tip = this.game.add.text(0,0," ",tooltip );
        mouseTooltip.tip.setTextBounds(3, 3, mouseTooltip.w-20, mouseTooltip.h-6);
        mouseTooltip.tip.lineSpacing = -5;
        mouseTooltip.tip.anchor.set(0);

        mouseTooltip.aboveItem = function () {

                var xShift = 10;
                var yShift = -80;
                if((this.game.input.x+mouseTooltip.w)>this.game.camera.width)
                    xShift = -10 -mouseTooltip.w;

                this.game.time.events.add(500, function (arguments) {
                    console.log("above 500");
                mouseTooltip.back.visible =true;
                mouseTooltip.back.bringToTop();
                mouseTooltip.tip.visible = true;
                mouseTooltip.tip.bringToTop();
                mouseTooltip.tip.text = arguments.info.summary;

                mouseTooltip.tip.x = this.game.input.x+xShift ;
                mouseTooltip.back.x = this.game.input.x+xShift;
                mouseTooltip.tip.y = this.game.input.y +yShift;
                mouseTooltip.back.y = this.game.input.y +yShift;

                mouseTooltip.tip.fixedToCamera = true;
                mouseTooltip.back.fixedToCamera = true;
                },this,this);

        };
        mouseTooltip.outOfItem = function () {

            this.game.time.events.removeAll();
            mouseTooltip.tip.fixedToCamera = false;
            mouseTooltip.back.fixedToCamera = false;
            mouseTooltip.tip.text="";
            mouseTooltip.tip.visible = false;
            mouseTooltip.back.visible = false;
        };
        mouseTooltip.clickToItem = function () {

            this.game.time.events.removeAll();
            mouseTooltip.tip.fixedToCamera = false;
            mouseTooltip.tip.text="";
            mouseTooltip.tip.visible = false;

        };
        mouseTooltip.tip.visible = false;
        mouseTooltip.back.visible = false;
        return mouseTooltip
    },
    ShipMenu : function (parent) {
        this.game = parent.game;
        var game = this.game;
        var w = 400;
        var h = 500;
        var zones = {

                shipInfo: {x:w*3/8,y:0,w:w*5/8,h:h*3/10,an:0},
                shipContextInfo: {x:w*3/8,y:h*3/10,w:w*5/8,h:h*1/10,an:0},
                shipView: {x:0,y:0,w:w*3/8,h:h*2/5,an:0,
                    grid:
                        {
                            cellW:50,
                            cellH:50
                        }

                },
                shipCargo: {
                    x:0,y:h*2/5,w:w,h:h*3/5,an:0,
                    grid:
                        {
                            cellW:50,
                            cellH:50
                        }
                },
                shipHangarInterface: {
                    x:w,y:0,w:w,h:h*0.6,an:0,
                },
                shipHangarCellZone: {
                    x:w,y:h*0.6,w:w,h:h*0.4,an:0,
                },
                //shipContext: {x:0,y:0,w:w*5/8,h:h*2/5,an:0},

                data:{},



            };
        zones.data.isHangar = false;
        Object.defineProperty(zones, "_visible", {
            value: false,
            enumerable: false,
            writable: true
        });
        Object.defineProperty(zones, "data", {
            enumerable: false,

        });
        Object.defineProperty(zones, "visible", {
            enumerable: false,
            get: function() {
                return this._visible;
                //return true;


            },

            set: function(value) {

                this._visible = value;
                for (var z in this)
                {



                    this[z].sprite.visible = this._visible;
                    if (typeof this[z].grid != "undefined")
                    {


                        this[z].grid.sprite.visible = this._visible;
                        //this[z].grid.sprite.bringToTop();

                        if (typeof this[z].grid.cells != "undefined" && this[z].grid.cells.length >0)
                        {
                            for (var i=0;i<this[z].grid.cells.length;i++)
                            {
                                if (this[z].grid.cells[i].item !=null && this[z].grid.cells[i].item.b != undefined) {
                                    this[z].grid.cells[i].item.b.visible = this._visible;
                                    this[z].grid.cells[i].item.b.bringToTop();

                                }
                            }
                        }
                    }


                }
            }
        });

        zones.data.zonesGroup = this.game.add.group(this.game.interfaceGroup );
        zones.data.shipCargoGroup = {};
        zones.data.installedEquipmentGroup = {};
        var  xPadding = 40;
        zones.data.xPadding = xPadding;
        var  yPadding = (this.game.camera.height-h)/5;
        zones.data.yPadding = yPadding;


        for (var z in zones)
        {
            var alpha = 1;
            if (typeof  zones[z].alpha!=="undefined")
                alpha = zones[z].alpha;
            var gr = this.game.add.graphics(0,0);
            gr.lineStyle(2,interfaceColor5,alpha);
            gr.beginFill(interfaceColor4,alpha);
            gr.drawRect(zones[z].x,zones[z].y,zones[z].w,zones[z].h);
            gr.endFill();
            var spr = gr.generateTexture();
            gr.destroy();

            zones[z].sprite  = this.game.add.sprite(zones[z].x + xPadding,zones[z].y+yPadding,spr);
            zones[z].sprite.anchor.set(zones[z].an);
            zones[z].sprite.fixedToCamera = true;
            zones.data.zonesGroup.add(zones[z].sprite);
            if (typeof zones[z].grid !== "undefined")
            {
                var cellsX = Math.floor(zones[z].w/zones[z].grid.cellW);
                var cellsY = Math.floor(zones[z].h/zones[z].grid.cellH);
                zones[z].cellsX = cellsX;
                zones[z].cellsY = cellsY;
                var cellsY = Math.floor(zones[z].h/zones[z].grid.cellH);
                var cellW =zones[z].grid.cellW;
                var cellH =zones[z].grid.cellH;
                zones[z].grid.cells = [];

                var gridGraphics = this.game.add.graphics(0,0);

                gridGraphics.beginFill(interfaceColor5,0.1);
                var cellCounter = 0;
                for (var i = 0; i<cellsX;i++)
                {

                    for (var j = 0; j<cellsY;j++)
                    {
                        gridGraphics.drawRect(cellW*i+1,cellH*j+1,cellW-2,cellW-2);
                        zones[z].grid.cells.push({i:i,j:j,w:cellW,h:cellH,index:cellCounter,item:null});
                        cellCounter++;
                    }
                }



                gridGraphics.endFill();
                var gridSpr = gridGraphics.generateTexture();
                gridGraphics.destroy();
                zones[z].grid.sprite  = this.game.add.sprite(zones[z].x+1 + xPadding,zones[z].y+yPadding+1,gridSpr);
                zones[z].grid.sprite.anchor.set(zones[z].an);
                zones[z].grid.sprite.fixedToCamera = true;
                zones.data.zonesGroup.add(zones[z].grid.sprite);

            }

        }

        var context = this.game.add.text(4,4,"",font);

        context.style.wordWrap=true;
        context.style.align="left";
        context.style.wordWrapWidth=zones.shipContextInfo.w -2;
        context.text+=" ";
        zones.shipContextInfo.sprite.addChild(context);

        zones.shipView.createShipView = function(ship) {
            this.avatar = game.add.sprite(this.w/2,this.h/2,"ship1",4);
            this.avatar.anchor.set(0.5);
            this.avatar.alpha = 1;
            this.avatar.customScale = this.w/this.avatar.width;
            this.avatar.scale.set(this.avatar.customScale);
            this.sprite.addChild(this.avatar);

            zones.data.installedEquipmentGroup = ship.installedEquipmentGroup;
            game.world.bringToTop(zones.data.installedEquipmentGroup);

        };
        zones.shipView.addItem = function (item,i) {


            var g =   i % this.cellsX;
            var k = Math.floor(i/this.cellsX);
            var x = this.x + zones.data.xPadding + this.grid.cellW * (g+1) - cellW / 2;
            var y = this.y + zones.data.yPadding + this.grid.cellH * (k+1) - cellH / 2;

            item = item.parentObject;
            item.scale = cellW / item.b.width ;
            item.b.scale.set( item.originalSize *2);
            item.b.reset(x,y);

            item.b.exists = false;
            item.b.visible = true;

            item.b.inputEnabled = true;
            item.b.input.enableDrag();


            item.b.input.enableSnap(cellW, cellH, false, true, Math.floor(-cellW / 2 -10), Math.floor(-cellH / 2 -10));
            item.b.events.onDragStop.add(zones.shipCargo.onDragItemStop, zones.shipCargo.sprite);

            item.b.events.onDragStart.add(function () {
                console.log("on drag start",arguments)

                arguments[0].parentObject.originZone = zones.data.detectZone(arguments[0]);
                arguments[0].parentObject.dragStart = {};
                arguments[0].parentObject.dragStart.x = arguments[2];
                arguments[0].parentObject.dragStart.y = arguments[3];
            });

        };
        zones.shipView.updateShipView = function (ship) {
            zones.data.installedEquipmentGroup = ship.installedEquipmentGroup;
            for (var i = 0; i < zones.data.installedEquipmentGroup.children.length; i++)
            {
                this.addItem( zones.data.installedEquipmentGroup.children[i],i);
            }

            if (zones.visible) {
                zones.visible = true;
                zones.data.installedEquipmentGroup.visible= true;
            }
            else {
                zones.visible = false;
                zones.data.installedEquipmentGroup.visible= false;
            }
            game.world.bringToTop(zones.data.installedEquipmentGroup);
        };
        zones.data.detectZone = function (item) {

            for (var z in zones) {
               // console.log(zones.data.xPadding+zones[z].x );
                if (item.x > zones.data.xPadding+zones[z].x &&
                    item.x < zones.data.xPadding+zones[z].x+zones[z].w &&
                    item.y >  zones.data.yPadding+zones[z].y &&
                    item.y < zones.data.yPadding+zones[z].y+zones[z].h)
                    return z;

            }
            return null;


        };
        zones.data.InventoryChangeHandler = function () {


            var ship = arguments[0];

            this.shipMenu.shipCargo.updateCargoView(ship);

            this.shipMenu.shipView.updateShipView(ship);

        };
        zones.shipCargo.onDragItemStop = function (item) {

        var ship = item.game.ship;
            if(zones.data.detectZone(item)===null) {



                ship.uninstallItem(item.parentObject);
                ship.dropItem(item.parentObject);
                this.game.onPlayerInventoryChanged.dispatch(ship);

            }
            else if(zones.data.detectZone(item)==='shipInfo') {

                item.x =item.parentObject.dragStart.x;
                item.y=item.parentObject.dragStart.y;

            }
            else if(zones.data.detectZone(item)==='shipView'  && item.parentObject.originZone==='shipCargo') {
                var result = ship.installItem(item.parentObject);
                if (result)
                {
                    console.log(result);

                    ship.cargoItemsGroup.remove(item);
                    ship.installedEquipmentGroup.add(item);

                    this.game.onPlayerInventoryChanged.dispatch(ship);

                }
                else
                {

                    console.log(result);
                    game.userInterface.pilot.say(result|| "Эээ...че то не то");

                    item.x =item.parentObject.dragStart.x;
                    item.y=item.parentObject.dragStart.y;


                }


            }
            else if(zones.data.detectZone(item)==='shipCargo' && item.parentObject.originZone==='shipView') {

                console.log("uninstall", item);

               ship.uninstallItem(item.parentObject);
            }

        };
        zones.shipCargo.addItem = function (item,i) {

            item = item.parentObject;


             item.b.scale.set(item.originalSize *2);

             var g =   i % this.cellsX;
             var k = Math.floor(i/this.cellsX);
             var x = this.x + zones.data.xPadding + this.grid.cellW * (g+1) - cellW / 2;
            var y = this.y + zones.data.yPadding + this.grid.cellH * (k+1) - cellH / 2;
            item.b.reset(x,y);

            item.b.exists = false;
            item.b.visible = true;

            item.b.inputEnabled = true;
            item.b.input.enableDrag();


            item.b.input.enableSnap(cellW, cellH, false, true, Math.floor(-cellW / 2 -10), Math.floor(-cellH / 2 -10));
            item.b.events.onDragStop.add(zones.shipCargo.onDragItemStop, zones.shipCargo.sprite);
            item.b.events.onDragStart.add(function () {
                arguments[0].parentObject.originZone = zones.data.detectZone(arguments[0]);
                arguments[0].parentObject.dragStart = {};
                arguments[0].parentObject.dragStart.x = arguments[2];
                arguments[0].parentObject.dragStart.y = arguments[3];
            });



        };
        zones.shipCargo.updateCargoView = function (ship) {

            var cargoItemsGroup = ship.cargoItemsGroup;

            for (var i = 0; i < cargoItemsGroup.children.length; i++)
            {
                this.addItem( cargoItemsGroup.children[i],i);
            }

            zones.data.shipCargoGroup = cargoItemsGroup;

            if (zones.visible) {
                zones.visible = true;
                zones.data.shipCargoGroup.visible= true;
            }
            else {
                zones.visible = false;
                zones.data.shipCargoGroup.visible= false;


            }
            game.world.bringToTop(zones.data.shipCargoGroup);

           // cargoItemsGroup.visible = zones.visible ;

            //zones.data.shipCargoGroup.visible = false;


        };
        zones.visible = false;
        return zones;
    },
    OpenShipMenu: function () {

        this.shipMenu.visible = !this.shipMenu.visible;
        this.shipMenu.data.zonesGroup.visible = this.shipMenu.visible;
        this.shipMenu.data.shipCargoGroup.visible = this.shipMenu.visible;
        this.shipMenu.data.installedEquipmentGroup.visible = this.shipMenu.visible;

    },
    ShipIconsButtons: function (sizes,parent) {
        this.game = parent.game;
        var ship = this.game.ship;
        var btns = {};

        btns.sizes = sizes || [100,100,100];
        var w = (this.game.width - btns.sizes[2]+16);
        var h = (this.game.height)-sizes[2]-16;

        var n = 0; // номер кнопки
        var f = 3; // фреймов на кнопку
        var sp = 32; //расстояние между кнопками
        btns.buttonsGroup = this.game.add.group();

        btns.shipMenuButton = this.game.add.button(w+sp*n,h,'spaceicons',parent.OpenShipMenu,parent,
            n*f,n*f+1,n*f,n*f,btns.buttonsGroup);
        btns.shipMenuButton.setCustomDefaults(n*f+2,n*f+1);
        btns.shipMenuButton.enable(true);
        n++;

        btns.shipGrab = this.game.add.button(w+sp*n,h,'spaceicons',"",parent,
            n*f,n*f+1,n*f,n*f,btns.buttonsGroup);
        btns.shipGrab.setCustomDefaults(n*f+2,n*f+1);
        btns.shipGrab.enable(false);
        n++;
        btns.shipFuel = this.game.add.button(w+sp*n,h,'spaceicons',"",parent,
            n*f,n*f+1,n*f,n*f,btns.buttonsGroup);
        btns.shipFuel.setCustomDefaults(n*f+2,n*f+1);
        btns.shipFuel.enable(false);
        n++;
        btns.intercom = this.game.add.button(w+sp*n,h,'spaceicons',"",parent,
            n*f,n*f+1,n*f,n*f,btns.buttonsGroup);
        btns.intercom.setCustomDefaults(n*f+2,n*f+1);
        btns.intercom.enable(false);


        btns.hide = function () {
            btns.buttonsGroup.forEach(function (b) {
                b.visible = false;
            })

        } ;
        btns.show = function () {
            btns.buttonsGroup.forEach(function (b) {
                b.visible = true;
            });
        } ;

        return btns;

    },
    Labels: function (parent) {
        var labels = {};
        labels.game = parent.game;
        var rightSide =6 * (labels.game.width/8);
        var yStep = 20;
        var yOffset = 20;
        var s = 1;
        var leftSide =0 ;
        var middleSide =3 * (labels.game.width/8) ;

        labels.labelDate = labels.game.add.text(leftSide, yOffset, "Дата: " + "2105.1.1",font);
        labels.labelMoney = labels.game.add.text(leftSide,yOffset+yStep,"",font);


        labels.labelCustomStatus = labels.game.add.text(middleSide,yOffset,"",font);

        labels.labelFuel =  labels.game.add.text(rightSide,yOffset,"", font);
        labels.labelSpeed =  labels.game.add.text(rightSide,yOffset+s*yStep,"",font);
        labels.labelAcc =  labels.game.add.text(rightSide,yOffset+s*yStep*2,"",font);

        labels.labelThrustLevel =  labels.game.add.text(rightSide,yOffset+s*yStep*3,"er",font);
        labels.labelThrustDumpLevel =  labels.game.add.text(rightSide,yOffset+s*yStep*8,"er",font);

        labels.labelMass =  labels.game.add.text(rightSide,yOffset+s*yStep*4,"",font);
        labels.labelCargo =  labels.game.add.text(rightSide,yOffset+s*yStep*5,"",font);
        labels.labelFlightStatus = labels.game.add.text(rightSide,yOffset+s*yStep*6,"",font);
        labels.labelFlightMode = labels.game.add.text(rightSide,yOffset+s*yStep*7,"",font);

        labels.labelDamping = labels.game.add.text(rightSide,yOffset+s*yStep*9,"",font);
        //labels.labelItems = this.game.add.text(rightSide,yOffset+s*yStep*10,"as",font);

        labels.labelSay = labels.game.add.text(labels.game.width-65,labels.game.height,"",font);
        labels.labelSay.anchor.set(0.5,1);





        labels.labelDate.fixedToCamera=true;
        labels.labelMoney.fixedToCamera=true;
        labels.labelFuel.fixedToCamera=true;
        labels.labelSpeed.fixedToCamera = true;
        labels.labelAcc.fixedToCamera = true;

        labels.labelThrustLevel.fixedToCamera = true;
        labels.labelThrustDumpLevel.fixedToCamera = true;

        labels.labelFlightStatus.fixedToCamera = true;
        labels.labelFlightMode.fixedToCamera = true;


        labels.labelDamping.fixedToCamera = true;
        //labels.labelItems.fixedToCamera = true;
        labels.labelCustomStatus.fixedToCamera = true;

        labels.labelMass.fixedToCamera = true;
        labels.labelCargo.fixedToCamera = true;

        labels.labelSay.fixedToCamera = true;

        var  configArmorBar = {
            width: 130,
            height: 14,
            x: labels.game.camera.width-65,
            y: labels.game.camera.height-150-14-10,
            maxHP:180,
            bg: {
                color: '#36080c'
            },
            bar: {
                color: '#bc0209'
            },
            animationDuration: 200,
            flipped: false
        };
        labels.hullBar = new HealthBar(labels.game, configArmorBar);
        labels.hullBar.setFixedToCamera(true);
        labels.hullBar.bgSprite.inputEnabled = true;
        labels.hullBar.bgSprite.info={summary:"прочность корпуса"};

        labels.hullBar.bgSprite.events.onInputOver.add(parent.mouseTooltip.aboveItem,labels.hullBar.bgSprite);
        labels.hullBar.bgSprite.events.onInputOut.add(parent.mouseTooltip.outOfItem,labels.hullBar.bgSprite);

        labels.hullBar.setHealth(140);

        labels.blinkLabel=function (label) {
            label.isBlinking = true;
            var oldBack = label.style.backgroundColor;
            var oldFill = label.style.fill;

            label.style.backgroundColor = "#ff9300";
            label.style.fill = "#030329";
            label.text+=" ";
            labels.game.time.events.add(500, function () {
                label.style.backgroundColor = oldBack;
                label.style.fill = oldFill;
                label.text+=" ";
                label.isBlinking = false;
            },this,this);
        };
        return labels;
    },
    resetFontBug : true,
    c: 0,
    updateLabels: function (game) {
        this.game=game;
        var ship = this.game.ship;

        if(this.resetFontBug)
        {this.c++;
            if(this.c>5) {
                for (label in this.labels) {
                    this.labels[label].text = " ";
                }
                this.resetFontBug = false;

                this.miniPlanet.updateTextBug();
            }
        }

        var labels = this.labels;

        if (ship.fuel < 0) ship.fuel = 0;

        labels.labelFuel.text = T[lang].fuel+ ": "+ Math.round(ship.fuel*100)/100;
        labels.labelAcc.text = T[lang].acceleation+ ": "+ ship.acc.toFixed(2)+"g";
        labels.labelMass.text = T[lang].mass+ ": "+ ship.mass+"t";
        labels.labelCargo.text = T[lang].cargobay+ ": "+ ship.cargoBay+"/"+ship.cargoBayCap;




        var detail = 10;
        var lvl = Math.round(ship.thrustCurrent/ship.thrustMaximum*detail);
        var string = "";
        for (var i=0;i<detail;i++)
        {
            if(i<lvl)
                string +="|";
            else
                string +=" ";
        }
        string = "["+string+"]";
        labels.labelThrustLevel.text = T[lang].thrust+": (Z)"+ string +"(X)";
        labels.labelThrustLevel.inputEnabled = true;
        labels.labelThrustLevel.events.onInputOut.add(function () {
            game.wheelDelta.valueToChange = null;
            game.wheelDelta.val =0;

        },this);
        labels.labelThrustLevel.events.onInputOver.add(function () {
            game.wheelDelta.setVal(ship,'thrustCurrent', 5);

        });


        string="";
        lvl =  Math.round(ship.thrustCurrentDamp/ship.thrustMaximum*detail);
        for (i=0;i<detail;i++)
        {
            if(i<lvl)
                string +="|";
            else
                string +=" ";
        }
        string = "["+string+"]";
        labels.labelThrustDumpLevel.text = T[lang].lvl+" (C)"+ string +"(V)";
        labels.labelThrustDumpLevel.inputEnabled = true;
        labels.labelThrustDumpLevel.events.onInputOut.add(function () {
            game.wheelDelta.valueToChange = null;
            game.wheelDelta.val =0;
        },this);
        labels.labelThrustDumpLevel.events.onInputOver.add(function () {
            game.wheelDelta.setVal(ship,'thrustCurrentDamp', 5);
        });
        labels.labelCustomStatus.text = ship.globalStatus ||"";

        labels.labelFlightMode.text = ship.isFreeFlight ? T[lang].freeflight+" (F)" : T[lang].autocompensation+""+ship.thrustCurrentDamp+"/"+ship.thrustMaximum+"  (F) ";
        labels.labelFlightMode.style.backgroundColor = ship.isFreeFlight ? "transparent" : "#ff9300";
        labels.labelFlightMode.style.fill = ship.isFreeFlight ? "white" : "black";


        labels.labelFlightStatus.text = this.game.userInterface.status;
        labels.labelFlightStatus.style.backgroundColor = customBack;
        labels.labelFlightStatus.style.fill = customFill;

        labels.labelMoney.text = T[lang].money+": " + Math.round(ship.money);

        labels.labelSpeed.text =  T[lang].speed+": " + Math.round(ship.vel/2)/10+" km/s";


        if (ship.isLanded) { labels.status = " на поверхности ";
            customFill = "rgb(0,0,0)";
            customBack = "rgba(0,255,0,0.8)";
        }
        else if (ship.isThrottling) { labels.status = " тяга ";
            customFill = "rgb(0,0,0)";
            customBack = "orange";
        } else { labels.status = "";
            customFill = "rgb(255,255,255)";
            customBack = ""; }


        if (this.game.counter >= 60) {

            this.game.day++;
            this.UpdateUnitDots(this.game);


            labels.labelDate.text = T[lang].date+": " + Math.floor(this.game.day / 360) + "." + (Math.floor((this.game.day % 360) / 30) + 1) + "." + ((this.game.day % 360) % 30 + 1);

            this.game.counter = 0;
        }
        else {
            this.game.counter++;
        }

    },
    Pilot : function (pilotSprite,parent) {

        var pilot={};
        pilot.parent = parent;
        pilot.game = parent.game;
        pilot.hp = 100;
        var x = pilot.game.camera.view.width;
        var y = pilot.game.camera.view.height;
        var w = 130;
        var h = 130;
        var frame = pilot.game.add.graphics(0, 0);
        frame.lineStyle(1, interfaceColor1,1);
        frame.beginFill('0x000000', 1);
        //this.UIframe.beginFill(interfaceColor2, 1);
        frame.drawRect(x-w, y-h, w, h);
        frame.endFill();


        pilot.ui = frame;
        pilot.ui.fixedToCamera = true;

        pilot.b = pilot.game.add.sprite(x,y,'pilotback',0);


        pilot.b.animations.add('blink',[0,1,2,3,4,5],4,true);
        pilot.b.animations.play('blink',6,true,false);
        pilot.s = pilot.game.add.sprite(x,y,pilotSprite,0);


        pilot.d = pilot.game.add.sprite(x,y,'grahemdamages',0);

        pilot.s.animations.add('blink',[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,3,0,0,0,0,0,0,0,3,0,0,0,0,0,0,0,1,1,1,1,1,0,0,0,0,0,3],20,true);

        pilot.s.animations.play('blink',5,true,false);
        pilot.d.animations.add('d0',[0],1,true);
        pilot.d.animations.add('d1',[1],1,true);
        pilot.d.animations.add('d2',[2],1,true);
        pilot.d.animations.add('d3',[3],1,true);
        pilot.d.animations.add('d4',[4],1,true);
        pilot.d.animations.add('d5',[5],1,true);
        pilot.d.animations.play('d0',6,true,false);
        pilot.s.anchor.set(1);
        pilot.b.anchor.set(1);
        pilot.d.anchor.set(1);
        pilot.s.fixedToCamera = true;
        pilot.b.fixedToCamera = true;
        pilot.d.fixedToCamera = true;
        pilot.s.scale.set(4);
        pilot.b.scale.set(4);
        pilot.d.scale.set(4);
        pilot.s.smoothed = false;
        pilot.b.smoothed = false;
        pilot.d.smoothed = false;

        var config = {
            width: 130,
            height: 14,
            x: x-w/2+1,
            y: y-h-14/2,
            bg: {
                color: '#411210'
            },
            bar: {
                color: '#bc4800'
            },
            animationDuration: 200,
            flipped: false
        };

        //pilot.hpbar = new HealthBar(pilot.game, config);
        //pilot.hpbar.setFixedToCamera(true);
        //pilot.hpbar.setPercent(100);

        pilot.say = function (text) {
            pilot.parent.labels.labelSay.text = text;
            this.game.time.events.add(4000, function () {
                arguments[0].parent.labels.labelSay.text ='';
            },this,this);
        };
        pilot.updateDamagePicture = function () {
            if(pilot.hp==100)
                pilot.d.animations.play('d0',6,true,false);
            if(pilot.hp<100)
                pilot.d.animations.play('d1',6,true,false);
            if(pilot.hp<80)
                pilot.d.animations.play('d2',6,true,false);
            if(pilot.hp<50)
                pilot.d.animations.play('d3',6,true,false);
            if(pilot.hp<25)
                pilot.d.animations.play('d4',6,true,false);
            if(pilot.hp<=10)
                pilot.d.animations.play('d5',6,true,false);

        };

        pilot.disConnect = function () {
            pilot.s.visible = false;
            pilot.d.visible = false;
            pilot.b.filters = [pilot.game.noiseFilter];
        };
        pilot.reConnect = function () {
            pilot.s.viible = true;
            pilot.d.visible = true;
            pilot.b.filters = [''];
        };
        return pilot;
    },
    MiniShip : function () {

    },
    MiniMap : function (size,parent) {
        this.game = parent.game;
        var worldSize = this.game.worldSize;
        var mMap = {};
        mMap.buttons = this.game.add.group();
        mMap.mMapGroup = this.game.add.group();
        mMap.zoom = 1;
        mMap.alpha = 1;
        var minimapSize = size;
        var gameSize = this.game.width;



        mMap.UIframe = this.game.add.graphics(0, 0);
        mMap.UIframe.lineStyle(1, interfaceColor1, mMap.alpha);
        mMap.UIframe.beginFill('0x000000', mMap.alpha);
        //this.UIframe.beginFill(interfaceColor2, 1);
        mMap.UIframe.drawRect(0, 0, minimapSize, minimapSize);
        mMap.UIframe.endFill();



        mMap.resolution = minimapSize / worldSize *mMap.zoom *16*16;


        mMap.mMapGroup.add(mMap.UIframe);

        mMap.unitDots = this.game.add.graphics(0, 0);
        mMap.unitDots.fixedToCamera = true;

        mMap.mMapGroup.add(mMap.unitDots);

        mMap.localX = mMap.UIframe.width;
        mMap.localY = this.game.camera.view.height - mMap.UIframe.height;
        mMap.UIframe.y = mMap.localY;
        mMap.UIframe.fixedToCamera = true;




        var plus =  this.game.add.text(mMap.localX-22 ,mMap.localY-19 , " + ",buttonsFontEnabledMap);
        var minus = this.game.add.text(mMap.localX-40 ,mMap.localY-19 , " - ",buttonsFontEnabledMap);

        mMap.labelZoom = this.game.add.text(mMap.localX-90 ,mMap.localY-19 , "x"+mMap.zoom,font);

        mMap.buttons.add(plus);
        mMap.buttons.add(minus);


        mMap.buttons.forEach(function (button) {
            button.inputEnabled = true;
            button.events.onInputOut.add(function () {this.game.isEnabledMouse=true;});
            button.events.onInputOver.add(function () {this.game.isEnabledMouse=false;});

        });
        plus.events.onInputUp.add(function () {
            if( mMap.zoom <129) {
                mMap.zoom *= 2;
                parent.UpdateUnitDots(parent.game);
                mMap.labelZoom.text = "x" + mMap.zoom;
            }
        },mMap);
        minus.events.onInputUp.add(function () {
            if(mMap.zoom > 0.124) {
                this.zoom /= 2;
                parent.UpdateUnitDots(parent.game);
                mMap.labelZoom.text = "x" + mMap.zoom;
            }
        },mMap);

        mMap.buttons.add(mMap.labelZoom);
        mMap.buttons.fixedToCamera=true;
        mMap._enabled = false;
        mMap._visible = true;
        Object.defineProperty(mMap, "enabled", {

            get: function() {
                return this._enabled;
            },

            set: function(value) {

                this.mMapGroup.visible = value && this.visible;
                this.buttons.visible = value && this.visible;
                this._enabled = value;

            }
        });
        Object.defineProperty(mMap, "visible", {

            get: function() {
                return this._visible;
            },

            set: function(value) {

                this.mMapGroup.visible = value && this.enabled;
                this.buttons.visible = value && this.enabled;
                this._visible = value;

            }
        });

        mMap.hide = function () {

            mMap.enabled = false;
        };
        mMap.show = function () {

            mMap.enabled = true;

        };
        mMap.enabled = false;
        return mMap;
    },
    MiniPlanet: function (size,parent) {
        var mPlanet={};

        var game = parent.game;
        mPlanet.alpha = 0.5;
        mPlanet.parent = parent;

        mPlanet.localX = size;
        mPlanet.localY = game.camera.view.height - size;

        mPlanet.UIframe = game.add.graphics(0, mPlanet.localY );
        mPlanet.UIframe.lineStyle(1, interfaceColor1, mPlanet.alpha);
        mPlanet.UIframe.beginFill('0x000000', mPlanet.alpha);
        //this.UIframe.beginFill(interfaceColor2, 1);
        mPlanet.UIframe.drawRect(0, 0, size, size);
        mPlanet.UIframe.endFill();
        mPlanet.UIframe.fixedToCamera = true;
        mPlanet.mPlanetGroup = game.add.group();
        mPlanet.mPlanetButtonsGroup = game.add.group(mPlanet.mPlanetGroup);

        ///buttons
        var buttonHeight = 32;
        var i = 0; //bitton iteration

        i++;
        mPlanet.infoButton = game.add.button(size,mPlanet.localY+size-(buttonHeight* i),'whitebuttons',"",this,1,0,2,1,mPlanet.mPlanetGroup);
        mPlanet.infoButton.fixedToCamera = true;
        mPlanet.infoButton.tint = "0x"+"#abf7ff".slice(1, 7);

        mPlanet.infoButton.text = game.add.text(0, 0, T[lang].planetInfoButton, {font: "12px Roboto mono", fill: "#000000", boundsAlignH: "center",boundsAlignV:"bottom"});
        mPlanet.infoButton.text.id = 'planetInfoButton';
        mPlanet.infoButton.text.setTextBounds(0,0,96,32);
        mPlanet.infoButton.addChild(mPlanet.infoButton.text);

        mPlanet.mPlanetButtonsGroup.add(mPlanet.infoButton);

        i++;
        mPlanet.tradeButton = game.add.button(size,mPlanet.localY+size-(buttonHeight* i),'whitebuttons',"",this,1,0,2,1,mPlanet.mPlanetGroup);
        mPlanet.tradeButton.fixedToCamera = true;
        mPlanet.tradeButton.tint = "0x"+"#abf7ff".slice(1, 7);

        mPlanet.tradeButton.text = game.add.text(0, 0, T[lang].planetTradeButton, {font: "12px Roboto mono", fill: "#000000", boundsAlignH: "center",boundsAlignV:"middle"});
        mPlanet.tradeButton.text.id = 'planetTradeButton';
        mPlanet.tradeButton.text.setTextBounds(0,0,96,32);
        mPlanet.tradeButton.addChild(mPlanet.tradeButton.text);

        mPlanet.mPlanetButtonsGroup.add(mPlanet.tradeButton);

        i++;
        mPlanet.landZoneButton = game.add.button(size,mPlanet.localY+size-(buttonHeight* i),'whitebuttons',"",this,1,0,2,1,mPlanet.mPlanetGroup);
        mPlanet.landZoneButton.fixedToCamera = true;
        mPlanet.landZoneButton.tint = "0x"+"#abf7ff".slice(1, 7);

        mPlanet.landZoneButton.text = game.add.text(0, 0, T[lang].landZoneButton, {font: "12px Roboto mono", fill: "#000000", boundsAlignH: "center",boundsAlignV:"middle"});
        mPlanet.landZoneButton.text.id = 'landZoneButton';
        mPlanet.landZoneButton.text.setTextBounds(0,0,96,32);
        mPlanet.landZoneButton.addChild(mPlanet.landZoneButton.text);

        mPlanet.mPlanetButtonsGroup.add(mPlanet.landZoneButton);

        i++;
        mPlanet.shipYardButton = game.add.button(size,mPlanet.localY+size-(buttonHeight* i),'whitebuttons',"",this,1,0,2,1,mPlanet.mPlanetGroup);
        mPlanet.shipYardButton.fixedToCamera = true;
        mPlanet.shipYardButton.tint = "0x"+"#abf7ff".slice(1, 7);

        mPlanet.shipYardButton.text = game.add.text(0, 0, T[lang].shipYardButton, {font: "12px Roboto mono", fill: "#000000", boundsAlignH: "center",boundsAlignV:"middle"});
        mPlanet.shipYardButton.text.id = 'shipYardButton';
        mPlanet.shipYardButton.text.setTextBounds(0,0,96,32);
        mPlanet.shipYardButton.addChild(mPlanet.shipYardButton.text);

        mPlanet.mPlanetButtonsGroup.add(mPlanet.shipYardButton);

        mPlanet.updateTextBug = function () {
            this.mPlanetButtonsGroup.forEach(function (button) {

              button.text.text+=" ";
                button.text.text = button.text.text.trim();
            })
        };

        console.log(mPlanet.localY);
        mPlanet.UIframe.y = mPlanet.localY;
        mPlanet.mPlanetGroup.add(mPlanet.UIframe);
        Object.defineProperty(mPlanet, "visible", {

            get: function() {
                return this._visible;
            },

            set: function(value) {

                this.mPlanetGroup.visible = value;
                this._visible = value;

            }
        });
        mPlanet.visible = true;
        mPlanet.show = function (planet) {


            mPlanet.visible = true;

            mPlanet.mPlanetButtonsGroup.forEach(function (button) {

                if( mPlanet.parent.game.ship.planetLanded!==undefined && mPlanet.parent.game.ship.planetLanded!==null) {

                    console.log("planet landed", mPlanet.parent.game.ship.planetLanded);
                    button.text.text = button.text.text;
                    console.log( button.text.text);
                    if (button.text.text = mPlanet.parent.game.ship.planetLanded.places !== undefined) {
                        button.text.text = mPlanet.parent.game.ship.planetLanded.places[button.text.text.id][lang].title;
                    }

                }
            })


        };
        mPlanet.hide = function () {

            mPlanet.visible = false;

        };
        return mPlanet;
    },
    UpdateUnitDots : function (game) {

        this.game = game;
        var ship = this.game.ship;
        //todo переписать как метод экземпляра MiniMap
        var  miniMap = this.miniMap;
        miniMap.unitDots.clear();

        if(miniMap.enabled &&  miniMap.visible && ship.eq.radar.radius!==undefined && ship.eq.radar.radius>0) {
            for(var i = 0,j=this.game.spaceObjects.length;i<j;i++)
            {
                var object =this.game.spaceObjects[i];
                if(object.b.visible) {

                    var unitMiniX = (object.b.x - ship.b.x) * miniMap.resolution * miniMap.zoom + miniMap.UIframe.width / 2;
                    var unitMiniY = (object.b.y - ship.b.y) * miniMap.resolution * miniMap.zoom + miniMap.UIframe.height / 2;
                    unitMiniX = Math.round(unitMiniX);
                    unitMiniY = Math.round(unitMiniY);

                    if (unitMiniX < miniMap.UIframe.width && unitMiniX > 0 && unitMiniY < miniMap.UIframe.height && unitMiniY > 0) {
                        //if(true ) {
                        if (object.objType === ObjTypes.planet) {

                            miniMap.unitDots.beginFill(mapColorPlanet, 0.5);
                            miniMap.unitDots.drawCircle(unitMiniX, unitMiniY + miniMap.localY, 8);

                        }
                        else if (object.objType === ObjTypes.asteroid) {
                            if (object.health !== -1) {
                                miniMap.unitDots.beginFill(mapColorAsteroidField, 0.5);
                                miniMap.unitDots.drawRect(unitMiniX, unitMiniY + miniMap.localY, 2, 2);
                            }

                        }
                        else if (object.objType === ObjTypes.player) {

                            miniMap.unitDots.beginFill(mapColorPlayer, 1);
                            miniMap.unitDots.drawRect(unitMiniX - 1, unitMiniY + miniMap.localY - 1, 4, 4);

                        }
                        else if (object.objType === ObjTypes.ship) {

                            miniMap.unitDots.beginFill(mapColorPlayer, 0.5);
                            miniMap.unitDots.drawRect(unitMiniX - 1, unitMiniY + miniMap.localY - 1, 4, 4);

                        }

                        miniMap.unitDots.endFill();

                    }
                }

            }

        }
        else
        {


        }

        miniMap.mMapGroup.sendToBack(miniMap.UIframe);

    }

};