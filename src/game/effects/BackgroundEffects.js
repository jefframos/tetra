import * as PIXI from 'pixi.js';
import config  from '../../config';
import TweenLite from 'gsap';

export default class BackgroundEffects extends PIXI.Container{
	constructor(){

		super();
		this.background =  new PIXI.Graphics().beginFill(0).drawRect(0,0,config.width,config.height);
		this.addChild(this.background);

		this.bgImage  = new PIXI.Sprite(PIXI.Texture.fromImage('./assets/images/game_bg.png'));
		this.bgImage.anchor.x = 0.5
		this.bgImage.x = config.width / 2;
		this.bgImage.y = config.height - this.bgImage.height;
		// this.addChild(this.bgImage);

		this.bgImageTop  = new PIXI.Sprite(PIXI.Texture.fromImage('./assets/images/game_bg.png'));
		this.bgImageTop.anchor.x = 0.5
		this.bgImageTop.x = config.width / 2;
		this.bgImageTop.y = this.bgImageTop.height;
		this.bgImageTop.scale.y = -1;
		// this.addChild(this.bgImageTop);

		this.particles = [];
	}
}