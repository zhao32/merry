// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import hero from "../hero";
import { State } from "../rat";
import EventMgr from "../utils/EventMgr";
import { gameConfig, gameContext } from "../utils/GameTools";
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
    }

    onDisable() {
        console.log('------------------第3关注销监听------------------')
        EventMgr.getInstance().unRegisterListener(EventMgr.TOUCHFINISH, this)
        EventMgr.getInstance().unRegisterListener(EventMgr.TOUCHTHORNS, this)
        EventMgr.getInstance().unRegisterListener(EventMgr.TOUCHBOTTLE, this)
        EventMgr.getInstance().unRegisterListener(EventMgr.TOUCHBERRL, this)
        EventMgr.getInstance().unRegisterListener(EventMgr.RESTART, this)
        this.clear()
    }


    start() {
        this.Restart()
    }

    Restart() {
        this.node.setPosition(0, 0)
        EventMgr.getInstance().sendListener(EventMgr.UPDATESAN, { 'disSan': 10 });
        EventMgr.getInstance().sendListener(EventMgr.CLOSEOPERATE, {});

        gameContext.playerNode.active = true
        gameContext.playerNode.setPosition(300, -165)
        gameContext.moveType = 1
        gameContext.hasFllow = true;
        (gameContext.player as hero).state = State.standRight

        this.distance = 0
        this._bottleNum = 0
        this._barrelNum = 0
        this._foodNum = 0
        this.preStart()

    }

    touchFinish() {
        console.log('游戏结束')
        gameConfig.maxLevel = 3
        this.unscheduleAllCallbacks()
        this.clear()
        cc.director.loadScene("startScene", () => {
            gameContext.memoryLength = 3
            gameContext.showMemoryUI()
        });
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
        EventMgr.getInstance().sendListener(EventMgr.UPDATESAN, { 'disSan': -2 });
        let operateUI: operateUI = gameContext.operateUI
        if (operateUI.san <= 0) {
            operateUI.san = 2
            gameContext.showToast('鼠鼠醒醒！')
        }
    }

    touchBerrl() {
        EventMgr.getInstance().sendListener(EventMgr.UPDATESAN, { 'disSan': -4 });
        let operateUI: operateUI = gameContext.operateUI
        if (operateUI.san <= 0) {
            operateUI.san = 2
            gameContext.showToast('鼠鼠醒醒！')
        }
    }

    touchFood() {
        EventMgr.getInstance().sendListener(EventMgr.UPDATESAN, { 'disSan': 2 });
    }

    preStart() {
        this.scheduleOnce(() => {
            gameContext.playerNode.setPosition(300, -165)
            EventMgr.getInstance().sendListener(EventMgr.OPENOPERATE, {
                left: true,
                right: true,
                top: false,
                down: false,
                fight: false,
                jump: true
            });

        }, 1)
    }

    update(dt) {
        // this.node.x += 1
        // this.setSyncPosition()
        
        if (gameContext.moveType == 1) {
            this.node.x -= gameContext.viewSpeed
            this.setSyncPosition()
            this.distance += gameContext.viewSpeed
        }

        if(this.node.x > 0){
            this.node.x = 0
            this.distance = 0
            this.setSyncPosition()
        }

        if (this.distance > 1334) {
            if (gameContext.moveType == 1) {
                gameContext.moveType = 0
                let operateUI: operateUI = gameContext.operateUI
                if ((gameContext.player as hero).state == State.walkRight) {
                    operateUI.startRight()
                } else if ((gameContext.player as hero).state == State.walkLeft) {
                    operateUI.startLeft()
                }
            }
        }
        // console.log(this.distance)

        if (gameContext.playerNode.x > 400 && this._barrelNum == 0) {
            this._barrelNum = 1
            this.createrBarrel(new cc.Vec2(this.distance + gameContext.playerNode.x, 500))
            console.log('Barrel:' + (this.distance + 200))
        } else if (gameContext.playerNode.x > 600 && this._barrelNum == 1) {
            this._barrelNum = 2
            this.createrBarrel(new cc.Vec2(this.distance + gameContext.playerNode.x, 500))
        } else if (gameContext.playerNode.x > 800 && this._barrelNum == 2) {
            this._barrelNum = 3
            this.createrBarrel(new cc.Vec2(this.distance + gameContext.playerNode.x, 500))
        } else if (gameContext.playerNode.x >= 800 && this._foodNum == 0) {
            this.createrFood()
        }

        if (this._bottleNum == 0) {
            this.createBottle()
        }
    }

    createrBarrel(pos: cc.Vec2) {

        let barrel = cc.instantiate(this.barrelPfb)
        // barrel.opacity = 255
        this.node.addChild(barrel)
        barrel.setPosition(pos)
        this.barrelList.push(barrel)
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
                bottle.setPosition(1500, -180)
                this.bottleList.push(bottle)
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
