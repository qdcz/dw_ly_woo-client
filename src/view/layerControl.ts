// @ts-ignore
import L from "leaflet";

export const tileServiceConfig = {
    TDT: {
        tk: "cca632d0f52e2e34f091af5a25699305",
        url: "https://t{s}.tianditu.gov.cn/{t}/wmts?service=WMTS&request=GetTile&version=1.0.0&layer={l}&style=default&tilematrixset=w&format=tiles&tilematrix={z}&tilecol={x}&tilerow={y}&tk={k}",
    },
    mapbox: {
        tk: "pk.eyJ1IjoiZ2dib21ib20iLCJhIjoiY2xsYm82b3k1MDZ5cTNwcGJraXR5eWFxNiJ9.oc-mcLqCGaTWTKQZmUlRpQ",
        url: "https://api.mapbox.com/styles/v1/mapbox/streets-v11/tiles/{z}/{x}/{y}?access_token={k}",
    },
    amap: {
        tk: "4fe0867f228e2524e33bf89d78dfbf49",
        url: "http://webrd01.is.autonavi.com/appmaptile?lang=zh_cn&size=1&scl=1&style=8&x={x}&y={y}&z={z}",
    },
    gooleMap: {
        tk: "",
        url: "https://www.google.cn/maps/vt?lyrs=m@189&gl=cn&x={x}&y={y}&z={z}",
    },
};

const setLayer = function (
    url: string,
    type: string,
    layer: string,
    token: string,
    minNativeZoom: number = 0,
    maxNativeZoom: number = 23
) {
    return L.tileLayer(url, {
        // @ts-ignore
        t: type,
        l: layer,
        k: token,
        subdomains: "01234567",
        minNativeZoom, // 原生图层缩放
        maxNativeZoom,
    });
};

const tsc = tileServiceConfig;
export const tileLayers = {
    // 电子底图及标记
    TDT_vecLayer: setLayer(tsc.TDT.url, "vec_w", "vec", tsc.TDT.tk, 0, 23),
    TDT_cvaLayer: setLayer(tsc.TDT.url, "cva_w", "cva", tsc.TDT.tk, 0, 23),
    TDT_evaLayer: setLayer(tsc.TDT.url, "eva_w", "eva", tsc.TDT.tk, 0, 23),

    // 影像底图及标记
    TDT_imgLayer: setLayer(tsc.TDT.url, "img_w", "img", tsc.TDT.tk, 0, 23),
    TDT_ciaLayer: setLayer(tsc.TDT.url, "cia_w", "cia", tsc.TDT.tk, 0, 23),
    TDT_eiaLayer: setLayer(tsc.TDT.url, "eia_w", "eia", tsc.TDT.tk, 0, 23),

    // 地形底图及标记
    TDT_terLayer: setLayer(tsc.TDT.url, "ter_w", "ter", tsc.TDT.tk, 0, 23),
    TDT_ctaLayer: setLayer(tsc.TDT.url, "cta_w", "cta", tsc.TDT.tk, 0, 23),

    // 境界标记
    TDT_iboLayer: setLayer(tsc.TDT.url, "ibo_w", "ibo", tsc.TDT.tk, 0, 23),

    mapbox_EBMLayer: setLayer(tsc.mapbox.url, "", "", tsc.mapbox.tk, 0, 23),
    amap_EBMLayer: setLayer(tsc.amap.url, "", "", tsc.amap.tk, 0, 23),
    gooleMap_EBMLayer: setLayer(
        tsc.gooleMap.url,
        "",
        "",
        tsc.gooleMap.tk,
        0,
        23
    ),
};