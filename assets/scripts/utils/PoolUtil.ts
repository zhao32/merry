var PoolUtil = {
    poolCache: {},

    _getCache(name) {
        if (!this.poolCache[name]) {
            this.poolCache[name] = new cc.NodePool();
        }
        return this.poolCache[name];
    },

    getItemShowNode(itemPerfab, cb) {
        var name = itemPerfab.name;
        var pool = this._getCache(name);
        var node = null;

        if (pool.size() > 0) {
            node = pool.get();
            cb && cb(node); cb = null;
        } else {
            node = cc.instantiate(itemPerfab);
            node.name = name;
            cb && cb(node); cb = null;
        }
        return node;
    },

    returnItemShowNode(node) {
        var pool = this._getCache(node.name);
        pool.put(node);
    },

    clearPool(name) {
        if (this.poolCache[name]) {
            this.poolCache[name].clear();
        }
    }
}
export default PoolUtil = PoolUtil;