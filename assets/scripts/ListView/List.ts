// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import { Logger } from "../Logger";
import ItemRender from "./ItemRender"

const { ccclass, property } = cc._decorator;

/**列表排列方式 */
export enum ListType {
    /**水平排列 */
    Horizontal = 1,
    /**垂直排列 */
    Vertical = 2,
    /**网格排列 */
    Grid = 3
}

/**网格布局中的方向 */
export enum StartAxisType {
    /**水平排列 */
    Horizontal = 1,
    /**垂直排列 */
    Vertical = 2,
}

/**
 * 列表
 * 根据cocos_example的listView改动而来
 * @author chenkai 2020.7.8
 * @example
 *  1.创建cocos的ScrollView组件，添加List，设置List属性即可
 *  
 */
@ccclass
export default class List extends cc.Component {

    //==================== 属性面板 =========================
    /**列表选项 */
    @property({ type: cc.Node, tooltip: "列表项" })
    public itemRender: cc.Node = null;

    

    /**排列方式 */
    @property({ type: cc.Enum(ListType), tooltip: "排列方式" })
    public type: ListType = ListType.Vertical;

    /**网格布局中的方向 */
    @property({ type: cc.Enum(StartAxisType), tooltip: "网格布局中的方向", visible() { return this.type == ListType.Grid } })
    public startAxis: StartAxisType = StartAxisType.Horizontal;

    /**列表项之间X间隔 */
    @property({ type: cc.Integer, tooltip: "列表项X间隔", visible() { return (this.type == ListType.Horizontal || this.type == ListType.Grid) } })
    public spaceX: number = 0;

    /**列表项之间Y间隔 */
    @property({ type: cc.Integer, tooltip: "列表项Y间隔", visible() { return this.type == ListType.Vertical || this.type == ListType.Grid } })
    public spaceY: number = 0;

    /**上间距 */
    @property({ type: cc.Integer, tooltip: "上间距", visible() { return (this.type == ListType.Vertical || this.type == ListType.Grid) } })
    public padding_top: number = 0;

    /**下间距 */
    @property({ type: cc.Integer, tooltip: "下间距", visible() { return (this.type == ListType.Vertical || this.type == ListType.Grid) } })
    public padding_buttom: number = 0;

    /**左间距 */
    @property({ type: cc.Integer, tooltip: "左间距", visible() { return (this.type == ListType.Horizontal || this.type == ListType.Grid) } })
    public padding_left: number = 0;



    @property(cc.Integer)
    public _padding: number = 0;

    /**右间距 */
    @property({ type: cc.Integer, tooltip: "右间距", visible() { return (this.type == ListType.Horizontal || this.type == ListType.Grid) } })
    public padding_right: number = 0;

    //====================== 滚动容器 ===============================
    /**列表滚动容器 */
    public scrollView: cc.ScrollView = null;
    /**scrollView的内容容器 */
    private content: cc.Node = null;

    //======================== 列表项 ===========================
    /**列表项数据 */
    private itemDataList: Array<any> = [];
    /**应创建的实例数量 */
    private spawnCount: number = 0;
    /**存放列表项实例的数组 */
    private itemList: Array<cc.Node> = [];
    /**item的高度 */
    private itemHeight: number = 0;
    /**item的宽度 */
    private itemWidth: number = 0;
    /**存放不再使用中的列表项 */
    private itemPool: Array<cc.Node> = [];

    //======================= 计算参数 ==========================
    /**距离scrollView中心点的距离，超过这个距离的item会被重置，一般设置为 scrollVIew.height/2 + item.heigt/2 + space，因为这个距离item正好超出scrollView显示范围 */
    private halfScrollView: number = 0;
    /**上一次content的X值，用于和现在content的X值比较，得出是向左还是向右滚动 */
    private lastContentPosX: number = 0;
    /**上一次content的Y值，用于和现在content的Y值比较，得出是向上还是向下滚动 */
    private lastContentPosY: number = 0;
    /**网格行数 */
    private gridRow: number = 0;
    /**网格列数 */
    private gridCol: number = 0;
    /**刷新时间，单位s */
    private updateTimer: number = 0;
    /**刷新间隔，单位s */
    private updateInterval: number = 0.1;
    /**是否滚动容器 */
    private bScrolling: boolean = false;
    /**刷新的函数 */
    private updateFun: Function = function () { };

