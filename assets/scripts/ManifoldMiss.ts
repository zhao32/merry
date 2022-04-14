// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import hero, { State } from "./hero";
import { Logger } from "./Logger";
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

    }

    /**
 * 当碰撞产生的时候调用
 * @param  {Collider} other 产生碰撞的另一个碰撞组件
 * @param  {Collider} self  产生碰撞的自身的碰撞组件
 */
    onCollisionEnter(other, self) {
        // Logger.log('on collision enter');

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

        if (other.tag == 0) {//墙
            Logger.log('撞墙')
            EventMgr.getInstance().sendListener(EventMgr.MISSSTONE);
        } else if (other.tag == 1) {//奶茶
            other.node.active = false
            Logger.log('奶茶')
            EventMgr.getInstance().sendListener(EventMgr.MISSSMILK);
        } else if (other.tag == 2) {//岳阳楼
            Logger.log('岳阳楼')
            EventMgr.getInstance().sendListener(EventMgr.MISSSYUYANG);
        } else if (other.tag == 3) {//博物馆
            Logger.log('博物馆')
            EventMgr.getInstance().sendListener(EventMgr.MISSSMUSEUM);
        } else if (other.tag == 4) {//刺
            Logger.log('刺')
            EventMgr.getInstance().sendListener(EventMgr.MISSSSTAB);
        }else if (other.tag == 5) {//
            Logger.log('飞机')
            EventMgr.getInstance().sendListener(EventMgr.MISSSSFLY);
        }
    }

    /**
     * 当碰撞产生后，碰撞结束前的情况下，每次计算碰撞结果后调用
     * @param  {Collider} other 产生碰撞的另一个碰撞组件
     * @param  {Collider} self  产生碰撞的自身的碰撞组件
     */
    onCollisionStay(other, self) {
        // Logger.log('on collision stay');
    }

    /**
     * 当碰撞结束后调用
     * @param  {Collider} other 产生碰撞的另一个碰撞组件
     * @param  {Collider} self  产生碰撞的自身的碰撞组件
     */
    onCollisionExit(other, self: cc.BoxCollider) {
        // Logger.log('on collision exit');
        self.node.getChildByName('label').active = false
        // if(other.tag == 2 || other.tag == 3){
        //     other.node.getChildByName('label').active = false
        // }
    }


    // 只在两个碰撞体开始接触时被调用一次
    onBeginContact(contact: cc.PhysicsContact, selfCollider: cc.PhysicsBoxCollider, otherCollider: cc.PhysicsBoxCollider) {
       
    }



    // update (dt) {}
}
