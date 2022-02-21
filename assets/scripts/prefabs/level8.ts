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


    callback: any

    page0: cc.Node
    page1: cc.Node
    page2: cc.Node

    label0: cc.Label
    label1: cc.Label

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

    btnContine:cc.Node

    btnRestart:cc.Node
    btnGiveUp:cc.Node

    init(data: any, callback) {
        this.callback = callback
    }

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        this.node.setAnchorPoint(0, 0.5)
        this.node.setPosition(0, 0)
        this.setSyncPosition()
        gameContext.hasFllow = true
        EventMgr.getInstance().registerListener(EventMgr.RESTART, this, this.Restart.bind(this))
        EventMgr.getInstance().registerListener(EventMgr.TOUCHBULLET, this, this.touchBullet.bind(this))

        EventMgr.getInstance().sendListener(EventMgr.CLOSEOPERATE, {});

        this.page0 = this.node.getChildByName('page0')
        this.page1 = this.node.getChildByName('page1')
        this.page2 = this.node.getChildByName('page2')
        this.btnContine = this.page2.getChildByName('btnContine')
        this.btnGiveUp = this.page2.getChildByName('btnGiveUp')
        this.btnRestart = this.page2.getChildByName('btnRestart')

        this.btnContine.on(cc.Node.EventType.TOUCH_END,()=>{
            this.page2.active = false
            this.page1.active = true
        },this)
        this.btnGiveUp.on(cc.Node.EventType.TOUCH_END,()=>{},this)
        this.btnRestart.on(cc.Node.EventType.TOUCH_END,()=>{
            this.Restart()
        },this)


        this.death = this.page0.getChildByName('death')

        this.label0 = this.page0.getChildByName('label0').getComponent(cc.Label)
        this.label1 = this.page0.getChildByName('label1').getComponent(cc.Label)
        this.label0.string = this.label1.string = ''

        this.enemy = this.page1.getChildByName('enemy')
        this.hook = this.page1.getChildByName('hook')
        this.enemyHp = this.page1.getChildByName('enemyHp')
        this.angleRat = this.page1.getChildByName('angleRat')
        this.bullet = cc.instantiate(this.bulletPfb)
        this.page1.addChild(this.bullet)
        this.bullet.setPosition(320, -95)
        this.bullet.active = false
    }


    start() {
        this.Restart()
    }

    Restart() {
        this.unscheduleAllCallbacks()
        this.page0.active = true
        this.page0.opacity = 255
        this.page1.active = false
        this.page2.active = false
        this.hpNum = 10
        this.enemyHpNum = 20
        this.enemyHp.scaleX = 1
        this.death.x = 800
        gameContext.playerNode.active = false
        this._touchArm = false

        gameConfig.currLevel = 6
        gameContext.playerNode.setPosition(100, -165)
        gameContext.playerNode.active = false
        EventMgr.getInstance().sendListener(EventMgr.CLOSEOPERATE, {});
        this.preStart()
    }

    /**前情提要 */
    preStart() {
        let preTime = 1
        this.death.runAction(cc.moveBy(3, new cc.Vec2(-200, 0)))

        this.scheduleOnce(() => {
            this.label0.string = '【死神】:我来接人了！'
        }, preTime + 1)
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
                this.page1.active = true
                console.log('启用生成子弹回调')
                this.schedule(this.hookAttack, 5)
            })))
        }, preTime + 3)
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
            operateUI.san = 10
            gameContext.showToast('不要丢下鼠鼠一个人！')
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
        this.bullet.setPosition(320, -95)
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
                    gameConfig.currLevel = 8
                    gameConfig.maxLevel = 8
                    gameContext.showToast('坦然面对死亡吧')
                    let rat = gameContext.playerNode.getChildByName('fllow')
                    rat.getComponent(cc.Animation).play('angleRat').repeatCount = Infinity
                    EventMgr.getInstance().sendListener(EventMgr.CLOSEOPERATE, {});
                    let moveBy = cc.moveBy(3, new cc.Vec2(0, 400))
                    let callF = cc.callFunc(() => {
                        // rat.y -= 500
                        // rat.getComponent(cc.Animation).stop('angleRat')
                        // rat.spriteFrame = new cc.SpriteFrame()
                        this.page2.active = true
                    })
                    rat.runAction(cc.sequence(moveBy, callF))

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
