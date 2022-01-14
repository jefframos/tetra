import * as PIXI from 'pixi.js';
import TweenLite from 'gsap';
import config from '../../config';

import utils from '../../utils';
import Screen from '../../screenManager/Screen'
import Grid from '../elements/Grid'
import Card from '../elements/Card'
import Block from '../elements/Block'
import Board from '../core/Board'
import StartScreenContainer from './StartScreenContainer'
import EndGameContainer from './EndGameContainer'
import BackgroundEffects from '../effects/BackgroundEffects'
import { debug } from 'webpack';

export default class TetraScreen extends Screen {
	constructor(label) {
		super(label);

		//console.log(levels)

		window.ENEMIES = {
			list: [
				{ isBlock: false, color: config.colors.blue, life: 0 },
				{ isBlock: false, color: config.colors.red, life: 1 },
				{ isBlock: false, color: config.colors.yellow, life: 2 },
				{ isBlock: false, color: config.colors.green, life: 3 },
				{ isBlock: false, color: config.colors.blue2, life: 4 },
				{ isBlock: false, color: config.colors.pink, life: 5 },
				{ isBlock: false, color: config.colors.red2, life: 6 },
				{ isBlock: false, color: config.colors.purple, life: 7 },
				{ isBlock: false, color: config.colors.white, life: 8 },
				{ isBlock: true, color: config.colors.block }
			]
		}
		window.ACTION_ZONES = [
			{ label: "TOP_LEFT", pos: { x: 0, y: 0 }, dir: { x: -1, y: -1 } },
			{ label: "TOP_CENTER", pos: { x: 1, y: 0 }, dir: { x: 0, y: -1 } },
			{ label: "TOP_RIGHT", pos: { x: 2, y: 0 }, dir: { x: 1, y: -1 } },
			{ label: "CENTER_RIGHT", pos: { x: 2, y: 1 }, dir: { x: 1, y: 0 } },
			{ label: "BOTTOM_RIGHT", pos: { x: 2, y: 2 }, dir: { x: 1, y: 1 } },
			{ label: "BOTTOM_CENTER", pos: { x: 1, y: 2 }, dir: { x: 0, y: 1 } },
			{ label: "BOTTOM_LEFT", pos: { x: 0, y: 2 }, dir: { x: -1, y: 1 } },
			{ label: "CENTER_LEFT", pos: { x: 0, y: 1 }, dir: { x: -1, y: 0 } }
		]
		let a = -1;
		let b = -2;


		this.levels = window.levelData;//window.levelsJson.levels;


		console.log(this.levels)
		this.hasHash = false;
		this.currentLevelID = 0;
		this.currentLevelData = this.levels[this.currentLevelID];
		if (window.location.hash) {
			var hash = window.location.hash.substring(1); //Puts hash in variable, and removes the # character
			console.log(hash)
			this.hasHash = true;
			if (hash == "a") {

				this.currentLevelID = -1;
			} else {
				if (hash < this.levels.length) {

					this.currentLevelID = hash;

					this.currentLevelData = this.levels[hash];
				}
			}
		}


		let tempid = this.currentLevelID >= 0 ? this.currentLevelID : 0
		
		this.updateGridDimensions();

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

		this.gameRunning = false;

	}

