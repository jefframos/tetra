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
        	{label:"TOP_LEFT", pos:{x:0,y:0}},
        	{label:"TOP_CENTER", pos:{x:1,y:0}},
        	{label:"TOP_RIGHT", pos:{x:2,y:0}},
        	{label:"CENTER_RIGHT", pos:{x:2,y:1}},
        	{label:"BOTTOM_RIGHT", pos:{x:2,y:2}},
        	{label:"BOTTOM_CENTER", pos:{x:1,y:2}},
        	{label:"BOTTOM_LEFT", pos:{x:0,y:2}},
        	{label:"CENTER_LEFT", pos:{x:0,y:1}}
        ]

        window.GRID = {
        	i:6,
        	j:7,
        	width: config.width * 0.7,
        	height: config.height * 0.7,
        }

        window.CARD = {
        	width: GRID.width / GRID.i,
        	height: GRID.height / GRID.j
        }

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

        this.gameContainer.addChild(this.gridContainer);
        this.gameContainer.addChild(this.cardsContainer);

        // this.currentCard = this.createCard();
        // this.cardsContainer.addChild(this.currentCard)
        // utils.centerObject(this.currentCard, this.background)

		for (var i = ACTION_ZONES.length - 1; i >= 0; i--) {
			this.getOpposit(ACTION_ZONES[i].label)
		}

		this.grid.createGrid();
		this.gridContainer.addChild(this.grid);
		utils.centerObject(this.gridContainer, this.background);

		this.cardsContainer.x = this.gridContainer.x;
		this.cardsContainer.y = this.gridContainer.y;

		this.trailMarker = new PIXI.Graphics().beginFill(0xFFFFFF).drawRoundedRect(0,0,CARD.width, GRID.height, 0);
		this.gridContainer.addChild(this.trailMarker);
		this.trailMarker.alpha = 0;

		this.cardsContainer.addChild(this.placeCard(0, 0));
		this.cardsContainer.addChild(this.placeCard(2, 0));

		this.board.debugBoard();

		this.addEvents();


	}

	destroy(){

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
	getOpposit(zone){
		// let id = ACTION_ZONES[zone] + 4 % 8;
		// console.log(ACTION_ZONES[zone]);
		// console.log(id);
		let id = 0;
		for (var i = ACTION_ZONES.length - 1; i >= 0; i--) {
			if(ACTION_ZONES[i].label == zone){
				id = i;
				break;
			}
		}

		// let id = ACTION_ZONES.filter(function( obj ) {
	 //  		return obj == zone;
		// });
		//console.log(zone, ACTION_ZONES[(id + ACTION_ZONES.length/2)%ACTION_ZONES.length].label);
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
			this.trailMarker.x = this.mousePosID * CARD.width;
			this.trailMarker.alpha = 0.15;
		}
	}

	transitionOut(nextScreen){
		super.transitionOut(nextScreen);
	}
	transitionIn(){

		super.transitionIn();

	}
	
	onTapDown(){
		if(!this.board.isPossibleShot(this.mousePosID)){
			return;
		}
		let card = new Card(this);
		card.createCard();
		this.board.shootCard(this.mousePosID, card);
		card.x = card.pos.i * CARD.width;
		card.y = card.pos.j * CARD.height;
		card.type = 1;
		card.updateCard();
		this.cardsContainer.addChild(card);
		console.log(this.mousePosID);
	}

	removeEvents(){
		
	}
	addEvents(){
		this.gameContainer.interactive = true;
		this.gameContainer.on('mousedown', this.onTapDown.bind(this)).on('touchstart', this.onTapDown.bind(this));
	}
}