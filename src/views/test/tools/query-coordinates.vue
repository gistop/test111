<script setup lang="ts">
import { ref, onUnmounted, inject } from 'vue';
import type { Map, MapBrowserEvent } from 'ol';
import { toLonLat } from 'ol/proj';

defineOptions({ name: 'QueryCoordinates' });

// 从父组件注入地图实例
const map = inject<Map>('map');

const active = ref(false);

let clickHandler: ((event: MapBrowserEvent<MouseEvent>) => void) | null = null;

// 启动查询
function startQuery() {
  if (!map) return;

  active.value = true;

  // 创建点击事件处理函数
  clickHandler = (event: MapBrowserEvent<MouseEvent>) => {
    const coordinate = event.coordinate;
    // 将坐标转换为经纬度 (EPSG:3857 -> EPSG:4326)
    const lonLat = toLonLat(coordinate);
    const [longitude, latitude] = lonLat;

    // 在控制台输出
    console.log('📍 点击位置坐标：', {
      经度: longitude.toFixed(6),
      纬度: latitude.toFixed(6),
      原始坐标: coordinate,
      格式化: `${longitude.toFixed(6)}, ${latitude.toFixed(6)}`
    });

    // 也可以使用 console.table 以表格形式显示
    console.table({
      经度: longitude.toFixed(6),
      纬度: latitude.toFixed(6)
    });
  };

  // 监听地图点击事件
  map.on('click', clickHandler);
}

// 停止查询
function stopQuery() {
  if (!map) return;

  active.value = false;

  if (clickHandler) {
    map.un('click', clickHandler);
    clickHandler = null;
  }
}

// 切换查询模式
function toggle() {
  if (active.value) {
    stopQuery();
  } else {
    startQuery();
  }
}

// 暴露方法给父组件
defineExpose({
  active,
  toggle,
  start: startQuery,
  stop: stopQuery
});

onUnmounted(() => {
  if (clickHandler && map) {
    map.un('click', clickHandler);
  }
});
</script>

<template>
  <ElButton :type="active ? 'primary' : 'default'" @click="toggle">
    {{ active ? '停止查询' : '查询坐标' }}
  </ElButton>
</template>

<style scoped></style>

