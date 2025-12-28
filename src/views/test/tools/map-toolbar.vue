<script setup lang="ts">
import { provide, ref } from 'vue';
import type { Map } from 'ol';
import MeasureDistance from './measure-distance.vue';
import QueryCoordinates from './query-coordinates.vue';

defineOptions({ name: 'MapToolbar' });

interface Props {
  map: Map;
}

const props = defineProps<Props>();

// 向子组件提供地图实例
provide('map', props.map);

// 当前激活的工具
const activeTool = ref<string | null>(null);

// 工具列表
const tools = [
  {
    id: 'measure',
    name: '测量距离1',
    component: MeasureDistance
  },
  {
    id: 'query',
    name: '查询坐标',
    component: QueryCoordinates
  }
  // 可以在这里添加更多工具
];

// 切换工具
function toggleTool(toolId: string) {
  if (activeTool.value === toolId) {
    activeTool.value = null;
  } else {
    activeTool.value = toolId;
  }
}
</script>

<template>
  <div class="absolute top-16px right-16px z-10 flex gap-8px">
    <component
      v-for="tool in tools"
      :key="tool.id"
      :is="tool.component"
      :class="{ 'is-active': activeTool === tool.id }"
    />
  </div>
</template>

<style scoped>
.is-active {
  /* 可以添加激活状态的样式 */
}
</style>

