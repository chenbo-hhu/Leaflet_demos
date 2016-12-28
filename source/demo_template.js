/**
 * Created by chenbo on 2016/10/12.
 */

// 规定好需要的库
seajs.config({
base: "./bower_components/",
alias:{
    "jquery":"jquery/dist/jquery.min.js",
    "jquery-ui": "jquery-ui/jquery-ui.min.js",
    "leaflet": "leaflet/dist/leaflet.js",
    "leaflet-providers": "leaflet-providers/leaflet-providers.js",
    "leaflet-chineseTmsProviders": "Leaflet.ChineseTmsProviders/src/leaflet.ChineseTmsProviders.js",
    "leaflet-hash": "leaflet-hash/leaflet-hash.js",
    "leaflet-draw": "leaflet-draw/dist/leaflet.draw.js",
    "leaflet.fullscreen": "leaflet.fullscreen/Control.FullScreen.js",
    "leaflet-minimap": "leaflet-minimap/dist/Control.MiniMap.min.js",
    "leaflet.zoombox": "Leaflet.ZoomBox/L.Control.ZoomBox.min.js",
    "leaflet-side-by-side": "leaflet-side-by-side/leaflet-side-by-side.js",
    "leaflet.easybutton": "Leaflet.EasyButton/src/easy-button.js",
    "leaflet.measurecontrol": "Leaflet.MeasureControl/leaflet.measurecontrol.min.js",
    "leaflet-measure": "leaflet-measure/dist/leaflet-measure.min.js",
    "leaflet-measure-path": "leaflet-measure-path/leaflet-measure-path.js",
    "leaflet-sidebar": "sidebar-v2/js/leaflet-sidebar.min.js",
    "leaflet-geojson-selector": "leaflet-geojson-selector/dist/leaflet-geojson-selector.src.js",
    "shp": "shp/dist/shp.min.js",
    "spin": "spin.js/spin.min.js",
    "leaflet-spin": "leaflet-spin/leaflet.spin.min.js",
    "leaflet-gibs-metadata": "leaflet-GIBS/src/GIBSMetadata.js",
    "leaflet-gibs": "leaflet-GIBS/src/GIBSLayer.js",
    "leaflet-groupedlayercontrol": "leaflet-groupedlayercontrol/dist/leaflet.groupedlayercontrol.min.js",
    "leaflet.timedimension": "leaflet-timedimension/dist/leaflet.timedimension.src.js",
},
preload: ['jquery', 'leaflet', "spin"]
});

// leaflet-spin依赖spin.js
var libs = ['jquery-ui', 'leaflet-hash', 'leaflet-providers', 'leaflet-chineseTmsProviders', 'leaflet.fullscreen', 
'leaflet-minimap', 'leaflet.zoombox', 'leaflet-side-by-side',
'leaflet.easybutton', 'leaflet.measurecontrol', 'leaflet-measure', 'leaflet-measure-path', 
'leaflet-sidebar', 'leaflet-geojson-selector', 'shp', 'leaflet-spin', 'leaflet-gibs-metadata', 'leaflet-gibs',
'leaflet-groupedlayercontrol', 'leaflet.timedimension'];

