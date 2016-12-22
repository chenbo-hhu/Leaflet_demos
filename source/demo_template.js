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
    "leaflet-geojson-selector": "leaflet-geojson-selector/src/leaflet-geojson-selector.js",
    "shp": "shp/dist/shp.min.js",
},
preload: ['jquery', 'leaflet']
});

var libs = ['jquery-ui', 'leaflet-hash', 'leaflet-providers','leaflet.fullscreen', 
'leaflet-minimap', 'leaflet.zoombox', 'leaflet-side-by-side',
'leaflet.easybutton', 'leaflet.measurecontrol', 'leaflet-measure', 'leaflet-measure-path', 
'leaflet-sidebar', 'leaflet-geojson-selector', 'shp'];

// 使用回调是为了保证先载入leaflet-draw, 再载入与之有依赖关系的库 
seajs.use(['leaflet-draw'], function  () {
    seajs.use(libs, function () {        

        var map = L.map("map",{
            fullscreenControl: true,
            fullscreenControlOptions: {
                position: 'topleft'
            }
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
        var layer1 = L.tileLayer.provider("OpenStreetMap").addTo(map);
        var layer2 = L.tileLayer.provider("Esri.WorldStreetMap").addTo(map);
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
        }}).addTo(map);


        var chinaShapefileUrl = './china/CHN_adm1';
        shp(chinaShapefileUrl).then(function (data) {
            geoLayer.addData(data);
            // var geoList = L.control.geoJsonSelector(geoLayer).addTo(map);
        })
    });
});