    onLoad() {
        this.itemHeight = this.itemRender.height;
        this.itemWidth = this.itemRender.width;
        this.scrollView = this.node.getComponent(cc.ScrollView);
        this.content = this.scrollView.content;
        this.content.anchorX = 0;
        this.content.anchorY = 1;
        this.content.removeAllChildren();
        this.scrollView.node.on("scrolling", this.onScrolling, this);
    }

    /**
     * 列表数据 (列表数据复制使用，如果列表数据改变，则需要重新设置一遍数据)
     * @param itemDataList item数据列表
     */
    public setData(itemDataList: Array<any>) {
        this.itemDataList = itemDataList.slice();
        this.updateContent();
    }

    /**计算列表的各项参数 */
    private countListParam() {
        let dataLen = this.itemDataList.length;
        if (this.type == ListType.Vertical) {
            this.scrollView.horizontal = false;
            this.scrollView.vertical = true;
            this.content.width = this.content.parent.width;
            this.content.height = dataLen * this.itemHeight + (dataLen - 1) * this.spaceY + this.padding_top + this.padding_buttom;
            this.spawnCount = Math.round(this.scrollView.node.height / (this.itemHeight + this.spaceY)) + 2; //计算创建的item实例数量，比当前scrollView容器能放下的item数量再加上2个
            this.halfScrollView = this.scrollView.node.height / 2 + this.itemHeight / 2 + this.spaceY; //计算bufferZone，item的显示范围
            this.updateFun = this.updateV;
        } else if (this.type == ListType.Horizontal) {
            this.scrollView.horizontal = true;
            this.scrollView.vertical = false;
            this.content.width = dataLen * this.itemWidth + (dataLen - 1) * this.spaceX + this.padding_left + this.padding_right;
            this.content.height = this.content.parent.height;
            this.spawnCount = Math.round(this.scrollView.node.width / (this.itemWidth + this.spaceX)) + 2;
            this.halfScrollView = this.scrollView.node.width / 2 + this.itemWidth / 2 + this.spaceX;
            this.updateFun = this.udpateH;
        } else if (this.type == ListType.Grid) {
            if (this.startAxis == StartAxisType.Vertical) {
                this.scrollView.horizontal = false;
                this.scrollView.vertical = true;
                this.content.width = this.content.parent.width;
                //如果left和right间隔过大，导致放不下一个item，则left和right都设置为0，相当于不生效
                if (this.padding_left + this.padding_right + this.itemWidth + this.spaceX > this.content.width) {
                    this.padding_left = 0;
                    this.padding_right = 0;
                    Logger.err("padding_left或padding_right过大");
                }

                this.gridCol = Math.floor((this.content.width - this.padding_left - this.padding_right) / (this.itemWidth + this.spaceX));
                this.gridRow = Math.ceil(dataLen / this.gridCol);
                this.content.height = this.gridRow * this.itemHeight + (this.gridRow - 1) * this.spaceY + this.padding_top + this.padding_buttom;
                this.spawnCount = Math.round(this.scrollView.node.height / (this.itemHeight + this.spaceY)) * this.gridCol + this.gridCol * 2;
                this.halfScrollView = this.scrollView.node.height / 2 + this.itemHeight / 2 + this.spaceY;
                this.updateFun = this.updateGrid_V;
            } else if (this.startAxis == StartAxisType.Horizontal) {
                this.scrollView.horizontal = true;
                this.scrollView.vertical = false;
                //计算高间隔
                this.content.height = this.content.parent.height;
                //如果left和right间隔过大，导致放不下一个item，则left和right都设置为0，相当于不生效
                if (this.padding_top + this.padding_buttom + this.itemHeight + this.spaceY > this.content.height) {
                    this.padding_top = 0;
                    this.padding_buttom = 0;
                    Logger.err("padding_top或padding_buttom过大");
                }

                this.gridRow = Math.floor((this.content.height - this.padding_top - this.padding_buttom) / (this.itemHeight + this.spaceY));
                this.gridCol = Math.ceil(dataLen / this.gridRow);
                this.content.width = this.gridCol * this.itemWidth + (this.gridCol - 1) * this.spaceX + this.padding_left + this.padding_right;
                this.spawnCount = Math.round(this.scrollView.node.width / (this.itemWidth + this.spaceX)) * this.gridRow + this.gridRow * 2;
                this.halfScrollView = this.scrollView.node.width / 2 + this.itemWidth / 2 + this.spaceX;
                this.updateFun = this.updateGrid_H;
            }
        }
    }

