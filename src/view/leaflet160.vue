<script setup lang="ts">
import { onMounted, reactive, ref } from "vue";
// @ts-ignore
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "proj4leaflet";
import proj4 from "proj4";
import { tileLayers } from "./layerControl";
const map: any = ref(null);

interface data {
    mapTileLayers: any;
    controlLayers: any;
}
const data: data = reactive({
    mapTileLayers: {},
    controlLayers: null,
});

onMounted(() => {
    // Leaflet 的默认投影是 Web Mercator (EPSG:3857)，这是 Web 地图的标准投影，包括 Google Maps, OpenStreetMap, Bing Maps 等都使用这种投影。

    // 定义坐标系编码
    // const crs4490 = new L.Proj.CRS(
    //     "EPSG:4490",
    //     "+proj=longlat +ellps=GRS80 +no_defs",
    //     {
    //         transformation: new L.Transformation(1, 0, -1, 0),
    //     }
    // );

    // const EPSG2400 = new L.Proj.CRS(
    //     "EPSG:2400",
    //     "+lon_0=15.808277777799999 +lat_0=0.0 +k=1.0 +x_0=1500000.0 " +
    //         "+y_0=0.0 +proj=tmerc +ellps=bessel +units=m " +
    //         "+towgs84=414.1,41.3,603.1,-0.855,2.141,-7.023,0 +no_defs",
    //     {
    //         resolutions: [8192, 4096, 2048], // 3 example zoom level resolutions
    //     }
    // );
    // const EPSG4490 = new L.Proj.CRS(
    //     "EPSG:4490",
    //     "+proj=longlat +ellps=GRS80 +no_defs +type=crs",
    //     {
    //         origin: [104.2, 90],
    //         resolutions: [0.125, 0.0625, 0.03125, 0.015625, 0.0078125],
    //         bounds: L.bounds([-180, -90], [180, 90]),
    //     }
    // );

    proj4.defs("EPSG:4326", "+proj=longlat +datum=WGS84 +no_defs");
    proj4.defs("EPSG:BD09", "+proj=longlat +ellps=WGS84 +datum=WGS84 +no_defs");
    var bdCoords = [118.095405, 24.486115]; // 百度坐标系经纬度
    var bdLonLat = proj4("EPSG:BD09", "EPSG:4326", bdCoords); // 将百度坐标系转换为84坐标系

    var wgs84Coords = [
        bdLonLat[0], // 将经度从毫秒转换为度
        bdLonLat[1], // 将纬度从毫秒转换为度
    ];

    console.log(wgs84Coords); // 输出转换后的84坐标系经纬度

    // 创建 BD09 坐标系的自定义 CRS
    // const BD09CRS = L.extend({}, L.CRS, {
    //     code: "BD09",
    //     projection: L.Projection.SphericalMercator,

    //     // 坐标转换函数
    //     transformation: new L.Transformation(1, 0, -1, 0),

    //     // 缩放级别和像素分辨率的映射关系
    //     scales: [256 * Math.pow(2, 20)],
    //     zoom: function (scale) {
    //         return Math.floor(Math.log(scale / 256) / Math.log(2));
    //     },
    //     zoomScale: function (zoom) {
    //         return 256 * Math.pow(2, zoom);
    //     },
    //     // 偏移量
    //     origin: [0, 0],
    // });

    // const BD09CRS = new L.Proj.CRS(
    //     "EPSG:BD09",
    //     "+proj=longlat +ellps=bd09 +towgs84=0,0,0 +no_defs",
    //     {
    //         origin: [0, 0],
    //         resolutions: [
    //             156543.03392804097, 78271.51696402048, 39135.75848201024,
    //             19567.87924100512, 9783.93962050256, 4891.96981025128,
    //             2445.98490512564, 1222.99245256282, 611.49622628141,
    //             305.748113140705, 152.8740565703525, 76.43702828517625,
    //             38.21851414258813, 19.109257071294063, 9.554628535647032,
    //             4.777314267823516, 2.388657133911758, 1.194328566955879,
    //             0.5971642834779395,
    //         ],
    //     }
    // );

    // L.CRS.Baidu = L.Util.extend({}, L.CRS.Earth, {
    //     code: "EPSG:Baidu",
    //     projection: L.Projection.BaiduMercator,
    //     transformation: new L.Transformation(1, 0.5, -1, 0.5),
    //     scale: function (zoom) {
    //         return 1 / Math.pow(2, 18 - zoom);
    //     },
    //     zoom: function (scale) {
    //         return 18 - Math.log(1 / scale) / Math.LN2;
    //     },
    // });

    // var crs = new L.Proj.CRS(
    //     "EPSG:4326",
    //     "+proj=longlat +datum=WGS84 +no_defs",
    //     {
    //         transformation: new L.Transformation(1, 0, -1, 0),
    //         scale: function (zoom) {
    //             return Math.pow(2, zoom);
    //         },
    //         origin: [-180, 90],
    //     }
    // );

    // imgLayer.on("tileload", leafletEventDelegation.tileload.bind(map.value));

    //

    /**
     * tile layers
     */

    data.mapTileLayers = {
        电子底图: {
            base: tileLayers.TDT_vecLayer,
            over: {
                电子注记: tileLayers.TDT_cvaLayer,
                电子英文注记: tileLayers.TDT_evaLayer,
                全球境界: tileLayers.TDT_iboLayer,
            },
        },
        影像底图: {
            base: tileLayers.TDT_imgLayer,
            over: {
                影像注记: tileLayers.TDT_ciaLayer,
                影像英文注记: tileLayers.TDT_eiaLayer,
                全球境界: tileLayers.TDT_iboLayer,
            },
        },
        地形底图: {
            base: tileLayers.TDT_terLayer,
            over: {
                地形注记: tileLayers.TDT_ctaLayer,
                全球境界: tileLayers.TDT_iboLayer,
            },
        },
        mapbox电子底图: {
            base: tileLayers.mapbox_EBMLayer,
            over: {},
        },
        高德电子底图: {
            base: tileLayers.amap_EBMLayer,
            over: {},
        },
        谷歌地图: {
            base: tileLayers.gooleMap_EBMLayer,
            over: {},
        },
    };

    // const crs = new L.Proj.CRS(
    //     "EPSG:4490",
    //     "+proj=longlat +datum=WGS84 +no_defs",
    //     {
    //         resolutions: [
    //             0.703125, 0.3515625, 0.17578125, 0.087890625, 0.0439453125,
    //             0.02197265625, 0.010986328125, 0.0054931640625,
    //             0.00274658203125, 0.001373291015625, 0.0006866455078125,
    //             0.00034332275390625, 0.000171661376953125,
    //             0.0000858306884765625, 0.00004291534423828125,
    //             0.000021457672119140625, 0.0000107288360595703125,
    //             0.00000536441802978515625, 0.000002682209014892578125,
    //         ],
    //         origin: [-180, 90],
    //         bounds: L.bounds([-180, -90], [180, 90]),
    //     }
    // );

    /**
     * new map
     */

    map.value = L.map("map", {
        center: [24.47961, 118.08888],
        // crs: L.CRS.EPSG3857,
        // crs: L.CRS.EPSG3395,
        // crs: EPSG4490,
        // crs: L.CRS.EPSG4326,
        // crs,
        // crs: BD09CRS,
        zoom: 12,
        zoomSnap: 0, // 关闭缩放级别捕捉
        layers: [data.mapTileLayers["电子底图"].base],
        zoomControl: true,
        attributionControl: true,
        doubleClickZoom: true,
        wheelPxPerZoomLevel: 10,

        minZoom: 1,
        maxZoom: 18,
        // @ts-ignore
        maxNativeZoom: 14,
    });

    console.log("info map", map.value, L.CRS);

    map.value.options.zoomSnap = 1; // 每次缩的zoom值必须是0.2的倍数
    map.value.options.zoomDelta = 1; // 每次点击缩放按钮 要么-0.2 要么+0.2
    map.value.options.wheelPxPerZoomLevel = 300;

    // map.value.setView([0, 0], 5);

    /**
     * map layer controller
     */
    data.controlLayers = L.control.layers(
        Object.keys(data.mapTileLayers).reduce((t: any, c: any) => {
            t[c] = data.mapTileLayers[c].base;
            return t;
        }, {}),
        data.mapTileLayers["电子底图"].over
    );
    data.controlLayers.addTo(map.value);
    L.marker([24.480037, 118.089179]).addTo(map.value);

    // map.value.createPane("labels");
    // map.value.getPane("labels").style.zIndex = 650;

    /**
     * map events
     */
    map.value.on("tileload", leafletEventDelegation.tileload.bind(map.value));
    map.value.on("moveend", leafletEventDelegation.zoomend.bind(map.value));
    map.value.on("zoomend", leafletEventDelegation.moveend.bind(map.value));
    map.value.on("click", leafletEventDelegation.mapClick.bind(map.value));
    map.value.on(
        "locationfound",
        leafletEventDelegation.locationfound.bind(map.value)
    );
    map.value.on(
        "locationerror",
        leafletEventDelegation.locationerror.bind(map.value)
    );
    map.value.on(
        "overlayadd",
        leafletEventDelegation.overlayadd.bind(map.value)
    );
    map.value.on(
        "baselayerchange",
        leafletEventDelegation.baselayerchange.bind(map.value)
    );
});

