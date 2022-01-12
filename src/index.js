import plugins from './plugins';
import config  from './config';
import Game from './Game';
import GameData from './game/GameData';
import CookieManager from './game/CookieManager';
import GlobalGameView from './game/GlobalGameView';
import ScreenManager from './screenManager/ScreenManager';
import GameScreen from './game/screen/GameScreen';
import LoadScreen from './game/screen/LoadScreen';
import StartScreen from './game/screen/StartScreen';
import ChooseTeamScreen from './game/screen/ChooseTeamScreen';
import ChooseFieldScreen from './game/screen/ChooseFieldScreen';
import GameOverScreen from './game/screen/GameOverScreen';
import TetraScreen from './game/screen/TetraScreen';
import EffectLayer from './game/effects/EffectLayer';
import ChooseMatchScreen from './game/screen/ChooseMatchScreen';
import Pool from './game/core/Pool';
// window.GRAPHICS_DATA = {
// 	roundedCorner:15
// }
// window.COLORS_CONST = {
//             red400:0xEF5350,
//             red500:0xF44336,
//             red600:0xE53935,
//             red800:0xC62828,
//             red900:0xB71C1C,

//             blue400:0x42A5F5,
//             blue500:0x2196F3,
//             blue600:0x1E88E5,
//             blue900:0x0D47A1,

//             grey50:0xFAFAFA,
//             grey100:0xF5F5F5,
//             grey500:0x9E9E9E,
//             grey600:0x757575,
//             grey400:0xBDBDBD,
//             grey900:0x212121,

//             yellow600:0xFDD835,

//             amber600:0xFFB300,

//             pink900:0x880E4F,

//             green500:0x4CAF50,
//             green600:0x43A047,
//             green700:0x388E3C,
//             green800:0x2E7D32,
//             green900:0x1B5E20,

//             light_green500:0x8BC34A,
//             light_green600:0x7CB342,
//             light_green700:0x689F38,
//             light_green800:0x558B2F,
//             light_green900:0x33691E,
//         }



// window.COOKIE_MANAGER = new CookieManager();
// window.GAME_DATA = new GameData();


window.config = config;
window.POOL = new Pool();

window.console.warn= function(){}
window.console.groupCollapsed = function(teste){return teste}//('hided warnings')


window.shuffleText = function shuffleText(label, keepfirstandlast = false){
	let rnd1 = String.fromCharCode(Math.floor(Math.random()*20) + 65);
	let rnd2 = Math.floor(Math.random()* 9);
	let rnd3 = String.fromCharCode(Math.floor(Math.random()*20) + 65);
	let tempLabel = label.split('');
	let rndPause = Math.random();

	let rand = keepfirstandlast ? tempLabel.length - 2 : tempLabel.length;

	if(rndPause < 0.2){
		let pos1 = Math.floor(Math.random()*rand) + (keepfirstandlast ? 1 : 0);
		let pos2 = Math.floor(Math.random()*rand) + (keepfirstandlast ? 1 : 0);
		if(tempLabel[pos1] != '\n')
			tempLabel[pos1] = rnd2;
		if(tempLabel[pos2] != '\n')
			tempLabel[pos2] = rnd3;
	}else if(rndPause < 0.5){
		let pos3 = Math.floor(Math.random()*rand) + (keepfirstandlast ? 1 : 0);
		if(tempLabel[pos3] != '\n')
			tempLabel[pos3] = rnd3;
	}
	let returnLabel = '';
	for (var i = 0; i < tempLabel.length; i++) {
		returnLabel+=tempLabel[i];
	}
	return returnLabel
}

PIXI.loader
	.add('./assets/fonts/stylesheet.css')
	.add('./assets/images/tvlines.png')
	.add('./assets/images/game_bg.png')
	.add('./assets/images/enemy.png')
	.add('./assets/images/glitch1.jpg')
	.add('./assets/images/glitch2.jpg')
	.add('./assets/images/particle1.png')
	.add('./assets/images/screen_displacement.jpg')
	.add('./assets/images/block.jpg')
	// .add('./assets/images/map.jpg')
	.load(configGame);

function configGame(){

	window.game = new Game(config);

	
	//create screen manager
	let screenManager = new ScreenManager();
	//add screens
	let gameScreen = new TetraScreen('GameScreen');

	game.stage.addChild(screenManager);

	screenManager.addScreen(gameScreen);
	//change to init screen
	screenManager.forceChange('GameScreen');

	window.EFFECTS = new EffectLayer(screenManager);
	game.stage.addChild(EFFECTS);


	// screenManager.filters = [this.pixelate]

	game.start();



}
