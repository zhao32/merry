// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import hero, { State } from "./hero";
import EventMgr from "./utils/EventMgr";
import { gameContext } from "./utils/GameTools";

const { ccclass, property } = cc._decorator;

@ccclass
export default class NewClass extends cc.Component {

    @property(cc.Label)
    label: cc.Label = null;

    @property
    text: string = 'hello';

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}

    start() {
        console.log('--------人物碰撞--------·')

    }

    /**
 * 当碰撞产生的时候调用
 * @param  {Collider} other 产生碰撞的另一个碰撞组件
 * @param  {Collider} self  产生碰撞的自身的碰撞组件
 */
    onCollisionEnter(other, self) {
        console.log('on collision enter');

        // 碰撞系统会计算出碰撞组件在世界坐标系下的相关的值，并放到 world 这个属性里面
        // var world = self.world;

        // // 碰撞组件的 aabb 碰撞框
        // var aabb = world.aabb;

        // // 节点碰撞前上一帧 aabb 碰撞框的位置
        // var preAabb = world.preAabb;

        // // 碰撞框的世界矩阵
        // var t = world.transform;

        // // 以下属性为圆形碰撞组件特有属性
        // var r = world.radius;
        // var p = world.position;

        // // 以下属性为 矩形 和 多边形 碰撞组件特有属性
        // var ps = world.points;

        if (other.tag == 1) {//完成
            console.log('到达完成地点')
            EventMgr.getInstance().sendListener(EventMgr.TOUCHFINISH);
        } else if (other.tag == 2) {//口罩
            console.log('----接触口罩----')
            EventMgr.getInstance().sendListener(EventMgr.TOUCHMASK, {});
        } else if (other.tag == 3) {//病毒
            console.log('接触病毒')
            EventMgr.getInstance().sendListener(EventMgr.TOUCHVIRUS);
        } else if (other.tag == 4) {//荆棘
            console.log('接触荆棘')
            EventMgr.getInstance().sendListener(EventMgr.TOUCHTHORNS);
        } else if (other.tag == 5) {//食物
            console.log('接触食物')
            EventMgr.getInstance().sendListener(EventMgr.FOODGPLAYER);
        } else if (other.tag == 14) {//接触奶茶店
            console.log('接触奶茶店')
            EventMgr.getInstance().sendListener(EventMgr.TOUCHTSHOP);
        } else if (other.tag == 8) {//蝙蝠
            // console.log('触碰蝙蝠')
            EventMgr.getInstance().sendListener(EventMgr.TOUCHBAT);
        } else if (other.tag == 9) {//蝙蝠超声波
            console.log('触碰蝙蝠超声波')
            EventMgr.getInstance().sendListener(EventMgr.TOUCHWAVE);
        } else if (other.tag == 10) {//羊
            console.log('触碰羊--')
            EventMgr.getInstance().sendListener(EventMgr.TOUCHSHEEP);
        }
    }

    /**
     * 当碰撞产生后，碰撞结束前的情况下，每次计算碰撞结果后调用
     * @param  {Collider} other 产生碰撞的另一个碰撞组件
     * @param  {Collider} self  产生碰撞的自身的碰撞组件
     */
    onCollisionStay(other, self) {
        // console.log('on collision stay');
    }

    /**
     * 当碰撞结束后调用
     * @param  {Collider} other 产生碰撞的另一个碰撞组件
     * @param  {Collider} self  产生碰撞的自身的碰撞组件
     */
    onCollisionExit(other, self: cc.BoxCollider) {
        // console.log('on collision exit');
        // self.node.getChildByName('label').active = false
        // // if(other.tag == 2 || other.tag == 3){
        // //     other.node.getChildByName('label').active = false
        // // }
    }


    // 只在两个碰撞体开始接触时被调用一次
    onBeginContact(contact: cc.PhysicsContact, selfCollider: cc.PhysicsBoxCollider, otherCollider: cc.PhysicsBoxCollider) {

    }



    // update (dt) {}
}
