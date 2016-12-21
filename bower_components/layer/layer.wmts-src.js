

//http://t1.tianditu.cn/vec_c/wmts?SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&LAYER=vec&STYLE=default&TILEMATRIXSET=c&TILEMATRIX=8&TILEROW=44&TILECOL=211&FORMAT=tiles
//http://t1.tianditu.cn/vec_c/wmts?service=WMTS&request=GetTile&version=1.0.0&layer=&style=&tilematrixSet=&format=image%2Fjpeg&height=256&width=256&TILEMATRIX=8&TILEROW=44&TILECOL=211
L.TileLayer.WMTS = L.TileLayer.extend({
    defaultWmtsParams: {
        service: 'WMTS',
        request: 'GetTile',
        version: '1.0.0',
        layer: '',
        style: 'default',
        tilematrixSet: 'c',
        format: 'tiles'
    },
    layerType:'WMTSLayer',
    initialize: function (url, options) { // (String, Object)
        this._url = url instanceof Array ? url : [url];
        var wmtsParams = L.extend({}, this.defaultWmtsParams),
            tileSize = options.tileSize || this.options.tileSize;
        if (options.detectRetina && L.Browser.retina) {
            wmtsParams.width = wmtsParams.height = tileSize * 2;
        } else {
            wmtsParams.width = wmtsParams.height = tileSize;
        }
        for (var i in options) {
            // all keys that are not TileLayer options go to WMTS params
            if (!this.options.hasOwnProperty(i) && i!="matrixIds") {
                wmtsParams[i] = options[i];
            }
        }
        this.wmtsParams = wmtsParams;
        L.setOptions(this, options);
    },

    onAdd: function (map) {
        L.TileLayer.prototype.onAdd.call(this, map);
    },

    getTileUrl: function (tilePoint) {
        var url = this._url[(tilePoint.x + tilePoint.y) % this._url.length];
        return url + L.Util.getParamString(this.wmtsParams, url) +
            "&tilematrix=" + tilePoint.z +
            "&tilerow=" + tilePoint.y +
            "&tilecol=" + tilePoint.x;
    },

    setParams: function (params, noRedraw) {
        L.extend(this.wmtsParams, params);
        if (!noRedraw) {
            this.redraw();
        }
        return this;
    }
});

L.tileLayer.wmts = function (url, options) {
    return new L.TileLayer.WMTS(url, options);
};

L.TileLayer.TDT = L.TileLayer.WMTS.extend({
    urlArray: [],

    tdtOptions: {},

    initialize: function (url, options) { // (String, Object)
        this._url = this.urlArray;
        options = this.tdtOptions;

        var wmtsParams = L.extend({}, this.defaultWmtsParams),
            tileSize = options.tileSize || this.options.tileSize;
        if (options.detectRetina && L.Browser.retina) {
            wmtsParams.width = wmtsParams.height = tileSize * 2;
        } else {
            wmtsParams.width = wmtsParams.height = tileSize;
        }
        for (var i in options) {
            // all keys that are not TileLayer options go to WMTS params
            if (!this.options.hasOwnProperty(i) && i != "matrixIds") {
                wmtsParams[i] = options[i];
            }
        }
        this.wmtsParams = wmtsParams;
        L.setOptions(this, options);
    }
});

L.TileLayer.TDT.Vector = L.TileLayer.TDT.extend({
    urlArray: ["http://t0.tianditu.com/vec_c/wmts",
        "http://t1.tianditu.com/vec_c/wmts",
        "http://t2.tianditu.com/vec_c/wmts",
        "http://t3.tianditu.com/vec_c/wmts"],

    tdtOptions: {
        layer: 'vec',
        style: 'default',
        format: 'tiles',
        tilematrixSet: 'c',
        attribution: '天地图'
    }
});

L.TileLayer.TDT.VectorAnno = L.TileLayer.TDT.extend({
    urlArray: ["http://t0.tianditu.com/cva_c/wmts",
        "http://t1.tianditu.com/cva_c/wmts",
        "http://t2.tianditu.com/cva_c/wmts",
        "http://t3.tianditu.com/cva_c/wmts"],

    tdtOptions: {
        layer: 'cva',
        style: 'default',
        format: 'tiles',
        tilematrixSet: 'c',
        attribution: '天地图'
    }
});

L.TileLayer.TDT.Raster = L.TileLayer.TDT.extend({
    urlArray: ["http://t0.tianditu.com/img_c/wmts",
        "http://t1.tianditu.com/img_c/wmts",
        "http://t2.tianditu.com/img_c/wmts",
        "http://t3.tianditu.com/img_c/wmts"],

    tdtOptions: {
        layer: 'img',
        style: 'default',
        format: 'tiles',
        tilematrixSet: 'c',
        attribution: '天地图'
    }
});

L.TileLayer.TDT.RasterAnno = L.TileLayer.TDT.extend({
    urlArray: ["http://t0.tianditu.com/cia_c/wmts",
        "http://t1.tianditu.com/cia_c/wmts",
        "http://t2.tianditu.com/cia_c/wmts",
        "http://t3.tianditu.com/cia_c/wmts"],

    tdtOptions: {
        layer: 'cia',
        style: 'default',
        format: 'tiles',
        tilematrixSet: 'c',
        attribution: '天地图'
    }
});




