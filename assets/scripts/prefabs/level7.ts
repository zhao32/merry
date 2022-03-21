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

    @property(cc.Prefab)
    boxPfb: cc.Prefab = null;

    callback: any

    page0: cc.Node
    page1: cc.Node
    // label0: cc.Label
    // label1: cc.Label

    hpNum: number

    tank: cc.Node
    arm: cc.Node
    armRight: cc.Node
    tankHp: cc.Node
    tankHpNum: number

    talkBload: cc.Node
    talkRat: cc.Node
    talkMon: cc.Node
    // talkDisplay: cc.Label

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
        cc.audioEngine.stopAll()
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

        // this.label0 = this.page0.getChildByName('label0').getComponent(cc.Label)
        // this.label1 = this.page0.getChildByName('label1').getComponent(cc.Label)

        this.tank = this.page1.getChildByName('tank')
        this.arm = this.page1.getChildByName('arm')
        this.armRight = this.page1.getChildByName('armRight')

        this.tankHp = this.page1.getChildByName('tankHp')
        this.talkBload = this.node.getChildByName('talkbg')
        this.talkRat = this.talkBload.getChildByName('ratTalk')
        this.talkMon = this.talkBload.getChildByName('monkeyTalk')

    }
    /**type 0 猴 1 鼠 2 隐藏  */
    showTalkBload(type: number, str?: string) {
        this.talkBload.parent = this.node.parent.parent
        this.talkBload.x = 0
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
        console.log('------------------第8关注销监听------------------')
        EventMgr.getInstance().unRegisterListener(EventMgr.TOUCHTANKARM, this)
        EventMgr.getInstance().unRegisterListener(EventMgr.RESTART, this)

        while (this.boxList.length > 0) {
            let node = this.boxList.pop()
            if (node) node.destroy()
        }

        GameTools.destroyNode(this.node)
    }



    start() {
        this.Restart()
    }

    Restart() {
        let operateUI: operateUI = gameContext.operateUI
        if (operateUI) operateUI.san = 10

        this.showTalkBload(2)
        this.unscheduleAllCallbacks()
        gameContext.moveType = 0
        this.unschedule(this.tankMove)
        this.tank.stopAllActions()
        this.tank.x = 60
        this.tankHpNum = 20
        this.tankHp.scaleX = 1

        // this.label0.string = this.label1.string = ''

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

        this.armAttack()

        gameConfig.currLevel = 7
        gameContext.playerNode.setPosition(100, -165)
        gameContext.playerNode.active = false
        gameContext.playerNode.getChildByName('fllow').getChildByName('blood').active = false
        EventMgr.getInstance().sendListener(EventMgr.CLOSEOPERATE, {});
        this.preStart()
    }

    /**前情提要 */
    preStart() {
        let preTime = 1
        this.scheduleOnce(() => {
            // this.weChatLeft.active = true
            // console.log('播放音效')
            // this.label0.string = '【猴】:装修太累了吧！'
            this.showTalkBload(0, ':装修太累了吧，睡一会儿休息一下zzz....')

        }, preTime)
        console.log('播放音效')
        this.scheduleOnce(() => {
            this.showTalkBload(2)
            GameTools.loadSound('sound/level/8/hulu', 1, false)
            this.schedule(this.tankMove, 10)
        }, preTime + 4)

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


        }, 11)

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
        GameTools.loadSound('sound/level/8/bossmove', 1, false)

    }

    armAttack() {
        let callF0 = cc.callFunc(() => {
            this.arm.opacity = 1
            this.armRight.opacity = 0
            this._touchArmLeft = false
            this._touchArmRight = false

            this.tank.getChildByName('front').getComponent(cc.Animation).play('frontAttack')
            this.tank.getChildByName('back').getComponent(cc.Animation).play('backNo')
            GameTools.loadSound('sound/level/8/bossattack', 1, false)

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
            GameTools.loadSound('sound/level/8/bossattack', 1, false)

        })
        this.arm.runAction(cc.repeatForever(cc.sequence(delay0, callF0, delay1, callF1)))
    }

    overCharge() {
        let operateUI: operateUI = gameContext.operateUI
        if (operateUI.san <= 2) {
            EventMgr.getInstance().sendListener(EventMgr.CLOSEOPERATE, {});
            (gameContext.player as hero).state = State.standRight
            this.unscheduleAllCallbacks()
            this.arm.stopAllActions()
            GameTools.loadSound('sound/level/8/bgmFail', 0, false)//14

            this.scheduleOnce(() => {
                this.showTalkBload(0, ':装修怪...')
                GameTools.loadSound('sound/level/wechat0', 1, false)

            }, 2)


            this.scheduleOnce(() => {
                this.showTalkBload(0, ':是不可能被打败的...')
                GameTools.loadSound('sound/level/wechat0', 1, false)
            }, 4)

            this.scheduleOnce(() => {
                this.showTalkBload(0, ':它是无敌的！')
                GameTools.loadSound('sound/level/wechat0', 1, false)

            }, 6)

            this.scheduleOnce(() => {
                this.showTalkBload(1, ':谁让你动我的猴子的！')
                GameTools.loadSound('sound/level/wechat1', 1, false)
            }, 8)

            this.scheduleOnce(() => {
                GameTools.loadSound('sound/level/8/jineng', 1, false)

            }, 9)

            this.scheduleOnce(() => {
                this.fallBox()
                operateUI.san = 10
                gameContext.showToast('淘宝达鼠')
                GameTools.loadSound('sound/level/8/boxfall', 1, false)
                let callF = cc.callFunc(() => {
                    console.log('游戏完成')
                    gameConfig.maxLevel = 8
                    gameConfig.memoryLength = 8
                    gameConfig.currMemory = 8
                    cc.director.loadScene("startScene", () => {
                        gameContext.showMemoryUI(true)
                    });
                })
                this.tank.runAction(cc.sequence(cc.delayTime(1), cc.blink(2, 5),cc.delayTime(1), callF))
            }, 11)

        }
    }

    fallBox() {
        for (let i = 0; i < this.boxList.length; i++) {
            let box = this.boxList[i]
            cc.tween(box)
                .by(1.5 + Math.random() * 2, { position: cc.v3(0, -1400, 0) }, { easing: 'CubicIn' })
                .call(() => {
                    box.y += 1400
                    // if (i == 0) {
                    //     console.log('游戏完成')
                    //     gameConfig.maxLevel = 8

                    //     cc.director.loadScene("startScene", () => {
                    //         gameContext.memoryLength = 8
                    //         gameContext.showMemoryUI(true)
                    //     });
                    // }
                })
                .start()
        }
    }


    update(dt) {
        let armPos = this.page1.convertToWorldSpaceAR(this.arm.getPosition());
        let armRightPos = this.page1.convertToWorldSpaceAR(this.armRight.getPosition());

        if (this._touchArmRight == false && Math.abs(armRightPos.x - gameContext.playerNode.x) < 100) {
            this._touchArmRight = true
            EventMgr.getInstance().sendListener(EventMgr.UPDATESAN, { 'disSan': -2 });

        }


        if (this._touchArmLeft == false && Math.abs(armPos.x - gameContext.playerNode.x) < 100) {
            this._touchArmLeft = true
            EventMgr.getInstance().sendListener(EventMgr.UPDATESAN, { 'disSan': -2 });
            this.overCharge()
            // let operateUI: operateUI = gameContext.operateUI
            // if (operateUI.san <= 2) {
            //     operateUI.san = 10
            //     gameContext.showToast('淘宝达鼠')
            //     GameTools.loadSound('sound/level/8/boxfall', 1, false)
            //     for (let i = 0; i < this.boxList.length; i++) {
            //         let box = this.boxList[i]
            //         cc.tween(box)
            //             .by(2 + Math.random() * 2, { position: cc.v3(0, -1400, 0) }, { easing: 'CubicIn' })
            //             .call(() => {
            //                 box.y += 1400
            //                 if (i == 0) {
            //                     console.log('游戏完成')
            //                     gameConfig.maxLevel = 8

            //                     cc.director.loadScene("startScene", () => {
            //                         gameContext.memoryLength = 8
            //                         gameContext.showMemoryUI(true)
            //                     });
            //                 }
            //             })
            //             .start()
            //     }
            // }
        }



        let tankPos = this.page1.convertToWorldSpaceAR(this.arm.getPosition())
        if (Math.abs(tankPos.x - gameContext.playerNode.x) < 100) {
            let player = gameContext.player as hero
            if (player && player.attack == true) {
                player.attack = false
                this.tankHpNum -= 2
                if (this.tankHpNum > 0) {
                    this.tankHp.scaleX = this.tankHpNum / 20
                } else {
                    this.tankHp.scaleX = 0
                    // console.log('打死装修怪，通关！')
                    // gameConfig.maxLevel = 8
                    // cc.director.loadScene("startScene", () => {
                    //     gameContext.memoryLength = 8
                    //     gameContext.showMemoryUI(true)
                    // });

                    let callF = cc.callFunc(() => {
                        console.log('游戏完成')
                        gameConfig.maxLevel = 8
                        gameConfig.memoryLength = 8
                        gameConfig.currMemory = 8
                        cc.director.loadScene("startScene", () => {
                            gameContext.showMemoryUI(true)
                        });
                    })
                    this.tank.runAction(cc.sequence(cc.delayTime(1), cc.blink(1, 5), callF))

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
