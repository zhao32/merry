// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

const { ccclass, property } = cc._decorator;

export enum State {
    standLeft,
    standRight,
    walkLeft,
    walkRight,
    jump,
    fight,
}


@ccclass
export default class NewClass extends cc.Component {

    @property(cc.Label)
    label: cc.Label = null;

    @property
    text: string = 'hello';

    _state: number = 0

    _dir: number = 0 //方向 0 left 1 right 

    _isJumping: boolean = false

    jumpDuration: number = 0.2

    jumpHeight: number = 200

    isMove: Boolean = false//主角是否真实运动，在场景两边时主角移动，场景中间时场景移动

    speed: number = 5 //主角移动速度

    readonly LEFT = 0
    readonly RIGHT = 1

    readonly STANDLEFT = 'standLeft'
    




    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        this.isMove = true
        this._state = State.standLeft
    }

    start() {

    }

    public set state(value: number) {
        if (this._isJumping) return
        this._state = value

        let ani = ''
        let repeatCount: number
        if (this._state == State.fight) {
            ani = null
            repeatCount = 0
        } else if (this._state == State.jump) {
            if (this._dir == this.LEFT) {
                ani = 'jumpLeft'
            } else {
                ani = 'jumpRight'
            }
            repeatCount = Infinity
            this.playJump()
        } else if (this._state == State.walkLeft) {
            ani = 'walkLeft'
            repeatCount = Infinity
            this._dir = this.LEFT
            this.isMove = true


        } else if (this._state == State.walkRight) {
            ani = 'walkRight'
            repeatCount = Infinity
            this._dir = this.RIGHT
            this.isMove = true

        } else if (this._state == State.standLeft) {
            // this.node.getComponent(cc.Animation).stop()
            this._dir = this.LEFT
            this.isMove = false
            ani = 'standLeft'
            repeatCount = Infinity

        } else if (this._state == State.standRight) {
            // this.node.getComponent(cc.Animation).stop()
            this._dir = this.RIGHT
            this.isMove = false
            ani = 'standRight'
            repeatCount = Infinity

        }
        if (ani) {
            this.node.getComponent(cc.Animation).play(ani).repeatCount = repeatCount
        } else {

        }

    }

    public get state() {
        return this._state
    }

    runJumpAction() {
        this._isJumping = true
        // 跳跃上升
        var jumpUp = cc.tween().by(this.jumpDuration, { y: this.jumpHeight }, { easing: 'sineOut' });
        // 下落
        var jumpDown = cc.tween().by(this.jumpDuration, { y: -this.jumpHeight }, { easing: 'sineIn' });

        // 创建一个缓动，按 jumpUp、jumpDown 的顺序执行动作
        let callback = cc.callFunc(() => {
            this._isJumping = false
            let ani = ''
            let repeatCount: number
            if (this._dir == this.LEFT) {
                ani = 'standLeft'
                repeatCount = Infinity
            } else {
                ani = 'standRight'
                repeatCount = Infinity
            }
            this.node.getComponent(cc.Animation).play(ani).repeatCount = repeatCount
        })
        var tween = cc.tween().sequence(jumpUp, jumpDown, callback)
        // 不断重复
        return tween;
    }

    playJump() {
        if (!this._isJumping) {
            let jump = this.runJumpAction()
            cc.tween(this.node).then(jump).start()
        }
    }

    // changeState() {
    //     let ani = ''
    //     let repeatCount: number
    //     if (this._state == State.fight) {
    //         ani = null
    //         repeatCount = 0
    //     } else if (this._state == State.jumpLeft) {
    //         ani = 'jumpLeft'
    //         repeatCount = Infinity
    //     } else if (this._state == State.jumpRight) {
    //         ani = 'jumpRight'
    //         repeatCount = Infinity

    //     } else if (this._state == State.walkLeft) {
    //         ani = 'walkLeft'
    //         repeatCount = Infinity

    //     } else if (this._state == State.walkRight) {
    //         ani = 'walkRight'
    //         repeatCount = Infinity

    //     }
    //     this.node.getComponent(cc.Animation).play(ani).repeatCount = repeatCount

    // }



    update(dt) {
        if (this.isMove && this._state != State.standLeft && this._state != State.standRight) {
          
            if (this.node.x < -500) {
                this.node.x = -500
            } else if (this.node.x > 500) {
                this.node.x = 500
            } else {
                if (this._dir == this.LEFT) {
                    this.node.x -= this.speed
                } else if (this._dir == this.RIGHT) {
                    this.node.x += this.speed
                }
            }
        }
    }
}
