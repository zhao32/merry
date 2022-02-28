// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import hero from "../hero";
import EventMgr from "../utils/EventMgr";
import { gameConfig, gameContext } from "../utils/GameTools";
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
    }

    onDisable(){
        console.log('------------------第5关注销监听------------------')
        EventMgr.getInstance().unRegisterListener(EventMgr.TOUCHWAVE, this)
        EventMgr.getInstance().unRegisterListener(EventMgr.RESTART, this)
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
            gameContext.showToast('鼠鼠会在暗中支持你！')
        }
    }



    Restart() {
        gameContext.moveType = 0
        gameConfig.currLevel = 4
        this.distance = 0
        this.batHp.setScale(1)
        this.batHpNum = 20
        this.page0.active = true
        this.page1.active = false
        gameContext.playerNode.active = false
        gameContext.playerNode.setPosition(300, -165);
        EventMgr.getInstance().sendListener(EventMgr.CLOSEOPERATE, {});
        this.preStart()
    }

    /**前情提要 */
    preStart() {
        let preTime = 0
        this.role0.scale = 1.5
        this.role0.x = -95
        this.role1.x = 0
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
                this.showWave()

                EventMgr.getInstance().sendListener(EventMgr.OPENOPERATE, {
                    left: true,
                    right: true,
                    top: false,
                    down: false,
                    fight: true,
                    jump: true
                });
                gameContext.playerNode.active = true
                gameContext.player.state = State.standRight
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
                    console.log('打死蝙蝠，通关！')
                    gameConfig.maxLevel = 5
                    cc.director.loadScene("startScene", () => {
                        gameContext.memoryLength = 5
                        gameContext.showMemoryUI()
                    });

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
