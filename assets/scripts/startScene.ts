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

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        gameContext.showStartUI()
        this.loadGameData()
    }

    start() {
        cc.director.preloadScene("playScene", function () {
            cc.log("Next scene playScene preloaded");
        });
    }

    loadGameData() {
        GameTools.load('gameData', null, (err, res) => {
            cc.log(`加载游戏数据${err ? '失败' : '成功'}`)
            if (!err) {
                var object = res.json
                for (const key in object) {
                    if (Object.prototype.hasOwnProperty.call(object, key)) {
                        gameConfig[key] = object[key]
                    }
                }
            }
        })
    }

    // update (dt) {}
}
