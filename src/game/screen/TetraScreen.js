import * as PIXI from 'pixi.js';
import TweenLite from 'gsap';
import config  from '../../config';
import utils  from '../../utils';
import Screen from '../../screenManager/Screen'
import Grid from '../elements/Grid'
import Card from '../elements/Card'
import Board from '../core/Board'
import BackgroundEffects from '../effects/BackgroundEffects'

export default class TetraScreen extends Screen{
	constructor(label){
		super(label);

        window.ACTION_ZONES = [
        	{label:"TOP_LEFT", pos:{x:0,y:0}, dir:{x:-1, y:-1}},
        	{label:"TOP_CENTER", pos:{x:1,y:0}, dir:{x:0, y:-1}},
        	{label:"TOP_RIGHT", pos:{x:2,y:0}, dir:{x:1, y:-1}},
        	{label:"CENTER_RIGHT", pos:{x:2,y:1}, dir:{x:1, y:0}},
        	{label:"BOTTOM_RIGHT", pos:{x:2,y:2}, dir:{x:1, y:1}},
        	{label:"BOTTOM_CENTER", pos:{x:1,y:2}, dir:{x:0, y:1}},
        	{label:"BOTTOM_LEFT", pos:{x:0,y:2}, dir:{x:-1, y:1}},
        	{label:"CENTER_LEFT", pos:{x:0,y:1}, dir:{x:-1, y:0}}
        ]

        window.GRID = {
        	i:5,
        	j:10,
        	height: config.height * 0.7,
        	width: config.width * 0.7,
        }

        window.CARD = {
        	width: GRID.height / GRID.j,
        	height: GRID.height / GRID.j,//GRID.height / GRID.j
        }

        window.ENEMIES = {
        	list:[
        		{color:0x61C6CE,life:0},
        		{color:0xD81639,life:1},
        		{color:0xE2C756,life:2},
        		{color:0x7BCA93,life:3},
        		{color:0x1376B9,life:4},
        		{color:0xDD6290,life:5},
        	]
        }

        window.GRID.width = window.GRID.i * CARD.width;
        window.GRID.height = window.GRID.j * CARD.height;

        this.grid = new Grid(this);
        this.board = new Board();
	}
	
	build(){
		super.build();
		this.background = new BackgroundEffects();
        this.addChild(this.background)

        this.gameContainer = new PIXI.Container();
        this.gridContainer = new PIXI.Container();
        this.cardsContainer = new PIXI.Container();

        this.addChild(this.gameContainer);

        this.gameContainer.addChild(this.background);
        this.gameContainer.addChild(this.gridContainer);
        this.gameContainer.addChild(this.cardsContainer);

        this.mousePosID = 0;
        // this.currentCard = this.createCard();
        // this.cardsContainer.addChild(this.currentCard)
        // utils.centerObject(this.currentCard, this.background)

	

		this.grid.createGrid();
		this.gridContainer.addChild(this.grid);
		utils.centerObject(this.gridContainer, this.background.background);

		this.cardsContainer.x = this.gridContainer.x;
		this.cardsContainer.y = this.gridContainer.y;

		this.trailMarker = new PIXI.Graphics().beginFill(0xFFFFFF).drawRoundedRect(0,0,CARD.width, GRID.height, 0);
		this.gridContainer.addChild(this.trailMarker);

		this.initGridY = this.gridContainer.y;
		this.initGridAcc = 0;

		this.trailMarker.alpha = 0;

		let tempPosRandom = []
		for (var i = 0; i <GRID.i; i++) {
			tempPosRandom.push(i);
		}
		utils.shuffle(tempPosRandom);
		for (var i = 0; i < GRID.i; i++) {		
			this.cardsContainer.addChild(this.placeCard(i, 0, 5));
		}
		for (var i = 0; i < GRID.i; i++) {		
			this.cardsContainer.addChild(this.placeCard(i, 1, 4));
		}
		for (var i = 0; i < GRID.i; i++) {		
			this.cardsContainer.addChild(this.placeCard(i, 2, 3));
		}
		// this.cardsContainer.addChild(this.placeCard(tempPosRandom[1], 0));

		this.board.debugBoard();

		this.addEvents();

		this.newRound();

	}

