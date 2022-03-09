// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import EventMgr from "../utils/EventMgr";
import GameTools, { gameConfig, gameContext } from "../utils/GameTools";
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
    // label0: cc.Label
    // label1: cc.Label

    talkBload: cc.Node
    talkRat: cc.Node
    talkMon: cc.Node

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


        // this.label0 = this.page0.getChildByName('label0').getComponent(cc.Label)
        // this.label1 = this.page0.getChildByName('label1').getComponent(cc.Label)
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

        this.talkBload = this.node.getChildByName('talkbg')
        this.talkRat = this.talkBload.getChildByName('ratTalk')
        this.talkMon = this.talkBload.getChildByName('monkeyTalk')
        // gameContext.playerNode.active = false
        // this.schedule(this.tankMove, 10)
    }

    /**type 0 猴 1 鼠 2 隐藏  */
    showTalkBload(type: number, str?: string) {
        if (type == 0) {
            this.talkBload.active = true
            this.talkMon.active = true
            this.talkRat.active = false
            let talkDisplay = this.talkMon.getChildByName('label').getComponent(cc.Label)
            talkDisplay.string = str
        } else if (type == 1) {
            this.talkBload.active = true
            this.talkRat.active = true
            this.talkMon.active = false
            let talkDisplay = this.talkRat.getChildByName('label').getComponent(cc.Label)
            talkDisplay.string = str
        } else {
            this.talkBload.active = false
        }
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

        GameTools.destroyNode(this.node)

    }

    startLeft() {
        this._dir = DIR.LEFT
        GameTools.loadSound('sound/level/7/move', 1, true, null, true)
    }

    endLeft() {
        this._dir = DIR.NULL
    }

    startRight() {
        this._dir = DIR.RIGHT
        GameTools.loadSound('sound/level/7/move', 1, true, null, true)
    }

    endRight() {
        this._dir = DIR.NULL
    }

    startUp() {
        this._dir = DIR.UP
        GameTools.loadSound('sound/level/7/move', 1, true, null, true)
    }
    endUp() {
        this._dir = DIR.NULL
    }

    startDown() {
        this._dir = DIR.DOWN
        GameTools.loadSound('sound/level/7/move', 1, true, null, true)
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
            // this.museum.getComponent(cc.BoxCollider).enabled = false
            this.museum.getChildByName('label').active = true
            this.player.getChildByName('label').active = true
            EventMgr.getInstance().sendListener(EventMgr.UPDATESAN, { 'disSan': -7 });
            let operateUI: operateUI = gameContext.operateUI
            if (operateUI.san <= 1) {
                operateUI.san = 10
                // gameContext.showToast('贴贴')
                this.showTalkBload(1, ':贴贴')
                GameTools.loadSound('sound/level/7/tietie', 1, false)
            }
            this._reachMuseum = true
            GameTools.loadSound('sound/level/7/tanqi', 1, false)
        }
    }

    touchFly() {
        if (!this._reachMuseum || !this._reachYueYang) {
            // gameContext.showToast('还没玩够呢！')
            this.showTalkBload(1, ':还没玩够呢！')
            GameTools.loadSound('sound/level/wechat0', 1, false)
            this.scheduleOnce(() => {
                this.showTalkBload(2)
            }, 2)
        } else if (this._milkNum != 3) {
            // gameContext.showToast('还想喝lai茶')
            this.showTalkBload(1, ':还想喝lai茶')
            GameTools.loadSound('sound/level/wechat0', 1, false)
            this.scheduleOnce(() => {
                this.showTalkBload(2)
            }, 2)
        } else {
            GameTools.loadSound('sound/level/7/fly', 1, false)
            gameConfig.maxLevel = 7
            gameConfig.memoryLength = 7
            gameConfig.currMemory = 7
            this.scheduleOnce(() => {
                cc.director.loadScene("startScene", () => {
                    gameContext.showMemoryUI(true)
                });
            }, 3)

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
                // gameContext.showToast('贴贴')
                this.showTalkBload(1, ':贴贴')
                GameTools.loadSound('sound/level/7/tietie', 1, false)
                // GameTools.loadSound('sound/level/wechat0', 1, false)
            }
            this._reachYueYang = true
            GameTools.loadSound('sound/level/7/tanqi', 1, false)

        }
    }

    touchMilk() {
        this._milkNum++
        EventMgr.getInstance().sendListener(EventMgr.UPDATESAN, { 'disSan': 1 });
        GameTools.loadSound('sound/level/7/get', 1, false)

    }

    start() {
        this.Restart()
    }

    Restart() {
        this.showTalkBload(2)
        this.unscheduleAllCallbacks()
        gameContext.moveType = 0
        this.op.active = false
        this.role.active = false
        this.fly.x = -800

        this._reachMuseum = false
        this._reachYueYang = false
        this._milkNum = 0
        // this.label0.string = this.label1.string = ''

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
            // this.label0.string = '【鼠鼠】:好喝奶茶我来了！'
            this.showTalkBload(1, ':好喝奶茶我来了！')
            GameTools.loadSound('sound/level/wechat0', 1, false)
        })))
        GameTools.loadSound('sound/level/7/fly', 1, false)


        console.log('播放音效')
        this.scheduleOnce(() => {
            this.page1.active = true
            this.op.active = true
            this.showTalkBload(2)
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


    // setSyncPosition() {
    //     let bodys = this.node.getComponentsInChildren(cc.RigidBody)
    //     for (let i = 0; i < bodys.length; i++) {
    //         bodys[i].syncPosition(true)
    //     }
    // }
}
