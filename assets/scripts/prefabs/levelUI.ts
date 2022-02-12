// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import { gameConfig, gameContext } from "../utils/GameTools";


const { ccclass, property } = cc._decorator;

@ccclass
export default class NewClass extends cc.Component {

    @property(cc.Label)
    label: cc.Label = null;

    @property
    text: string = 'hello';

    callback: any

    init(data: any, callback) {
        this.callback = callback
    }

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        for (let i = 0; i < 9; i++) {
            let box = this.node.getChildByName(`box${i}`)
            box.on(cc.Node.EventType.TOUCH_END, this.selectPass, this)
            let idxDisplay = box.getChildByName('idx').getComponent(cc.Label)
            idxDisplay.string = String(i + 1)

            let nameLabel = box.getChildByName('name')
            if (i > gameConfig.maxLevel) {
                nameLabel.active = false
            } else {
                nameLabel.active = true
            }

        }
    }

    start() {

    }

    selectPass(touch: any) {
        // console.log(touch)
        let name: string = touch.target.name
        let level = parseInt(name.charAt(name.length - 1))
        if (level > gameConfig.maxLevel) {
            gameContext.showToast('请先通关之前关卡')
        } else {
            console.log('打开关卡' + level)
            cc.director.loadScene("playScene");
            // console.log(cc.director.runScene())
        }
    }

    // update (dt) {}
}
