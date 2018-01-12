import * as PIXI from 'pixi.js';
import config  from '../../config';
import utils  from '../../utils';
export default class Board{
	constructor(game){

		this.game = game;
		this.cards = [];
		for (var i = window.GRID.i - 1; i >= 0; i--) {
			let lane = [];
			for (var j = window.GRID.j - 1; j >= 0; j--) {
				lane.push(0);
			}
			this.cards.push(lane);
		}
	}
	addCard(card){
		this.cards[card.pos.i][card.pos.j] = card;
	}

	isPossibleShot(laneID){
		if(laneID >= this.cards.length || laneID < 0){
			return false;
		}
		for (var i = this.cards[laneID].length - 1; i >= 0; i--) {
			if(!this.cards[laneID][i]){
				return true;
			}
			break;
		}
		return false;	
	}

	shootCard(laneID, card){
		let spaceID = -1;
		for (var i = this.cards[laneID].length-1; i >= 0; i--) {
			if(!this.cards[laneID][i]){
				spaceID = i;
				//break;
			}else{
				break;
			}
		}
		if(spaceID >= 0){			
			card.pos.i = laneID;
			card.pos.j = spaceID;
			this.addCard(card);
			setTimeout(function() {
				this.updateRound(card);				
			}.bind(this), 200);
		}
	}
	moveCardDown(card){
		// return;
		if(card.counter <= 0){
			card.counter = 10;
		}
		this.cards[card.pos.i][card.pos.j] = 0;
		card.pos.j ++;
		if(card.pos.j > GRID.j){
			card.destroy();
			return;
		}
		this.addCard(card);
		card.move({
			x: card.pos.i * CARD.width,
			y: card.pos.j * CARD.height
		}, 0.2);
	}
	moveLaneDown(card){
		//NAO TA FUNCIONANDO
		let cards = [];
		cards.push(card);
		for (var i = card.pos.j; i < this.cards[card.pos.i].length; i++) {
			if(this.cards[card.pos.i][i]){
				cards.push(this.cards[card.pos.i][i]);
			}
		}

		for (var i = 0; i < cards.length; i++) {
			this.moveCardDown(cards[i])
		}
		
		//if card is 0, reset the counter e move todos que tao abaixo pra mais perto do game over
	}

	updateRound(card){
		let zones = card.zones;
		let findCards = false;
		let cardFound = null;
		let cardsToDestroy = [];
		for (var i = 0; i < zones.length; i++) {
			let actionPosId = {
				i:card.pos.i +zones[i].dir.x,
				j:card.pos.j +zones[i].dir.y
			}
			if((actionPosId.i >= 0 && actionPosId.i < window.GRID.i)&&
				(actionPosId.j >= 0 && actionPosId.j < window.GRID.j)){

				cardFound = this.cards[actionPosId.i][actionPosId.j];
				if(cardFound){
					
					findCards = true;
					cardsToDestroy.push({cardFound:cardFound, currentCard: card, attackZone:zones[i]});
				}				
			}
		}
		if(!findCards){
			card.type = 0;
			card.updateCard();
		}else{
			//cardsToDestroy.push(card);
			setTimeout(function() {
				this.destroyCards(cardsToDestroy, card);		
			}.bind(this), 300);
			//this.destroyCards(cardsToDestroy);			
		}

		setTimeout(function() {
			this.updateCardsCounter(-1);
		}.bind(this), 350);
		
		

	}

	updateCardsCounter(value, card){
		for (var i = 0; i < this.cards.length; i++) {
			for (var j = 0; j < this.cards[i].length; j++) {
				if(this.cards[i][j]){
					this.cards[i][j].updateCounter(value);
				}
			}
		}
	}
	destroyCards(list, card){
		let timeline = new TimelineLite();
		for (var i = 0; i < list.length; i++) {
			//timeline.append(TweenLite.to(list[i].currentCard.getArrow(list[i].attackZone.label).scale, 0.1, {x:0, y:0}))

			timeline.append(TweenLite.to(list[i].cardFound, 0.3, {
				onStartParams:[list[i].currentCard.getArrow(list[i].attackZone.label), list[i].attackZone],
				onStart:function(arrow, zone){
					TweenLite.to(arrow.scale, 0.3, {x:0, y:0, ease:Back.easeIn})
					TweenLite.to(arrow, 0.2, {x:arrow.x  + 10 * zone.dir.x, y:arrow.y + 10 * zone.dir.y, ease:Back.easeIn})
				}.bind(this),
				onCompleteParams:[list[i].cardFound],
				onComplete:function(card){
					card.destroy();
					card.convertCard();
				}.bind(this)}));
			this.cards[list[i].cardFound.pos.i][list[i].cardFound.pos.j] = 0;
		}
		card.convertCard();
	}

	getOpposit(zone){
		let id = 0;
		for (var i = ACTION_ZONES.length - 1; i >= 0; i--) {
			if(ACTION_ZONES[i].label == zone){
				id = i;
				break;
			}
		}
	}

	debugBoard2(){
		for (var i = 0; i < this.cards.length; i++) {
			let str = (i + 1)+'---  ';
			for (var j = 0; j < this.cards[i].length; j++) {
				str += (this.cards[i][j] || "0") + ' - ';
			}
			console.log(str);
		}
	}

	debugBoard(){
		for (var i = this.cards.length-1; i >= 0; i--) {
			let str = (i + 1)+'---  ';
			for (var j = 0; j < this.cards[i].length; j++) {
				str += (this.cards[i][j] || "0") + ' - ';
			}
			console.log(str);
		}
	}
}