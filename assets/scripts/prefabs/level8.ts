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


    // weChat: cc.Node = null
    // // @property(cc.Node)
    // weChatLeft: cc.Node = null;

    // // @property(cc.Node)
    // weChatRight: cc.Node = null;

    @property
    text: string = 'hello';

    @property(cc.Prefab)
    boxPfb: cc.Prefab = null;


    @property(cc.Prefab)
    bulletPfb: cc.Prefab = null;

    @property(cc.Node)
    btnHome: cc.Node = null;

    @property(cc.Node)
    ratBlood: cc.Node = null;


    callback: any

    page0: cc.Node
    page1: cc.Node
    page2: cc.Node
    page3: cc.Node

    talkBload: cc.Node
    talkRat: cc.Node
    talkDeath: cc.Node
    talkDeath1: cc.Node


    // hp: cc.Node
    hpNum: number

    enemy: cc.Node
    enemyHp: cc.Node
    enemyHpNum: number

    _touchArm: boolean

    death: cc.Node
    bulletList = []
    hook: cc.Node

    angleRat: cc.Node

    bullet: cc.Node

    btnContine: cc.Node

    btnRestart: cc.Node
    btnGiveUp: cc.Node

    init(data: any, callback) {
        this.callback = callback
    }

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        gameConfig.openPhysics(true)

        this.node.setAnchorPoint(0, 0.5)
        this.node.setPosition(0, 0)
        // this.setSyncPosition()
        gameContext.hasFllow = true
        EventMgr.getInstance().registerListener(EventMgr.RESTART, this, this.Restart.bind(this))
        EventMgr.getInstance().registerListener(EventMgr.TOUCHBULLET, this, this.touchBullet.bind(this))
        EventMgr.getInstance().sendListener(EventMgr.CLOSEOPERATE, {});

        this.page0 = this.node.getChildByName('page0')
        this.page1 = this.node.getChildByName('page1')
        this.page2 = this.node.getChildByName('page2')
        this.page3 = this.node.getChildByName('page3')

        this.btnContine = this.page2.getChildByName('btnContine')
        this.btnGiveUp = this.page2.getChildByName('btnGiveUp')
        this.btnRestart = this.page2.getChildByName('btnRestart')

        this.btnHome.on(cc.Node.EventType.TOUCH_END, () => {
            cc.director.loadScene("startScene");
        }, this)

        this.btnGiveUp.on(cc.Node.EventType.TOUCH_END, () => {
            this.page2.active = true
            this.page1.active = false
            gameConfig.openPhysics(false)

            let player = gameContext.player as hero
            let animMon = []
            let ratanim = ''
            if (player.state == State.standLeft || player.state == State.walkLeft) {
                ratanim = 'angleRatLeft1'
                animMon = ['angleMonRight0', "angleMonRight1"]
            } else {
                animMon = ['angleMonLeft0', "angleMonLeft1"]

                ratanim = 'angleRatRight1'

            }

            gameContext.playerNode.getComponent(cc.Animation).play(animMon[0]).repeatCount = Infinity
            EventMgr.getInstance().sendListener(EventMgr.CLOSEOPERATE, {});
            let moveBy = cc.moveBy(3, new cc.Vec2(0, 400))
            let moveBy1 = cc.moveBy(3, new cc.Vec2(0, -400))

            let callF0 = cc.callFunc(() => {
                let rat = gameContext.playerNode.getChildByName('fllow')
                // rat.y -= 400
                rat.getComponent(cc.Animation).play(ratanim)
                gameContext.playerNode.getComponent(cc.Animation).play(animMon[1])

            })



            let callF = cc.callFunc(() => {
                let rat = gameContext.playerNode.getChildByName('fllow')
                // rat.y -= 400
                rat.getComponent(cc.Animation).play('ratstandRight')

                gameContext.playerNode.y -= 400
                gameContext.playerNode.getComponent(cc.Animation).play('standRight')
                gameConfig.maxLevel = 9
                gameConfig.memoryLength = 9
                gameConfig.currMemory = 9
                cc.director.loadScene("startScene", () => {
                    gameContext.showMemoryUI(true)
                });
                // rat.spriteFrame = new cc.SpriteFrame()
            })
            gameContext.playerNode.runAction(cc.sequence(moveBy, callF0, cc.delayTime(5), callF))
            gameContext.playerNode.getChildByName('fllow').runAction(moveBy1)
        }, this)
        this.btnContine.on(cc.Node.EventType.TOUCH_END, () => {
            this.page2.active = false
            this.page1.active = true
            this.enemy.runAction(cc.sequence(cc.moveBy(1, new cc.Vec2(300, 0)), cc.callFunc(() => {
                this.page3.active = true
            })))

            gameContext.playerNode.active = false

            // let rat = gameContext.playerNode.getChildByName('fllow')
            // rat.y -= 400
            // rat.getComponent(cc.Animation).play('ratstandRight')
        }, this)
        this.btnRestart.on(cc.Node.EventType.TOUCH_END, () => {
            this.Restart()
            let rat = gameContext.playerNode.getChildByName('fllow')
            rat.y -= 400
            rat.getComponent(cc.Animation).play('ratstandRight')
        }, this)


        this.death = this.page0.getChildByName('death')
        this.talkBload = this.node.getChildByName('talkbg')
        this.talkRat = this.talkBload.getChildByName('ratTalk')
        this.talkDeath = this.talkBload.getChildByName('deathTalk')
        this.talkDeath1 = this.talkBload.getChildByName('deathTalk1')

        this.enemy = this.page1.getChildByName('enemy')
        this.hook = this.enemy.getChildByName('hook')
        this.enemyHp = this.page1.getChildByName('enemyHp')
        this.angleRat = this.page1.getChildByName('angleRat')
        this.bullet = cc.instantiate(this.bulletPfb)
        this.page1.addChild(this.bullet)
    }

    showTalkBload(type) {
        this.talkBload.parent = this.node.parent.parent
        this.talkBload.x = 0
        if (type == 0) {
            this.talkBload.active = true
            this.talkDeath.active = true
            this.talkDeath1.active = false
            this.talkRat.active = false
        } else if (type == 1) {
            this.talkBload.active = true
            this.talkDeath.active = false
            this.talkDeath1.active = true
            this.talkRat.active = false
        } else if (type == 2) {
            this.talkBload.active = true
            this.talkDeath.active = false
            this.talkDeath1.active = false
            this.talkRat.active = true
        } else {
            this.talkBload.active = false
        }
    }



    onDisable() {
        console.log('------------------第9关注销监听------------------')
        EventMgr.getInstance().unRegisterListener(EventMgr.TOUCHBULLET, this)
        EventMgr.getInstance().unRegisterListener(EventMgr.RESTART, this)

        this.btnContine.off(cc.Node.EventType.TOUCH_END)
        this.btnGiveUp.off(cc.Node.EventType.TOUCH_END)
        this.btnRestart.off(cc.Node.EventType.TOUCH_END)
        GameTools.destroyNode(this.node)
    }


    start() {
        this.Restart()
    }

    Restart() {
        GameTools.loadSound('sound/bgm/bgm9', 0, true)

        let operateUI: operateUI = gameContext.operateUI
        if (operateUI) operateUI.san = 10
        this.showTalkBload(-1)

        this.unscheduleAllCallbacks()
        gameContext.moveType = 0
        // EventMgr.getInstance().sendListener(EventMgr.UPDATESAN, { 'disSan': 10 });
        let rat: cc.Node = gameContext.playerNode.getChildByName('fllow')
        let blood = rat.getChildByName('blood')
        blood.active = false
        this.ratBlood.setScale(1)


        this.bullet.setPosition(-20, -95)
        this.bullet.active = false

        this.page0.active = true
        this.page0.opacity = 255
        this.page1.active = false
        this.page2.active = false
        this.page3.active = false
        this.hpNum = 10
        this.enemyHpNum = 20
        this.enemyHp.scaleX = 1
        this.death.x = 800
        this.enemy.x = 180
        gameContext.playerNode.active = false
        this._touchArm = false

        gameConfig.currLevel = 8
        gameContext.playerNode.setPosition(100, -165)
        gameContext.playerNode.active = false
        this.hook.setPosition(15, 50)
        EventMgr.getInstance().sendListener(EventMgr.CLOSEOPERATE, {});
        this.preStart()
    }

    /**前情提要 */
    preStart() {
        let preTime = 1
        this.scheduleOnce(() => {
            this.death.runAction(cc.moveBy(3, new cc.Vec2(-300, 0)))

        }, 20)

        this.scheduleOnce(() => {
            this.showTalkBload(0)
        }, 25)

        // this.scheduleOnce(() => {
        //     this.showTalkBload(0)
        // }, preTime + 1)
        console.log('播放音效')
        this.scheduleOnce(() => {
            this.showTalkBload(-1)
            this.page0.runAction(cc.sequence(cc.fadeOut(2), cc.callFunc(() => {
                EventMgr.getInstance().sendListener(EventMgr.OPENOPERATE, {
                    left: true,
                    right: true,
                    top: false,
                    down: false,
                    fight: true,
                    jump: true
                });
                gameContext.playerNode.active = true;
                gameContext.player.state = State.standRight

                this.page1.active = true
                console.log('启用生成子弹回调')
                GameTools.loadSound('sound/level/9/bossbgm', 0, true)

                this.schedule(this.hookAttack, 5)
            })))
        }, 28)
    }

    touchArm() {
        // console.log('手臂攻击')
        // if (this.arm.opacity == 255) {
        //     this.arm.opacity = 254
        //     EventMgr.getInstance().sendListener(EventMgr.UPDATESAN, { 'disSan': -2 });
        //     let operateUI: operateUI = gameContext.operateUI
        //     if (operateUI.san <= 1) {
        //         operateUI.san = 9
        //         gameContext.showToast('鼠鼠会在暗中支持你！')
        //     }
        // }
    }
    touchBullet() {
        this.bullet.active = false
        EventMgr.getInstance().sendListener(EventMgr.UPDATESAN, { 'disSan': -2 });
        let operateUI: operateUI = gameContext.operateUI
        if (operateUI.san <= 1) {
            this.showTalkBload(2)
            this.scheduleOnce(() => {
                this.showTalkBload(-1)
                operateUI.san = 10
            }, 2)
        }
    }



    hookAttack() {
        // cc.tween(this.hook)
        //     .by(1, { position: cc.v3(-200, 45, 0), angle: 100 })
        //     .delay(1)
        //     .by(.5, { position: cc.v3(200, -45, 0), angle: -100 })
        //     .start()
        // let bullet = cc.instantiate(this.bulletPfb)
        // this.page1.addChild(bullet)
        // bullet.setPosition(320, -95)
        // console.log('生成子弹')
        this.bullet.active = true
        this.bullet.setPosition(-20, -95)
        GameTools.loadSound('sound/level/9/bossAttack', 1, false)

        // this.bulletList.push(bullet)
    }


    update(dt) {
        // this.node.x += 1
        // this.setSyncPosition()


        // let armPos = this.page1.convertToWorldSpaceAR(this.arm.getPosition())
        // // console.log('heroX:'+ gameContext.playerNode.x)
        // // console.log('sheepX:'+ sheepPos.x)
        // // console.log('heroY:'+ gameContext.playerNode.y)
        // // console.log('sheepY:'+ sheepPos.y)
        // if (this._touchArm == false && Math.abs(armPos.x - gameContext.playerNode.x) < 100) {
        //     this._touchArm = true
        //     EventMgr.getInstance().sendListener(EventMgr.UPDATESAN, { 'disSan': -2 });
        //     let operateUI: operateUI = gameContext.operateUI
        //     if (operateUI.san <= 2) {
        //         operateUI.san = 10
        //         gameContext.showToast('淘宝达鼠')
        //         for (let i = 0; i < this.boxList.length; i++) {
        //             let box = this.boxList[i]
        //             cc.tween(box)
        //                 .by(2 + Math.random() * 2, { position: cc.v3(0, -1400, 0) }, { easing: 'CubicIn' })
        //                 .call(() => {
        //                     box.y += 1400
        //                     if (i == 0) {
        //                         this.unschedule(this.enemyMove)
        //                         this.arm.opacity = 0
        //                         this.arm.stopAllActions()
        //                         this.enemy.stopAllActions()
        //                         console.log('游戏完成')
        //                         gameConfig.currLevel = 6
        //                         gameConfig.maxLevel = 6
        //                         EventMgr.getInstance().sendListener(EventMgr.CLOSEOPERATE, {});

        //                     }
        //                 })
        //                 .start()
        //         }
        //     }
        // }

        let enemyPos = this.page1.convertToWorldSpaceAR(this.enemy.getPosition())
        if (Math.abs(enemyPos.x - gameContext.playerNode.x) < 100) {
            let player = gameContext.player as hero
            if (player && player.attack == true) {
                console.log('攻击死神')
                player.attack = false
                this.enemyHpNum -= 2
                if (this.enemyHpNum >= 3) {
                    this.enemyHp.scaleX = this.enemyHpNum / 20
                } else {
                    this.enemyHp.scaleX = 0
                    gameConfig.maxLevel = 9
                    EventMgr.getInstance().sendListener(EventMgr.CLOSEOPERATE, {});

                    // gameContext.showToast('坦然面对死亡吧')
                    this.showTalkBload(1)
                    GameTools.loadSound('sound/level/9/bossAttackBig', 1, false)
                    // cc.tween(this.hook)
                    //     .by(.5, { position: cc.v3(200, -45, 0), angle: -100 })
                    //     .delay(1)
                    //     .by(1, { position: cc.v3(-200, 45, 0), angle: 100 })
                    //     .start()


                    this.hook.runAction(cc.spawn(cc.rotateBy(3, 720), cc.moveBy(4, new cc.Vec2(-2000, 0))))

                    let rat = gameContext.playerNode.getChildByName('fllow')
                    // let blood = rat.getChildByName('blood')
                    this.page1.runAction(cc.sequence(cc.delayTime(2), cc.blink(2, 5), cc.callFunc(() => {
                        this.ratBlood.runAction(cc.scaleTo(2, 0, 1))
                    })))


                    this.unscheduleAllCallbacks()

                    let callF = cc.callFunc(() => {
                        // rat.y -= 500
                        // rat.getComponent(cc.Animation).stop('angleRat')
                        // rat.spriteFrame = new cc.SpriteFrame()
                        this.showTalkBload(-1)
                        this.page2.active = true
                    })
                    let player = gameContext.player as hero
                    let anim = ''
                    if (player.state == State.standLeft || player.state == State.walkLeft) {
                        anim = 'angleRatLeft2'
                    } else {
                        anim = 'angleRatRight2'
                    }
                    let moveBy = cc.moveBy(3, new cc.Vec2(0, 400))
                    let delay = cc.delayTime(6)
                    let callF0 = cc.callFunc(() => {
                        rat.getComponent(cc.Animation).play(anim).repeatCount = Infinity
                    })
                    rat.runAction(cc.sequence(delay, callF0, moveBy, callF))

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
