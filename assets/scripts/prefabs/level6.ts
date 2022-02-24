// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import EventMgr from "../utils/EventMgr";
import { gameConfig, gameContext } from "../utils/GameTools";
export enum DIR {
    UP,
    DOWN,
    LEFT,
    RIGHT,
    NULL,
}

const { ccclass, property } = cc._decorator;
import operateUI from "./operateUI";

@ccclass
export default class NewClass extends cc.Component {

    @property(cc.Label)
    label: cc.Label = null;

    @property
    text: string = 'hello';

    callback: any

    player: cc.Node
    page0: cc.Node
    page1: cc.Node
    label0: cc.Label
    label1: cc.Label

    op: cc.Node
    btnUp: cc.Node
    btnDown: cc.Node
    btnLeft: cc.Node
    btnRight: cc.Node

    _dir: number
    _dis: number

    _reachYueYang: boolean
    _reachMuseum: boolean
    _milkNum: number

    milk0: cc.Node
    milk1: cc.Node
    milk2: cc.Node
    yueyang: cc.Node
    museum: cc.Node

    fly: cc.Node
    role: cc.Node

    init(data: any, callback) {
        this.callback = callback
        // this.Restart()
        // this.preStart()

    }
    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        this._dis = 5
        this.node.setAnchorPoint(0, 0.5)
        this.node.setPosition(0, 0)
        gameContext.hasFllow = false
        // gameContext.currLevelScript = this.node.getComponent('level0')
        EventMgr.getInstance().registerListener(EventMgr.RESTART, this, this.Restart.bind(this))
        EventMgr.getInstance().registerListener(EventMgr.MISSSTONE, this, this.touchStone.bind(this))
        EventMgr.getInstance().registerListener(EventMgr.MISSSMUSEUM, this, this.touchMuseum.bind(this))
        EventMgr.getInstance().registerListener(EventMgr.MISSSSFLY, this, this.touchFly.bind(this))
        EventMgr.getInstance().registerListener(EventMgr.MISSSSTAB, this, this.touchStab.bind(this))
        EventMgr.getInstance().registerListener(EventMgr.MISSSYUYANG, this, this.touchYueYang.bind(this))
        EventMgr.getInstance().registerListener(EventMgr.MISSSMILK, this, this.touchMilk.bind(this))

        EventMgr.getInstance().sendListener(EventMgr.CLOSEOPERATE, {});


        this.page0 = this.node.getChildByName('page0')
        this.page1 = this.node.getChildByName('page1')

        this.fly = this.page0.getChildByName('fly')
        this.role = this.page0.getChildByName('role')


        this.label0 = this.page0.getChildByName('label0').getComponent(cc.Label)
        this.label1 = this.page0.getChildByName('label1').getComponent(cc.Label)
        this.op = this.node.getChildByName('op')
        this.btnLeft = this.op.getChildByName('left')
        this.btnRight = this.op.getChildByName('right')
        this.btnUp = this.op.getChildByName('up')
        this.btnDown = this.op.getChildByName('down')
        this.player = this.page1.getChildByName('icon')

        this.milk0 = this.page1.getChildByName('milk0')
        this.milk1 = this.page1.getChildByName('milk1')
        this.milk2 = this.page1.getChildByName('milk2')
        this.museum = this.page1.getChildByName('museum')
        this.yueyang = this.page1.getChildByName('yuyang')

        this.btnLeft.on(cc.Node.EventType.TOUCH_START, this.startLeft, this)
        this.btnLeft.on(cc.Node.EventType.TOUCH_END, this.endLeft, this)
        this.btnLeft.on(cc.Node.EventType.TOUCH_CANCEL, this.endLeft, this)

        this.btnRight.on(cc.Node.EventType.TOUCH_START, this.startRight, this)
        this.btnRight.on(cc.Node.EventType.TOUCH_END, this.endRight, this)
        this.btnRight.on(cc.Node.EventType.TOUCH_CANCEL, this.endRight, this)

