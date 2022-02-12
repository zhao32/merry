// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import hero, { State } from "../hero";
import GameTools, { gameConfig, gameContext } from "../utils/GameTools";

const { ccclass, property } = cc._decorator;

@ccclass
export default class NewClass extends cc.Component {

    @property(cc.Label)
    displayLevel: cc.Label = null;

    @property
    text: string = 'hello';

    @property(cc.Node)
    btnPause: cc.Node = null;

    @property(cc.Node)
    btnReplay: cc.Node = null;

    @property(cc.Node)
    btnHome: cc.Node = null;

    @property(cc.Node)
    btnLeft: cc.Node = null;

    @property(cc.Node)
    btnRight: cc.Node = null;

    @property(cc.Node)
    btnUp: cc.Node = null;

    @property(cc.Node)
    btnMusic: cc.Node = null;

    @property(cc.Node)
    blood: cc.Node = null;

    @property(cc.Node)
    role: cc.Node = null;

    callback: any

    init(data: any, callback) {
        this.callback = callback
        this.displayLevel.string = `第${gameConfig.currLevel + 1}关`

        GameTools.loadItemIcon(`pic/role${gameConfig.levelData[gameConfig.currLevel].role}`, this.role)
    }


    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        this.btnLeft.on(cc.Node.EventType.TOUCH_START, this.startLeft, this)
        this.btnLeft.on(cc.Node.EventType.TOUCH_END, this.endLeft, this)
        this.btnLeft.on(cc.Node.EventType.TOUCH_CANCEL, this.endLeft, this)

        this.btnRight.on(cc.Node.EventType.TOUCH_START, this.startRight, this)
        this.btnRight.on(cc.Node.EventType.TOUCH_END, this.endRight, this)
        this.btnRight.on(cc.Node.EventType.TOUCH_CANCEL, this.endRight, this)

        this.btnUp.on(cc.Node.EventType.TOUCH_END, this.endUp, this)
        this.btnMusic.on(cc.Node.EventType.TOUCH_END, this.checkMusic, this)
        this.btnPause.on(cc.Node.EventType.TOUCH_END, this.checkPause, this)
        this.btnReplay.on(cc.Node.EventType.TOUCH_END, this.doReplay, this)
        this.btnHome.on(cc.Node.EventType.TOUCH_END, this.doHome, this)
    }

    setHp() {

    }

    startLeft() {
        (gameContext.player as hero).state = State.walkLeft
    }

    endLeft() {
        (gameContext.player as hero).state = State.standLeft
    }

    startRight() {
        (gameContext.player as hero).state = State.walkRight
    }

    endRight() {
        (gameContext.player as hero).state = State.standRight
    }

    endUp() {
        if ((gameContext.player as hero).state == State.walkLeft) {
            (gameContext.player as hero).isMove = true;
            (gameContext.player as hero).state = State.jumpLeft
        } else if ((gameContext.player as hero).state == State.walkRight) {
            (gameContext.player as hero).isMove = true;
            (gameContext.player as hero).state = State.jumpRight
        } else if ((gameContext.player as hero).state == State.standLeft) {
            (gameContext.player as hero).isMove = false;
            (gameContext.player as hero).state = State.jumpLeft
        } else if ((gameContext.player as hero).state == State.standRight) {
            (gameContext.player as hero).isMove = false;
            (gameContext.player as hero).state = State.jumpRight
        }
    }

    checkMusic() {
        let frame: string
        if (gameContext.isPlayMusic) {
            gameContext.isPlayMusic = false
            frame = 'pic/checkMusic1'
            cc.audioEngine.pauseMusic()
        } else {
            gameContext.isPlayMusic = true
            frame = 'pic/checkMusic0'
            cc.audioEngine.resumeMusic()
        }
        let sprite = this.btnMusic.getComponent(cc.Sprite) as cc.Sprite;
        cc.resources.load(frame, cc.SpriteFrame, (err, spriteFrame) => {
            sprite.spriteFrame = spriteFrame as any;
        });
    }

    checkPause() {
        let frame: string
        if (gameContext.isPause) {
            gameContext.isPause = false
            frame = 'pic/kongzhi-2'
            cc.director.resume()
        } else {
            gameContext.isPause = true
            frame = 'pic/kongzhi-3'
            cc.director.pause()
        }
        let sprite = this.btnPause.getComponent(cc.Sprite) as cc.Sprite;
        cc.resources.load(frame, cc.SpriteFrame, (err, spriteFrame) => {
            sprite.spriteFrame = spriteFrame as any;
        });
    }

    doReplay() {

    }

    doHome() {
        cc.director.loadScene("startScene");

    }

    start() {

    }

    // update (dt) {}
}
