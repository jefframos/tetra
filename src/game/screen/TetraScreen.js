import * as PIXI from 'pixi.js';
import TweenLite from 'gsap';
import config  from '../../config';
import utils  from '../../utils';
import Screen from '../../screenManager/Screen'
import Grid from '../elements/Grid'
import Card from '../elements/Card'
import Block from '../elements/Block'
import Board from '../core/Board'
import BackgroundEffects from '../effects/BackgroundEffects'

export default class TetraScreen extends Screen{
	constructor(label){
		super(label);

        window.ENEMIES = {
        	list:[
        		{color:0x61C6CE,life:0},
        		{color:0xD81639,life:1},
        		{color:0xE2C756,life:2},
        		{color:0x7BCA93,life:3},
        		{color:0x1376B9,life:4},
        		{color:0xDD6290,life:5},
        		{color:0xFF2320,life:6},
        	]
        }
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
        let a = -1;
        let b = -2;

        this.levels = [
        [
        	[6,6,6,6,6],
        	[5,5,5,5,5],
        	[4,4,4,4,4],
        	[3,3,3,3,3],
        	[2,2,2,2,2],
        	[1,1,1,1,1],
        	[0,0,0,0,0],
        	[a,a,a,a,a],
        	[a,a,a,a,a],
        	[a,a,a,a,a],
        ],
        [
        	[a,6,6,6,a],
        	[6,6,6,6,6],
        	[6,b,6,b,6],
        	[6,6,6,6,6],
        	[a,6,b,6,a],
        	[a,6,6,6,a],
        	[a,a,a,a,a],
        	[a,a,a,a,a],
        	[a,a,a,a,a],
        	[a,a,a,a,a],
        ]
        ]
        this.currentLevelID = 0;
        if(window.location.hash){
        	var hash = window.location.hash.substring(1); //Puts hash in variable, and removes the # character
    	  	if(hash < this.levels.length){
    	  		this.currentLevelID = hash;
    	  	}
  		}

        window.GRID = {
        	i:this.levels[this.currentLevelID][0].length,
        	j:this.levels[this.currentLevelID].length,
        	height: config.height * 0.8,
        	width: config.width * 0.7,
        }

        window.CARD = {
        	width: GRID.height / GRID.j,
        	height: GRID.height / GRID.j,//GRID.height / GRID.j
        }


        window.GRID.width = window.GRID.i * CARD.width;
        window.GRID.height = window.GRID.j * CARD.height;

        window.CARD_POOL = [];

        window.CARD_NUMBER = 0;

        this.grid = new Grid(this);
        this.board = new Board(this);
        this.totalLines = 6;

        this.currentPoints = 0;
        this.currentPointsLabel = 0;
        this.currentRound = 0;

        this.cardQueue = [];
        this.cardQueueSize = 4;

        this.currentButtonLabel = 'START';

	}
	getRect(size = 4, color = 0xFFFFFF){
		return new PIXI.Graphics().beginFill(color).drawRect(0,0,size,size);
	}
	generateImage(level){
		let container = new PIXI.Container();
		let tempRect = null;
		let size = 16;
		for (var i = 0; i < this.level.length; i++) {			
			for (var j = 0; j < this.level[i].length; j++) {
				if(this.level[i][j] >= 0){
					// this.cardsContainer.addChild(this.placeCard(j, i, ENEMIES.list[this.level[i][j]].life));
					tempRect = this.getRect(size, ENEMIES.list[this.level[i][j]].color)
					container.addChild(tempRect)
					tempRect.x = j * size;
					tempRect.y = i * size;
				}else if(this.level[i][j] == -2){
					tempRect = this.getRect(size, 0x333333)
					container.addChild(tempRect)
					tempRect.x = j * size;
					tempRect.y = i * size;
				}else{
					tempRect = this.getRect(size, 0x000000)
					container.addChild(tempRect)
					tempRect.x = j * size;
					tempRect.y = i * size;
				}
			}
		}
		return container;
	}
	buildUI(){
		this.pointsLabel = new PIXI.Text(this.currentPoints,{font : '20px', fill : 0xFFFFFF, align : 'right', fontWeight : '800'});
		this.roundsLabel = new PIXI.Text(0,{font : '20px', fill : 0xFFFFFF, align : 'right', fontWeight : '800'});

		this.pointsLabelStatic = new PIXI.Text("POINTS",{font : '20px', fill : 0xFFFFFF, align : 'right', fontWeight : '800'});
		this.roundsLabelStatic = new PIXI.Text("MOVES",{font : '20px', fill : 0xFFFFFF, align : 'right', fontWeight : '800'});

		this.UIContainer.addChild(this.pointsLabelStatic)
		this.UIContainer.addChild(this.roundsLabelStatic)
		this.UIContainer.addChild(this.pointsLabel)
		this.UIContainer.addChild(this.roundsLabel)


		this.cardQueueContainer = new PIXI.Container();
		this.UIContainer.addChild(this.cardQueueContainer)

		this.resetLabel = new PIXI.Text(this.shuffleText(this.currentButtonLabel),{font : '20px', fill : 0xFFFFFF, align : 'right', fontWeight : '800'});
		this.startButton = new PIXI.Container();
		this.startButtonBackground = new PIXI.Graphics().beginFill(0x61C6CE).drawRect(0,0,100,40);
		this.startButton.addChild(this.startButtonBackground);
		this.startButton.addChild(this.resetLabel);

		this.startButton.interactive = true;
		this.startButton.buttonMode = true;

		this.startButton.on('mouseup', this.resetGame.bind(this)).on('touchend', this.resetGame.bind(this));

		utils.centerObject(this.startButton, this);

		this.resetLabel.style.fill = 0xFFFFFF
		utils.centerObject(this.resetLabel, this.startButtonBackground);

		this.UIContainer.addChild(this.startButton);

		this.cardQueueContainer.x = this.gridContainer.x + this.gridContainer.width + 5;
		this.cardQueueContainer.y = this.gridContainer.y + GRID.j * CARD.height - CARD.height * (this.cardQueueSize);

		this.pointsLabelStatic.x = 10;
		this.pointsLabelStatic.y = 10;

		this.pointsLabel.x = this.pointsLabelStatic.x;
		this.pointsLabel.y = this.pointsLabelStatic.y + 20;

		this.roundsLabelStatic.x = config.width / 2;
		this.roundsLabelStatic.y = 10;

		this.roundsLabel.x = this.roundsLabelStatic.x;
		this.roundsLabel.y = this.roundsLabelStatic.y + 20;

		// this.addChild(this.generateImage(this.level1))

		this.gridContainer.alpha = 0;
		this.updateUI();
	}

