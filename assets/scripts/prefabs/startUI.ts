// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import GameTools, { gameConfig, gameContext } from "../utils/GameTools";


const { ccclass, property } = cc._decorator;

@ccclass
export default class NewClass extends cc.Component {

    @property(cc.Label)
    label: cc.Label = null;

    @property
    text: string = 'hello';

    callback: any

    @property(cc.Node)
    btnMemory: cc.Node = null;

    @property(cc.Node)
    btnStart: cc.Node = null;

   
    init(data: any, callback) {
        this.callback = callback
        GameTools.loadSound(`sound/bgm/bgmMain`, 0, true)
    }

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        this.node.zIndex = 0
        this.btnMemory.on(cc.Node.EventType.TOUCH_END, this.showMemory, this)
        this.btnStart.on(cc.Node.EventType.TOUCH_END, this.showLevel, this)
    }

    start() {
        // gameConfig.currMemory = -1
    }

    showMemory() {
        // gameContext.showToast('打开记忆宝典')
        gameContext.showMemoryUI(false)
        GameTools.loadSound('sound/op/click', 1, false)

    }

    showLevel() {
        gameContext.showLevelUI()
        GameTools.loadSound('sound/op/click', 1, false)
    }

    // update (dt) {}
}
