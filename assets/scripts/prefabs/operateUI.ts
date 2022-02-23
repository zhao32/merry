// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import hero, { State } from "../hero";
import EventMgr from "../utils/EventMgr";
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
    btnDown: cc.Node = null;

    @property(cc.Node)
    btnFight: cc.Node = null;

    @property(cc.Node)
    btnJump: cc.Node = null;



    @property(cc.Node)
    btnMusic: cc.Node = null;

    @property(cc.Node)
    blood: cc.Node = null;

    @property(cc.Node)
    role: cc.Node = null;

    _canOperate: boolean

    _san: number = 10

    _preState: number = 0

    _fightTouch: boolean = true

    public set canOperate(open: boolean) {
        this._canOperate = open
    }

    public get canOperate() {
        return this._canOperate
    }

    public resetBtn(self, parms) {
        console.log('执行OPENOPERATE')
        this._canOperate = true
        console.log('重置按钮状态')
        this.btnLeft.active = parms.left
        this.btnRight.active = parms.right
        this.btnUp.active = parms.up
        this.btnDown.active = parms.down
        this.btnJump.active = parms.jump
        this.btnFight.active = parms.fight
        let btnBg0 = this.node.getChildByName('btnBg0')
        let btnBg1 = this.node.getChildByName('btnBg1')
        if (!parms.jump && !parms.fight) btnBg1.active = false
        else btnBg1.active = true
        btnBg0.active = true
    }

    public set san(num: number) {
        this._san += num
        this._san = Math.min(10, this._san)
        this._san = Math.max(0, this._san)
        this.blood.width = 240 * (this._san / 10)
    }

    private updateSan(self, params) {
        if (!this._san) this._san = 10
        this._san += params.disSan
        this._san = Math.min(10, this._san)
        this._san = Math.max(0, this._san)
        this.blood.width = 240 * (this._san / 10)
        console.log('this._san:' + this._san)
    }

    public get san() {
        return this._san
    }

    // private openOperate() {
    //     this._canOperate = true
    //     let btnBg0 = this.node.getChildByName('btnBg0')
    //     let btnBg1 = this.node.getChildByName('btnBg1')
    //     btnBg0.active = btnBg1.active = true
    //     console.log('打开玩家操作')
    // }

    private closeOperate() {
        this._canOperate = false
        let btnBg0 = this.node.getChildByName('btnBg0')
        let btnBg1 = this.node.getChildByName('btnBg1')
        btnBg0.active = btnBg1.active = false
        console.log('关闭玩家操作')
    }

    callback: any

    init(data: any, callback) {
        this.callback = callback
        this._canOperate = false
        this.displayLevel.string = `第${gameConfig.currLevel + 1}关`
        GameTools.loadItemIcon(`pic/role${gameConfig.levelData[gameConfig.currLevel].role}`, this.role)
    }

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        this.san = 10
        this._fightTouch = true

        this.btnLeft.on(cc.Node.EventType.TOUCH_START, this.startLeft, this)
        this.btnLeft.on(cc.Node.EventType.TOUCH_END, this.endLeft, this)
        this.btnLeft.on(cc.Node.EventType.TOUCH_CANCEL, this.endLeft, this)

        this.btnRight.on(cc.Node.EventType.TOUCH_START, this.startRight, this)
        this.btnRight.on(cc.Node.EventType.TOUCH_END, this.endRight, this)
        this.btnRight.on(cc.Node.EventType.TOUCH_CANCEL, this.endRight, this)

        this.btnFight.on(cc.Node.EventType.TOUCH_START, this.startFight, this)
        this.btnFight.on(cc.Node.EventType.TOUCH_END, this.endFight, this)
        // this.btnFight.on(cc.Node.EventType.TOUCH_CANCEL, this.endFight, this)


        this.btnJump.on(cc.Node.EventType.TOUCH_END, this.endJump, this)
        this.btnMusic.on(cc.Node.EventType.TOUCH_END, this.checkMusic, this)
        this.btnPause.on(cc.Node.EventType.TOUCH_END, this.checkPause, this)
        this.btnReplay.on(cc.Node.EventType.TOUCH_END, this.doReplay, this)
        this.btnHome.on(cc.Node.EventType.TOUCH_END, this.doHome, this)

        EventMgr.getInstance().registerListener(EventMgr.CLOSEOPERATE, this, this.closeOperate.bind(this))

        EventMgr.getInstance().registerListener(EventMgr.UPDATESAN, this, this.updateSan.bind(this))
        console.log('注册OPENOPERATE')
        EventMgr.getInstance().registerListener(EventMgr.OPENOPERATE, this, this.resetBtn.bind(this))

        let btnBg0 = this.node.getChildByName('btnBg0')
        let btnBg1 = this.node.getChildByName('btnBg1')
        btnBg0.active = btnBg1.active = false


    }

    onDisable() {
        console.log('注销OP监听')
        EventMgr.getInstance().unRegisterListener(EventMgr.CLOSEOPERATE, this)
        EventMgr.getInstance().unRegisterListener(EventMgr.UPDATESAN, this)
        EventMgr.getInstance().unRegisterListener(EventMgr.OPENOPERATE, this)

    }

    setHp() {

    }

    startLeft() {
        if (!this._canOperate) return
        (gameContext.player as hero).state = State.walkLeft
    }

    endLeft() {
        if (!this._canOperate) return
        (gameContext.player as hero).state = State.standLeft
    }

    startRight() {
        if (!this._canOperate) return
        (gameContext.player as hero).state = State.walkRight
    }

    endRight() {
        if (!this._canOperate) return
        (gameContext.player as hero).state = State.standRight
    }

    endJump() {
        if (!this._canOperate) return
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

    startFight() {
        if (!this._canOperate) return
        if (this._fightTouch == true) {
            this._fightTouch = false

            this.scheduleOnce(() => {
                this._fightTouch = true
            }, 1)
            this._preState = (gameContext.player as hero)._state as number
            (gameContext.player as hero).state = State.fight
        } else {
            gameContext.showToast('冷却时间1s')

        }


    }

    endFight() {
        if (!this._canOperate) return
        (gameContext.player as hero).state = this._preState
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

        EventMgr.getInstance().sendListener(EventMgr.RESTART, {});
        console.log('重新开始游戏')
    }

    doHome() {
        cc.director.loadScene("startScene");

    }

    start() {



    }

    // update (dt) {}
}