	updateStartLabel(){
		this.resetLabel.text = this.shuffleText(this.currentButtonLabel);
		//this.resetLabel.style.fill = ENEMIES.list[Math.floor(ENEMIES.list.length * Math.random())].color;
		utils.centerObject(this.resetLabel, this.startButtonBackground);
	}
	build(){
		super.build();
		this.background = new BackgroundEffects();
        this.addChild(this.background)

        this.gameContainer = new PIXI.Container();
        this.gridContainer = new PIXI.Container();
        this.cardsContainer = new PIXI.Container();
        this.UIContainer = new PIXI.Container();

        this.addChild(this.gameContainer);

        this.gameContainer.addChild(this.background);
        this.gameContainer.addChild(this.gridContainer);
        this.gameContainer.addChild(this.cardsContainer);
        this.gameContainer.addChild(this.UIContainer);


        this.mousePosID = GRID.i / 2;
        // this.currentCard = this.createCard();
        // this.cardsContainer.addChild(this.currentCard)
        // utils.centerObject(this.currentCard, this.background)

	

		this.grid.createGrid();
		this.gridContainer.addChild(this.grid);
		utils.centerObject(this.gridContainer, this.background.background);
		this.gridContainer.x = config.width / 2 - ((GRID.i + 1) * CARD.width)/ 2// - this.gridContainer.width / 2;
		// this.gridContainer.y -= CARD.height;

        this.buildUI();

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
	}