    /**
     * 创建列表 
     * @param startIndex 起始显示的数据索引 0表示第一项
     * @param offset     scrollView偏移量
     */
    private createList(startIndex: number, offset: cc.Vec2) {
        //当需要显示的数据长度 > 虚拟列表长度， 删除最末尾几个数据时，列表需要重置位置到scrollView最底端
        if (this.itemDataList.length > this.spawnCount && (startIndex + this.spawnCount - 1) >= this.itemDataList.length) {
            startIndex = this.itemDataList.length - this.spawnCount;
            offset = this.scrollView.getMaxScrollOffset();

            //当需要显示的数据长度 <= 虚拟列表长度， 隐藏多余的虚拟列表项 
        } else if (this.itemDataList.length <= this.spawnCount) {
            startIndex = 0;
        }

        for (let i = 0; i < this.spawnCount; i++) {
            let item: cc.Node;
            //需要显示的数据索引在数据范围内，则item实例显示出来
            if (i + startIndex < this.itemDataList.length) {
                if (this.itemList[i] == null) {
                    item = this.getItem();
                    this.itemList.push(item);
                    item.parent = this.content;
                } else {
                    item = this.itemList[i];
                }
                //需要显示的数据索引超过了数据范围，则item实例隐藏起来
            } else {
                //item实例数量 > 需要显示的数据量
                if (this.itemList.length > (this.itemDataList.length - startIndex)) {
                    item = this.itemList.pop();
                    item.removeFromParent();
                    this.itemPool.push(item);
                }
                continue;
            }

            let itemRender: ItemRender = item.getComponent(ItemRender);
            itemRender.itemIndex = i + startIndex;
            itemRender.data = this.itemDataList[i + startIndex];
            itemRender.dataChanged();
            item.on(cc.Node.EventType.TOUCH_END,this.doClick,this)

            if (this.type == ListType.Vertical) {
                //因为content的锚点X是0，所以item的x值是content.with/2表示居中，锚点Y是1，所以item的y值从content顶部向下是0到负无穷。所以item.y= -item.height/2时，是在content的顶部。
                item.setPosition(this.content.width / 2, -item.height * (0.5 + i + startIndex) - this.spaceY * (i + startIndex) - this.padding_top);
            } else if (this.type == ListType.Horizontal) {
                item.setPosition(item.width * (0.5 + i + startIndex) + this.spaceX * (i + startIndex) + this.padding_left, -this.content.height / 2);
            } else if (this.type == ListType.Grid) {
                if (this.startAxis == StartAxisType.Vertical) {
                    var row = Math.floor((i + startIndex) / this.gridCol);
                    var col = (i + startIndex) % this.gridCol;
                    item.setPosition(item.width * (0.5 + col) + this.spaceX * col + this.padding_left, -item.height * (0.5 + row) - this.spaceY * row - this.padding_top);
                    item.opacity = 255;
                } else if (this.startAxis == StartAxisType.Horizontal) {
                    var row = (i + startIndex) % this.gridRow;
                    var col = Math.floor((i + startIndex) / this.gridRow);
                    item.setPosition(item.width * (0.5 + col) + this.spaceX * col + this.padding_left, -item.height * (0.5 + row) - this.spaceY * row - this.padding_top);
                    item.opacity = 255;
                }
            }
        }

        this.scrollView.scrollToOffset(offset);
    }

