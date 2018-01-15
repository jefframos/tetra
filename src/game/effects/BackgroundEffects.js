import * as PIXI from 'pixi.js';
import config  from '../../config';
import TweenLite from 'gsap';

export default class BackgroundEffects extends PIXI.Container{
	constructor(){

		super();
		this.background =  new PIXI.Graphics().beginFill(0).drawRect(0,0,config.width,config.height);
		this.addChild(this.background);
		this.particles = [];
	}
}