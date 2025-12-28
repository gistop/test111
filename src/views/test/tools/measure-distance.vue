<script setup lang="ts">
import { ref, onUnmounted, inject } from 'vue';
import type { Map } from 'ol';
import VectorLayer from 'ol/layer/Vector';
import VectorSource from 'ol/source/Vector';
import { Draw } from 'ol/interaction';
import { LineString } from 'ol/geom';
import { getLength } from 'ol/sphere';
import { Style, Stroke, Fill, Circle as CircleStyle } from 'ol/style';
import Overlay from 'ol/Overlay';

defineOptions({ name: 'MeasureDistance' });

// 从父组件注入地图实例
const map = inject<Map>('map');

const active = ref(false);
const distanceText = ref('');

let draw: Draw | null = null;
let measureLayer: VectorLayer<VectorSource> | null = null;
let measureOverlay: Overlay | null = null;

// 格式化距离显示
function formatDistance(length: number): string {
  if (length > 1000) {
    return `${(length / 1000).toFixed(2)} 公里`;
  }
  return `${length.toFixed(2)} 米`;
}

// 创建测量样式
function createMeasureStyle() {
  return new Style({
    stroke: new Stroke({
      color: '#ff0000',
      width: 2
    }),
    image: new CircleStyle({
      radius: 5,
      fill: new Fill({ color: '#ff0000' }),
      stroke: new Stroke({ color: '#ffffff', width: 2 })
    })
  });
}

// 启动测量
function startMeasure() {
  if (!map) return;

  active.value = true;

  // 创建测量图层
  if (!measureLayer) {
    measureLayer = new VectorLayer({
      source: new VectorSource(),
      style: createMeasureStyle()
    });
    map.addLayer(measureLayer);
  }

  // 创建绘制交互
  draw = new Draw({
    source: measureLayer.getSource()!,
    type: 'LineString',
    style: createMeasureStyle()
  });

  // 创建显示距离的覆盖物元素
  const measureElement = document.createElement('div');
  measureElement.className = 'measure-tooltip';
  measureOverlay = new Overlay({
    element: measureElement,
    positioning: 'center-left',
    stopEvent: false,
    offset: [10, 0]
  });
  map.addOverlay(measureOverlay);

  let sketch: LineString | null = null;

  // 监听绘制过程，实时显示距离
  draw.on('drawstart', (e) => {
    sketch = e.feature.getGeometry() as LineString;
    sketch.on('change', () => {
      const coordinates = sketch!.getCoordinates();
      if (coordinates.length > 1) {
        const length = getLength(sketch!);
        distanceText.value = formatDistance(length);
        const lastCoord = coordinates[coordinates.length - 1];
        measureOverlay!.setPosition(lastCoord);
        measureElement.innerHTML = distanceText.value;
      }
    });
  });

  draw.on('drawend', (e) => {
    const geometry = e.feature.getGeometry() as LineString;
    const coordinates = geometry.getCoordinates();
    const length = getLength(geometry);
    distanceText.value = formatDistance(length);
    const lastCoord = coordinates[coordinates.length - 1];
    measureOverlay!.setPosition(lastCoord);
    measureElement.innerHTML = distanceText.value;
    sketch = null;
  });

  draw.on('drawabort', () => {
    measureOverlay!.setPosition(undefined);
    measureElement.innerHTML = '';
    sketch = null;
  });

  map.addInteraction(draw);
}

// 停止测量
function stopMeasure() {
  if (!map) return;

  active.value = false;

  if (draw) {
    map.removeInteraction(draw);
    draw = null;
  }
  if (measureOverlay) {
    map.removeOverlay(measureOverlay);
    measureOverlay = null;
  }
  if (measureLayer) {
    measureLayer.getSource()!.clear();
  }
  distanceText.value = '';
}

// 切换测量模式
function toggle() {
  if (active.value) {
    stopMeasure();
  } else {
    startMeasure();
  }
}

// 暴露方法给父组件
defineExpose({
  active,
  toggle,
  start: startMeasure,
  stop: stopMeasure
});
</script>

<template>
  <ElButton :type="active ? 'primary' : 'default'" @click="toggle">
    {{ active ? '停止测量' : '测量距离' }}
  </ElButton>
</template>

<style scoped>
:deep(.measure-tooltip) {
  background: rgba(0, 0, 0, 0.7);
  color: #fff;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
  white-space: nowrap;
  pointer-events: none;
}
</style>