    doClick(t){
       
        if(this.itemList.length > 0){
            for (let i = 0; i < this.itemList.length; i++) {
                let item = this.itemList[i];
                item.getChildByName('itemSelect').active = false
                
            }
        }
        t.currentTarget.getChildByName('itemSelect').active = true
        Logger.log(t)

    }

    /**获取一个列表项 */
    private getItem() {
        if (this.itemPool.length == 0) {
            return cc.instantiate(this.itemRender);
        } else {
            return this.itemPool.pop();
        }
    }

    update(dt) {
        if (this.bScrolling == false) {
            return;
        }
        this.updateTimer += dt;
        if (this.updateTimer < this.updateInterval) {
            return;
        }
        this.updateTimer = 0;
        this.bScrolling = false;
        this.updateFun();
    }

    onScrolling() {
        this.bScrolling = true;
    }

    /**垂直排列 */
    private updateV() {
        let items = this.itemList;
        let item;
        let bufferZone = this.halfScrollView;
        let isUp = this.scrollView.content.y > this.lastContentPosY;
        let offset = (this.itemHeight + this.spaceY) * items.length;
        for (let i = 0; i < items.length; i++) {
            item = items[i];
            let viewPos = this.getPositionInView(item);
            if (isUp) {
                //item上滑时，超出了scrollView上边界，将item移动到下方复用，item移动到下方的位置必须不超过content的下边界
                if (viewPos.y > bufferZone && item.y - offset - this.padding_buttom > -this.content.height) {
                    let itemRender: ItemRender = item.getComponent(ItemRender);
                    let itemIndex = itemRender.itemIndex + items.length;
                    itemRender.itemIndex = itemIndex;
                    itemRender.data = this.itemDataList[itemIndex];
                    itemRender.dataChanged();
                    item.y = item.y - offset;
                }
            } else {
                //item下滑时，超出了scrollView下边界，将item移动到上方复用，item移动到上方的位置必须不超过content的上边界
                if (viewPos.y < -bufferZone && item.y + offset + this.padding_top < 0) {
                    let itemRender: ItemRender = item.getComponent(ItemRender);
                    let itemIndex = itemRender.itemIndex - items.length;
                    itemRender.itemIndex = itemIndex;
                    itemRender.data = this.itemDataList[itemIndex];
                    itemRender.dataChanged();
                    item.y = item.y + offset;
                }
            }
        }
        this.lastContentPosY = this.scrollView.content.y;
    }

    /**水平排列 */
    private udpateH() {
        let items = this.itemList;
        let item;
        let bufferZone = this.halfScrollView;
        let isRight = this.scrollView.content.x > this.lastContentPosX;
        let offset = (this.itemWidth + this.spaceX) * items.length;
        for (let i = 0; i < items.length; i++) {
            item = items[i];
            let viewPos = this.getPositionInView(item);
            if (isRight) {
                //item右滑时，超出了scrollView右边界，将item移动到左方复用，item移动到左方的位置必须不超过content的左边界
                if (viewPos.x > bufferZone && item.x - offset - this.padding_left > 0) {
                    let itemRender: ItemRender = item.getComponent(ItemRender);
                    let itemIndex = itemRender.itemIndex - items.length;
                    itemRender.itemIndex = itemIndex;
                    itemRender.data = this.itemDataList[itemIndex];
                    itemRender.dataChanged();
                    item.x = item.x - offset;
                }
            } else {
                //item左滑时，超出了scrollView左边界，将item移动到右方复用，item移动到右方的位置必须不超过content的右边界
                if (viewPos.x < -bufferZone && item.x + offset + this.padding_right < this.content.width) {
                    let itemRender: ItemRender = item.getComponent(ItemRender);
                    let itemIndex = itemRender.itemIndex + items.length;
                    itemRender.itemIndex = itemIndex;
                    itemRender.data = this.itemDataList[itemIndex];
                    itemRender.dataChanged();
                    item.x = item.x + offset;
                }
            }
        }
        this.lastContentPosX = this.scrollView.content.x;
    }

