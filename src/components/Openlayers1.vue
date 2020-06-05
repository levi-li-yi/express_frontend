<template>
    <div>
        <div id="map" ref="map"></div>
        <div id="popup" class="ol-popup">
            <a href="#" id="popup-closer" class="ol-popup-closer"></a>
            <div id="popup-content" class="popup-content"></div>
        </div>
    </div>
</template>

<script>
import "ol/ol.css";
import { Map, View } from "ol";
import { toStringHDMS } from "ol/coordinate";
import TileLayer from "ol/layer/Tile";
import XYZ from "ol/source/XYZ";
import Overlay from "ol/Overlay";
import { fromLonLat, transform, toLonLat } from "ol/proj";

export default {
    data() {
        return {
            map: null,
            overlay: null
        }
    },
    mounted() {
        this.initMap();
        this.addPopup();
    },
    methods: {
        initMap() {
            let target = "map" // 绑定页面元素ID
            let tileLayer = new TileLayer({
                source: new XYZ({
                    url: "http://map.geoq.cn/ArcGIS/rest/services/ChinaOnlineStreetPurplishBlue/MapServer/tile/{z}/{y}/{x}"
                })
            })
            let view = new View({
                center: fromLonLat([104.980167,30.770697]),
                zoom: 5
            })
            this.map = new Map({
                target: target,
                layers: [tileLayer], // 配置地图数据源
                view: view // 配置地图显示的options(坐标系、中心点、缩放级别)
            })
        },
        /* 创建一个overlay，叠加从对象用作显示弹窗
        1、点击地图位置
        2、获取经纬度坐标
        3、调用ol内置方法ol.overlay实现弹出
         */
        addPopup() {
            // 变量存储弹窗所需的DOM对象
            let container = document.getElementById("popup")
            let closer = document.getElementById("popup-closer")
            let content = document.getElementById("popup-content")
            // 创建一个弹窗Overlay对象
            this.overlay = new Overlay({
                element: container, // 绑定Overlay对象和DOM对象
                autoPan: true, // 弹出窗口在边缘点击时，设置自动平移效果
                autoPanAnimation: {
                    duration: 250 // 自动平移相关的动画时间
                }
            });
            // 将弹窗添加到map地图中
            this.map.addOverlay(this.overlay);
            let self = this;
            // 添加单击响应函数来处理弹窗动作
            this.map.on('click', function(evt) {
                // 转换
                let coordinate = transform(
                    evt.coordinate,
                    "EPSG:3857",
                    "EPSG:4326"
                );
                // 点击尺（米）
                let hdms = toStringHDMS(toLonLat(evt.coordinate)); // 转换为经纬度
                content.innerHTML = `
                <p>点击</p>
                <p>经纬度：${hdms}</p>
                <p>坐标：X:${coordinate[0]}  Y:${coordinate[1]}</p>
                `
                self.overlay.setPosition(evt.coordinate); // 把overlay显示到指定的x、y坐标
            })
            // 弹窗添加关闭函数
            closer.onclick = function() {
                self.overlay.setPosition(undefined);
                closer.blur();
                return false;
            }
        }
    }
}
</script>

<style>
html,
body {
    height: 100%;
}
#app {
    min-height: calc(100vh - 50px);
    width: 100%;
    position: relative;
    overflow: none;
}
#map {
        height: 888px;
        min-height: calc(100vh - 50px);
    }
.ol-popup {
    position: absolute;
    background-color: white;
    -webkit-filter: drop-shadow(0 1px 4px rgba(0, 0, 0, 0.2));
    filter: drop-shadow(0 1px 4px rgba(0, 0, 0, 0.2));
    padding: 15px;
    border-radius: 10px;
    border: 1px solid #cccccc;
    bottom: 12px;
    left: -50px;
}
.ol-popup:after,
.ol-popup:before {
    top: 100%;
    border: solid transparent;
    content: " ";
    height: 0;
    width: 0;
    position: absolute;
    pointer-events: none;
}
.ol-popup:after {
    border-top-color: white;
    border-width: 10px;
    left: 48px;
    margin-left: -10px;
}
.ol-popup:before {
    border-top-color: #cccccc;
    border-width: 11px;
    left: 48px;
    margin-left: -11px;
}
.ol-popup-closer {
    text-decoration: none;
    position: absolute;
    top: 2px;
    right: 8px;
}
.popup-content {
    width: 400px;
}
.ol-popup-closer:after {
    content: "✖";
}
</style>