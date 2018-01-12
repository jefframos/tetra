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
		for (var i = 0; i < this.cards[laneID].length; i++) {
			if(!this.cards[laneID][i]){
				return true;
			}
		}
		return false;	
	}

	shootCard(laneID, card){
		let spaceID = -1;
		for (var i = 0; i < this.cards[laneID].length; i++) {
			if(!this.cards[laneID][i]){
				spaceID = i;
				break;
			}
		}
		if(spaceID >= 0){
			this.cards[laneID][spaceID] = card;
			card.pos.i = laneID;
			card.pos.j = spaceID;
		}
		console.log(this.cards[laneID]);
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