	updateGridDimensions(){
		window.GRID = {
			i: this.currentLevelData.pieces[0].length,
			j: this.currentLevelData.pieces.length,
			height: config.height * 0.7,
			width: config.width * 0.7,
		}

		window.CARD = {
			width: GRID.height / GRID.j,
			height: GRID.height / GRID.j,//GRID.height / GRID.j
		}


		window.GRID.width = window.GRID.i * CARD.width;
		window.GRID.height = window.GRID.j * CARD.height;

		if(this.gridContainer){

			if(this.trailMarker && this.trailMarker.parent){
				this.trailMarker.parent.removeChild(this.trailMarker);
			}
			this.trailMarker = new PIXI.Graphics().beginFill(0xFFFFFF).drawRoundedRect(0, 0, CARD.width, GRID.height, 0);
			this.gridContainer.addChild(this.trailMarker);
		}
	}
	getRect(size = 4, color = 0xFFFFFF) {
		return new PIXI.Graphics().beginFill(color).drawRect(0, 0, size, size);
	}
	getRect2(w = 4, h = 4, color = 0xFFFFFF) {
		return new PIXI.Graphics().beginFill(color).drawRect(0, 0, w, h);
	}
	getCircle(size = 4, color = 0xFFFFFF) {
		return new PIXI.Graphics().beginFill(color).drawCircle(0, 0, size * 0.5);
	}
	generateImage(level, size = 24) {
		let container = new PIXI.Container();
		let tempRect = null;

		let background = this.getRect2(level[0].length * size + size, level.length * size + size, 0x222222)
		background.x -= size * 0.5
		background.y -= size * 0.5
		container.addChild(background)
		for (var i = 0; i < level.length; i++) {
			for (var j = 0; j < level[i].length; j++) {
				if (level[i][j] >= 0) {
					// this.cardsContainer.addChild(this.placeCard(j, i, ENEMIES.list[level[i][j]].life));

					if (ENEMIES.list[level[i][j]].isBlock) {
						tempRect = this.getRect(size, config.colors.dark)
						container.addChild(tempRect)
						tempRect.x = j * size;
						tempRect.y = i * size;
					} else {
						tempRect = this.getRect(size, ENEMIES.list[level[i][j]].color)
						container.addChild(tempRect)
						tempRect.x = j * size;
						tempRect.y = i * size;
					}
				} else if (level[i][j] == -2) {
					tempRect = this.getRect(size, config.colors.dark)
					container.addChild(tempRect)
					tempRect.x = j * size;
					tempRect.y = i * size;
				} else {
					tempRect = this.getRect(size, 0x111111)
					container.addChild(tempRect)
					tempRect.x = j * size;
					tempRect.y = i * size;
				}
			}
		}
		return container;
	}
	buildUI() {
		this.pointsLabel = new PIXI.Text(this.currentPoints, { font: '20px', fill: 0xFFFFFF, align: 'right', fontWeight: '500', fontFamily: 'round_popregular' });
		this.roundsLabel = new PIXI.Text(0, { font: '20px', fill: 0xFFFFFF, align: 'right', fontWeight: '500', fontFamily: 'round_popregular' });
		this.entitiesLabel = new PIXI.Text(0, { font: '20px', fill: 0xFFFFFF, align: 'right', fontWeight: '500', fontFamily: 'round_popregular' });

		this.pointsLabelStatic = new PIXI.Text("POINTS", { font: '20px', fill: 0xFFFFFF, align: 'right', fontWeight: '500', fontFamily: 'round_popregular' });
		this.roundsLabelStatic = new PIXI.Text("MOVES", { font: '20px', fill: 0xFFFFFF, align: 'right', fontWeight: '500', fontFamily: 'round_popregular' });
		this.entitiesLabelStatic = new PIXI.Text("ENTITIES", { font: '20px', fill: 0xFFFFFF, align: 'right', fontWeight: '500', fontFamily: 'round_popregular' });

		this.levelNameLabel = new PIXI.Text("name", { font: '30px', fill: 0xFFFFFF, align: 'right', fontWeight: '800', fontFamily: 'round_popregular' });




		//this.UIContainer.addChild(this.resetLabelBack)


		this.mainMenuContainer = new PIXI.Container();
		this.UIInGame = new PIXI.Container();

		this.startScreenContainer = new StartScreenContainer(this);
		this.mainMenuContainer.addChild(this.startScreenContainer)

		this.endGameScreenContainer = new EndGameContainer(this);
		this.mainMenuContainer.addChild(this.endGameScreenContainer)

		this.backButton = new PIXI.Graphics().beginFill(config.colors.pink).drawCircle(0, 0, 25);
		let backIcon = PIXI.Sprite.fromImage('./assets/images/cancel.png');
		backIcon.tint = 0x000000;
		let sclb = this.backButton.height / backIcon.height;
		sclb *= 0.9;
		backIcon.anchor = { x: 0.5, y: 0.5 }
		backIcon.scale = { x: sclb, y: sclb }
		//utils.centerObject(backIcon, this.backButton);
		this.backButton.addChild(backIcon);


		this.restartButton = new PIXI.Graphics().beginFill(config.colors.yellow).drawCircle(0, 0, 25);

		let restartIcon = PIXI.Sprite.fromImage('./assets/images/cycle.png');
		restartIcon.tint = 0x000000;
		let scl = this.restartButton.height / restartIcon.height;
		scl *= 0.9;
		restartIcon.anchor = { x: 0.5, y: 0.5 }
		restartIcon.scale = { x: scl, y: scl }
		//utils.centerObject(restartIcon, this.restartButton);
		this.restartButton.addChild(restartIcon);

		this.UIContainer.addChild(this.UIInGame)
		this.UIInGame.addChild(this.backButton)
		this.UIInGame.addChild(this.restartButton)
		this.UIInGame.addChild(this.pointsLabelStatic)
		this.UIInGame.addChild(this.roundsLabelStatic)
		this.UIInGame.addChild(this.entitiesLabelStatic)
		this.UIInGame.addChild(this.levelNameLabel)
		this.UIInGame.addChild(this.pointsLabel)
		this.UIInGame.addChild(this.roundsLabel)
		this.UIInGame.addChild(this.entitiesLabel)
		this.UIInGame.y = -200;

		this.cardQueueContainer = new PIXI.Container();
		this.startScreenContainer.x = this.width / 2
		this.startScreenContainer.y = this.height / 2

		this.startScreenContainer.addEvents();


		this.endGameScreenContainer.x = this.width / 2
		this.endGameScreenContainer.y = this.height / 2

		this.endGameScreenContainer.addEvents();

		this.UIContainer.addChild(this.cardQueueContainer)


		this.UIContainer.addChild(this.mainMenuContainer)


		//this.UIContainer.addChild();


		this.backButton.y = 50;
		this.backButton.x = config.width - this.backButton.width;

		this.backButton.on('mousedown', this.mainmenuState.bind(this)).on('touchstart', this.mainmenuState.bind(this));
		//this.addChild(this.generateImage(this.levels[2]))

		this.backButton.interactive = true;
		this.backButton.buttonMode = true;

		this.restartButton.y = 110;
		this.restartButton.x = config.width - this.restartButton.width;

		this.updateLabelsPosition()
		this.cardQueueContainer.x = this.restartButton.x - CARD.width / 2//this.gridContainer.x + this.gridContainer.width + 5;
		this.cardQueueContainer.y = this.gridContainer.y + GRID.j * CARD.height - CARD.height * (this.cardQueueSize);


		this.restartButton.on('mousedown', this.resetGame.bind(this)).on('touchstart', this.resetGame.bind(this));
		//this.addChild(this.generateImage(this.levels[2]))

		this.restartButton.interactive = true;
		this.restartButton.buttonMode = true;

		this.gridContainer.alpha = 0;
		this.updateUI();

		this.endGameScreenContainer.hide(true);

		if (this.hasHash) {
			if (this.currentLevelID < 0) {
				this.endGameState();
			} else {
				console.log(this.currentLevelID)
				this.resetGame();
			}
		} else {
			this.mainmenuState();
		}
	}
	updateLabelsPosition() {

		this.entitiesLabelStatic.x = this.backButton.x - this.backButton.width - this.entitiesLabelStatic.width - 30
		this.entitiesLabelStatic.y = this.backButton.y - this.backButton.height / 2;;

		this.entitiesLabel.x = this.entitiesLabelStatic.x;
		this.entitiesLabel.y = this.entitiesLabelStatic.y + 20;


		this.roundsLabelStatic.x = this.entitiesLabelStatic.x - 120;
		this.roundsLabelStatic.y = this.entitiesLabelStatic.y;

		this.roundsLabel.x = this.roundsLabelStatic.x;
		this.roundsLabel.y = this.roundsLabelStatic.y + 20;

		this.pointsLabelStatic.x = this.roundsLabelStatic.x - 120;;
		this.pointsLabelStatic.y = this.entitiesLabelStatic.y;

		this.pointsLabel.x = this.pointsLabelStatic.x;
		this.pointsLabel.y = this.pointsLabelStatic.y + 20;


		let tempid = this.currentLevelID >= 0 ? this.currentLevelID : 0

		this.levelNameLabel.text = this.currentLevelData.levelName
		utils.centerObject(this.levelNameLabel, config)
		this.levelNameLabel.y = this.roundsLabel.y + 35
	}
	hideInGameElements() {
		TweenLite.killTweensOf(this.cardsContainer);
		TweenLite.killTweensOf(this.gridContainer);
		TweenLite.killTweensOf(this.cardQueueContainer);
		TweenLite.to(this.cardQueueContainer, 0.25, { alpha: 0 })
		TweenLite.to(this.cardsContainer, 0.5, { alpha: 0 })
		TweenLite.to(this.gridContainer, 0.5, { alpha: 0 })

		TweenLite.killTweensOf(this.UIInGame);
		TweenLite.to(this.UIInGame, 0.5, { y: -200 })


		if (this.currentCard) {

			TweenLite.killTweensOf(this.currentCard);
			TweenLite.to(this.currentCard, 0.5, { alpha: 0 })
		}
	}

