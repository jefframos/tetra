import * as PIXI from 'pixi.js';
import config  from '../../config';
import utils  from '../../utils';
export default class Grid extends PIXI.Container{
	constructor(game){
		super();
		this.game = game;
	}
	start(){
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


		this.addChild(gridContainer);
	}
}