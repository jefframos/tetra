import * as PIXI from 'pixi.js';
import TweenLite from 'gsap';
import config  from '../../config';
import utils  from '../../utils';
import Screen from '../../screenManager/Screen'

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
        	i:5,
        	j:7,
        	width: config.width * 0.7,
        	height: config.height * 0.7,
        }

        window.CARD = {
        	width: GRID.width / GRID.i,
        	height: GRID.height / GRID.j
        }
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

		this.createGrid();
		this.cardsContainer.x = this.gridContainer.x;
		this.cardsContainer.y = this.gridContainer.y;

		this.trailMarker = new PIXI.Graphics().beginFill(0xFFFFFF).drawRoundedRect(0,0,CARD.width, GRID.height, 0);
		this.gridContainer.addChild(this.trailMarker);
		this.trailMarker.alpha = 0;

		this.cardsContainer.addChild(this.placeCard(this.createCard(), 0, 0));
		// this.cardsContainer.addChild(this.placeCard(this.createCard(), 1, 0));
		// this.cardsContainer.addChild(this.placeCard(this.createCard(), 2, 0));
		// this.cardsContainer.addChild(this.placeCard(this.createCard(), 3, 0));
		// this.cardsContainer.addChild(this.placeCard(this.createCard(), 4, 0));
		// this.cardsContainer.addChild(this.placeCard(this.createCard(), 2, 1));
		// this.cardsContainer.addChild(this.placeCard(this.createCard(), 3, 1));
		// this.cardsContainer.addChild(this.placeCard(this.createCard(), 0, 1));
       // this.getOpposit("TOP_LEFT")

	}

	destroy(){

	}
	createGrid(){
		let gridContainer = new PIXI.Container();
		let gridBackground = new PIXI.Graphics().beginFill(0x555555).drawRect(0,0,GRID.width, GRID.height);
		gridContainer.addChild(gridBackground)

		for (var i = GRID.i; i >= 0; i--) {
			let line = new PIXI.Graphics().beginFill(0x999999).drawRect(0,0,1, GRID.height);
			line.x = i * CARD.width;
			gridContainer.addChild(line)
		}

		for (var j = GRID.j; j >= 0; j--) {
			let line = new PIXI.Graphics().beginFill(0x999999).drawRect(0,0,GRID.width, 1);
			line.y = j * CARD.height;
			gridContainer.addChild(line)
		}


		this.gridContainer.addChild(gridContainer);

		utils.centerObject(this.gridContainer, this.background);
	}
	createCard(){
		let card = new PIXI.Container();
		let cardBackground = new PIXI.Graphics().beginFill(0x777777).drawRoundedRect(0,0,CARD.width, CARD.height, 0);
		let cardBackground2 = new PIXI.Graphics().beginFill(0x888888).drawRoundedRect(8,8,CARD.width-16, CARD.height-16, 0);
		let cardContainer = new PIXI.Container();
		let cardActions = new PIXI.Container();
		card.addChild(cardContainer);
		cardContainer.addChild(cardBackground);
		cardContainer.addChild(cardBackground2);
		cardContainer.addChild(cardActions);

		let orderArray = [0,1,2,3,4,5,6,7]
		utils.shuffle(orderArray);
		console.log(orderArray);

		let totalSides = Math.floor(Math.random() * ACTION_ZONES.length*0.75) + 1;

		for (var i = totalSides - 1; i >= 0; i--) {

			let arrow = new PIXI.Graphics().beginFill(0xFFFFFF);
			arrow.moveTo(-5,0);
			arrow.lineTo(5,0);
			arrow.lineTo(0,-5);

			let zone = ACTION_ZONES[orderArray[i]];



			let tempX = (zone.pos.x / 2) * cardBackground.width;
			let tempY = (zone.pos.y / 2) * cardBackground.height;
			arrow.x = tempX;
			arrow.y = tempY;

			let centerPos = {x: cardBackground.width/2, y: cardBackground.height / 2};
			//console.log(ACTION_ZONES[orderArray[i]]);
			let angle = Math.atan2(tempY - centerPos.y, tempX - centerPos.x) + Math.PI / 2// * 180 / Math.PI;
			//angle = Math.floor(Math.PI / 4 / angle) * Math.PI / 4
			console.log(Math.round((angle * 180 / Math.PI) / 45) * 45);
			angle = (Math.round((angle * 180 / Math.PI) / 45) * 45) / 180 * Math.PI;
			arrow.rotation = angle;
			cardActions.addChild(arrow);

			arrow.x -= Math.sin(angle) * 7;
			arrow.y += Math.cos(angle) * 7;
		}
		return card;

	}
	placeCard(card, i, j){
		card.x = i * CARD.width;
		card.y = j * CARD.height;
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
		console.log(zone, ACTION_ZONES[(id + ACTION_ZONES.length/2)%ACTION_ZONES.length].label);
	}

	
	update(delta){
		this.mousePosition = renderer.plugins.interaction.mouse.global;
		this.updateMousePosition();
		//console.log(this.mousePosition);
	}

	updateMousePosition(){
		let mousePosID = Math.floor((this.mousePosition.x - this.gridContainer.x) / CARD.width);
		this.trailMarker.alpha = 0;
		if(mousePosID >= 0 && mousePosID <= GRID.i){
			this.trailMarker.x = mousePosID * CARD.width;
			this.trailMarker.alpha = 0.15;
		}
	}

	transitionOut(nextScreen){
		super.transitionOut(nextScreen);
	}
	transitionIn(){

		super.transitionIn();

	}
	
	removeEvents(){
		
	}
	addEvents(){
		
	}
}