	showInGameElements() {
		TweenLite.killTweensOf(this.cardsContainer);
		TweenLite.killTweensOf(this.gridContainer);
		TweenLite.killTweensOf(this.cardQueueContainer);
		TweenLite.to(this.cardQueueContainer, 0.1, { alpha: 1 })
		TweenLite.to(this.cardsContainer, 0.1, { alpha: 1 })
		TweenLite.to(this.gridContainer, 0.1, { alpha: 0.5 })
		if (this.currentCard) {
			TweenLite.killTweensOf(this.currentCard);
			TweenLite.to(this.currentCard, 0.1, { alpha: 1 })
		}
		TweenLite.killTweensOf(this.UIInGame);
		TweenLite.to(this.UIInGame, 0.5, { y: 0, ease: Back.easeOut })

	}
	mainmenuState(force = false) {
		this.endGameScreenContainer.hide(force);
		this.startScreenContainer.show(force, force ? 0.2 : 0.75);
		this.gameRunning = false;

		this.hideInGameElements();

		this.removeEvents();

	}
	mainmenuStateFromGame(force = false) {
		this.endGameScreenContainer.hide(force);
		this.startScreenContainer.showFromGame(force, force ? 0.2 : 0.75);
		this.gameRunning = false;

		this.hideInGameElements();

		this.removeEvents();

	}
	endGameState() {
		this.gameRunning = false;
		this.startScreenContainer.hide(true);
		let tempid = this.currentLevelID >= 0 ? this.currentLevelID : 0
		this.endGameScreenContainer.setStats(this.currentPoints, this.currentRound, this.generateImage(this.currentLevelData.pieces), this.currentLevelData);
		this.endGameScreenContainer.show(false, 1);
		this.hideInGameElements();
		this.removeEvents();
		console.log("endGameState")
	}
	gameState() {
		this.gameRunning = true;
		this.showInGameElements();
		this.addEvents();
		this.endGameScreenContainer.hide();
		this.board.startNewGame();

		console.log("gameState")
	}

