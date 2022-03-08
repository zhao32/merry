// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import hero from "../hero";
import EventMgr from "../utils/EventMgr";
import GameTools, { gameConfig, gameContext } from "../utils/GameTools";
import operateUI from "./operateUI";
import { State } from "../hero";

const { ccclass, property } = cc._decorator;

@ccclass
export default class NewClass extends cc.Component {

    @property(cc.Label)
    label: cc.Label = null;
    @property
    text: string = 'hello';

    callback: any

    role0: cc.Node
    role1: cc.Node


    page0: cc.Node
    page1: cc.Node

    wave0: cc.Node
    wave1: cc.Node

    distance: number = null

    batHp: cc.Node
    batHpNum: number
    bat: cc.Node

    talkBload: cc.Node
    talkRat: cc.Node
    talkMon: cc.Node


    init(data: any, callback) {
        this.callback = callback
        // this.Restart()
        // this.preStart()
    }

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        this.node.setAnchorPoint(0, 0.5)
        this.node.setPosition(0, 0)
        // this.setSyncPosition()
        gameContext.hasFllow = false

        EventMgr.getInstance().registerListener(EventMgr.TOUCHWAVE, this, this.touchWave.bind(this))
        EventMgr.getInstance().registerListener(EventMgr.RESTART, this, this.Restart.bind(this))
        this.page0 = this.node.getChildByName('page0')
        this.page1 = this.node.getChildByName('page1')
        this.role0 = this.page0.getChildByName('role0')
        this.role1 = this.page0.getChildByName('role1')

        this.wave0 = this.page1.getChildByName('wave0')
        this.wave1 = this.page1.getChildByName('wave1')
        this.batHp = this.page1.getChildByName('batHp')
        this.bat = this.page1.getChildByName('bat')

        this.talkBload = this.node.getChildByName('talkbg')
        this.talkRat = this.talkBload.getChildByName('ratTalk')
        this.talkMon = this.talkBload.getChildByName('monkeyTalk')
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
        console.log('------------------第5关注销监听------------------')
        EventMgr.getInstance().unRegisterListener(EventMgr.TOUCHWAVE, this)
        EventMgr.getInstance().unRegisterListener(EventMgr.RESTART, this)
        GameTools.destroyNode(this.node)
    }


    start() {
        this.Restart()
    }

    // touchBat() {
    //     // let player = gameContext.player as hero
    //     // console.log('攻击蝙蝠')
    //     // console.log('attack:' + player.attack)
    //     // if (player && player.attack == true) {
    //     //     console.log('攻击蝙蝠')
    //     //     player.attack = false
    //     //     this.batHpNum -= 2
    //     //     if (this.batHpNum > 0) {
    //     //         this.batHp.scaleX = this.batHpNum / 20
    //     //     } else {
    //     //         this.batHp.scaleX = 0
    //     //         console.log('打死蝙蝠，通关！')
    //     //     }
    //     // }
    // }

    touchWave() {
        EventMgr.getInstance().sendListener(EventMgr.UPDATESAN, { 'disSan': -3 });
        let operateUI: operateUI = gameContext.operateUI
        if (operateUI.san <= 1) {
            operateUI.san = 9
            // gameContext.showToast('鼠鼠会在暗中支持你！')
            this.showTalkBload(0,'鼠鼠会在暗中支持你！')
            this.scheduleOnce(()=>{
                this.showTalkBload(2)
            },3)
        }
    }



    Restart() {
        this.showTalkBload(2)
        this.unscheduleAllCallbacks()
        gameContext.moveType = 0
        gameConfig.currLevel = 3
        this.distance = 0
        this.batHp.setScale(1)
        this.batHpNum = 20
        this.page0.active = true
        this.page1.active = false
        gameContext.playerNode.active = false
        gameContext.playerNode.setPosition(300, -165);
        EventMgr.getInstance().sendListener(EventMgr.CLOSEOPERATE, {});
        this.preStart()
        GameTools.loadSound('sound/level/4/startbgm', 0, true)
    }

    /**前情提要 */
    preStart() {
        let preTime = 0
        this.role0.scale = 1.5
        this.role0.x = -95
        this.role1.x = 0
        this.bat.y = -90
        this.bat.active = false
        this.wave0.active = false
        this.wave1.active = false

        this.unscheduleAllCallbacks()
        this.role0.stopAllActions()
        this.role1.stopAllActions()
        this.scheduleOnce(() => {
            this.role0.getComponent(cc.Animation)
                .play('walkRight').repeatCount = Infinity
            this.role1.getComponent(cc.Animation)
                .play('ratWalkRight').repeatCount = Infinity
            let moveBy = cc.moveBy(6, new cc.Vec2(900, 0));
            let callF = cc.callFunc(() => {
                this.page0.active = false
                this.page1.active = true
                this.page1.runAction(cc.sequence(cc.delayTime(0.5), cc.blink(1, 5), cc.callFunc(() => {
                    this.showWave()
                    EventMgr.getInstance().sendListener(EventMgr.OPENOPERATE, {
                        left: true,
                        right: true,
                        top: false,
                        down: false,
                        fight: true,
                        jump: true
                    });

                    this.bat.active = true
                })))
                gameContext.playerNode.active = true
                gameContext.player.state = State.standRight
                GameTools.loadSound('sound/level/4/bossbgm', 0, true)


            });
            this.role0.runAction(cc.sequence(moveBy, callF))
            this.role1.runAction(moveBy.clone())
        }, preTime + 1)
    }


    showWave() {
        // this.wave.runAction()
        this.wave0.active = false
        this.wave1.active = false

        let delay0 = cc.delayTime(3)
        let callF0 = cc.callFunc(() => {

            let random = Math.random() * 1
            if (random > 0.5) {
                this.wave0.active = true
                this.wave1.active = false
            } else {
                this.wave0.active = false
                this.wave1.active = true
            }
        })
        let delay1 = cc.delayTime(1)
        let callF1 = cc.callFunc(() => {
            this.wave0.active = false
            this.wave1.active = false
        })
        GameTools.loadSound('sound/level/4/batAttack', 1, false)

        this.node.runAction(cc.repeatForever(cc.sequence(delay0, callF0, delay1, callF1)))
    }

    update(dt) {
        if (gameContext.playerNode.x > 980 && gameContext.playerNode.x < 1110) {
            let player = gameContext.player as hero
            if (player && player.attack == true) {
                console.log('攻击蝙蝠')
                player.attack = false
                this.batHpNum -= 2
                if (this.batHpNum > 0) {
                    this.batHp.scaleX = this.batHpNum / 20
                } else {
                    this.batHp.scaleX = 0
                    let moveby = cc.moveBy(5, new cc.Vec2(0, -500));
                    this.node.stopAllActions()
                    this.wave0.active = this.wave1.active = false
                    let callback = cc.callFunc(() => {
                        GameTools.loadSound('sound/level/4/finish', 1, false)
                        gameConfig.maxLevel = 4
                        cc.director.loadScene("startScene", () => {
                            gameConfig.memoryLength = 4
                            gameConfig.currMemory = 4
                            gameContext.showMemoryUI(true)
                        });
                    })
                    this.setSyncPosition()
                    this.bat.runAction(cc.sequence(moveby, callback))
                    console.log('打死蝙蝠，通关！')
                }
            }
        }
    }

    setSyncPosition() {
        let bodys = this.node.getComponentsInChildren(cc.RigidBody)
        for (let i = 0; i < bodys.length; i++) {
            bodys[i].syncPosition(true)
        }
    }
}
