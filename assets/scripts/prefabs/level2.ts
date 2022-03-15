// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import hero from "../hero";
import { State } from "../rat";
import EventMgr from "../utils/EventMgr";
import GameTools, { gameConfig, gameContext } from "../utils/GameTools";
import operateUI from "./operateUI";


const { ccclass, property } = cc._decorator;

@ccclass
export default class NewClass extends cc.Component {

    @property(cc.Label)
    label: cc.Label = null;

    @property({ type: cc.Prefab })
    barrelPfb: cc.Prefab = null;

    @property({ type: cc.Prefab })
    foodPfb: cc.Prefab = null;

    @property({ type: cc.Prefab })
    bottlePfb: cc.Prefab = null;

    weChat: cc.Node = null


    @property
    text: string = 'hello';
    _barrelNum = 0

    _foodNum = 0

    _bottleNum = 0

    foodList = []

    barrelList = []

    bottleList = []

    distance: number = null

    callback: any

    _start: boolean = false

    init(data: any, callback) {
        this.callback = callback
    }

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        this.node.setAnchorPoint(0, 0.5)
        this.node.setPosition(0, 0)
        this.setSyncPosition()

        // EventMgr.getInstance().sendListener(EventMgr.CLOSEOPERATE, {});
        EventMgr.getInstance().registerListener(EventMgr.RESTART, this, this.Restart.bind(this))
        EventMgr.getInstance().registerListener(EventMgr.TOUCHFINISH, this, this.touchFinish.bind(this))
        EventMgr.getInstance().registerListener(EventMgr.TOUCHBOTTLE, this, this.touchBottle.bind(this))
        EventMgr.getInstance().registerListener(EventMgr.TOUCHBERRL, this, this.touchBerrl.bind(this))
        EventMgr.getInstance().registerListener(EventMgr.TOUCHFOOD, this, this.touchFood.bind(this))