	build() {
		super.build();
		this.changeLabelTimer = 0;

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
		this.gridContainer.x = config.width / 2 - ((GRID.i + 1) * CARD.width) / 2// - this.gridContainer.width / 2;
		// this.gridContainer.y -= CARD.height;

		this.buildUI();

		this.cardsContainer.x = this.gridContainer.x;
		this.cardsContainer.y = this.gridContainer.y;

		this.trailMarker = new PIXI.Graphics().beginFill(0xFFFFFF).drawRoundedRect(0, 0, CARD.width, GRID.height, 0);
		this.gridContainer.addChild(this.trailMarker);

		this.initGridY = this.gridContainer.y;
		this.initGridAcc = 0;

		this.trailMarker.alpha = 0;

		let tempPosRandom = []
		for (var i = 0; i < GRID.i; i++) {
			tempPosRandom.push(i);
		}
		utils.shuffle(tempPosRandom);

	}

	startNewLevel(data, isEasy) {
		this.currentLevelData = data;
		this.updateGridDimensions();
		this.gridContainer.x = config.width / 2 - ((GRID.i + 1) * CARD.width) / 2;
		this.cardsContainer.x = this.gridContainer.x;
		this.cardsContainer.y = this.gridContainer.y;
		this.grid.createGrid()
		this.resetGame();
		if(isEasy){
			this.board.addCrazyCards2(GRID.i * GRID.j);
		}
	}
	resetGame() {


		this.gameState();
		if (this.currentLevelID < 0) {
			this.currentLevelID = 0;
		}
		this.currentPoints = 0;
		this.currentPointsLabel = 0;
		this.currentRound = 0;

		this.board.newGameFinished = true;
		this.board.destroyBoard();
		this.board.resetBoard();

		for (var i = this.cardQueue.length - 1; i >= 0; i--) {
			this.cardQueue[i].forceDestroy();
		}
		this.cardQueue = []
		if (this.currentCard)
			this.currentCard.forceDestroy();
		this.currentCard = null;

		for (var i = 0; i < this.currentLevelData.pieces.length; i++) {
			for (var j = 0; j < this.currentLevelData.pieces[i].length; j++) {
				if (this.currentLevelData.pieces[i][j] >= 0) {
					if (ENEMIES.list[this.currentLevelData.pieces[i][j]].isBlock) {
						this.cardsContainer.addChild(this.placeBlock(j, i));
					} else {
						this.cardsContainer.addChild(this.placeCard(j, i, ENEMIES.list[this.currentLevelData.pieces[i][j]].life));
					}
				} else if (this.currentLevelData.pieces[i][j] == -2) {
					this.cardsContainer.addChild(this.placeBlock(j, i));
				}
			}
		}

		this.currentPoints = 0;
		this.currentPointsLabel = 0;
		this.currentRound = 0;

		// this.board.debugBoard();


		this.newRound();

		TweenLite.to(this.cardsContainer, 0.1, { alpha: 1 })
		TweenLite.to(this.gridContainer, 0.1, { alpha: 0.3 })
		TweenLite.to(this.UIInGame, 0.75, { y: 0, ease: Cubic.easeOut, onComplete: () => { this.gameState() } })

		this.startScreenContainer.hide();

		


		this.mousePosition = -config.width / 2
		//this.currentButtonLabel = 'RESET';

	}