	resetGame(){

		this.currentPoints = 0;
        this.currentPointsLabel = 0;
        this.currentRound = 0;


		this.board.destroyBoard();
		this.board.resetBoard();

		for (var i = this.cardQueue.length - 1; i >= 0; i--) {
			this.cardQueue[i].forceDestroy();
		}
		this.cardQueue = []
		if(this.currentCard)
			this.currentCard.forceDestroy();
		this.currentCard = null;

		for (var i = 0; i < this.levels[this.currentLevelID].length; i++) {			
			for (var j = 0; j < this.levels[this.currentLevelID][i].length; j++) {
				if(this.levels[this.currentLevelID][i][j] >= 0){
					this.cardsContainer.addChild(this.placeCard(j, i, ENEMIES.list[this.levels[this.currentLevelID][i][j]].life));
				}else if(this.levels[this.currentLevelID][i][j] == -2){
					this.cardsContainer.addChild(this.placeBlock(j, i));					
				}
			}
		}

		this.currentPoints = 0;
        this.currentPointsLabel = 0;
        this.currentRound = 0;

        this.startButton.x = config.width - this.startButton.width - 6;
        this.startButton.y = 6;
		// this.board.debugBoard();

		this.addEvents();

		this.newRound();

		TweenLite.to(this.gridContainer, 0.5, {alpha:.3})
		this.currentButtonLabel = 'RESET';

	}

	formatPointsLabel(tempPoints){
		if(tempPoints < 10){
			return "0000" + tempPoints
		}else if(tempPoints < 100){
			return "000" + tempPoints
		}else if(tempPoints < 1000){
			return "00" + tempPoints
		}else if(tempPoints < 10000){
			return "0" + tempPoints
		}else{
			return tempPoints
		} 
	}
	updateUI(){
		this.pointsLabel.text = this.formatPointsLabel(Math.ceil(this.currentPointsLabel));
		this.roundsLabel.text = this.formatPointsLabel(Math.ceil(this.currentRound));
	}
	addRandomPiece(){
	}
	addPoints(points){
		this.currentPoints += points;
		TweenLite.to(this, 0.2, {currentPointsLabel: this.currentPoints, onUpdate:function(){
			this.currentPointsLabel = Math.ceil(this.currentPointsLabel);
			this.updateUI();
		}.bind(this)});

	}

	updateQueue(){
		while(this.cardQueue.length < this.cardQueueSize){
			let card;
			if(CARD_POOL.length){
				// console.log(CARD_POOL);
				card = CARD_POOL[0];
				CARD_POOL.shift();
			}else{
				card = new Card(this);
			}
			// console.log(1 - (this.currentRound % 3)*0.12);
			card.life = Math.random() < 1 - (this.currentRound % 3)*0.17 ? 0 : Math.random() < 0.5 ? 2 : 1;
			card.createCard();
			card.type = 0;
			card.x = 0;
			this.cardQueueContainer.addChild(card);
			this.cardQueue.push(card);
		}
		// for (var i = this.cardQueue.length - 1; i >= 0; i--) {
		for (var i = 0; i < this.cardQueue.length; i++) {
			TweenLite.to(this.cardQueue[i], 0.3, {y:CARD.width * (this.cardQueue.length - i), ease:Back.easeOut})
			// this.cardQueue[i].y = ;
		}

	}
	newRound(){		
		this.updateQueue();
		this.currentCard = this.cardQueue[0];
		this.cardQueue.shift();
		this.currentCard.x = CARD.width * this.mousePosID;
		this.currentCard.y = this.gridContainer.height + 100;
		this.currentCard.alpha = 0;
		TweenLite.to(this.currentCard, 0.3, {alpha : 1, y:this.gridContainer.height, ease:Elastic.easeOut})
		this.currentCard.updateCard();
		this.cardsContainer.addChild(this.currentCard);
	}

	placeCard(i, j, level = 0){
		let card;
		if(CARD_POOL.length){
			// console.log(CARD_POOL);
			card = CARD_POOL[0];
			CARD_POOL.shift();
		}else{
			card = new Card(this);
		}
		card.life = level;
		card.createCard();
		card.x = i * CARD.width;
		card.y = j * CARD.height - CARD.height;
		// card.cardContainer.scale.set(1.2 - j * 0.05)
		card.alpha = 0;
		TweenLite.to(card, 0.5, {alpha:1, delay:i*0.05, y:j * CARD.height, ease:Back.easeOut})
		card.pos.i = i;
		card.pos.j = j;
		card.updateCard();
		this.board.addCard(card);
		// this.CARD_POOL.push(card);
		return card;
	}

