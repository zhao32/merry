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

    @property(cc.Prefab)
    boxPfb: cc.Prefab = null;

    callback: any

    page0: cc.Node
    page1: cc.Node
    label0: cc.Label
    label1: cc.Label

    hpNum: number

    tank: cc.Node
    arm: cc.Node
    armRight: cc.Node
    tankHp: cc.Node
    tankHpNum: number

    _touchArmLeft: boolean
    _touchArmRight: boolean

    boxList = []

    init(data: any, callback) {
        this.callback = callback
    }
    createrBox() {
        for (let i = 0; i < 10; i++) {
            let box = cc.instantiate(this.boxPfb)
            this.boxList.push(box)
            box.setPosition(200 + Math.random() * 1000, 500 + Math.random() * 500)
            this.node.addChild(box)
        }
    }


    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        this.node.setAnchorPoint(0, 0.5)
        this.node.setPosition(0, 0)
        // this.setSyncPosition()
        gameContext.hasFllow = true
        // gameContext.currLevelScript = this.node.getComponent('level0')
        EventMgr.getInstance().registerListener(EventMgr.RESTART, this, this.Restart.bind(this))
        EventMgr.getInstance().registerListener(EventMgr.TOUCHTANKARM, this, this.touchArm.bind(this))
        EventMgr.getInstance().sendListener(EventMgr.CLOSEOPERATE, {});

        this.createrBox()
        this.page0 = this.node.getChildByName('page0')
        this.page1 = this.node.getChildByName('page1')

        this.label0 = this.page0.getChildByName('label0').getComponent(cc.Label)
        this.label1 = this.page0.getChildByName('label1').getComponent(cc.Label)

        this.tank = this.page1.getChildByName('tank')
        this.arm = this.page1.getChildByName('arm')
        this.armRight = this.page1.getChildByName('armRight')

        this.tankHp = this.page1.getChildByName('tankHp')

    }

    onDisable() {
        console.log('------------------第8关注销监听------------------')
        EventMgr.getInstance().unRegisterListener(EventMgr.TOUCHTANKARM, this)
        EventMgr.getInstance().unRegisterListener(EventMgr.RESTART, this)

        while (this.boxList.length > 0) {
            let node = this.boxList.pop()
            if (node) node.destroy()
        }
    }



    start() {
        this.Restart()
    }

    Restart() {
        gameContext.moveType = 0
        this.unschedule(this.tankMove)
        this.tank.stopAllActions()
        this.tank.x = 60
        this.tankHpNum = 20
        this.tankHp.scaleX = 1

        this.label0.string = this.label1.string = ''

        this.page0.active = true
        this.page1.active = false
        this.hpNum = 10
        this.arm.stopAllActions()
        this.arm.opacity = 0
        this.arm.x = -100


        this._touchArmLeft = false
        this._touchArmRight = false

        this.tank.getChildByName('front').getComponent(cc.Animation).play('frontNo')
        this.tank.getChildByName('back').getComponent(cc.Animation).play('backNo')

        this.schedule(this.tankMove, 10)
        this.armAttack()

        gameConfig.currLevel = 7
        gameContext.playerNode.setPosition(100, -165)
        gameContext.playerNode.active = false
        EventMgr.getInstance().sendListener(EventMgr.CLOSEOPERATE, {});
        this.preStart()
    }

    /**前情提要 */
    preStart() {
        let preTime = 1
        this.scheduleOnce(() => {
            // this.weChatLeft.active = true
            // console.log('播放音效')
            this.label0.string = '【猴】:装修太累了吧！'
        }, preTime)
        console.log('播放音效')
        this.scheduleOnce(() => {
            this.page0.runAction(cc.sequence(cc.fadeOut(2), cc.callFunc(() => {
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
                this.page1.active = true
            })))

        }, preTime + 2)

    }

    touchArm() {
        // console.log('手臂攻击')
        // if (this.arm.opacity == 1) {
        //     this.arm.opacity = 0
        //     EventMgr.getInstance().sendListener(EventMgr.UPDATESAN, { 'disSan': -2 });
        //     let operateUI: operateUI = gameContext.operateUI
        //     if (operateUI.san <= 1) {
        //         operateUI.san = 9
        //         gameContext.showToast('鼠鼠会在暗中支持你！')
        //     }
        // }

        // if (this.armRight.opacity == 1) {
        //     this.armRight.opacity = 0
        //     EventMgr.getInstance().sendListener(EventMgr.UPDATESAN, { 'disSan': -2 });
        //     let operateUI: operateUI = gameContext.operateUI
        //     if (operateUI.san <= 1) {
        //         operateUI.san = 9
        //         gameContext.showToast('鼠鼠会在暗中支持你！')
        //     }
        // }
    }

    tankMove() {
        let list = [1, 2, 3, -1, -2, -3]
        let ids = list[Math.floor(Math.random() * list.length)] * 220

        let move0 = cc.moveBy(2, new cc.Vec2(ids, 0))
        let delay = cc.delayTime(1)
        let move2 = cc.moveBy(2, new cc.Vec2(-ids, 0))
        // this.arm.getComponent(cc.RigidBody).syncPosition(true)
        let ani0 = cc.sequence(move0, delay, move2)
        let ani1 = ani0.clone()
        this.tank.runAction(ani0)
        this.arm.runAction(ani1)
        this.armRight.runAction(ani1.clone())
    }

    armAttack() {
        let callF0 = cc.callFunc(() => {
            this.arm.opacity = 1
            this.armRight.opacity = 0
            this._touchArmLeft = false
            this._touchArmRight = false

            this.tank.getChildByName('front').getComponent(cc.Animation).play('frontAttack')
            this.tank.getChildByName('back').getComponent(cc.Animation).play('backNo')

        })

        let delay0 = cc.delayTime(2)
        let delay1 = cc.delayTime(1)

        let callF1 = cc.callFunc(() => {
            this.arm.opacity = 0
            this.armRight.opacity = 1
            this._touchArmLeft = false
            this._touchArmRight = false
            this.tank.getChildByName('front').getComponent(cc.Animation).play('frontNo')
            this.tank.getChildByName('back').getComponent(cc.Animation).play('backAttack')

        })
        this.arm.runAction(cc.repeatForever(cc.sequence(delay0, callF0, delay1, callF1)))
    }


    update(dt) {
        let armPos = this.page1.convertToWorldSpaceAR(this.arm.getPosition());
        let armRightPos = this.page1.convertToWorldSpaceAR(this.armRight.getPosition());
        
        if (this._touchArmRight == false && Math.abs(armRightPos.x - gameContext.playerNode.x) < 100) {
            this._touchArmRight = true
            EventMgr.getInstance().sendListener(EventMgr.UPDATESAN, { 'disSan': -2 });
            let operateUI: operateUI = gameContext.operateUI
            if (operateUI.san <= 2) {
                operateUI.san = 10
                gameContext.showToast('淘宝达鼠')
                for (let i = 0; i < this.boxList.length; i++) {
                    let box = this.boxList[i]
                    cc.tween(box)
                        .by(2 + Math.random() * 2, { position: cc.v3(0, -1400, 0) }, { easing: 'CubicIn' })
                        .call(() => {
                            box.y += 1400
                            if (i == 0) {
                                console.log('游戏完成')
                                gameConfig.maxLevel = 8

                                cc.director.loadScene("startScene", () => {
                                    gameContext.memoryLength = 8
                                    gameContext.showMemoryUI()
                                });
                            }
                        })
                        .start()
                }
            }
        }


        if (this._touchArmLeft == false && Math.abs(armPos.x - gameContext.playerNode.x) < 100) {
            this._touchArmLeft = true
            EventMgr.getInstance().sendListener(EventMgr.UPDATESAN, { 'disSan': -2 });
            let operateUI: operateUI = gameContext.operateUI
            if (operateUI.san <= 2) {
                operateUI.san = 10
                gameContext.showToast('淘宝达鼠')
                for (let i = 0; i < this.boxList.length; i++) {
                    let box = this.boxList[i]
                    cc.tween(box)
                        .by(2 + Math.random() * 2, { position: cc.v3(0, -1400, 0) }, { easing: 'CubicIn' })
                        .call(() => {
                            box.y += 1400
                            if (i == 0) {
                                console.log('游戏完成')
                                gameConfig.maxLevel = 8

                                cc.director.loadScene("startScene", () => {
                                    gameContext.memoryLength = 8
                                    gameContext.showMemoryUI()
                                });
                            }
                        })
                        .start()
                }
            }
        }

       

        let tankPos = this.page1.convertToWorldSpaceAR(this.arm.getPosition())
        if (Math.abs(tankPos.x - gameContext.playerNode.x) < 100) {
            let player = gameContext.player as hero
            if (player && player.attack == true) {
                console.log('攻击蝙蝠')
                player.attack = false
                this.tankHpNum -= 2
                if (this.tankHpNum > 0) {
                    this.tankHp.scaleX = this.tankHpNum / 20
                } else {
                    this.tankHp.scaleX = 0
                    console.log('打死装修怪，通关！')
                    gameConfig.maxLevel = 8
                    cc.director.loadScene("startScene", () => {
                        gameContext.memoryLength = 8
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
