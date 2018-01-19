import * as PIXI from 'pixi.js';
import config  from '../../config';
import utils  from '../../utils';
export default class Card extends PIXI.Container{
	constructor(game){
		super();
		this.game = game;
		this.zones = [];
		this.arrows = [];
		this.pos = {i:-1, j:-1};
		this.type = 0;
		this.MAX_COUNTER = 10;
		this.life = 2;
	}
	start(){
	}
	createCard(){
		let card = new PIXI.Container();
		this.counter = this.MAX_COUNTER;
		this.cardBackground = new PIXI.Graphics().beginFill(0xFFFFFF).drawRoundedRect(0,0,CARD.width, CARD.height, 0);
		this.cardBackground2 = PIXI.Sprite.fromImage('./assets/images/enemy.png');
		let cardContainer = new PIXI.Container();
		this.cardActions = new PIXI.Container();
		card.addChild(cardContainer);
		// cardContainer.addChild(this.cardBackground);
		cardContainer.addChild(this.cardBackground2);
		cardContainer.addChild(this.cardActions);
		
		
		this.lifeContainer = new PIXI.Container();
		cardContainer.addChild(this.lifeContainer);
		this.lifeLabel = new PIXI.Text(this.life,{font : '15px', fill : 0x000000, align : 'right'});
		this.lifeLabel.pivot.x = this.lifeLabel.width / 2
		this.lifeLabel.pivot.y = this.lifeLabel.height / 2
		this.lifeContainerBackground = new PIXI.Graphics().beginFill(0x00FFFF).drawCircle(0,0,10);
		this.lifeContainer.addChild(this.lifeContainerBackground);
		this.lifeContainer.addChild(this.lifeLabel);
		this.lifeContainer.x = CARD.width * 0.75;
		this.lifeContainer.y = CARD.height * 0.75;

		this.label = new PIXI.Text(this.counter,{font : '20px', fill : 0x000000, align : 'right'});
		// cardContainer.addChild(this.label);
		utils.centerObject(this.label, this.cardBackground);
		utils.centerObject(this.cardBackground2, this.cardBackground);
		this.addActionZones();

		this.cardContainer = cardContainer;//card;
		this.addChild(card);
		cardContainer.pivot.x = CARD.width / 2;
		cardContainer.x = CARD.width / 2;
		return this.cardContainer;
	}
	attacked(){
		this.life --;

		this.updateCard()

		if(this.life <0){
			return true;
		}
		
		return false;
	}
	hasZone(zone){
		for (var i = 0; i < this.zones.length; i++) {
			if(this.zones[i].label == zone){
				return this.zones[i];
			}
		}
		return false;
	}
	removeActionZones(){
		this.zones = [];
		while(this.cardActions.children.length > 0){
			this.cardActions.removeChildAt(0);
		}
	}
	updateCounter(value){
		//this.counter += value;
		this.label.text = this.counter;
		if(this.counter <= 0){
			this.counter = this.MAX_COUNTER;
			return this;
			//this.game.board.moveLaneDown(this);
		}
		return null;
	}
	updateCard(){
		console.log(this.life);
		for (var i = 0; i < ENEMIES.list.length; i++) {
			if(ENEMIES.list[i].life == this.life){
				this.cardBackground2.tint = ENEMIES.list[i].color;
			}
		}

		if(this.life <1){
			this.lifeContainer.alpha = 0;
		}else{
			this.lifeLabel.text = this.life;
			this.lifeContainer.x = CARD.width * 0.75;
			this.lifeContainer.y = CARD.height * 0.75;
		}
		// if(this.type == 0){
		// 	this.cardBackground.tint = 0x777777;
		// }else if(this.type == 1){
		// 	this.cardBackground.tint = 0x202022;
		// 	this.cardBackground2.tint = 0x888888;
		// }

	}
	convertCard(){
		//this.type = this.type == 1 ? 0 : 1;
		this.updateCard();
	}
	getArrow(label){
		for (var i = 0; i < this.arrows.length; i++) {
			if(this.arrows[i].zone == label){
				return this.arrows[i].arrow;
			}
		}
	}
	addActionZones(){
		this.zones = [];
		this.removeActionZones();
		let orderArray = [0,1,2,3,4,5,6,7]
		utils.shuffle(orderArray);

		let totalSides = Math.floor(Math.random() * ACTION_ZONES.length*0.4) + 1;

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

			this.arrows.push({arrow:arrow, zone:zone.label});

			let centerPos = {x: this.cardBackground.width/2, y: this.cardBackground.height / 2};
			let angle = Math.atan2(tempY - centerPos.y, tempX - centerPos.x) + Math.PI / 2;

			angle = (Math.round((angle * 180 / Math.PI) / 45) * 45) / 180 * Math.PI;
			arrow.rotation = angle;
			this.cardActions.addChild(arrow);

			arrow.x -= Math.sin(angle) * 7;
			arrow.y += Math.cos(angle) * 7;
		}
	}
	move(pos, time = 0.3, delay = 0){
		TweenLite.to(this, time, {x:pos.x, y:pos.y, delay: delay});
	}
	moveX(pos, time = 0.3, delay = 0){
		TweenLite.to(this, time, {x:pos, delay: delay});
	}
	destroy(){
		TweenLite.to(this, 0.2, {alpha:0, onComplete:function(){			
			this.parent.removeChild(this);
		}.bind(this)});
	}
}