/**
 * Created by lav010 on 11.10.2017.
 */

var PickableObjectTypes = PickableObjectTypes || {};
PickableObjectTypes=
    {
        material: "material",
        equipment: "equipment",
    };

var Equipment = Equipment || {};
Equipment.Types =
    {
        engine:{
            name: "engine",
            title: "двигатель"
        },
        weapon:
        {
            name: "weapon",
            title: "оружие"
        },
        grabber:
        {
            name: "grabber",
            title: "захват"
        },
        power:
        {
            name: "power",
            title: "Энергогенератор"
        },
        radar:
        {
            name: "radar",
            title: "Радар"
        },
        capacitor:
        {
            name: "capacitor",
            title: "захват"
        },
        shield:
        {
            name: "shield",
            title: "щит"
        },
        any:
            {
                name: "any",
                title: "любое"
            }

    };
Equipment.Hulls = {

    Ship0:
        {
            name: "Hunter",
            title: "охотник",
            descr: "перехватчик",
            mass: 150,
            shape: "ship1",
            sprite: "ship0",
            secondaryEnginesSprite: "sidethrust1",
            space: "250"

        },

    Ship1:
        {   name: "Droplet",
            title: "Капелька 2050",
            descr: "Корпус устаревшей модели 2050 года выпуска. Поступила в производство в 50 лет назад, за 4 года до начала эпохи гиперпереходов. " +
            "Модель хороша своей универсальностью и относительной дешевизной. " +
            "В стандартной комплектации снащена маневровыми дюзами и фронтальным орудийном пилоном." +
            " Возможность установить гипердвигатель, при наличии достаточной ёмкости энергонакопителя, позволяет использовать корпус " +
            "и сейчас для разных задач.",
            mass: 150,
            shape: "ship1",
            sprite: "ship1",
            secondaryEnginesSprite: "sidethrust1",
            space: "250",
            equipmentSlots:
                {
                    weapon1:
                        {maxRoom: 10,pos: {x:0,y:-10},type: Equipment.Types.weapon,occupied:false},
                    //weapon2:
                    //      {maxRoom: 3,pos: {x:5,y:-15},type: Equipment.Types.weapon},

                    engine:{maxRoom: 20,pos: {x:0,y:12},type: Equipment.Types.engine,occupied:false },
                    // grab:{maxRoom: 5,pos: {x:-7,y:-4},type: Equipment.Types.grabber,occupied:false },
                    // radar:{maxRoom: 5,pos: {x:-0,y:-4},type: Equipment.Types.radar,occupied:false },
                    // generator:{maxRoom: 5,pos: {x:7,y:-4},type: Equipment.Types.powerPlant,occupied:false },
                    // capacitor:{maxRoom: 5,pos: {x:7,y:4},type: Equipment.Types.energyStorage,occupied:false },
                    any5:{maxRoom: 5,pos: {x:0,y:4},type: Equipment.Types.any,occupied:false },
                    any7:{maxRoom: 5,pos: {x:-7,y:4},type: Equipment.Types.any,occupied:false },
                    any8:{maxRoom: 5,pos: {x:-7,y:4},type: Equipment.Types.any,occupied:false },
                    any9:{maxRoom: 5,pos: {x:-7,y:4},type: Equipment.Types.any,occupied:false },
                    any0:{maxRoom: 5,pos: {x:-7,y:4},type: Equipment.Types.any,occupied:false }
                },

            data:
                {
                    pos:
                        {
                            rotLeft:{x:-7,y:-7,angle:20},
                            rotRight:{x:7,y:-7,angle:-20},

                            marchLeft:{x:-12,y:3,angle:0},
                            marchRight:{x:12,y:3,angle:0},

                            marchForward:{x:0,y:15,angle:0},
                            marchBackwards:{x:0,y:-15,angle:0}


                        }
                }
        },



    Ship2:
        {   name: "Droplet",
            mass: 500,
            shape: "ship1",
            sprite: "ship1",
            space: "250"
        },


};
Equipment.Engines = {

    RD300:
        {   name: "RD-300",
            title: "Двигатель RD-300",
            thrustMax: 70,
            sprite: 'engines',
            frame: 0,
            tint: '0xAAAAAA',
            mass: 45,
            volume: 15,
            fuelConsumption: 0.01,
            rotationFuelConsumption: 0.001,
            price: 300,
            powerGeneration:1,
            rotationMax: 150,
            optimalManeuveringSpeed:  20,
            typeName: PickableObjectTypes.equipment,
            type: Equipment.Types.engine
        }

};

Equipment.Weapons = {
    Laser1:
        {
            name: "L-10",
            sprite: "lasers",
            frame: 0,

            title: "Импульсный лазер, 2МВт*сек",
            mass: 4,
            volume: 5,

            delay: 100,
            damagePerShot: 4,
            bullet: "laser",
            price: 70,
            powerPerShot: 2,
            bulletSpeed:1000,
            typeName: PickableObjectTypes.equipment,
            type: Equipment.Types.weapon
        },
    Laser2:
        {
            name: "L-15-b",
            sprite: "lasers",
            frame: 1,

            title: "Импульсный лазер, 5МВт*сек",
            mass: 6,
            volume: 10,

            delay: 150,
            damagePerShot: 10,
            bullet: "laser",
            bulletScale:1.2,
            price: 135,
            powerPerShot: 5,
            bulletSpeed:1000,
            typeName: PickableObjectTypes.equipment,
            type: Equipment.Types.weapon
        },
    Laser3:
        {
            name: "L-20-x2",
            sprite: "lasers",
            frame: 2,
            title: "Импульсный лазер, 15МВт*сек",
            descr: "лазерная установка бывшая когда то на вооружении сил Земного Альянса Колоний",
            mass: 7,
            volume: 15,
            delay: 300,
            damagePerShot: 25,
            bullet: "laser",
            bulletScale:1.5,
            price: 620,
            powerPerShot: 15,
            bulletSpeed:1000,
            typeName: PickableObjectTypes.equipment,
            type: Equipment.Types.weapon
        }
};

Equipment.PowerPlants = {
    PP1:
        {
            name: "TWR-330",
            title: "реактор типа TWR-330",
            sprite: "generators",
            frame: 0,
            mass: 40,
            volume: 50,
            output: 5,
            price: 70,
            typeName: PickableObjectTypes.equipment,
            type: Equipment.Types.power
        },

};
Equipment.EnergyStorages = {
    EnergyBank1:
        {
            name: "EnergyBank-1",
            title: "энергобанк на базе нанопленочных конденсаторов",
            sprite: "capacitors",
            frame: 0,
            volume: 30,
            mass: 40,
            capacity: 220,
            typeName: PickableObjectTypes.equipment,
            type: Equipment.Types.capacitor
        },

};
Equipment.Grabbers = {
    Grab1:
        {
            name: "The Force MAX200",
            title: "устройство захвата, модель The Force MAX200",
            sprite: "grabbers",
            frame: 0,
            radius: 100,
            volume:10,
            mass:40,
            typeName: PickableObjectTypes.equipment,
            type: Equipment.Types.grabber

        },

};

Equipment.Radars = {
    Radar1:
        {
            name: "Космос-12",
            title: "Радар производства завода Красный Пеленг, РСССР 2045",
            sprite: "radars",
            frame: 0,
            radius: 12000,
            volume:10,
            mass:40,
            typeName: PickableObjectTypes.equipment,
            type: Equipment.Types.radar

        },

};