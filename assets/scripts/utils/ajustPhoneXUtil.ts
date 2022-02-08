var ajustPhoneXUtil = {
    isPhoneX: false,
    iPhoneXLiuHaiSize: cc.size(200, 0),
    iPhoneXBottomSize: cc.size(200, 0),
    scale: 0,
    gameScale: null,
    checkPhoneX(cvsNode) {
        this.scale = 1;
        this.setGameScale()
        var isMobile = cc.sys.isMobile;
        var visibleSize = cc.view.getVisibleSizeInPixel();
        var visibleFactor = visibleSize.height / visibleSize.width;
        if (isMobile && visibleFactor > 1.3) {
            if (visibleFactor > 2) {
                this.isPhoneX = true;
                if (window['systemInfo']) {
                    if (window['systemInfo'].model) {
                        var model = window['systemInfo'].model.toLowerCase();
                        var brand = window['systemInfo'].brand.toLowerCase();
                        if ((brand === "xiaomi" || model.indexOf("mi") !== -1)) {//小米长屏自动适配
                            this.isPhoneX = false;
                        }
                    }
                }
                var cvsComponent = cvsNode.getComponent(cc.Canvas);
                cvsNode.removeComponent(cc.Widget);
                if (visibleSize.width / visibleSize.height > 2) {
                    cvsComponent.fitHeight = true;
                    cvsComponent.fitWidth = false;
                } else if (visibleFactor > 2) {
                    cvsComponent.fitHeight = false;
                    cvsComponent.fitWidth = true;
                }
            }
        } else {
            this.isFitHeightAndWidth = true;
            this.gameScale = cc.v2(1, 1);
            var cvsComponent = cvsNode.getComponent(cc.Canvas);
            cvsNode.removeComponent(cc.Widget);
            cvsComponent.fitHeight = true;
            cvsComponent.fitWidth = true;
        }
    },

    setGameScale() {
        var pixelSize = cc.view.getVisibleSizeInPixel();
        var designSize = cc.view.getDesignResolutionSize();
        var rateH = (pixelSize.height / designSize.height).toFixed(2);
        var rateW = (pixelSize.width / designSize.width).toFixed(2);
        var scaleX = 1;
        var scaleY = Number(rateH) / Number(rateW);
        this.gameScale = cc.v2(scaleX, scaleY);
    },

    getGameScale() {
        return Math.min(this.gameScale.x, this.gameScale.y);
    },
    resetWidget(node) {
        if (this.isPhoneX && node && cc.isValid(node)) {
            var widget = node.getComponent(cc.Widget);
            if (node.name === "Canvas" || (widget && ((widget.isAlignTop && widget.top == 0) &&
                (widget.isAlignBottom && widget.bottom == 0) && (widget.isAlignLeft && widget.left == 0) && (widget.isAlignRight && widget.right == 0)))) {
                if (node.childrenCount > 0) {
                    var children = node.children;
                    for (let i = 0; i < children.length; i++) {
                        const child = children[i];
                        this.resetWidget(child);
                    }
                }
            } else {
                if (widget) {
                    if (widget.isAlignTop) widget.top += 54;
                    if (widget.isAlignBottom) widget.bottom += 34;
                }
            }
        }
    },
};
export default ajustPhoneXUtil = ajustPhoneXUtil