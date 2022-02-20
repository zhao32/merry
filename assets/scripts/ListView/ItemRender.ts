import EventMgr from "../utils/EventMgr";
import GameTools, { gameConfig, gameContext } from "../utils/GameTools";
import List, { ListType } from "./List";

const { ccclass, property } = cc._decorator;

@ccclass
export default class ItemRender extends cc.Component {
    /**数据 */
    public data: any = null;
    /**索引 0表示第一项*/
    public itemIndex: number = 0;

    onLoad(): void {
        this.node.on(cc.Node.EventType.TOUCH_END, this.doClick, this)

    }

    doClick() {
        console.log('data:' + this.data)
        EventMgr.getInstance().sendListener(EventMgr.SHOWMEMRY, { data: this.data });


    }


    /**数据改变时调用 */
    public dataChanged() {
        // {\"nickname\":\"学生1642227619644\",\"head\":\"\",\"score\":74.0},
        // let mask = this.node.getChildByName('mask')
        // let container = mask.getChildByName('head').getComponent(cc.Sprite)
        // this.data.tel = this.data.tel.substr(0, 3) + '****' + this.data.tel.substr(7, 4)
        // this.node.getChildByName("rankLab").getComponent(cc.Label).string = this.data.rank + "";
        // this.node.getChildByName("nameLab").getComponent(cc.Label).string = this.data.name + "";
        // this.node.getChildByName("scoreLab").getComponent(cc.Label).string = this.data.score + "";
        // this.node.getChildByName("telLab").getComponent(cc.Label).string = this.data.tel + "";

        // if (!this.data.head) this.data.head = 'http://162g.vip.hnhxzkj.com/bgHead.png'
        // cc.assetManager.loadRemote(this.data.head, { ext: '.png' }, (err, texture: cc.Texture2D) => {
        //     let spriteFrame = new cc.SpriteFrame(texture)
        //     container.spriteFrame = spriteFrame
        // });

        // cc.loader.load(this.data.head,function(err,texture){
        //     let spriteFrame = new cc.SpriteFrame(texture)
        //     container.spriteFrame = spriteFrame
        // })
        GameTools.loadItemIcon(this.data,this.node.getChildByName('item'))

    }
}