        this.btnUp.on(cc.Node.EventType.TOUCH_START, this.startUp, this)
        this.btnUp.on(cc.Node.EventType.TOUCH_END, this.endUp, this)
        this.btnUp.on(cc.Node.EventType.TOUCH_CANCEL, this.endUp, this)

        this.btnDown.on(cc.Node.EventType.TOUCH_START, this.startDown, this)
        this.btnDown.on(cc.Node.EventType.TOUCH_END, this.endDown, this)
        this.btnDown.on(cc.Node.EventType.TOUCH_CANCEL, this.endDown, this)

        // gameContext.playerNode.active = false
        // this.schedule(this.tankMove, 10)
    }


    onDisable() {
        console.log('------------------第7关注销监听------------------')
        EventMgr.getInstance().unRegisterListener(EventMgr.RESTART, this)
        EventMgr.getInstance().unRegisterListener(EventMgr.MISSSTONE, this)
        EventMgr.getInstance().unRegisterListener(EventMgr.MISSSMUSEUM, this)
        EventMgr.getInstance().unRegisterListener(EventMgr.MISSSSFLY, this)
        EventMgr.getInstance().unRegisterListener(EventMgr.MISSSSTAB, this)
        EventMgr.getInstance().unRegisterListener(EventMgr.MISSSYUYANG, this)
        EventMgr.getInstance().unRegisterListener(EventMgr.MISSSMILK, this)

        this.btnDown.off(cc.Node.EventType.TOUCH_START)
        this.btnDown.off(cc.Node.EventType.TOUCH_CANCEL)
        this.btnDown.off(cc.Node.EventType.TOUCH_END)

        this.btnUp.off(cc.Node.EventType.TOUCH_START)
        this.btnUp.off(cc.Node.EventType.TOUCH_CANCEL)
        this.btnUp.off(cc.Node.EventType.TOUCH_END)

        this.btnLeft.off(cc.Node.EventType.TOUCH_START)
        this.btnLeft.off(cc.Node.EventType.TOUCH_CANCEL)
        this.btnLeft.off(cc.Node.EventType.TOUCH_END)

        this.btnRight.off(cc.Node.EventType.TOUCH_START)
        this.btnRight.off(cc.Node.EventType.TOUCH_CANCEL)
        this.btnRight.off(cc.Node.EventType.TOUCH_END)
    }

    startLeft() {
        this._dir = DIR.LEFT
    }

    endLeft() {
        this._dir = DIR.NULL
    }

    startRight() {
        this._dir = DIR.RIGHT
    }

    endRight() {
        this._dir = DIR.NULL
    }

    startUp() {
        this._dir = DIR.UP
    }
    endUp() {
        this._dir = DIR.NULL
    }

    startDown() {
        this._dir = DIR.DOWN
    }

    endDown() {
        this._dir = DIR.NULL
    }

    touchStone() {
        if (this._dir == DIR.LEFT) {
            this.player.x += this._dis
        } else if (this._dir == DIR.RIGHT) {
            this.player.x -= this._dis
        } else if (this._dir == DIR.UP) {
            this.player.y -= this._dis
        } else if (this._dir == DIR.DOWN) {
            this.player.y += this._dis
        }
        this._dir = DIR.NULL

    }

    touchMuseum() {
        if (!this._reachMuseum) {
            this.museum.getChildByName('label').active = true
            this.player.getChildByName('label').active = true
            EventMgr.getInstance().sendListener(EventMgr.UPDATESAN, { 'disSan': -7 });
            let operateUI: operateUI = gameContext.operateUI
            if (operateUI.san <= 1) {
                operateUI.san = 10
                gameContext.showToast('贴贴')
            }
            this._reachMuseum = true
        }
    }

    touchFly() {
        if (!this._reachMuseum || !this._reachYueYang) {
            gameContext.showToast('还没玩够呢！')
        } else if (this._milkNum != 2) {
            gameContext.showToast('还想喝lai茶')

        } else {
            gameConfig.maxLevel = 7
            cc.director.loadScene("startScene", () => {
                gameContext.memoryLength = 7
                gameContext.showMemoryUI()
            });
        }

    }

    touchStab() {

    }

    touchYueYang() {
        if (!this._reachYueYang) {
            this.yueyang.getChildByName('label').active = true
            this.player.getChildByName('label').active = true
            EventMgr.getInstance().sendListener(EventMgr.UPDATESAN, { 'disSan': -7 });
            let operateUI: operateUI = gameContext.operateUI
            if (operateUI.san <= 1) {
                operateUI.san = 10
                gameContext.showToast('贴贴')
            }
            this._reachYueYang = true
        }
    }

    touchMilk() {
        this._milkNum++
        EventMgr.getInstance().sendListener(EventMgr.UPDATESAN, { 'disSan': 1 });
    }




    start() {
        this.Restart()
    }

    Restart() {
        gameContext.moveType = 0
        this.op.active = false
        this.role.active = false
        this.fly.x = -800

        this._reachMuseum = false
        this._reachYueYang = false
        this._milkNum = 0
        this.label0.string = this.label1.string = ''

        this.page0.active = true
        this.page1.active = false
        this.page1.setPosition(1334, 375)
        this.player.setPosition(-1200, -500)
        this.milk0.active = true
        this.milk1.active = true
        this.milk2.active = true
        this.museum.getChildByName('label').active = false
        this.player.getChildByName('label').active = false
        this.yueyang.getChildByName('label').active = false


        gameConfig.currLevel = 6
        EventMgr.getInstance().sendListener(EventMgr.CLOSEOPERATE, {});
        this.preStart()
    }

    /**前情提要 */
    preStart() {
        this.fly.runAction(cc.sequence(cc.moveTo(3, new cc.Vec2(1200, 0)), cc.callFunc(() => {
            this.role.active = true
            this.label0.string = '【鼠鼠】:好喝奶茶我来了！'
        })))

        console.log('播放音效')
        this.scheduleOnce(() => {
            this.page1.active = true
            this.op.active = true
        }, 6)

    }

    update(dt) {
        if (this._dir == DIR.UP) {
            if (this.player.y < 750) this.player.y += this._dis
            // console.log('this.player.y:' + this.player.y)
        } else if (this._dir == DIR.DOWN) {
            if (this.player.y > -750) this.player.y -= this._dis
            // console.log('this.player.y:' + this.player.y)
        } else if (this._dir == DIR.LEFT) {
            if (this.player.x > -1334) this.player.x -= this._dis
            // console.log('this.player.x:' + this.player.x)
        } else if (this._dir == DIR.RIGHT) {
            if (this.player.x < 1334) this.player.x += this._dis
            // console.log('this.player.x:' + this.player.x)
        }

        if (this._dir == DIR.RIGHT && this.page1.x == 1334 && this.player.x >= 0) {
            this._dir = DIR.NULL
            this.page1.x = 0
        }

        if (this._dir == DIR.LEFT && this.page1.x == 0 && this.player.x <= 0) {
            this._dir = DIR.NULL
            this.page1.x = 1334
        }

        if (this._dir == DIR.UP && this.page1.y == 375 && this.player.y >= 0) {
            this._dir = DIR.NULL
            this.page1.y = -375
        }

        if (this._dir == DIR.DOWN && this.page1.y == -375 && this.player.y <= 0) {
            this._dir = DIR.NULL
            this.page1.y = 375
        }
    }


    setSyncPosition() {
        let bodys = this.node.getComponentsInChildren(cc.RigidBody)
        for (let i = 0; i < bodys.length; i++) {
            bodys[i].syncPosition(true)
        }
    }
}
