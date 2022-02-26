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

        if (other.tag == 5) {//酒瓶
            console.log('老鼠接触酒瓶')
            other.node.opacity = 0
            EventMgr.getInstance().sendListener(EventMgr.TOUCHBOTTLE);
        } else if (other.tag == 6) {//酒桶
            console.log('老鼠接触酒桶')
            other.node.opacity = 0
            EventMgr.getInstance().sendListener(EventMgr.TOUCHBERRL);
        } else if (other.tag == 7) {//食物
            console.log('老鼠接触食物')
            other.node.opacity = 0
            EventMgr.getInstance().sendListener(EventMgr.TOUCHFOOD);
        }
    }

    /**
     * 当碰撞产生后，碰撞结束前的情况下，每次计算碰撞结果后调用
     * @param  {Collider} other 产生碰撞的另一个碰撞组件
     * @param  {Collider} self  产生碰撞的自身的碰撞组件
     */
    onCollisionStay(other, self) {
        console.log('on collision stay');
    }

    /**
     * 当碰撞结束后调用
     * @param  {Collider} other 产生碰撞的另一个碰撞组件
     * @param  {Collider} self  产生碰撞的自身的碰撞组件
     */
    onCollisionExit(other, self: cc.BoxCollider) {
        console.log('on collision exit');
    }


    // 只在两个碰撞体开始接触时被调用一次
    onBeginContact(contact: cc.PhysicsContact, selfCollider: cc.PhysicsBoxCollider, otherCollider: cc.PhysicsBoxCollider) {
        if (otherCollider.tag == 0) {//地面砖块
            // console.log('---------------------碰撞-----------------------------')
            console.log('开始碰撞')
            if (gameContext.player) {
                gameContext.player.isJumping = false
                if (gameContext.player.state == State.jumpLeft) {
                    gameContext.player.state = State.standLeft
                } else if (gameContext.player.state == State.jumpRight) {
                    gameContext.player.state = State.standRight
                }
                let body = gameContext.player.getComponent(cc.RigidBody)
                body.linearVelocity = new cc.Vec2(0, 0)

            }
        } else if (otherCollider.tag == 1) {//完成
            console.log('到达完成地点')
            EventMgr.getInstance().sendListener(EventMgr.TOUCHFINISH);
        } else if (otherCollider.tag == 2) {//口罩
            console.log('接触口罩')
            EventMgr.getInstance().sendListener(EventMgr.TOUCHMASK, {});
        } else if (otherCollider.tag == 3) {//病毒
            console.log('接触病毒')
            EventMgr.getInstance().sendListener(EventMgr.TOUCHVIRUS);
        } else if (otherCollider.tag == 4) {//荆棘
            console.log('接触荆棘')
            EventMgr.getInstance().sendListener(EventMgr.TOUCHTHORNS);
        } else if (otherCollider.tag == 5) {//酒瓶
            console.log('老鼠接触酒瓶')
            otherCollider.node.active = false
            EventMgr.getInstance().sendListener(EventMgr.TOUCHBOTTLE);
        } else if (otherCollider.tag == 6) {//酒桶
            console.log('老鼠接触酒桶')
            EventMgr.getInstance().sendListener(EventMgr.TOUCHBERRL);
        } else if (otherCollider.tag == 7) {//食物
            console.log('老鼠接触食物')
            EventMgr.getInstance().sendListener(EventMgr.TOUCHFOOD);
        }
        else if (otherCollider.tag == 8) {//蝙蝠
            // console.log('触碰蝙蝠')
            EventMgr.getInstance().sendListener(EventMgr.TOUCHBAT);
        }
        else if (otherCollider.tag == 9) {//蝙蝠超声波
            console.log('触碰蝙蝠超声波')
            EventMgr.getInstance().sendListener(EventMgr.TOUCHWAVE);
        } else if (otherCollider.tag == 10) {//羊
            console.log('触碰羊')
            EventMgr.getInstance().sendListener(EventMgr.TOUCHSHEEP);
        }
        // else if (otherCollider.tag == 11) {//装修怪手臂
        //     console.log('触碰装修怪手臂')
        //     EventMgr.getInstance().sendListener(EventMgr.TOUCHTANKARM);
        // }
        else if (otherCollider.tag == 12) {//装修怪
            console.log('触碰装修怪')
            EventMgr.getInstance().sendListener(EventMgr.TOUCHTANK);
        }
    }



    // update (dt) {}
}
