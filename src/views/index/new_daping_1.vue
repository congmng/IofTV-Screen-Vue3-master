

<template>
<div class="bg-transparent text-white rounded-xl p-6 shadow-lg">
    <!-- 标题 -->

    <!-- 内容区域 -->
    <div class="flex justify-between items-center">
      <!-- 左侧：节点数量 -->
      <div class="space-y-6 text-right">
        <div v-for="item in nodes" :key="item.label">
          <div class="text-sm">{{ item.label }}</div>
          <div class="text-green-400 text-lg font-bold">{{ item.value }}</div>
        </div>
      </div>
      <div class="flex flex-col items-center justify-center relative mx-6">
        <HexInfoCenter />
      </div>

      <!-- 右侧：资源数量 -->
      <div class="space-y-6 text-left">
        <div v-for="item in resources" :key="item.label">
          <div class="text-sm">{{ item.label }}</div>
          <div class="text-blue-400 text-lg font-bold">{{ item.value }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import HexInfoCenter from './HexInfoCenter.vue';
interface InfoItem {
  label: string
  value: string
}

defineProps<{
  nodes: InfoItem[]
  resources: InfoItem[]
}>()
</script>

<style scoped>
.hexagon-container {
  width: 482px;
  height: 592px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.hexagon {
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, #00e5ff, #3f51b5);
  clip-path: polygon(
    50% 0%,
    93% 25%,
    93% 75%,
    50% 100%,
    7% 75%,
    7% 25%
  );
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 0 12px #2196f3;
}
</style>
