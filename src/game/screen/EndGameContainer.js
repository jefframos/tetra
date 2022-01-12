import * as PIXI from 'pixi.js';
import TweenLite from 'gsap';
import config from '../../config';
import utils from '../../utils';
import Screen from '../../screenManager/Screen'
import Grid from '../elements/Grid'
import Card from '../elements/Card'
import Block from '../elements/Block'
import Board from '../core/Board'
import BackgroundEffects from '../effects/BackgroundEffects'
import { debug } from 'webpack';

export default class EndGameContainer extends PIXI.Container {
    constructor(screen) {
        super();

        this.gameScreen = screen;

        this.screenContainer = new PIXI.Container();
        this.stripsContainer = new PIXI.Container();
        this.changeLabelTimer = 0;


        this.currentButtonLabel = "YOU WIN"
        this.resetLabelBack = new PIXI.Text(this.currentButtonLabel, { font: '90px', fill: 0xFFFFFF, align: 'center', fontWeight: '800' });
        this.resetLabel = new PIXI.Text(this.resetLabelBack.text, { font: '90px', fill: 0xFFFFFF, align: 'center', fontWeight: '800' });

        this.addChild(this.screenContainer);
        this.screenContainer.addChild(this.resetLabelBack);
        this.screenContainer.addChild(this.stripsContainer);
        this.screenContainer.addChild(this.resetLabel);
        let height = 50;
        let line1 = new PIXI.Graphics().beginFill(window.config.colors.blue2).drawRect(0,-height*4, 1000, height*5);
        this.stripsContainer.addChild(line1);

        let line2 = new PIXI.Graphics().beginFill(window.config.colors.red).drawRect(0, 0, 1000, height);
        this.stripsContainer.addChild(line2);
        line2.y = height;

        let line3 = new PIXI.Graphics().beginFill(window.config.colors.yellow).drawRect(0, 0, 1000, height);
        this.stripsContainer.addChild(line3);
        line3.y = height * 2;

        let line4 = new PIXI.Graphics().beginFill(window.config.colors.green).drawRect(0, 0, 1000, height);
        this.stripsContainer.addChild(line4);
        line4.y = height * 3;

        let line5 = new PIXI.Graphics().beginFill(window.config.colors.pink).drawRect(0, 0, 1000, height);
        this.stripsContainer.addChild(line5);
        line5.y = height * 4;


        let center = new PIXI.Graphics().beginFill(0xff0000).drawCircle(0, 0, 10)
        //this.addChild(center);
        this.stripsContainer.pivot.x = this.stripsContainer.width / 2;
        this.stripsContainer.pivot.y = this.stripsContainer.height / 2;
        this.stripsContainer.rotation = Math.PI * 0.5;

        this.resetLabelBack.pivot.x = this.resetLabelBack.width / 2;
        this.resetLabelBack.pivot.y = this.resetLabelBack.height / 2;

        this.resetLabel.pivot.x = this.resetLabel.width / 2;
        this.resetLabel.pivot.y = this.resetLabel.height / 2;

        //this.interactive = true;
        this.buttonMode = true;


        this.stripsContainer.rotation = -Math.PI * 0.25
        this.resetLabel.rotation = -Math.PI * 0.25

        this.resetLabel.y = 130
        this.resetLabel.x += Math.cos(this.resetLabel.rotation) * 20
        this.resetLabel.y += Math.sin(this.resetLabel.rotation) * 20

        this.getMask();
        this.screenContainer.addChild(this.currentMask);
        this.resetLabel.mask = this.currentMask;
        
        
        this.pointsLabel = new PIXI.Text("POINTS: 3450", { font: '30px', fill: 0xFFFFFF, align: 'left', fontWeight: '800' });
        this.pointsLabel.pivot.x = this.pointsLabel.width / 2;
        this.pointsLabel.pivot.y = this.pointsLabel.height / 2;
        this.pointsLabel.rotation = -Math.PI * 0.25
        this.pointsLabel.y = 250
        this.pointsLabel.x += Math.cos(this.pointsLabel.rotation) * 100
        this.pointsLabel.y += Math.sin(this.pointsLabel.rotation) * 100
        this.screenContainer.addChild(this.pointsLabel);

        this.movesLabel = new PIXI.Text("MOVES: 34", { font: '30px', fill: 0xFFFFFF, align: 'left', fontWeight: '800' });
        this.movesLabel.pivot.x = this.movesLabel.width / 2;
        this.movesLabel.pivot.y = this.movesLabel.height / 2;
        this.movesLabel.rotation = -Math.PI * 0.25
        this.movesLabel.x = this.pointsLabel.x +  Math.cos(this.pointsLabel.rotation) * 12
        this.movesLabel.y = this.pointsLabel.y+  Math.sin(this.pointsLabel.rotation) * 12
        this.movesLabel.y += 50
        this.screenContainer.addChild(this.movesLabel);

        this.backButton = new PIXI.Graphics().beginFill(window.config.colors.blue).drawRect(0, 0, 330, 330);
        this.backButton.pivot.x = this.backButton.width / 2;
        this.backButton.pivot.y = this.backButton.height / 2;
        
        this.backButton.rotation = Math.PI * 0.25

        this.backButton.on('mousedown', this.goBack.bind(this)).on('touchstart', this.goBack.bind(this));
        

    }
    getRect(size = 4, color = 0xFFFFFF) {
        return new PIXI.Graphics().beginFill(color).drawRect(0, 0, size, size);
    }
    show(force = false, delay = 0) {
        TweenLite.to(this.screenContainer, 0.5, {delay:delay, alpha:1, ease: Cubic.easeOut })
        this.backButton.alpha = 0;
        TweenLite.to(this.backButton, 0.5, {delay:delay, alpha:1, ease: Cubic.easeOut })
        this.backButton.x = config.width
        this.backButton.y = config.height
        this.backButton.interactive = true;
        this.backButton.buttonMode = true;
        this.parent.addChild(this.backButton);

        this.backButton.visible = true;

        console.log("SHOE")

    }
    hide(force = false) {
        TweenLite.to(this.screenContainer, force ? 0: 0.5, { alpha:0, ease: Cubic.easeIn })
        TweenLite.to(this.backButton, force ? 0: 0.5, { alpha:0, ease: Cubic.easeIn })
        this.backButton.interactive = false;
        console.log("hide")
        console.trace()
    }
    getMask() {
        this.currentMask = new PIXI.Graphics().beginFill(0xFF0000).drawRect(0, 0, this.stripsContainer.width, this.stripsContainer.height);
        this.currentMask.rotation = this.stripsContainer.rotation;
        this.currentMask.pivot.x = this.stripsContainer.pivot.x
        this.currentMask.pivot.y = this.stripsContainer.pivot.y
        this.currentMask.x = this.x
        this.currentMask.y = this.y
        return this.currentMask
    }

    update(delta) {
        this.currentMask.rotation = this.stripsContainer.rotation;

        if (this.changeLabelTimer <= 0) {
            //this.updateStartLabel();

        } else {
            this.changeLabelTimer -= delta;
        }

        this.resetLabelBack.x = this.resetLabel.x;
        this.resetLabelBack.y = this.resetLabel.y;
        this.resetLabelBack.rotation = this.resetLabel.rotation;
        this.resetLabelBack.text = this.resetLabel.text;

        // this.stripsContainer.rotation += delta * 0.1
        // this.currentMask.rotation = this.stripsContainer.rotation;
        //this.resetLabel.mask = this.currentMask;


    }
    updateStartLabel() {
        if (Math.random() < 0.2) return;
        this.resetLabel.text = window.shuffleText(this.currentButtonLabel, true);
        //this.resetLabel.style.fill = ENEMIES.list[Math.floor(ENEMIES.list.length * Math.random())].color;

        this.changeLabelTimer = 0.5;
    }
    goBack() {
        this.gameScreen.mainmenuState()
    }
    removeEvents() {
        console.log("removeEvents")
        this.backButton.interactive = true;

    }
    addEvents() {
        this.removeEvents();
        console.log("addEvents")
        this.backButton.interactive = true;


    }


}