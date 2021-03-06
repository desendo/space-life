/**
 * Created by goblino on 14.10.2017.
 */

var defaultLang = 'en';
var lang = defaultLang;
T = {};

T.ru= {
    langid: 'ru',
    langname: 'Russian',
    langtitle: 'Русский',

    gamename: "Косможизнь",
    newgame: "Новая игра",
    continuegame: "Продолжить",

    date:"Дата",
    money:"Деньги",
    speed: "Скорость",
    fuel: "Топливо",

    mass:"Масса",
    acceleation:"Ускорение",
    level:"уровень",
    lvl:"ур.",
    cargobay:"Грузовой отсек",
    thrust:"тяга",
    autocompensation:"автоком.",
    freeflight:"свободный полет",

    inatmosphereofplanet: "в атмосфере планеты",
    inagravityofplanet: "В гравитационном поле планеты",
    onsurfaceofplanet: "На поверхности планеты",

    planetInfoButton: "Инфо",
    planetTradeButton: "Торговля",
    landZoneButton: "Место посадки",
    shipYardButton: "Ангар",

};
T.en= {
    langid: 'en',
    langname: 'English',
    langtitle: 'English',

    gamename: "Space life",
    newgame: "New game",
    continuegame: "Continue",

    date:"Date",
    fuel: "Fuel",
    money:"Money",
    speed: "Speed",

    mass:"Mass",
    acceleation:"Acceleration",
    level: "level",
    lvl: "lvl",
    cargobay: "Cargo bay",
    thrust: "thrust",
    autocompensation:"autocomp.",
    freeflight:"free flight",
    inatmosphereofplanet: "In the atmosphere of planet",
    inagravityofplanet: "In the gravity of planet",
    onsurfaceofplanet: "On the surface of planet",

    planetInfoButton: "Info",
    planetTradeButton: "Trade",
    landZoneButton: "Land zone",
    shipYardButton: "Hangar",



};
var GLOBAL = GLOBAL || {};
GLOBAL.IS_DEBUG = false;
GLOBAL.SPEED = 55;

var assets = 'assets/';
var colorDarkGrey =  "#120009";
var colorGrey =  "#3C3B40";
var colorMiddle = "#9D9CA6";
var colorLight = "#EDECF5";
var colorFlue = "#0F41A6";
var colorMetal = "#5283A3";


var font = { font: "12px Roboto mono" ,fill: "#ddd", align: "center",boundsAlignH: "center", boundsAlignV: "middle"};
var tooltip = { font: "12px Roboto mono" ,fill: colorLight, align: "left",boundsAlignH: "left", boundsAlignV: "top",  wordWrap: true, wordWrapWidth: 250};
var menu = { font: "25px sans-serif" ,fill: '#DDDDDD', align: "center"};
var speechFont = { font: "16px Tahoma" ,fill: "#ff1807", align: "center",boundsAlignH: "center", boundsAlignV: "middle"  };
var fontLeft = { font: "12px Tahoma" ,fill: "#ddd", align: "left",boundsAlignH: "center", boundsAlignV: "middle"  };
var fontLeft2 = { font: "22px Tahoma" ,fill: "#ddd", align: "left",boundsAlignH: "center", boundsAlignV: "middle"  };
var fontMenu1 = { font: "80px Tahoma" ,fill: "#ffffff", align: "center",boundsAlignH: "center", boundsAlignV: "middle"  };
var fontMenu1_gover = { font: "50px Tahoma" ,fill: "#ff0d00", align: "center",boundsAlignH: "center", boundsAlignV: "middle"  };
var fontMenu2 = { font: "30px Tahoma" ,fill: "#ffffff", align: "center",boundsAlignH: "center", boundsAlignV: "middle"  };
var fontInverted = { font: "12px Tahoma" ,fill: "#000000", align: "center",boundsAlignH: "center", boundsAlignV: "middle", backgroundColor: "#FFFFFF" };
var buttonsFont = { font: "16px Tahoma" ,fill: "#171717", align: "center", backgroundColor: "#a1a1a1" , boundsAlignH: "center", boundsAlignV: "middle" };
var buttonsFontEnabled = { font: "16px Tahoma" ,fill: "#171717", align: "center", backgroundColor: "#07a100", boundsAlignH: "center", boundsAlignV: "middle"  };
var buttonsFontEnabledMap = { font: "12px Tahoma" ,fill: "#ffffff", align: "center", backgroundColor: "#5e5e5e",boundsAlignH: "center", boundsAlignV: "middle"  };

var interfaceColor1 = "0x"+"#abf7ff".slice(1, 7);
var interfaceColor2 = "0x"+"#2d2d2d".slice(1, 7);
var interfaceColor3 = "0x"+"#c8ccc2".slice(1, 7);
var interfaceColor4 = "0x"+"#1d1d29".slice(1, 7);
var interfaceColor5 = "0x"+"#c7c2ff".slice(1, 7);

var mapColorPlanet = "0x"+"#5754fe".slice(1, 7);
var mapColorPlayer = "0x"+"#fffd04".slice(1, 7);
var mapColorAsteroidField = "0x"+"#868a84".slice(1, 7);
var mapColor4= "0x"+"#277b1f".slice(1, 7);
var mapColorDanger= "0x"+"#e40001".slice(1, 7)

var customFill,customBack;



var colorGrey =  "#3C3B40";
var colorMiddle = "#9D9CA6";
var colorLight = "#EDECF5";
var colorFlue = "#0F41A6";
var colorMetal = "#5283A3";


