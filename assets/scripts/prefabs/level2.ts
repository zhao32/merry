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


    @property
    text: string = 'hello';
    _barrelNum = 0

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
        gameContext.moveType = 0

        EventMgr.getInstance().sendListener(EventMgr.CLOSEOPERATE, {});
        EventMgr.getInstance().registerListener(EventMgr.RESTART, this, this.Restart.bind(this))

    }

    start() {

    }

    Restart() {
        gameContext.playerNode.setPosition(100, -165)
        EventMgr.getInstance().sendListener(EventMgr.CLOSEOPERATE, {});

    }

    preStart() {

        EventMgr.getInstance().sendListener(EventMgr.OPENOPERATE, {});
        this.scheduleOnce(()=>{
            EventMgr.getInstance().sendListener(EventMgr.OPENOPERATE, {});

        },1)
    }

    update(dt) {
        // this.node.x += 1
        // this.setSyncPosition()
        if (gameContext.playerNode.x == 300 && this._barrelNum == 0) {
            this._barrelNum = 1
            this.createrBarrel(new cc.Vec2(300, 500))
        } if (gameContext.playerNode.x == 500 && this._barrelNum == 1) {
            this._barrelNum = 2
            this.createrBarrel(new cc.Vec2(500, 500))
        } if (gameContext.playerNode.x == 800 && this._barrelNum == 2) {
            this._barrelNum = 3
            this.createrBarrel(new cc.Vec2(800, 500))

        }
    }

    createrBarrel(pos: cc.Vec2) {
        let barrel = cc.instantiate(this.barrelPfb)
        this.node.addChild(barrel)
        barrel.setPosition(pos)


    }

    setSyncPosition() {
        let bodys = this.node.getComponentsInChildren(cc.RigidBody)
        for (let i = 0; i < bodys.length; i++) {
            bodys[i].syncPosition(true)
        }
    }
}