// 使用回调是为了保证先载入leaflet-draw, 再载入与之有依赖关系的库 
seajs.use(['leaflet-draw'], function  () {
    seajs.use(libs, function () {        

        var map = L.map("map",{
            fullscreenControl: true,
            fullscreenControlOptions: {
                position: 'topleft'
            },
            // Add timedimension tool.
            timeDimension: true,
            timeDimensionControl: true,
        }).setView([29.92831, 121.5484], 5);

        // 添加Hash工具
        L.hash(map);

        // 加入底图图层
        // var baseLayer = L.tileLayer.provider("OpenStreetMap").addTo(map);

        // 添加绘制工具
        var editableLayers = new L.FeatureGroup();
        map.addLayer(editableLayers);

        var MyCustomMarker = L.Icon.extend({
            options: {
                shadowUrl: null,
                iconAnchor: new L.Point(12, 12),
                iconUrl: 'bower_components/leaflet/dist/images/marker-icon.png'
            }
        });

        var options = {
            position: 'topright',
            draw: {
                polyline: {
                    shapeOptions: {
                        color: '#f357a1',
                        weight: 10
                    }
                },
                polygon: {
                    allowIntersection: false, // Restricts shapes to simple polygons
                    drawError: {
                        color: '#e1e100', // Color the shape will turn when intersects
                        message: '<strong>Oh snap!<strong> you can\'t draw that!' // Message that will show when intersect
                    },
                    shapeOptions: {
                        color: '#bada55'
                    }
                },
                circle: true, // Turns off this drawing tool
                rectangle: {
                    shapeOptions: {
                        clickable: true
                    }
                },
                marker: {
                    icon: new MyCustomMarker()
                }
            },
            edit: {
                featureGroup: editableLayers, //REQUIRED!!
                remove: true
            }
        };

        var drawControl = new L.Control.Draw(options);
        map.addControl(drawControl);

        // 矢量图层绘制完成时触发的事件
        map.on('draw:created', function (e) {
            var type = e.layerType,
                layer = e.layer;

            editableLayers.addLayer(layer);

            if (type === 'marker') {
                layer.bindPopup('A popup!');
            } else {
                layer.showMeasurements();
            }            

            // 显示坐标点数据
            if ($('a[href="#coordinate"]')[0].parentNode.className !== 'active') {
                $('a[href="#coordinate"]')[0].click();
            }

            var tempjson = layer.toGeoJSON();
            if (layer.getRadius) {
                tempjson.geometry.type = "Circle";
                tempjson.geometry.radius = [layer.getRadius()];
            }

            $('div#coordinate p').text(JSON.stringify(tempjson));

            // 增加点击矢量图层显示坐标点数据功能
            layer.on('click', (function () {
                $('div#coordinate p').text(JSON.stringify(tempjson));
            }).bind(layer));

        });

        // 为Trash图标绑定清空坐标点数据的功能
        $('i.fa.fa-remove').parent().on('click', function(){$('div#coordinate p').text(null)})

        // 添加鹰眼图或者是缩略图
        var miniMap = new L.Control.MiniMap(L.tileLayer.provider("OpenStreetMap"), {
            minimized: true,
            toggleDisplay: true
        }).addTo(map);

        L.control.zoomBox({
            modal: false
        }).addTo(map);

        //添加幕帘功能
        // TODO:需要改进
        var layer1 = L.tileLayer.chinaProvider("Google.Normal.Map", {maxZoom: 18, minZoom: 3}).addTo(map);
        var layer2 = L.tileLayer.chinaProvider("Google.Satellite.Map", {maxZoom: 18, minZoom: 3}).addTo(map);

        layer2.getContainer().style.clip = 'rect(0px, 0px, 0px, 0px)';

        var compareControl = L.control.sideBySide(layer1, layer2);

        var sideByside = function () {
            var flag = false;
            return function () {
                // console.log(flag);
                if (flag){
                    compareControl.removeFromMap();
                    flag = false
                }else{
                    compareControl.addTo(map);
                    flag = true;
                }
            };
        }();

        // 添加帘幕功能按钮
        L.easyButton('fa fa-map', function () {
            sideByside()
        }, "幕帘").addTo(map);

        // 添加测距功能按钮
        L.Control.measureControl().addTo(map);

        // 添加测量功能
        L.control.measure().addTo(map);

        // 添加比例尺
        L.control.scale().addTo(map);

        // 添加sidebar
        var sidebar = L.control.sidebar('sidebar', {position: 'right'}).addTo(map);

        // 添加Geojson-Selector
        var geoLayer = L.geoJson({features:[]},{onEachFeature:function popUp(f,l){
            var out = [];
            if (f.properties){
                for(var key in f.properties){
                    out.push(key+": "+f.properties[key]);
                }
            l.bindPopup(out.join("<br />"));
            }
            // l.bindTooltip("f.properties.NAME_1");
        }}).addTo(map);

        // 显示载入的图标
        map.spin(true);
        var chinaShapefileUrl = './china/CHN_adm1';
        shp(chinaShapefileUrl).then(function (data) {
            map.spin(false);
            geoLayer.addData(data);
            // 使用geojson-selector
            var geoList = L.control.geoJsonSelector(geoLayer, {
                collapsed: true,
                position: 'topleft',
                listLabel: 'properties.NAME_1',
                style: {
                    color:'#00f',
                    fillColor:'#fff',
                    fillOpacity: 0,
                    opacity: 1,
                    weight: 1.2
                },
                activeClass: 'active',          //css class name for active list items
                activeStyle: {                  //style for Active GeoJSON feature
                    color:'#00f',
                    fillColor:'#fc0',
                    fillOpacity: 0.3,
                    opacity: 1,
                    weight: 1.2
                },
                selectClass: 'selected',
                selectStyle: {
                    color:'#00f',
                    fillColor:'#f80',
                    fillOpacity: 0.5,
                    opacity: 1,
                    weight: 1.2
                }
            }).addTo(map);
            // 去除载入的图标
        })

        // 处理leaflet-GIBS模块
        var now = new Date();
        var oneDay = 1000*60*60*24, // milliseconds in one day
            startTimestamp = now.getTime() - oneDay + now.getTimezoneOffset()*60*1000,
            startDate = new Date(startTimestamp); //previous day

        var overLayers = {};

        for (var id in L.GIBS_LAYERS) {
            overLayers[id] = new L.GIBSLayer(id, {date: startDate, transparent: true});
        }
                
        // L.control.layers(null, overLayers, {collapsed: true, position: "topleft"}).addTo(map);

        L.control.groupedLayers(null, {GIBSLayer: overLayers}, {position: "topleft"}).addTo(map);

        // Add timedimension tool.
        var testLayer = new L.GIBSLayer("AMSR2_Snow_Water_Equivalent", {date: startDate, transparent: true});
        console.log(testLayer);
        var timeLayer = L.timeDimension.layer(testLayer);
        console.log(timeLayer);
        timeLayer.addTo(map);
    });
});

