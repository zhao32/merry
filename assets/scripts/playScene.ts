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
        gameConfig.setGravity(30)
        // gameConfig.openPhysicsDebug()

        let manager = cc.director.getCollisionManager();

        manager.enabled = true;
        // manager.enabledDebugDraw = true;

        // gameConfig.currLevel = 0
        // gameConfig.maxLevel = 0
        // gameConfig.maxLevel = 9

      


        if (gameConfig.currLevel == 5) {
            gameContext.isChaos = true
        } else {
            gameContext.isChaos = false
        }
        console.log('-------------------playScene--------------------')
    }

    start() {
        cc.director.preloadScene("startScene", function () {
            cc.log("Next scene startScene preloaded");
        });
        // this.scheduleOnce(()=>{        gameContext.showLevel(gameConfig.currLevel)
        // },0.1)
        if (gameConfig.currLevel + 1 != 5 && gameConfig.currLevel + 1 != 8) GameTools.loadSound(`sound/bgm/bgm${gameConfig.currLevel + 1}`, 0, true)
        else {
            cc.audioEngine.stopMusic()
        }
        gameContext.showLevel(gameConfig.currLevel)

        gameContext.showOperateUI()

        let hero
        if (gameConfig.currLevel == 4) {
            hero = cc.instantiate(this.ratPfb)
            gameContext.player = hero.getComponent('rat')
            hero.setPosition(100, -210)

        } else {
            hero = cc.instantiate(this.heroPfb)
            gameContext.player = hero.getComponent('hero')
            hero.setPosition(100, -165)
        }
        hero.setAnchorPoint(0.5, 0.5)
        hero.zIndex = cc.macro.MAX_ZINDEX
        hero.active = false
        this.node.getChildByName('gameUI').addChild(hero)
        gameContext.playerNode = hero

        // this.scheduleOnce(()=>{
        //     gameContext.showLevel(gameConfig.currLevel)
        // },0.1)


    }

    // update (dt) {}
}
