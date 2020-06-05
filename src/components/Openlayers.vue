<template>
    <div id="map" ref="rootmap">

    </div>
</template>

<script>
//import TileLayer from "ol/layer/Tile";
//import XYZ from "ol/source/XYZ";
import 'ol/ol.css'
import { Map, View } from "ol";
//import TileLayer from "ol/layer/Tile";
//import OSM from "ol/source/OSM";
import mapconfig from '../utils/mapconfig'

export default {
  data() {
    return {
      map: null
    };
  },
  mounted() {
    this.initMap1();
  },
  methods: {
      initMap1() {
          var mapcontainer = this.$refs.rootmap;
            this.map = new Map({
            target: mapcontainer,
            /* layers: [
                new TileLayer({
                source: new OSM()
                })
            ],
            view: new View({
                projection: "EPSG:4326",    //使用这个坐标系
                center: [104.980167,30.770697],  //
                zoom: 12
            }) */
            layers: mapconfig.streetmap(),
            view: new View({
                projection: "EPSG:4326",    //使用这个坐标系
                center: [mapconfig.x,mapconfig.y],  //深圳
                zoom: mapconfig.zoom
            })
            });
      },
  }
};
</script>

<style>
#map{
    display: none;
    height:100%;
    }
/*隐藏ol的一些自带元素*/
.ol-attribution,.ol-zoom { display: none;}

</style>