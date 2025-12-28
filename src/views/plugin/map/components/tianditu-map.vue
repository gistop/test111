<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue';
import { useScriptTag } from '@vueuse/core';

defineOptions({ name: 'TiandituMap' });

// 天地图API - 需要替换为你的key
const TIANDITU_KEY = 'YOUR_TIANDITU_KEY';
const TIANDITU_API_URL = `https://api.tianditu.gov.cn/api?v=4.0&tk=${TIANDITU_KEY}`;

const { load } = useScriptTag(TIANDITU_API_URL);

const domRef = ref<HTMLDivElement | null>(null);
let map: any = null;

async function renderMap() {
  await load(true);
  if (!domRef.value) return;

  // 使用天地图 JavaScript API
  // 注意：需要确保天地图API已加载完成
  if (typeof window !== 'undefined' && (window as any).T) {
    const T = (window as any).T;
    map = new T.Map(domRef.value);
    const center = new T.LngLat(116.407526, 39.904030); // 北京天安门
    map.centerAndZoom(center, 12);
    map.addControl(new T.Control.Zoom());
    map.addControl(new T.Control.Scale());
  }
}

onMounted(() => {
  renderMap();
});

onUnmounted(() => {
  if (map) {
    map = null;
  }
});
</script>

<template>
  <div ref="domRef" class="h-full w-full"></div>
</template>

<style scoped></style>