	formatPointsLabel(tempPoints) {
		if (tempPoints < 10) {
			return "00000" + tempPoints
		} else if (tempPoints < 100) {
			return "0000" + tempPoints
		} else if (tempPoints < 1000) {
			return "000" + tempPoints
		} else if (tempPoints < 10000) {
			return "00" + tempPoints
		} else if (tempPoints < 100000) {
			return "0" + tempPoints
		} else {
			return tempPoints
		}
	}
	updateUI() {
		this.pointsLabel.text = this.formatPointsLabel(Math.ceil(this.currentPointsLabel));
		this.roundsLabel.text = this.formatPointsLabel(Math.ceil(this.currentRound));
		this.entitiesLabel.text = this.formatPointsLabel(Math.ceil(this.board.totalCards));
	}
	addRandomPiece() {
	}
	addPoints(points) {
		this.currentPoints += points;
		TweenLite.to(this, 0.2, {
			currentPointsLabel: this.currentPoints, onUpdate: function () {
				this.currentPointsLabel = Math.ceil(this.currentPointsLabel);
				this.updateUI();
			}.bind(this)
		});

	}

	updateQueue() {
		while (this.cardQueue.length < this.cardQueueSize) {
			let card;
			if (CARD_POOL.length) {
				// console.log(CARD_POOL);
				card = CARD_POOL[0];
				CARD_POOL.shift();
			} else {
				card = new Card(this);
			}
			// console.log(1 - (this.currentRound % 3)*0.12);
			card.life = Math.random() < 1 - (this.currentRound % 3) * 0.17 ? 0 : Math.random() < 0.5 ? 2 : 1;
			card.createCard();
			card.type = 0;
			card.x = 0;
			this.cardQueueContainer.addChild(card);
			this.cardQueue.push(card);
		}
		// for (var i = this.cardQueue.length - 1; i >= 0; i--) {
		for (var i = 0; i < this.cardQueue.length; i++) {
			TweenLite.to(this.cardQueue[i], 0.3, { y: CARD.width * (this.cardQueue.length - i), ease: Back.easeOut })
			// this.cardQueue[i].y = ;
		}

	}
	newRound() {
		this.updateQueue();
		this.currentCard = this.cardQueue[0];
		this.cardQueue.shift();
		if (this.mousePosID < 0) {
			this.mousePosID = GRID.i / 2
		}
		console.log(this.mousePosID)
		this.currentCard.x = CARD.width * this.mousePosID;
		this.currentCard.alpha = 0;
		TweenLite.to(this.currentCard, 0.3, { alpha: 1, y: this.gridContainer.height + 20, ease: Elastic.easeOut })
		this.currentCard.updateCard(true);
		this.cardsContainer.addChild(this.currentCard);
	}