	placeBlock(i, j){
		let block;
		// if(CARD_POOL.length){
		// 	// console.log(CARD_POOL);
		// 	block = CARD_POOL[0];
		// 	CARD_POOL.shift();
		// }else{
		// }
			block = new Block(this);
		// block.createCard();
		block.x = i * CARD.width;
		block.y = j * CARD.height - CARD.height;
		// card.cardContainer.scale.set(1.2 - j * 0.05)
		block.alpha = 0;
		TweenLite.to(block, 0.5, {alpha:1, delay:i*0.05, y:j * CARD.height, ease:Back.easeOut})
		block.pos.i = i;
		block.pos.j = j;
		// block.updateCard();
		this.board.addCard(block);
		// this.CARD_POOL.push(card);
		return block;
	}
	

	
	update(delta){
		if(renderer.plugins.interaction.mouse.global){
			this.mousePosition = renderer.plugins.interaction.mouse.global;
		}
		this.updateMousePosition();

		this.gridContainer.y = this.initGridY + Math.sin(this.initGridAcc) * 5;
		this.initGridAcc += 0.05;

		this.updateStartLabel();

		if(this.board){
			this.board.update(delta);
		}
	}

	updateMousePosition(){
		if(!this.currentCard){
			return;
		}
		this.mousePosID = Math.floor((this.mousePosition.x - this.gridContainer.x) / CARD.width);
		// this.trailMarker.alpha = 0;
		if(this.mousePosID >= 0 && this.mousePosID < GRID.i){
			TweenLite.to(this.trailMarker, 0.1, {x:this.mousePosID * CARD.width});
			this.trailMarker.alpha = 0.15;
			if(this.currentCard){
				if(this.mousePosID * CARD.width >= 0){
					// console.log("MOUSE MOVE");
					this.currentCard.moveX(this.mousePosID * CARD.width, 0.1);
				}
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
		if(this.mousePosition.y < this.gridContainer.y){
			return;
		}
		this.updateMousePosition();
		//console.log(renderer.plugins.interaction.activeInteractionData[0].global);
		if(!this.board.isPossibleShot(this.mousePosID)){
			return;
		}

		this.currentRound ++;
		let nextRoundTimer = this.board.shootCard(this.mousePosID, this.currentCard);
		let normalDist = (this.currentCard.y - this.currentCard.pos.j * CARD.height) / GRID.height;
		this.currentCard.move({
			x: this.currentCard.pos.i * CARD.width,
			y: this.currentCard.pos.j * CARD.height
		}, 0.1 * normalDist);
		
		this.currentCard = null;
		this.updateUI();
		// console.log(0.1 * normalDist * 100);
		setTimeout(function() {
			this.newRound();			
		}.bind(this), 0.1 * normalDist + nextRoundTimer);

		// console.log(nextRoundTimer);
	}

	onTapDown(){
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
	}

	removeEvents(){
		this.gameContainer.interactive = false;
		this.gameContainer.off('mousedown', this.onTapDown.bind(this)).off('touchstart', this.onTapDown.bind(this));
		this.gameContainer.off('mouseup', this.onTapUp.bind(this)).off('touchend', this.onTapUp.bind(this));
	}
	addEvents(){
		this.removeEvents();
		this.gameContainer.interactive = true;
		this.gameContainer.on('mousedown', this.onTapDown.bind(this)).on('touchstart', this.onTapDown.bind(this));
		this.gameContainer.on('mouseup', this.onTapUp.bind(this)).on('touchend', this.onTapUp.bind(this));

	}

	shuffleText(label){
		let rnd1 = String.fromCharCode(Math.floor(Math.random()*20) + 65);
		let rnd2 = Math.floor(Math.random()* 9);
		let rnd3 = String.fromCharCode(Math.floor(Math.random()*20) + 65);
		let tempLabel = label.split('');
		let rndPause = Math.random();
		if(rndPause < 0.2){
			let pos1 = Math.floor(Math.random()*tempLabel.length);
			let pos2 = Math.floor(Math.random()*tempLabel.length);
			if(tempLabel[pos1] != '\n')
				tempLabel[pos1] = rnd2;
			if(tempLabel[pos2] != '\n')
				tempLabel[pos2] = rnd3;
		}else if(rndPause < 0.5){
			let pos3 = Math.floor(Math.random()*tempLabel.length);
			if(tempLabel[pos3] != '\n')
				tempLabel[pos3] = rnd3;
		}
		let returnLabel = '';
		for (var i = 0; i < tempLabel.length; i++) {
			returnLabel+=tempLabel[i];
		}
		return returnLabel
	}
}