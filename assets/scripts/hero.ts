// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import { gameContext } from "./utils/GameTools";

const { ccclass, property } = cc._decorator;

export enum State {
    standLeft,
    standRight,
    walkLeft,
    walkRight,
    jumpLeft,
    jumpRight,
    fight,
}


@ccclass
export default class NewClass extends cc.Component {

    @property(cc.Label)
    label: cc.Label = null;

    @property
    text: string = 'hello';

    private _state: number = 0

    private _isJumping: boolean = false

    isMove: Boolean = false//主角是否真实运动，在场景两边时主角移动，场景中间时场景移动

    private readonly Velocity = 150

    private readonly Speed = 5


    // public moveType: number = 0//0 玩家移动 1 背景移动

    onLoad() {
        this.isMove = true
        this.state = State.standRight

    }

    start() {

    }

    public set isJumping(value: boolean) {
        this._isJumping = value
    }

    public get isJumping() {
        return this._isJumping
    }

    public set state(value: number) {
        if (this._isJumping) return
        let body = this.node.getComponent(cc.RigidBody)
        this._state = value

        let ani = ''
        let repeatCount: number = Infinity
        if (this._state == State.fight) {
            ani = null
            repeatCount = 0
        } else if (this._state == State.jumpLeft) {
            ani = 'jumpLeft'
            if (this.isMove) {
                if (gameContext.moveType == 0) {
                    body.linearVelocity = new cc.Vec2(-this.Velocity, 0)
                } else {
                    gameContext.viewSpeed = -this.Speed
                }
            }
            this.playJump()
        } else if (this._state == State.jumpRight) {
            ani = 'jumpRight'
            if (this.isMove) {
                if (gameContext.moveType == 0) {
                    body.linearVelocity = new cc.Vec2(this.Velocity, 0)
                } else {
                    gameContext.viewSpeed = -this.Speed
                }
            }
            this.playJump()
        } else if (this._state == State.walkLeft) {
            ani = 'walkLeft'
            this.isMove = true
            if (gameContext.moveType == 0) {
                body.linearVelocity = new cc.Vec2(-this.Velocity, 0)
            } else {
                gameContext.viewSpeed = -this.Speed
            }
        } else if (this._state == State.walkRight) {
            ani = 'walkRight'
            repeatCount = Infinity
            this.isMove = true
            if (gameContext.moveType == 0) {
                body.linearVelocity = new cc.Vec2(this.Velocity, 0)
            } else {
                gameContext.viewSpeed = this.Speed
            }
        } else if (this._state == State.standLeft) {
            this.isMove = false
            ani = 'standLeft'
            repeatCount = Infinity
            body.linearVelocity = new cc.Vec2(0, 0)
            gameContext.viewSpeed = 0


        } else if (this._state == State.standRight) {
            // this.node.getComponent(cc.Animation).stop()
            // this._dir = this.RIGHT
            this.isMove = false
            ani = 'standRight'
            repeatCount = Infinity
            body.linearVelocity = new cc.Vec2(0, 0)
            gameContext.viewSpeed = 0
        }
        if (ani) {
            this.node.getComponent(cc.Animation).play(ani).repeatCount = repeatCount
            console.log('播放：' + ani)
        }
    }

    public get state() {
        return this._state
    }

    playJump() {
        // if (!this._isJumping) {
        //     let jump = this.runJumpAction()
        //     cc.tween(this.node).then(jump).start()
        // }
        let body = this.node.getComponent(cc.RigidBody)
        if (body.linearVelocity.y == 0) {
            body.linearVelocity = new cc.Vec2(body.linearVelocity.x, this.Velocity * 4)
            this._isJumping = true
        }
    }

    update(dt) {

        if (this.node.x < 20) {
            this.node.x = 20
        } else if (this.node.x > this.node.parent.width - 20) {
            this.node.x = this.node.parent.width - 20
        }
        // if (this.isMove && this._state != State.standLeft && this._state != State.standRight) {
        //     if (this.node.x < -500) {
        //         this.node.x = -500
        //     } else if (this.node.x > 500) {
        //         this.node.x = 500
        //     } else {
        //         // if (this._dir == this.LEFT) {
        //         //     this.node.x -= this.speed
        //         // } else if (this._dir == this.RIGHT) {
        //         //     this.node.x += this.speed
        //         // }
        //     }
        // }
    }
}
