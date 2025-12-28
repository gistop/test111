# 地图工具组件

这个目录包含了所有地图工具的独立组件。每个工具都是独立的 Vue 组件，可以轻松添加、移除或修改。

## 目录结构

```
tools/
├── map-toolbar.vue      # 工具栏管理器，统一管理所有工具
├── measure-distance.vue # 测量距离工具
└── README.md           # 本文件
```

## 如何添加新工具

### 1. 创建工具组件

在 `tools/` 目录下创建一个新的 Vue 组件，例如 `draw-polygon.vue`：

```vue
<script setup lang="ts">
import { ref, inject, onUnmounted } from 'vue';
import type { Map } from 'ol';
// 导入你需要的 OpenLayers 模块

defineOptions({ name: 'DrawPolygon' });

// 从父组件注入地图实例
const map = inject<Map>('map');

const active = ref(false);

// 你的工具逻辑
function startTool() {
  // 实现工具功能
}

function stopTool() {
  // 清理资源
}

// 切换工具
function toggle() {
  if (active.value) {
    stopTool();
  } else {
    startTool();
  }
}

// 暴露方法给父组件（可选）
defineExpose({
  active,
  toggle,
  start: startTool,
  stop: stopTool
});

onUnmounted(() => {
  // 清理资源
});
</script>

<template>
  <ElButton :type="active ? 'primary' : 'default'" @click="toggle">
    {{ active ? '停止绘制' : '绘制多边形' }}
  </ElButton>
</template>
```

### 2. 在工具栏中注册

在 `map-toolbar.vue` 中导入并添加到工具列表：

```vue
<script setup lang="ts">
import MeasureDistance from './measure-distance.vue';
import DrawPolygon from './draw-polygon.vue'; // 导入新工具

const tools = [
  {
    id: 'measure',
    name: '测量距离',
    component: MeasureDistance
  },
  {
    id: 'polygon',
    name: '绘制多边形',
    component: DrawPolygon // 添加新工具
  }
];
</script>
```

### 3. 完成！

新工具会自动出现在工具栏中。

## 工具组件规范

### 必需项

1. **使用 `inject('map')` 获取地图实例**
   ```ts
   const map = inject<Map>('map');
   ```

2. **管理工具状态**
   ```ts
   const active = ref(false);
   ```

3. **实现 `toggle()` 方法**
   ```ts
   function toggle() {
     if (active.value) {
       stopTool();
     } else {
       startTool();
     }
   }
   ```

4. **在 `onUnmounted` 中清理资源**

### 可选

- 使用 `defineExpose` 暴露方法给父组件
- 添加工具特定的样式

## 示例工具

### 测量距离 (`measure-distance.vue`)
- 使用 OpenLayers Draw 交互
- 实时显示距离
- 支持多段线测量

## 注意事项

- 每个工具应该独立管理自己的图层和交互
- 工具之间应该互不干扰
- 记得在工具关闭时清理所有资源（图层、交互、覆盖物等）

