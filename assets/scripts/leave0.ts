// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import { gameContext } from "./utils/GameTools";

const {ccclass, property} = cc._decorator;

@ccclass
export default class NewClass extends cc.Component {

    @property(cc.Label)
    label: cc.Label = null;

    @property
    text: string = 'hello';

    @property({type:cc.Prefab})
    heroPfb: cc.Prefab = null;


    // LIFE-CYCLE CALLBACKS:

    onLoad () {

        let hero = cc.instantiate(this.heroPfb)
        hero.setPosition(-400,0)
        this.node.getChildByName('gameUI').addChild(hero)
        gameContext.player = hero.getComponent('hero')


    }

    start () {

    }

    // update (dt) {}
}