const leafletEventDelegation = {
    tileload: function (e: any) {
        return;
        console.log("tileload", e);
        if (e.coords.z == 4) {
            console.log("做一些该层级 要显示的东西...");
            // 直接不显示该图层，透明度设置为0
            // e.target.options.opacity = 0

            // 当然，还有其他类型的要求，比如在该瓦片下 我要直接隐藏  15-20层级的  x y 在某个海域的瓦片地址（使用海路融合、航道、灯塔、客流量信息融合图的瓦片资源）
            // e.target._url = "http://t0.tianditu.gov.cn/img_w/wmts?SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&LAYER=img&STYLE=default&TILEMATRIXSET=c&FORMAT=tiles&TILEMATRIX={z}&TILEROW={y}&TILECOL={x}&tk=cca632d0f52e2e34f091af5a25699305"
            e.target.setUrl(
                "https://t{s}.tianditu.gov.cn/vec_w/wmts?service=WMTS&request=GetTile&version=1.0.0&layer=vec&style=default&tilematrixset=w&format=tiles&tilematrix={z}&tilecol={x}&tilerow={y}&tk={k}"
            );
        } else {
            e.target.setUrl(
                "https://t{s}.tianditu.gov.cn/{t}/wmts?service=WMTS&request=GetTile&version=1.0.0&layer={l}&style=default&tilematrixset=w&format=tiles&tilematrix={z}&tilecol={x}&tilerow={y}&tk={k}"
            );
        }
    },
    overlayadd: function () {
        console.log("Layer overlay updated");
    },
    baselayerchange: function (e: any) {
        console.log("Layer switching is updated");

        const updatedOverLayers: any = {};
        for (let baseLayerName in data.mapTileLayers) {
            // 移除光栅图层
            for (let overLayerName in data.mapTileLayers[baseLayerName].over) {
                const layerContent =
                    data.mapTileLayers[baseLayerName].over[overLayerName];
                if (e.name == baseLayerName) {
                    updatedOverLayers[overLayerName] = layerContent;
                    continue;
                }
                map.value.removeLayer(layerContent);
                // 改变工具栏ui界面的选中状态
                data.controlLayers.removeLayer(layerContent);
                // data.controlLayers._update();
            }
        }

        // 重新添加覆盖层数据
        for (let overlayer in updatedOverLayers) {
            data.controlLayers.addOverlay(
                updatedOverLayers[overlayer],
                overlayer
            );
        }
    },
    zoomend: function () {
        var center = map.value.getCenter();
        var zoom = map.value.getZoom();
        console.log("Zoom end - Center:", center, "Zoom:", zoom);
    },
    moveend: function () {
        var center = map.value.getCenter();
        var zoom = map.value.getZoom();
        console.log("Move end - Center:", center, "Zoom:", zoom);
    },
    mapClick: function (e: any) {
        console.log("map clicked", e);
        // map.value.locate({ setView: true, maxZoom: 10 });
    },
    locationfound: function (e: any) {
        console.log("locationfound", e);
    },
    locationerror: function (e: any) {
        console.log("locationerror", e);
    },
};
</script>

<template>
    <div id="map"></div>
</template>

<style>
#map {
    height: 90vh;
    border: solid 1px gray;
    background-color: rgb(155, 243, 243);
    overflow: hidden;
}

.leaflet-control-container {
    /* display: none; */
}
</style>
