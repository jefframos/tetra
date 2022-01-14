import * as PIXI from 'pixi.js';
import TweenLite from 'gsap';
import config  from '../../config';
import utils  from '../../utils';
import Screen from '../../screenManager/Screen'
import Grid from '../elements/Grid'
import Card from '../elements/Card'
import Block from '../elements/Block'
import LevelSelectContainer from './LevelSelectContainer'
import Board from '../core/Board'
import BackgroundEffects from '../effects/BackgroundEffects'
import { debug } from 'webpack';

export default class StartScreenContainer extends PIXI.Container{
	constructor(screen){
		super();

		this.gameScreen = screen;
		this.currentButtonLabel = 'SPADERS';

		this.levelSelectionContainer = new PIXI.Container();
		this.screenContainer = new PIXI.Container();
		this.stripsContainer = new PIXI.Container();
		this.chooseLevelPanel = new LevelSelectContainer(this.gameScreen);
		this.changeLabelTimer = 0;

		this.levelSelectionContainer.addChild(this.chooseLevelPanel);

		this.chooseLevelPanel.x = 0;
		this.chooseLevelPanel.y = 150;
		this.resetLabelBack = new PIXI.Text(window.shuffleText(this.currentButtonLabel, true), { font: '90px', fill: 0xFFFFFF, align: 'center', fontWeight: '800', fontFamily:'round_popregular' });
		this.resetLabel = new PIXI.Text(this.resetLabelBack.text, { font: '90px', fill: 0x000000, align: 'center', fontWeight: '800', fontFamily:'round_popregular'  });

		this.addChild(this.screenContainer);
		this.addChild(this.levelSelectionContainer);
		this.screenContainer.addChild(this.resetLabelBack);
		this.screenContainer.addChild(this.stripsContainer);
		this.screenContainer.addChild(this.resetLabel);
		let height = 50;
		let line1 = new PIXI.Graphics().beginFill(window.config.colors.blue2).drawRect(0,0,2000,height);
		this.stripsContainer.addChild(line1);

		let line2 = new PIXI.Graphics().beginFill(window.config.colors.red).drawRect(0,0,2000,height);
		this.stripsContainer.addChild(line2);
		line2.y = height;

		let line3 = new PIXI.Graphics().beginFill(window.config.colors.yellow).drawRect(0,0,2000,height);
		this.stripsContainer.addChild(line3);
		line3.y = height * 2;

		this.playLine = new PIXI.Graphics().beginFill(window.config.colors.green).drawRect(0,0,2000,height * 3);
		this.stripsContainer.addChild(this.playLine);
		this.playLine.y = height * 3;

		let center = new PIXI.Graphics().beginFill(0xff0000).drawCircle(0,0,10)
		//this.addChild(center);
		this.stripsContainer.pivot.x = this.stripsContainer.width / 2;
		this.stripsContainer.pivot.y = this.stripsContainer.height / 2;

		this.resetLabelBack.pivot.x = this.resetLabelBack.width / 2;
		this.resetLabelBack.pivot.y = this.resetLabelBack.height / 2;

		this.resetLabel.pivot.x = this.resetLabel.width / 2;
		this.resetLabel.pivot.y = this.resetLabel.height / 2;

		this.playLine.buttonMode = true;
		this.playLine.interactive = true;

		this.stripsContainer.rotation = Math.PI * -0.25

		this.getMask();
		this.screenContainer.addChild(this.currentMask);
		this.resetLabel.mask = this.currentMask;

		this.resetLabel.rotation = -Math.PI * 0.25

		this.resetLabel.x = - 80
		this.resetLabel.y = - 240

		this.playLabel = new PIXI.Text("PLAY", { font: '60px', fill: 0x000000, align: 'center', fontWeight: '800', fontFamily:'round_popregular'  });
		this.screenContainer.addChild(this.playLabel);
		this.playLabel.rotation = Math.PI * -0.25;
		this.playLabel.x = -config.width / 2 + 80
		this.playLabel.y = config.height / 2 - 170


		this.playLine.on('mousedown', this.resetGame.bind(this)).on('touchstart', this.resetGame.bind(this));



		this.backButton = new PIXI.Graphics().beginFill(window.config.colors.red).drawCircle(0,0,40);
		this.levelSelectionContainer.addChild(this.backButton);

		
		this.backButton.x =  config.width -80
		this.backButton.y = 70
		this.backButton.buttonMode = true;
		this.backButton.interactive = true;

		this.backButton.on('mousedown', this.startState.bind(this)).on('touchstart', this.startState.bind(this));


		this.playButton = new PIXI.Graphics().beginFill(window.config.colors.blue).drawCircle(0,0,50);
		//this.levelSelectionContainer.addChild(this.playButton);

		
		this.playButton.x =  config.width -80
		this.playButton.y = this.backButton.y
		this.playButton.buttonMode = true;
		this.playButton.interactive = true;

		this.playButton.on('mousedown', this.goToLevel.bind(this)).on('touchstart', this.goToLevel.bind(this));

		this.levelSelectionContainer.x = config.width;
		this.levelSelectionContainer.y = -this.y;
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
		this.resetLabelBack.rotation = this.resetLabel.rotation;
		this.resetLabelBack.position = this.resetLabel.position;


		// this.stripsContainer.rotation += delta * 0.1
		// this.currentMask.rotation = this.stripsContainer.rotation;
		//this.resetLabel.mask = this.currentMask;

	}
	startMenuState(delay = 0){
		TweenLite.killTweensOf(this.screenContainer)
		TweenLite.killTweensOf(this.levelSelectionContainer)
		
		TweenLite.to(this.screenContainer, 0.75, {delay:delay, alpha: 1,y: -config.height / 2 - 130, x:80,rotation: Math.PI * 0.25, ease: Back.easeOut.config(1.2) })
		TweenLite.to(this.levelSelectionContainer, 1, {delay:delay, alpha: 1, x:-this.x, ease: Back.easeOut.config(1.2) })
		this.playLine.interactive = false;
		this.backButton.interactive = true;

		this.chooseLevelPanel.visible = true;
		this.levelSelectionContainer.y = -this.y;
	}
	startState(delay = 1, force = false){
		TweenLite.killTweensOf(this.screenContainer)
		TweenLite.killTweensOf(this.levelSelectionContainer)
		this.playLine.interactive = true;
		this.backButton.interactive = false;
		
		TweenLite.to(this.screenContainer,force?0: 0.75, {delay:delay, alpha: 1,y: 0, x:0,rotation:0, ease: Cubic.easeOut })
		TweenLite.to(this.levelSelectionContainer, force?0:0.5, {delay:delay, alpha: 1, x:config.width,rotation:0, ease: Cubic.easeOut })

		this.levelSelectionContainer.y = -this.y;
	}
	updateStartLabel() {
		if (Math.random() < 0.2) return;
		this.resetLabel.text = window.shuffleText(this.currentButtonLabel, true);
		//this.resetLabel.style.fill = ENEMIES.list[Math.floor(ENEMIES.list.length * Math.random())].color;
		
		this.changeLabelTimer = 0.5;
	}
	show(force = false, delay = 0){
		TweenLite.killTweensOf(this.screenContainer)

		this.startState(delay, force);

		this.playLine.interactive = true;
		this.playButton.interactive = true;
		this.backButton.interactive = true;

		this.playLine.visible = true;
		this.playButton.visible = true;
		this.backButton.visible = true;
	}
	showFromGame(force = false, delay = 0){
		TweenLite.killTweensOf(this.screenContainer)

		this.startMenuState(delay, force);

		this.playLine.interactive = true;
		this.playButton.interactive = true;
		this.backButton.interactive = true;

		this.playLine.visible = true;
		this.playButton.visible = true;
		this.backButton.visible = true;

	}
	hide(force = false){
		TweenLite.killTweensOf(this.screenContainer)
		this.playLine.interactive = false;
		this.playButton.interactive = false;
		this.backButton.interactive = false;

		this.playLine.visible = false;
		this.playButton.visible = false;
		this.backButton.visible = false;

		this.chooseLevelPanel.visible = false;

		TweenLite.to(this.screenContainer, force?0:0.2, { alpha: 0 })


	}
	goToLevel(){
		this.hide(true);
		this.gameScreen.resetGame()
	}
	resetGame(){
		this.startMenuState();
		//this.gameScreen.resetGame()
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