	placeCard(i, j, level = 0) {
		let card;
		if (CARD_POOL.length) {
			// console.log(CARD_POOL);
			card = CARD_POOL[0];
			CARD_POOL.shift();
		} else {
			card = new Card(this);
		}
		card.life = level;
		card.createCard();
		card.x = i * CARD.width;
		card.y = j * CARD.height - CARD.height;
		// card.cardContainer.scale.set(1.2 - j * 0.05)
		card.alpha = 0;
		TweenLite.to(card, 0.5, { alpha: 1, delay: i * 0.05, y: j * CARD.height, ease: Back.easeOut })
		card.pos.i = i;
		card.pos.j = j;
		card.updateCard();
		this.board.addCard(card);
		// this.CARD_POOL.push(card);
		return card;
	}

	placeBlock(i, j) {
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
		TweenLite.to(block, 0.5, { alpha: 1, delay: i * 0.05, y: j * CARD.height, ease: Back.easeOut })
		block.pos.i = i;
		block.pos.j = j;
		// block.updateCard();
		this.board.addCard(block);
		// this.CARD_POOL.push(card);
		return block;
	}



	update(delta) {


		this.startScreenContainer.update(delta)
		this.endGameScreenContainer.update(delta)

		if (!this.gameRunning) {
			return;
		}

		//console.log(this.mousePosition)

		this.updateUI();

		if (!this.board.newGameFinished && this.board.totalCards <= 0) {
			this.endGameState();
			this.gameRunning = false;
			return;
		}

		if (renderer.plugins.interaction.mouse.global) {
			this.mousePosition = renderer.plugins.interaction.mouse.global;
		}
		this.updateMousePosition();

		this.gridContainer.y = this.initGridY + Math.sin(this.initGridAcc) * 5;

		if (this.currentCard) {

			this.currentCard.y = this.gridContainer.height + Math.sin(this.initGridAcc) * 5 + 30;//+  this.gridContainer.height + 10;
		}

		this.initGridAcc += 0.05;

		if (this.board) {
			this.board.update(delta);
		}

	}

	updateMousePosition() {
		if (!this.currentCard) {
			return;
		}
		this.mousePosID = Math.floor((this.mousePosition.x - this.gridContainer.x) / CARD.width);
		// this.trailMarker.alpha = 0;
		if (this.mousePosID >= 0 && this.mousePosID < GRID.i) {
			TweenLite.to(this.trailMarker, 0.1, { x: this.mousePosID * CARD.width });
			this.trailMarker.alpha = 0.15;
			if (this.currentCard) {
				if (this.mousePosID * CARD.width >= 0) {
					// console.log("MOUSE MOVE");
					this.currentCard.moveX(this.mousePosID * CARD.width, 0.1);
				}
			}
		}
	}

