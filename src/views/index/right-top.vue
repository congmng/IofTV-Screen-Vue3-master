<script setup lang="ts">
import { graphic } from "echarts/core";
import { ref, defineProps, onMounted, watch } from "vue";
import type { PropType } from 'vue';
// 接收父组件传递的 props 数据
const props = defineProps({
  name: {
    type: Array as PropType<string[]>,  // 明确指定是字符串数组
    required: true,
    default: () => ['default', 'names'],  // 默认值
  },
  xData: {
    type: Array,
    required: true,
  },
  yData: {
    type: Array,
    required: true,
  },
  yData2: {
    type: Array,
    required: true,
  },
  yData3: {
    type: Array,
    required: true,
  },
});

const option = ref({});

// 设置图表的配置
const setOption = (xData: any[], yData: any[], yData2: any[], yData3: any[]) => {
  option.value = {
    xAxis: {
      type: "category",
      data: xData,
      boundaryGap: false, // 不留白，从原点开始
      splitLine: {
        show: true,
        lineStyle: {
          color: "rgba(31,99,163,.2)",
        },
      },
      axisLine: {
        lineStyle: {
          color: "rgba(31,99,163,.1)",
        },
      },
      axisLabel: {
        color: "#7EB7FD",
        fontWeight: "500",
      },
    },
    yAxis: {
      type: "value",
      name: '网络延迟',
      splitLine: {
        show: true,
        lineStyle: {
          color: "rgba(31,99,163,.2)",
        },
      },
      axisLine: {
        lineStyle: {
          color: "rgba(31,99,163,.1)",
        },
      },
      axisLabel: {
        color: "#7EB7FD",
        fontWeight: "500",
        formatter: '{value} ms',
      },
    },
    tooltip: {
      trigger: "axis",
      backgroundColor: "rgba(0,0,0,.6)",
      borderColor: "rgba(147, 235, 248, .8)",
      textStyle: {
        color: "#FFF",
      },
    },
    grid: {
      show: true,
      left: "10px",
      right: "30px",
      bottom: "10px",
      top: "32px",
      containLabel: true,
      borderColor: "#1F63A3",
    },
    series: [
      {
        data: yData,
        type: "line",
        smooth: true,
        symbol: "none", // 去除点
        name: props.name[0],
        color: "rgba(252,144,16,.7)",
        areaStyle: {
          color: new graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: "rgba(252,144,16,.7)" },
            { offset: 1, color: "rgba(252,144,16,.0)" },
          ], false),
        },
      },
      {
        data: yData2,
        type: "line",
        smooth: true,
        symbol: "none", // 去除点
        name: props.name[1],
        color: "rgba(9,202,243,.7)",
        areaStyle: {
          color: new graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: "rgba(9,202,243,.7)" },
            { offset: 1, color: "rgba(9,202,243,.0)" },
          ], false),
        },
      },
      {
        data: yData3,
        type: "line",
        smooth: true,
        symbol: "none", // 去除点
        name: props.name[2],
        color: "rgba(9,100,243,.7)",
        areaStyle: {
          color: new graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: "rgba(9,102,243,.7)" },
            { offset: 1, color: "rgba(9,102,243,.0)" },
          ], false),
        },
      },
    ],
  };
};

onMounted(() => {
  setOption(props.xData, props.yData, props.yData2, props.yData3);
});

watch(
  () => [props.xData, props.yData, props.yData2, props.yData3],
  ([newX, newY, newY2, newY3]) => {
    setOption(newX, newY, newY2, newY3);
  },
  { deep: true }  // ✅ 深度监听数组内容变化
);
</script>

<template>
  <v-chart class="chart" :option="option" v-if="JSON.stringify(option) !== '{}'"/>
</template>

<style scoped lang="scss"></style>
