<script setup lang="ts">
import { ref, watch } from "vue";
import { graphic } from "echarts/core";

const props = defineProps({
  newData: {
    type: Object,
    required: true,
  }
});

const option = ref({});

const setOption = (newData: any) => {
  option.value = {
    tooltip: {
      trigger: "axis",
      backgroundColor: "rgba(0,0,0,.6)",
      borderColor: "rgba(147, 235, 248, .8)",
      textStyle: { color: "#FFF" },
      formatter: (params: any) =>
        params.map((item: any) => `${item.seriesName}: ${item.value ?? '-'}`).join('<br>'),
    },
    grid: { left: "50px", right: "40px", bottom: "30px", top: "20px" },
    xAxis: {
      data: newData.category,
      axisLine: { lineStyle: { color: "#B4B4B4" } },
      axisTick: { show: false },
    },
    yAxis: {
      splitLine: { show: false },
      axisLine: { lineStyle: { color: "#B4B4B4" } },
    },
    series: [
      {
        name: "河南电力",
        type: "bar",
        stack: "任务数",
        barWidth: 30,
        itemStyle: {
          color: "steelblue", // 红色
          borderRadius: [5, 5, 0, 0],
        },
        data: newData.cpu_data.电力,
      },
      {
        name: "山东高速",
        type: "bar",
        stack: "任务数",
        itemStyle: {
          color: "limegreen", // 绿色
        },
        data: newData.cpu_data.交通,
      },
      {
        name: "智能制造",
        type: "bar",
        stack: "任务数",
        itemStyle: {
          color: "dodgerblue", // 蓝色
          borderRadius: [0, 0, 5, 5],
        },
        data: newData.cpu_data.制造,
      },
    ]
  };
};

watch(
  () => props.newData,
  (val) => {
    if (val) setOption(val);
  },
  { deep: true, immediate: true }
);
</script>


<template>
  <v-chart class="chart" :option="option" v-if="option && option.series" />
</template>

<style scoped lang="scss"></style>