	addRandomPiece(){
	}

	newRound(){
		this.currentCard =  new Card(this);
		this.currentCard.life = Math.random() < 0.75 ? 0 : 1;
		this.currentCard.createCard();
		this.currentCard.type = 0;
		this.currentCard.x = CARD.width * this.mousePosID;
		this.currentCard.y = this.gridContainer.height + 100;
		// this.currentCard.y = this.gridContainer.height + 20;
		TweenLite.to(this.currentCard, 0.3, {y:this.gridContainer.height + 30, ease:Elastic.easeOut})
		this.currentCard.updateCard();
		this.cardsContainer.addChild(this.currentCard);
	}

	placeCard(i, j, level = 0){
		let card = new Card(this);
		card.life = level;
		card.createCard();
		card.x = i * CARD.width;
		card.y = j * CARD.height;
		card.pos.i = i;
		card.pos.j = j;
		card.updateCard();
		this.board.addCard(card);
		return card;
	}
	

	
	update(delta){
		if(renderer.plugins.interaction.mouse.global){
			this.mousePosition = renderer.plugins.interaction.mouse.global;
		}
		this.updateMousePosition();

		this.gridContainer.y = this.initGridY + Math.sin(this.initGridAcc) * 5;
		this.initGridAcc += 0.05
		
		//console.log(this.mousePosition);
	}

	updateMousePosition(){
		this.mousePosID = Math.floor((this.mousePosition.x - this.gridContainer.x) / CARD.width);
		// this.trailMarker.alpha = 0;
		if(this.mousePosID >= 0 && this.mousePosID < GRID.i){
			TweenLite.to(this.trailMarker, 0.1, {x:this.mousePosID * CARD.width});
			this.trailMarker.alpha = 0.15;
			if(this.currentCard){
				this.currentCard.moveX(this.mousePosID * CARD.width, 0.1);
			}
		}
	}

	transitionOut(nextScreen){
		super.transitionOut(nextScreen);
	}
	transitionIn(){

		super.transitionIn();
	}
	destroy(){

	}
	
	onTapUp(){
		if(!this.currentCard){
			return;
		}
		if(renderer.plugins.interaction.activeInteractionData[0]){
			this.mousePosition = renderer.plugins.interaction.activeInteractionData[0].global
		}
		else{
			this.mousePosition = renderer.plugins.interaction.mouse.global
		}
		this.updateMousePosition();
		//console.log(renderer.plugins.interaction.activeInteractionData[0].global);
		if(!this.board.isPossibleShot(this.mousePosID)){
			return;
		}

		this.board.shootCard(this.mousePosID, this.currentCard);
		let normalDist = (this.currentCard.y - this.currentCard.pos.j * CARD.height) / GRID.height;
		this.currentCard.move({
			x: this.currentCard.pos.i * CARD.width,
			y: this.currentCard.pos.j * CARD.height
		}, 0.1 * normalDist);
		
		this.currentCard = null;

		console.log(0.1 * normalDist * 100);
		setTimeout(function() {
			this.newRound();			
		}.bind(this), 0.1 * normalDist * 100 + 200);
	}

	onTapDown(){
		if(renderer.plugins.interaction.activeInteractionData[0]){
			this.mousePosition = renderer.plugins.interaction.activeInteractionData[0].global
		}
		else{
			this.mousePosition = renderer.plugins.interaction.mouse.global
		}
		this.updateMousePosition();
	}

	removeEvents(){
		
	}
	addEvents(){
		this.gameContainer.interactive = true;
		this.gameContainer.on('mousedown', this.onTapDown.bind(this)).on('touchstart', this.onTapDown.bind(this));
		this.gameContainer.on('mouseup', this.onTapUp.bind(this)).on('touchend', this.onTapUp.bind(this));

	}
}