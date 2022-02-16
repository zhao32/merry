// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import EventMgr from "../utils/EventMgr";
import { gameConfig, gameContext } from "../utils/GameTools";


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

    callback: any

    init(data: any, callback) {
        this.callback = callback
    }

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        this.node.setAnchorPoint(0, 0.5)
        this.node.setPosition(0, 0)
        this.setSyncPosition()
        this._barrelNum = 0
        this._bottleNum = 0
        this._foodNum = 0
        gameContext.moveType = 0

        EventMgr.getInstance().sendListener(EventMgr.CLOSEOPERATE, {});
        EventMgr.getInstance().registerListener(EventMgr.RESTART, this, this.Restart.bind(this))
        EventMgr.getInstance().registerListener(EventMgr.TOUCHFINISH, this, this.touchFinish.bind(this))


    }

    start() {
        this.preStart()
    }

    Restart() {
        gameContext.playerNode.setPosition(100, -165)
        EventMgr.getInstance().sendListener(EventMgr.CLOSEOPERATE, {});

    }

    touchFinish() {
        console.log('游戏结束')
        gameConfig.maxLevel = 3
    }

    preStart() {

        EventMgr.getInstance().sendListener(EventMgr.OPENOPERATE, {});
        this.scheduleOnce(() => {
            EventMgr.getInstance().sendListener(EventMgr.OPENOPERATE, {});

        }, 1)
    }

    update(dt) {
        // this.node.x += 1
        // this.setSyncPosition()
        if (gameContext.playerNode.x == 200 && this._barrelNum == 0) {
            this._barrelNum = 1
            this.createrBarrel(new cc.Vec2(200, 500))
        } else if (gameContext.playerNode.x == 400 && this._barrelNum == 1) {
            this._barrelNum = 2
            this.createrBarrel(new cc.Vec2(400, 500))
        } else if (gameContext.playerNode.x == 600 && this._barrelNum == 2) {
            this._barrelNum = 3
            this.createrBarrel(new cc.Vec2(600, 500))
        } else if (gameContext.playerNode.x >= 800 && this._foodNum == 0) {
            this.createrFood()
        }

        if(this._bottleNum == 0){
            this.createBottle()
        }



        for (let i = 0; i < this.barrelList.length; i++) {
            if (this.barrelList[i].y < -500) {
                this.barrelList[i].destroy()
                this.barrelList.splice(i, 1)
                console.log('删除水桶')
            }

        }

        for (let i = 0; i < this.foodList.length; i++) {
            if (this.foodList[i].y < -500) {
                this.foodList[i].destroy()
                this.foodList.splice(i, 1)
                console.log('删除食物')
            }
        }

        for (let i = 0; i < this.bottleList.length; i++) {
            if (this.bottleList[i].x < -100) {
                this.bottleList[i].destroy()
                this.bottleList.splice(i, 1)
                console.log('删除酒瓶')
            }
        }
    }

    createrBarrel(pos: cc.Vec2) {

        let barrel = cc.instantiate(this.barrelPfb)

        this.node.addChild(barrel)
        barrel.setPosition(pos)
        this.barrelList.push(barrel)
    }

    createrFood() {
        this._foodNum = 5
        for (let i = 0; i < 5; i++) {
            this.scheduleOnce(() => {
                let food = cc.instantiate(this.foodPfb)
                this.node.addChild(food)
                food.setPosition(Math.random() * 200 + 800, 500)
                this.foodList.push(food)
            }, i * 2)
        }
    }

    createBottle(){
        this._bottleNum = 4
        for (let i = 0; i < 4; i++) {
            this.scheduleOnce(() => {
                console.log('生成水瓶')
                let bottle = cc.instantiate(this.bottlePfb)
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