    /**网格垂直排列 */
    private updateGrid_V() {
        let items = this.itemList;
        let item: cc.Node;
        let bufferZone = this.halfScrollView;
        let isUp = this.scrollView.content.y > this.lastContentPosY;
        let offset = (this.itemHeight + this.spaceY) * (this.spawnCount / this.gridCol);
        for (let i = 0; i < items.length; i++) {
            item = items[i];
            let viewPos = this.getPositionInView(item);
            if (isUp) {
                //item上滑时，超出了scrollView上边界，将item移动到下方复用，item移动到下方的位置必须不超过content的下边界
                if (viewPos.y > bufferZone && item.y - offset - this.padding_buttom > -this.content.height) {
                    let itemRender: ItemRender = item.getComponent(ItemRender);
                    let itemIndex = itemRender.itemIndex + (this.spawnCount / this.gridCol) * this.gridCol;
                    if (this.itemDataList[itemIndex] != null) {
                        item.y = item.y - offset;
                        itemRender.itemIndex = itemIndex;
                        itemRender.data = this.itemDataList[itemIndex];
                        itemRender.dataChanged();
                        item.opacity = 255;
                    } else {
                        item.y = item.y - offset;
                        itemRender.itemIndex = itemIndex;
                        item.opacity = 0;
                    }
                }
            } else {//item下滑时，超出了scrollView下边界，将item移动到上方复用，item移动到上方的位置必须不超过content的上边界
                if (viewPos.y < -bufferZone && item.y + offset + this.padding_top < 0) {
                    let itemRender: ItemRender = item.getComponent(ItemRender);
                    let itemIndex = itemRender.itemIndex - (this.spawnCount / this.gridCol) * this.gridCol;
                    if (this.itemDataList[itemIndex] != null) {
                        item.y = item.y + offset;
                        itemRender.itemIndex = itemIndex;
                        itemRender.data = this.itemDataList[itemIndex];
                        itemRender.dataChanged();
                        item.opacity = 255;
                    } else {
                        item.y = item.y + offset;
                        itemRender.itemIndex = itemIndex;
                        item.opacity = 0;
                    }
                }
            }
        }
        this.lastContentPosY = this.scrollView.content.y;
    }

    /**网格水平排列 */
    private updateGrid_H() {
        let items = this.itemList;
        let item;
        let bufferZone = this.halfScrollView;
        let isRight = this.scrollView.content.x > this.lastContentPosX;
        let offset = (this.itemWidth + this.spaceX) * (this.spawnCount / this.gridRow);
        for (let i = 0; i < items.length; i++) {
            item = items[i];
            let viewPos = this.getPositionInView(item);
            if (isRight) {
                //item右滑时，超出了scrollView右边界，将item移动到左方复用，item移动到左方的位置必须不超过content的左边界
                if (viewPos.x > bufferZone && item.x - offset - this.padding_left > 0) {
                    let itemRender: ItemRender = item.getComponent(ItemRender);
                    let itemIndex = itemRender.itemIndex - (this.spawnCount / this.gridRow) * this.gridRow;
                    if (this.itemDataList[itemIndex] != null) {
                        item.x = item.x - offset;
                        itemRender.itemIndex = itemIndex;
                        itemRender.data = this.itemDataList[itemIndex];
                        itemRender.dataChanged();
                        item.opacity = 255;
                    } else {
                        item.x = item.x - offset;
                        itemRender.itemIndex = itemIndex;
                        item.opacity = 0;
                    }
                }
            } else {
                //item左滑时，超出了scrollView左边界，将item移动到右方复用，item移动到右方的位置必须不超过content的右边界
                if (viewPos.x < -bufferZone && item.x + offset + this.padding_right < this.content.width) {
                    let itemRender: ItemRender = item.getComponent(ItemRender);
                    let itemIndex = itemRender.itemIndex + (this.spawnCount / this.gridRow) * this.gridRow;
                    if (this.itemDataList[itemIndex] != null) {
                        item.x = item.x + offset;
                        itemRender.itemIndex = itemIndex;
                        itemRender.data = this.itemDataList[itemIndex];
                        itemRender.dataChanged();
                        item.opacity = 255;
                    } else {
                        item.x = item.x + offset;
                        itemRender.itemIndex = itemIndex;
                        item.opacity = 0;
                    }
                }
            }
        }
        this.lastContentPosX = this.scrollView.content.x;
    }

