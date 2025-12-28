import { ref, onMounted, onUnmounted, type Ref } from 'vue';
import { Map, View } from 'ol';
import TileLayer from 'ol/layer/Tile';
import XYZ from 'ol/source/XYZ';
import { fromLonLat } from 'ol/proj';
import 'ol/ol.css';

// 天地图 API Key
const TIANDITU_KEY = 'd042a6421f43987b40bb0ab8822f5495';

export function useMap(mapRef: Ref<HTMLDivElement | null>) {
  const map = ref<Map | null>(null);

  onMounted(() => {
    if (!mapRef.value) return;

    // 创建天地图影像底图图层
    const imgLayer = new TileLayer({
      source: new XYZ({
        url: `https://t{0-7}.tianditu.gov.cn/DataServer?T=img_w&x={x}&y={y}&l={z}&tk=${TIANDITU_KEY}`,
        crossOrigin: 'anonymous'
      })
    });

    // 创建天地图影像注记图层
    const imgLabelLayer = new TileLayer({
      source: new XYZ({
        url: `https://t{0-7}.tianditu.gov.cn/DataServer?T=cia_w&x={x}&y={y}&l={z}&tk=${TIANDITU_KEY}`,
        crossOrigin: 'anonymous'
      })
    });

    // 创建地图实例
    map.value = new Map({
      target: mapRef.value,
      layers: [imgLayer, imgLabelLayer],
      view: new View({
        center: fromLonLat([116.407526, 39.904030]), // 北京天安门坐标
        zoom: 12
      })
    });
  });

  onUnmounted(() => {
    if (map.value) {
      map.value.setTarget(undefined);
      map.value = null;
    }
  });

  return {
    map
  };
}

