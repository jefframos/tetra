import * as PIXI from 'pixi.js';
import TweenLite from 'gsap';
import config  from '../../config';
import utils  from '../../utils';
import Screen from '../../screenManager/Screen'
import Grid from '../elements/Grid'
import Card from '../elements/Card'
import Board from '../core/Board'

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
        	i:6,
        	j:7,
        	width: config.width * 0.7,
        	height: config.height * 0.7,
        }

        window.CARD = {
        	width: GRID.width / GRID.i,
        	height: GRID.width / GRID.i,//GRID.height / GRID.j
        }

        window.GRID.height = window.GRID.j * CARD.height;

        this.grid = new Grid(this);
        this.board = new Board();
	}
	
	build(){
		super.build();
		this.background = new PIXI.Graphics().beginFill(0x333333).drawRect(0,0,config.width,config.height);
        this.addChild(this.background)

        this.gameContainer = new PIXI.Container();
        this.gridContainer = new PIXI.Container();
        this.cardsContainer = new PIXI.Container();

        this.addChild(this.gameContainer);

        this.gameContainer.addChild(this.background);
        this.gameContainer.addChild(this.gridContainer);
        this.gameContainer.addChild(this.cardsContainer);

        // this.currentCard = this.createCard();
        // this.cardsContainer.addChild(this.currentCard)
        // utils.centerObject(this.currentCard, this.background)

	

		this.grid.createGrid();
		this.gridContainer.addChild(this.grid);
		utils.centerObject(this.gridContainer, this.background);

		this.cardsContainer.x = this.gridContainer.x;
		this.cardsContainer.y = this.gridContainer.y;

		this.trailMarker = new PIXI.Graphics().beginFill(0xFFFFFF).drawRoundedRect(0,0,CARD.width, GRID.height, 0);
		this.gridContainer.addChild(this.trailMarker);
		this.trailMarker.alpha = 0;

		let tempPosRandom = []
		for (var i = 0; i <GRID.i; i++) {
			tempPosRandom.push(i);
		}
		utils.shuffle(tempPosRandom);
		this.cardsContainer.addChild(this.placeCard(tempPosRandom[0], 0));
		this.cardsContainer.addChild(this.placeCard(tempPosRandom[1], 0));

		this.board.debugBoard();

		this.addEvents();

		this.newRound();

	}

	newRound(){
		this.currentCard =  new Card(this);
		this.currentCard.createCard();
		this.currentCard.type = 1;
		this.currentCard.y = this.gridContainer.height + 20;
		this.currentCard.updateCard();
		this.cardsContainer.addChild(this.currentCard);
	}

	placeCard(i, j){
		let card = new Card(this);
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
		this.mousePosition = renderer.plugins.interaction.mouse.global;
		this.updateMousePosition();
		//console.log(this.mousePosition);
	}

	updateMousePosition(){
		this.mousePosID = Math.floor((this.mousePosition.x - this.gridContainer.x) / CARD.width);
		this.trailMarker.alpha = 0;
		if(this.mousePosID >= 0 && this.mousePosID < GRID.i){
			TweenLite.to(this.trailMarker, 0.3, {x:this.mousePosID * CARD.width});
			this.currentCard.move({x:this.mousePosID * CARD.width, y:this.currentCard.y}, 0.3);
			this.trailMarker.alpha = 0.15;
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
	
	onTapDown(){
		if(!this.board.isPossibleShot(this.mousePosID)){
			return;
		}
		this.board.shootCard(this.mousePosID, this.currentCard);
		let normalDist = (this.currentCard.y - this.currentCard.pos.j * CARD.height) / GRID.height;
		this.currentCard.move({
			x: this.currentCard.pos.i * CARD.width,
			y: this.currentCard.pos.j * CARD.height
		}, 0.3 * normalDist);
		
		// console.log((this.currentCard.y - this.currentCard.pos.j * CARD.height) / GRID.height);
		// console.log(this.mousePosID);

		this.newRound();
	}

	removeEvents(){
		
	}
	addEvents(){
		this.gameContainer.interactive = true;
		this.gameContainer.on('mousedown', this.onTapDown.bind(this)).on('touchstart', this.onTapDown.bind(this));
	}
}