    /**获取item在scrollView的局部坐标 */
    private getPositionInView(item) {
        let worldPos = item.parent.convertToWorldSpaceAR(item.position);
        let viewPos = this.scrollView.node.convertToNodeSpaceAR(worldPos);
        return viewPos;
    }

    /**获取列表数据 */
    public getListData() {
        return this.itemDataList;
    }

    /**
     * 增加一项数据到列表的末尾
     * @param data 数据
     */
    public addItem(data: any) {
        this.itemDataList.push(data);
        this.updateContent();
    }

    /**
     * 增加一项数据到列表指定位置
     * @param index   位置，0表示第1项
     * @param data  数据
     */
    public addItemAt(index: number, data: any) {
        if (this.itemDataList[index] != null || this.itemDataList.length == index) {
            this.itemDataList.splice(index, 1, data);
            this.updateContent();
        }
    }

    /**
     * 删除一项数据
     * @param index 删除项的位置 ,0表示第1项
     */
    public deleteItem(index: number) {
        if (this.itemDataList[index] != null) {
            this.itemDataList.splice(index, 1);
            this.updateContent();
        }
    }

    /**
     * 改变一项数据
     * @param index   位置,0表示第1项
     * @param data  替换的数据
     */
    public changeItem(index: number, data: any) {
        if (this.itemDataList[index] != null) {
            this.itemDataList[index] = data;
            this.updateContent();
        }
    }

    /**获取第一个Item的位置 */
    private updateContent() {
        //显示列表实例为0个
        if (this.itemList.length == 0) {
            this.countListParam();
            this.createList(0, new cc.Vec2(0, 0));
            //显示列表的实例不为0个，则需要重新排列item实例数组
        } else {
            if (this.type == ListType.Vertical) {
                this.itemList.sort((a: any, b: any) => {
                    return b.y - a.y;
                });
            } else if (this.type == ListType.Horizontal) {
                this.itemList.sort((a: any, b: any) => {
                    return a.x - b.x;
                });
            } else if (this.type == ListType.Grid) {
                if (this.startAxis == StartAxisType.Vertical) {
                    this.itemList.sort((a: any, b: any) => {
                        return a.x - b.x;
                    });
                    this.itemList.sort((a: any, b: any) => {
                        return b.y - a.y;
                    });
                } else if (this.startAxis == StartAxisType.Horizontal) {
                    this.itemList.sort((a: any, b: any) => {
                        return b.y - a.y;
                    });
                    this.itemList.sort((a: any, b: any) => {
                        return a.x - b.x;
                    });
                }
            }

            this.countListParam();

            //获取第一个item实例需要显示的数据索引
            var startIndex = this.itemList[0].getComponent(ItemRender).itemIndex;

            if (this.type == ListType.Grid && this.startAxis == StartAxisType.Vertical) {
                startIndex += (startIndex + this.spawnCount) % this.gridCol;
            } else if (this.type == ListType.Grid && this.startAxis == StartAxisType.Horizontal) {
                startIndex += (startIndex + this.spawnCount) % this.gridRow;
            }

            //getScrollOffset()和scrollToOffset()的x值是相反的
            var offset: cc.Vec2 = this.scrollView.getScrollOffset();
            offset.x = - offset.x;

            this.createList(startIndex, offset);
        }
    }

    /**销毁 */
    public onDestroy() {
        //清理列表项
        let len = this.itemList.length;
        for (let i = 0; i < len; i++) {
            if (cc.isValid(this.itemList[i], true)) {
                this.itemList[i].destroy();
            }
        }
        this.itemList.length = 0;
        //清理对象池
        len = this.itemPool.length;
        for (let i = 0; i < len; i++) {
            if (cc.isValid(this.itemPool[i], true)) {
                this.itemPool[i].destroy();
            }
        }
        this.itemPool.length = 0;
        //清理列表数据
        this.itemDataList.length = 0;
    }
}