	transitionOut(nextScreen) {
		super.transitionOut(nextScreen);
	}
	transitionIn() {

		super.transitionIn();
	}
	destroy() {

	}

	onTapUp() {
		if (!this.currentCard) {
			return;
		}
		console.log(renderer.plugins.interaction.activeInteractionData)
		if (renderer.plugins.interaction.activeInteractionData) {

			for (const key in renderer.plugins.interaction.activeInteractionData) {
				const element = renderer.plugins.interaction.activeInteractionData[key];
				if (element.pointerType == "touch") {
					this.mousePosition = element.global;
				}

			}

		}
		else {
			this.mousePosition = renderer.plugins.interaction.mouse.global
		}
		if (this.mousePosition.y < this.gridContainer.y) {
			return;
		}

		this.updateMousePosition();
		//console.log(renderer.plugins.interaction.activeInteractionData[0].global);
		if (!this.board.isPossibleShot(this.mousePosID)) {
			return;
		}

		this.currentRound++;
		let nextRoundTimer = this.board.shootCard(this.mousePosID, this.currentCard);
		let normalDist = (this.currentCard.y - this.currentCard.pos.j * CARD.height) / GRID.height;
		this.currentCard.move({
			x: this.currentCard.pos.i * CARD.width,
			y: this.currentCard.pos.j * CARD.height
		}, 0.1 * normalDist);

		this.currentCard = null;
		this.updateUI();
		// console.log(0.1 * normalDist * 100);
		setTimeout(function () {
			this.newRound();
		}.bind(this), 0.1 * normalDist + nextRoundTimer);

		// console.log(nextRoundTimer);
	}

	onTapDown() {
		if (!this.currentCard) {
			return;
		}
		if (renderer.plugins.interaction.activeInteractionData[0]) {
			this.mousePosition = renderer.plugins.interaction.activeInteractionData[0].global
		}
		else {
			this.mousePosition = renderer.plugins.interaction.mouse.global
		}
		this.updateMousePosition();
	}

	removeEvents() {
		this.gameContainer.interactive = false;
		this.gameContainer.off('mousedown', this.onTapDown.bind(this)).off('touchstart', this.onTapDown.bind(this));
		this.gameContainer.off('mouseup', this.onTapUp.bind(this)).off('touchend', this.onTapUp.bind(this));
		this.startScreenContainer.removeEvents();
		this.endGameScreenContainer.removeEvents();

	}
	addEvents() {
		this.removeEvents();
		this.gameContainer.interactive = true;
		this.gameContainer.on('mousedown', this.onTapDown.bind(this)).on('touchstart', this.onTapDown.bind(this));
		this.gameContainer.on('mouseup', this.onTapUp.bind(this)).on('touchend', this.onTapUp.bind(this));
		this.startScreenContainer.addEvents();
		this.endGameScreenContainer.addEvents();

	}

	shuffleText(label) {
		let rnd1 = String.fromCharCode(Math.floor(Math.random() * 20) + 65);
		let rnd2 = Math.floor(Math.random() * 9);
		let rnd3 = String.fromCharCode(Math.floor(Math.random() * 20) + 65);
		let tempLabel = label.split('');
		let rndPause = Math.random();
		if (rndPause < 0.2) {
			let pos1 = Math.floor(Math.random() * tempLabel.length);
			let pos2 = Math.floor(Math.random() * tempLabel.length);
			if (tempLabel[pos1] != '\n')
				tempLabel[pos1] = rnd2;
			if (tempLabel[pos2] != '\n')
				tempLabel[pos2] = rnd3;
		} else if (rndPause < 0.5) {
			let pos3 = Math.floor(Math.random() * tempLabel.length);
			if (tempLabel[pos3] != '\n')
				tempLabel[pos3] = rnd3;
		}
		let returnLabel = '';
		for (var i = 0; i < tempLabel.length; i++) {
			returnLabel += tempLabel[i];
		}
		return returnLabel
	}
}