        this.weChat = this.node.getChildByName('weChat')
        this.weChat.active = false
        this.weChat.parent = this.node.parent.parent
        this._start = false
    }

    onDisable() {
        console.log('------------------第3关注销监听------------------')
        EventMgr.getInstance().unRegisterListener(EventMgr.TOUCHFINISH, this)
        EventMgr.getInstance().unRegisterListener(EventMgr.TOUCHTHORNS, this)
        EventMgr.getInstance().unRegisterListener(EventMgr.TOUCHBOTTLE, this)
        EventMgr.getInstance().unRegisterListener(EventMgr.TOUCHBERRL, this)
        EventMgr.getInstance().unRegisterListener(EventMgr.RESTART, this)
        this.clear()
        GameTools.destroyNode(this.node)

    }


    start() {
        this.Restart()
    }

    Restart() {
        this.clear()
        this._start = false
        this.weChat.x = 0
        gameConfig.currLevel = 2
        this.unscheduleAllCallbacks()
        this.node.setPosition(0, 0)
        this.setSyncPosition()
        // EventMgr.getInstance().sendListener(EventMgr.UPDATESAN, { 'disSan': 10 });
        let operateUI: operateUI = gameContext.operateUI
        if (operateUI) operateUI.san = 10
        EventMgr.getInstance().sendListener(EventMgr.CLOSEOPERATE, {});

        gameContext.playerNode.active = true
        gameContext.playerNode.getChildByName('fllow')
            .getChildByName('blood').active = false
        gameContext.playerNode.setPosition(300, -165)
        gameContext.moveType = 1
        gameContext.hasFllow = true;
        (gameContext.player as hero).state = State.standRight

        this.distance = 0
        this._bottleNum = 0
        this._barrelNum = 0
        this._foodNum = 0
        this.preStart()

        for (let i = 0; i < 6; i++) {
            let food = this.node.getChildByName(`food${i}`)
            food.active = true

        }

    }

    touchFinish() {
        console.log('游戏结束')
        GameTools.loadSound('sound/level/3/finish', 1, false)

        gameConfig.maxLevel = 3
        gameConfig.memoryLength = 3
        gameConfig.currMemory = 3
        this.unscheduleAllCallbacks()
        this.clear()
        EventMgr.getInstance().sendListener(EventMgr.CLOSEOPERATE, {});
        (gameContext.player as hero).state = State.standRight
        this.scheduleOnce(() => {
            cc.director.loadScene("startScene", () => {
                // gameConfig.memoryLength = 3
                // gameConfig.currMemory = 3
                gameContext.showMemoryUI(true)
            });
        }, 5)

    }

    clear() {
        while (this.barrelList.length > 0) {
            let node = this.barrelList.pop()
            if (node) node.destroy()
            console.log('删除水桶')
        }
        while (this.foodList.length > 0) {
            let node = this.foodList.pop()
            if (node) node.destroy()
            console.log('删除食物')
        }
        while (this.bottleList.length > 0) {
            let node = this.bottleList.pop()
            if (node) node.destroy()
            console.log('删除酒瓶')

        }
    }

    touchBottle() {
        // GameTools.loadSound('sound/level/3/attacked', 1, false)

        EventMgr.getInstance().sendListener(EventMgr.UPDATESAN, { 'disSan': -2 });
        let operateUI: operateUI = gameContext.operateUI
        if (operateUI.san <= 0) {
            // gameContext.showToast('鼠鼠醒醒！')

            // GameTools.loadSound('sound/level/wechat0', 1, false)
            this.weChat.parent = this.node.parent.parent
            this.weChat.active = true
            this.weChat.getChildByName('label').getComponent(cc.Label).string = '：鼠鼠醒醒！'

            // this.weChat.x = 667

            this.scheduleOnce(() => {
                this.weChat.active = false
                this.weChat.removeFromParent()
                GameTools.loadSound('sound/level/3/1blood', 1, false)
                operateUI.san = 2
            }, 3)
        }
    }

    touchBerrl() {
        // GameTools.loadSound('sound/level/3/attacked', 1, false)

        EventMgr.getInstance().sendListener(EventMgr.UPDATESAN, { 'disSan': -4 });
        let operateUI: operateUI = gameContext.operateUI
        if (operateUI.san <= 0) {

            // gameContext.showToast('鼠鼠醒醒！')

            // GameTools.loadSound('sound/level/wechat0', 1, false)
            this.weChat.parent = this.node.parent.parent
            this.weChat.active = true
            this.weChat.getChildByName('label').getComponent(cc.Label).string = '：鼠鼠醒醒！'
            // this.weChat.x = 667

            this.scheduleOnce(() => {
                this.weChat.active = false
                this.weChat.removeFromParent()
                operateUI.san = 2
                GameTools.loadSound('sound/level/3/1blood', 1, false)

            }, 3)
        }
    }

    touchFood() {
        console.log('老鼠吃到食物')
        // let operateUI: operateUI = gameContext.operateUI
        // operateUI.san += 1
        EventMgr.getInstance().sendListener(EventMgr.UPDATESAN, { 'disSan': 1 });
    }

    preStart() {

        this.weChat.parent = this.node.parent.parent
        this.weChat.active = true
        this.weChat.getChildByName('label').getComponent(cc.Label).string = '一起去搞点好吃的吧！'
        // this.weChat.x = 667

        this.scheduleOnce(() => {
            this.weChat.active = false
            this.weChat.removeFromParent()
            this._start = true

            gameContext.playerNode.setPosition(300, -165)
            EventMgr.getInstance().sendListener(EventMgr.OPENOPERATE, {
                left: true,
                right: true,
                top: false,
                down: false,
                fight: false,
                jump: true
            });
        }, 3)
        // this.scheduleOnce(() => {
        //     gameContext.playerNode.setPosition(300, -165)
        //     EventMgr.getInstance().sendListener(EventMgr.OPENOPERATE, {
        //         left: true,
        //         right: true,
        //         top: false,
        //         down: false,
        //         fight: false,
        //         jump: true
        //     });

        // }, 1)
    }

    update(dt) {

        let operateUI: operateUI = gameContext.operateUI
        if (operateUI && !operateUI.canOperate) return
        // if (this.failPage.active == true) return
        if (this.node.x >= 0) {
            this.node.x = 0
            if (gameContext.moveType == 1) {
                gameContext.moveType = 0
                // this.node.x = 0
                let operateUI: operateUI = gameContext.operateUI
                if ((gameContext.player as hero).state == State.walkRight) {
                    operateUI.startRight()
                } else if ((gameContext.player as hero).state == State.walkLeft) {
                    operateUI.startLeft()
                }

            } else {
                if (gameContext.playerNode.x > 500 && (gameContext.player as hero).state == State.walkRight) {
                    gameContext.moveType = 1
                    let operateUI: operateUI = gameContext.operateUI
                    if ((gameContext.player as hero).state == State.walkRight) {
                        operateUI.startRight()
                    } else if ((gameContext.player as hero).state == State.walkLeft) {
                        operateUI.startLeft()
                    }
                }
            }
        }

        let nodeWidth = this.node.width
        let sceneWidth = this.node.parent.width
        let posRight = sceneWidth - nodeWidth

        if (this.node.x <= posRight) {
            this.node.x = posRight
            if (gameContext.moveType == 1) {
                gameContext.moveType = 0
                let operateUI: operateUI = gameContext.operateUI
                if ((gameContext.player as hero).state == State.walkRight) {
                    operateUI.startRight()
                } else if ((gameContext.player as hero).state == State.walkLeft) {
                    operateUI.startLeft()
                }
            } else {
                if (gameContext.playerNode.x <= 1100 && (gameContext.player as hero).state == State.walkLeft) {
                    gameContext.moveType = 1
                    let operateUI: operateUI = gameContext.operateUI
                    if ((gameContext.player as hero).state == State.walkRight) {
                        operateUI.startRight()
                    } else if ((gameContext.player as hero).state == State.walkLeft) {
                        operateUI.startLeft()
                    }
                }
            }
        }


        if (gameContext.moveType == 1 && gameContext.playerNode.active == true) {
            this.node.x -= gameContext.viewSpeed
            this.setSyncPosition()
            // this.distance += gameContext.viewSpeed
        }
        // this.node.x += 1
        // this.setSyncPosition()
        // let operateUI: operateUI = gameContext.operateUI
        // if (operateUI && !operateUI.canOperate) return


        // if (gameContext.moveType == 1) {
        //     this.node.x -= gameContext.viewSpeed
        //     this.setSyncPosition()
        //     this.distance += gameContext.viewSpeed
        // }

        // if (this.node.x > 0) {
        //     this.node.x = 0
        //     this.distance = 0
        //     this.setSyncPosition()
        // }

        // if (this.distance > 1334) {
        //     if (gameContext.moveType == 1) {
        //         gameContext.moveType = 0
        //         let operateUI: operateUI = gameContext.operateUI
        //         if ((gameContext.player as hero).state == State.walkRight) {
        //             operateUI.startRight()
        //         } else if ((gameContext.player as hero).state == State.walkLeft) {
        //             operateUI.startLeft()
        //         }
        //     }
        // }
        // console.log(this.distance)
        // console.log('this.node.x:'+this.node.x )

        if (this.node.x < -1000 && this._barrelNum == 0) {
            this._barrelNum = 1
            this.createrBarrel(new cc.Vec2(1500, 500))
            console.log('Barrel:' + (this.distance + 200))
            console.log('-----------------------1---------------------------')
            console.log(gameContext.playerNode.x)
        } else if (this.node.x < -1500 && this._barrelNum == 1) {
            this._barrelNum = 2
            this.createrBarrel(new cc.Vec2(2000, 500))
            console.log('-----------------------2---------------------------')
            console.log(gameContext.playerNode.x)
        } else if (this.node.x < -2000 && this._barrelNum == 2) {
            this._barrelNum = 3
            console.log('-----------------------3---------------------------')
            console.log(gameContext.playerNode.x + this.node.width - 500)

            this.createrBarrel(new cc.Vec2(2500, 500))
        } else if (this.node.x < -3000 && this._foodNum == 0) {
            // this.createrFood()
        }

        if (this._bottleNum == 0 && this._start == true) {
            this.createBottle()
        }
    }

    createrBarrel(pos: cc.Vec2) {
        let barrel = cc.instantiate(this.barrelPfb)
        // barrel.opacity = 255
        this.node.addChild(barrel)
        barrel.setPosition(pos)
        this.barrelList.push(barrel)
        GameTools.loadSound('sound/level/3/barrelfall', 1, false)
    }

    createrFood() {
        this._foodNum = 5
        for (let i = 0; i < 5; i++) {
            this.scheduleOnce(() => {
                let food = cc.instantiate(this.foodPfb)
                // food.opacity = 255
                this.node.addChild(food)
                food.setPosition(this.distance + Math.random() * 400 + 400, 500)
                this.foodList.push(food)
            }, i * 2)
        }
    }

    createBottle() {
        this._bottleNum = 4
        for (let i = 0; i < 4; i++) {
            this.scheduleOnce(() => {
                console.log('生成水瓶')
                let bottle = cc.instantiate(this.bottlePfb)
                // bottle.opacity = 255
                this.node.addChild(bottle)
                bottle.setPosition(3000, -180)
                this.bottleList.push(bottle)
                GameTools.loadSound('sound/level/3/bottleRoll', 1, false)
            }, i * 3)
        }
    }

    setSyncPosition() {
        let bodys = this.node.getComponentsInChildren(cc.RigidBody)
        for (let i = 0; i < bodys.length; i++) {
            bodys[i].syncPosition(true)
        }
    }
}
