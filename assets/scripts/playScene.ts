// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import GameTools, { gameConfig, gameContext } from "./utils/GameTools";

const { ccclass, property } = cc._decorator;

@ccclass
export default class NewClass extends cc.Component {

    @property(cc.Label)
    label: cc.Label = null;

    @property
    text: string = 'hello';

    @property({ type: cc.Prefab })
    heroPfb: cc.Prefab = null;

    @property({ type: cc.Prefab })
    ratPfb: cc.Prefab = null;


    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        gameConfig.openPhysics(true)
        gameConfig.setGravity(20)
        // gameConfig.openPhysicsDebug()
        let manager = cc.director.getCollisionManager();
        manager.enabled = true;
        manager.enabledDebugDraw = true;

        gameConfig.currLevel = 7
        gameConfig.maxLevel = 7


        gameContext.showOperateUI()
        gameContext.showLevel(gameConfig.currLevel)


        let hero
        if (gameConfig.currLevel == 5) {
            hero = cc.instantiate(this.ratPfb)
            gameContext.player = hero.getComponent('rat')
        } else {
            hero = cc.instantiate(this.heroPfb)
            gameContext.player = hero.getComponent('hero')
        }
        hero.setPosition(100, -165)
        hero.setAnchorPoint(0.5, 0.5)
        hero.zIndex = cc.macro.MAX_ZINDEX
        this.node.getChildByName('gameUI').addChild(hero)
        gameContext.playerNode = hero
    }

    start() {
        // this.scheduleOnce(()=>{
        //     gameContext.showLevel(gameConfig.currLevel)
        // },0.1)


    }

    // update (dt) {}
}
