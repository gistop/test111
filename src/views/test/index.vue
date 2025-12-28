<script setup lang="ts">
import { ref, computed } from 'vue';
import { useMap } from './composables/useMap';
import MapToolbar from './tools/map-toolbar.vue';
import type { Map } from 'ol';

defineOptions({ name: 'TestPage' });

const mapRef = ref<HTMLDivElement | null>(null);
const { map } = useMap(mapRef);

// 等待地图初始化完成
const mapInstance = computed(() => map.value);
</script>

<template>
  <div class="relative size-full">
    <div ref="mapRef" class="size-full"></div>
    <!-- 工具栏 -->
    <MapToolbar v-if="mapInstance" :map="mapInstance" />
  </div>
</template>

<style scoped>
/* 确保地图容器占满整个页面 */
:deep(.ol-viewport) {
  width: 100%;
  height: 100%;
}
</style>

