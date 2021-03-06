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

    // 只在两个碰撞体开始接触时被调用一次
    onBeginContact(contact: cc.PhysicsContact, selfCollider: cc.PhysicsBoxCollider, otherCollider: cc.PhysicsBoxCollider) {
        if (otherCollider.tag == 0) {//地面砖块
            // Logger.log('---------------------碰撞-----------------------------')
            Logger.log('开始碰撞')
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
        } 
        // else if (otherCollider.tag == 1) {//完成
        //     Logger.log('到达完成地点')
        //     EventMgr.getInstance().sendListener(EventMgr.TOUCHFINISH);
        // } else if (otherCollider.tag == 2) {//口罩
        //     Logger.log('接触口罩')
        //     EventMgr.getInstance().sendListener(EventMgr.TOUCHMASK, {});
        // } else if (otherCollider.tag == 3) {//病毒
        //     Logger.log('接触病毒')
        //     EventMgr.getInstance().sendListener(EventMgr.TOUCHVIRUS);
        // } else if (otherCollider.tag == 4) {//荆棘
        //     Logger.log('接触荆棘')
        //     EventMgr.getInstance().sendListener(EventMgr.TOUCHTHORNS);
        // }else if (otherCollider.tag == 14) {//荆棘
        //     Logger.log('接触奶茶店')
        //     EventMgr.getInstance().sendListener(EventMgr.TOUCHTSHOP);
        // }
        // else if (otherCollider.tag == 5) {//酒瓶
        //     Logger.log('老鼠接触酒瓶')
        //     otherCollider.node.destroy()
        //     EventMgr.getInstance().sendListener(EventMgr.TOUCHBOTTLE);
        // } else if (otherCollider.tag == 6) {//酒桶
        //     Logger.log('老鼠接触酒桶')
        //     EventMgr.getInstance().sendListener(EventMgr.TOUCHBERRL);
        // } else if (otherCollider.tag == 7) {//食物
        //     Logger.log('老鼠接触食物')
        //     EventMgr.getInstance().sendListener(EventMgr.TOUCHFOOD);
        // }

        // else if (otherCollider.tag == 8) {//蝙蝠
        //     // Logger.log('触碰蝙蝠')
        //     EventMgr.getInstance().sendListener(EventMgr.TOUCHBAT);
        // }
        // else if (otherCollider.tag == 9) {//蝙蝠超声波
        //     Logger.log('触碰蝙蝠超声波')
        //     EventMgr.getInstance().sendListener(EventMgr.TOUCHWAVE);
        // }
        
        // else if (otherCollider.tag == 10) {//羊
        //     Logger.log('触碰羊--')
        //     EventMgr.getInstance().sendListener(EventMgr.TOUCHSHEEP);
        // }
        // else if (otherCollider.tag == 11) {//装修怪手臂
        //     Logger.log('触碰装修怪手臂')
        //     EventMgr.getInstance().sendListener(EventMgr.TOUCHTANKARM);
        // }
        else if (otherCollider.tag == 12) {//装修怪
            Logger.log('触碰装修怪')
            EventMgr.getInstance().sendListener(EventMgr.TOUCHTANK);
        } else if (otherCollider.tag == 13) {//装修怪
            Logger.log('触碰子弹')
            EventMgr.getInstance().sendListener(EventMgr.TOUCHBULLET);
        }
    }

    // 只在两个碰撞体结束接触时被调用一次
    onEndContact(contact: cc.PhysicsContact, selfCollider: cc.PhysicsBoxCollider, otherCollider: cc.PhysicsBoxCollider) {
    }

    // 每次将要处理碰撞体接触逻辑时被调用
    onPreSolve(contact: cc.PhysicsContact, selfCollider: cc.PhysicsBoxCollider, otherCollider: cc.PhysicsBoxCollider) {
        // let body = gameContext.player.getComponent(cc.RigidBody)
        // let vx = body.linearVelocity.x
        // let vy = body.linearVelocity.y

        // if (body && vx == 0) {
        //     if (otherCollider.tag == 0) {//撞墙
        //         // Logger.log('---------------------碰撞-----------------------------')
        //         if (gameContext.player) {
        //             if (gameContext.player.state == State.standLeft) {
        //                 gameContext.player.state = State.standLeft
        //             } else if (gameContext.player.state == State.standRight) {
        //                 gameContext.player.state = State.standRight
        //             }
        //         }
        //     }
        // }

        // if (otherCollider.tag == 8) {//蝙蝠
        //     Logger.log('onPreSolve 触碰蝙蝠')
        //     EventMgr.getInstance().sendListener(EventMgr.TOUCHBAT);
        // }

        // if (otherCollider.tag == 11) {//装修怪手臂
        //     Logger.log('触碰装修怪手臂')
        //     EventMgr.getInstance().sendListener(EventMgr.TOUCHTANKARM);
        // }

        // if (otherCollider.tag == 10) {//羊
        //     Logger.log('触碰羊**')
        //     EventMgr.getInstance().sendListener(EventMgr.TOUCHSHEEP);
        // }
    }

    // 每次处理完碰撞体接触逻辑时被调用
    onPostSolve(contact: cc.PhysicsContact, selfCollider: cc.PhysicsBoxCollider, otherCollider: cc.PhysicsBoxCollider) {
        // if (otherCollider.tag == 8) {//蝙蝠
        //     Logger.log('onPostSolve 触碰蝙蝠')
        //     EventMgr.getInstance().sendListener(EventMgr.TOUCHBAT);
        // }
        // if (otherCollider.tag == 10) {//羊
        //     Logger.log('触碰羊**')
        //     EventMgr.getInstance().sendListener(EventMgr.TOUCHSHEEP);
        // }

    }

    // update (dt) {}
}
