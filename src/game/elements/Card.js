import * as PIXI from 'pixi.js';
import config  from '../../config';
import utils  from '../../utils';
export default class Card extends PIXI.Container{
	constructor(game){
		super();
		this.game = game;
		this.zones = [];
		this.pos = {i:-1, j:-1};
		this.type = 0;
	}
	start(){
	}
	createCard(){
		let card = new PIXI.Container();
		this.cardBackground = new PIXI.Graphics().beginFill(0xFFFFFF).drawRoundedRect(0,0,CARD.width, CARD.height, 0);
		this.cardBackground2 = new PIXI.Graphics().beginFill(0xFFFFFF).drawRoundedRect(8,8,CARD.width-16, CARD.height-16, 0);
		let cardContainer = new PIXI.Container();
		this.cardActions = new PIXI.Container();
		card.addChild(cardContainer);
		cardContainer.addChild(this.cardBackground);
		cardContainer.addChild(this.cardBackground2);
		cardContainer.addChild(this.cardActions);

		this.addActionZones();

		this.cardContainer = card;
		this.addChild(this.cardContainer);
		return this.cardContainer;
	}
	removeActionZones(){
		this.zones = [];
		while(this.cardActions.children.length > 0){
			this.cardActions.removeChildAt(0);
		}
	}
	updateCard(){
		if(this.type == 0){
			this.cardBackground.tint = 0x777777;
			this.cardBackground2.tint = 0x888888;
		}else if(this.type == 1){
			this.cardBackground.tint = 0x202022;
			this.cardBackground2.tint = 0x888888;
		}

	}
	addActionZones(){
		this.zones = [];
		this.removeActionZones();
		let orderArray = [0,1,2,3,4,5,6,7]
		utils.shuffle(orderArray);

		let totalSides = Math.floor(Math.random() * ACTION_ZONES.length*0.75) + 1;

		for (var i = totalSides - 1; i >= 0; i--) {

			let arrow = new PIXI.Graphics().beginFill(0xFFFFFF);
			arrow.moveTo(-5,0);
			arrow.lineTo(5,0);
			arrow.lineTo(0,-5);

			let zone = ACTION_ZONES[orderArray[i]];

			this.zones.push(zone);

			let tempX = (zone.pos.x / 2) * this.cardBackground.width;
			let tempY = (zone.pos.y / 2) * this.cardBackground.height;
			arrow.x = tempX;
			arrow.y = tempY;

			let centerPos = {x: this.cardBackground.width/2, y: this.cardBackground.height / 2};
			let angle = Math.atan2(tempY - centerPos.y, tempX - centerPos.x) + Math.PI / 2;

			angle = (Math.round((angle * 180 / Math.PI) / 45) * 45) / 180 * Math.PI;
			arrow.rotation = angle;
			this.cardActions.addChild(arrow);

			arrow.x -= Math.sin(angle) * 7;
			arrow.y += Math.cos(angle) * 7;
		}
	}
	destroy(){
	}
}