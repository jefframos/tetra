import * as PIXI from 'pixi.js';
import TweenLite from 'gsap';
import config  from '../../config';
import utils  from '../../utils';
import Screen from '../../screenManager/Screen'
import Grid from '../elements/Grid'
import Card from '../elements/Card'
import Block from '../elements/Block'
import Board from '../core/Board'
import BackgroundEffects from '../effects/BackgroundEffects'
import { debug } from 'webpack';

export default class StartScreenContainer extends PIXI.Container{
	constructor(screen){
		super();

		this.gameScreen = screen;
		this.currentButtonLabel = 'START';

		this.screenContainer = new PIXI.Container();
		this.stripsContainer = new PIXI.Container();
		this.changeLabelTimer = 0;

		this.resetLabelBack = new PIXI.Text(window.shuffleText(this.currentButtonLabel, true), { font: '110px', fill: 0xFFFFFF, align: 'center', fontWeight: '800' });
		this.resetLabel = new PIXI.Text(this.resetLabelBack.text, { font: '110px', fill: 0x000000, align: 'center', fontWeight: '800' });

		this.addChild(this.screenContainer);
		this.screenContainer.addChild(this.resetLabelBack);
		this.screenContainer.addChild(this.stripsContainer);
		this.screenContainer.addChild(this.resetLabel);
		let height = 50;
		let line1 = new PIXI.Graphics().beginFill(window.config.colors.blue2).drawRect(0,0,1000,height);
		this.stripsContainer.addChild(line1);

		let line2 = new PIXI.Graphics().beginFill(window.config.colors.red).drawRect(0,0,1000,height);
		this.stripsContainer.addChild(line2);
		line2.y = height;

		let line3 = new PIXI.Graphics().beginFill(window.config.colors.yellow).drawRect(0,0,1000,height);
		this.stripsContainer.addChild(line3);
		line3.y = height * 2;

		let line4 = new PIXI.Graphics().beginFill(window.config.colors.green).drawRect(0,0,1000,height);
		this.stripsContainer.addChild(line4);
		line4.y = height * 3;

		let center = new PIXI.Graphics().beginFill(0xff0000).drawCircle(0,0,10)
		//this.addChild(center);
		this.stripsContainer.pivot.x = this.stripsContainer.width / 2;
		this.stripsContainer.pivot.y = this.stripsContainer.height / 2;
		this.stripsContainer.rotation = Math.PI*0.5;

		this.resetLabelBack.pivot.x = this.resetLabelBack.width / 2;
		this.resetLabelBack.pivot.y = this.resetLabelBack.height / 2;

		this.resetLabel.pivot.x = this.resetLabel.width / 2;
		this.resetLabel.pivot.y = this.resetLabel.height / 2;

		this.interactive = true;
		this.buttonMode = true;


		this.stripsContainer.rotation = Math.PI * 0.25

		this.getMask();
		this.screenContainer.addChild(this.currentMask);
		this.resetLabel.mask = this.currentMask;

		this.on('mousedown', this.resetGame.bind(this)).on('touchstart', this.resetGame.bind(this));


	}
	getRect(size = 4, color = 0xFFFFFF){
		return new PIXI.Graphics().beginFill(color).drawRect(0,0,size,size);
	}

	getMask(){
		this.currentMask  = new PIXI.Graphics().beginFill(0xFF0000).drawRect(0,0,this.stripsContainer.width,this.stripsContainer.height);
		this.currentMask .rotation = this.stripsContainer.rotation;
		this.currentMask .pivot.x = this.stripsContainer.pivot.x
		this.currentMask .pivot.y = this.stripsContainer.pivot.y
		this.currentMask .x = this.x
		this.currentMask .y = this.y
		return this.currentMask 
	}
	
	update(delta){
		this.currentMask.rotation = this.stripsContainer.rotation;

		if (this.changeLabelTimer <= 0) {
			this.updateStartLabel();

		} else {
			this.changeLabelTimer -= delta;
		}

		this.resetLabelBack.text = this.resetLabel.text;

		// this.stripsContainer.rotation += delta * 0.1
		// this.currentMask.rotation = this.stripsContainer.rotation;
		//this.resetLabel.mask = this.currentMask;

		
	}
	updateStartLabel() {
		if (Math.random() < 0.2) return;
		this.resetLabel.text = window.shuffleText(this.currentButtonLabel, true);
		//this.resetLabel.style.fill = ENEMIES.list[Math.floor(ENEMIES.list.length * Math.random())].color;
		
		this.changeLabelTimer = 0.5;
	}
	show(force = false, delay = 0){
		TweenLite.to(this.screenContainer, 0.5, {delay:delay, alpha: 1, ease: Cubic.easeOut })
		this.interactive = true;
	}
	hide(force = false){
		this.interactive = false;
		TweenLite.to(this.screenContainer, force?0:0.5, { alpha: 0 })
	}
	resetGame(){
		this.gameScreen.resetGame()
	}
	removeEvents(){
		//this.interactive = false;

	}
	addEvents(){
		this.removeEvents();
		//this.interactive = true;

		//this.startButton.on('mouseup', this.resetGame.bind(this)).on('touchend', this.resetGame.bind(this));


	}

	
}