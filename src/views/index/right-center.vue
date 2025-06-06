<script setup lang="ts">
import { defineProps, watch, ref } from "vue";
import CapsuleChart from "@/components/datav/capsule-chart";

// 接收 props
const props = defineProps<{
  config: object;
  data: Array<{
    name: string;
    value: string | number;
  }>;
}>();

// 内部响应式数据 (可选，便于做防抖、优化)
const chartData = ref(props.data);
const chartConfig = ref(props.config);

// 监听 props.data 变化，更新 chartData
watch(
  () => props.data,
  (newData) => {
    chartData.value = newData;
    //console.log("chartData", chartData.value);
  },
  { deep: true } // ✅ 深度监听（数组对象）
);

// 监听 props.config 变化，更新 chartConfig
watch(
  () => props.config,
  (newConfig) => {
    chartConfig.value = newConfig;
  },
  { deep: true } // ✅ 深度监听（对象）
);
</script>

<template>
  <div class="right_bottom">
    <CapsuleChart
      :config="chartConfig"
      :data="chartData"
      style="width: 100%; height: 260px"
    />
  </div>
</template>

<style scoped lang="scss">
.right_bottom {
  box-sizing: border-box;
  padding: 0 16px;
}
</style>
