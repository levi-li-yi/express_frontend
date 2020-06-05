<template>
    <div>
        <div id="map" class="map"></div>
        <form class="form-inline">
            <label for="shall-smoothen">Smooth drawn geometry</label>
            <input type="checkbox" id="shall-smoothen" checked>
            <label for="iterations">Number of smoothings</label>
            <input type="range" style="width:250px" id="iterations" min="2" max="10" step="1" value="5">
        </form>
    </div>
</template>
<script>
import 'ol/ol.css';
import Map from 'ol/Map';
import View from 'ol/View';
import {Tile as TileLayer, Vector as VectorLayer} from 'ol/layer';
import { Vector as VectorSource} from 'ol/source';
import Draw from 'ol/interaction/Draw';
import smooth from 'chaikin-smooth';
import XYZ from "ol/source/XYZ";

export default {
    mounted() {
        this.initMap()
    },
    methods: {
        makeSmooth(path, numIterations) {
            numIterations = Math.min(Math.max(numIterations, 1), 10)
            while(numIterations > 0) {
                path = smooth(path)
                numIterations--
            }
            console.log(path)
            return path;
        },
        initMap() {
            let vectorSource = new VectorSource({});
            let map = new Map({
                layers: [
                    new TileLayer({
                        // source: new OSM(),
                        source: new XYZ({
                            url: "http://map.geoq.cn/ArcGIS/rest/services/ChinaOnlineStreetPurplishBlue/MapServer/tile/{z}/{y}/{x}"
                        }),
                        // opacity: 0.5
                    }),
                    new VectorLayer({
                        source: vectorSource
                    })
                ],
                target: 'map',
                view: new View({
                    center: [1078373.5950, 6871994.5910],
                    zoom: 5
                })
            });
            let shallSmoothen = document.getElementById('shall-smoothen');
            let numIterations = document.getElementById('iterations');

            let draw = new Draw({
                source: vectorSource,
                type: 'LineString'
            })
            map.addInteraction(draw);
            let self=this;
            draw.on('drawend', function(event) {
                if (!shallSmoothen.checked) {
                    return;
                }
                let feat = event.feature;
                let geometry = feat.getGeometry();
                let coords = geometry.getCoordinates();
                console.log(coords)
                let smoothened = self.makeSmooth(coords, parseInt(numIterations, 10) || 5)
                geometry.setCoordinates(smoothened)
            })
        }
    }
}
</script>
<style>

</style>    