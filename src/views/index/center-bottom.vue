<script setup lang="ts">
import { ref, onMounted, watch } from "vue";
import { graphic } from "echarts/core";

// 接收父组件传递的数据
const props = defineProps({
  newData: {
    type: Object,
    required: true,
  }
});

// 定义 option 用来传递给图表
const option = ref({});

// 使用传入的 newData 设置图表配置
const setOption = (newData: any) => {
  option.value = {
    tooltip: {
      trigger: "axis",
      backgroundColor: "rgba(0,0,0,.6)",
      borderColor: "rgba(147, 235, 248, .8)",
      textStyle: {
        color: "#FFF",
      },
      formatter: function (params: any) {
        var result = params[0].name + "<br>";
        params.forEach(function (item: any) {
          if (item.value) {
            if (item.seriesName == "内存使用率") {
              result += item.marker + " " + item.seriesName + " : " + item.value + "%</br>";
            } else {
              result += item.marker + " " + item.seriesName + " : " + item.value + "%</br>";
            }
          } else {
            result += item.marker + " " + item.seriesName + " :  - </br>";
          }
        });
        return result;
      },
    },
    legend: {
      data: ["CPU使用率", "GPU使用率", "内存使用率"],
      textStyle: {
        color: "#B4B4B4",
      },
      top: "0",
    },
    grid: {
      left: "50px",
      right: "40px",
      bottom: "30px",
      top: "20px",
    },
    xAxis: {
      data: newData.category,
      axisLine: {
        lineStyle: {
          color: "#B4B4B4",
        },
      },
      axisTick: {
        show: false,
      },
    },
    yAxis: [
      {
        splitLine: { show: false },
        axisLine: {
          lineStyle: {
            color: "#B4B4B4",
          },
        },
        axisLabel: {
          formatter: "{value}%",
        },
      },
    ],
    series: [
      {
        name: "CPU使用率",
        type: "bar",
        barWidth: 10,
        itemStyle: {
          borderRadius: 5,
          color: new graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: "#956FD4" },
            { offset: 1, color: "#3EACE5" },
          ]),
        },
        data: newData.cpu_data,
      },
      {
        name: "GPU使用率",
        type: "bar",
        barGap: "-100%",
        barWidth: 10,
        itemStyle: {
          borderRadius: 5,
          color: new graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: "rgba(156,107,211,0.8)" },
            { offset: 0.2, color: "rgba(156,107,211,0.5)" },
            { offset: 1, color: "rgba(156,107,211,0.2)" },
          ]),
        },
        z: -12,
        data: newData.gpu_data,
      },
      {
        name: "内存使用率",
        type: "line",
        smooth: true,
        showAllSymbol: true,
        symbol: "emptyCircle",
        symbolSize: 8,
        yAxisIndex: 0,  // 使用左侧的 Y 轴
        itemStyle: {
          color: "#F02FC2",
        },
        data: newData.memory_data,
      },
    ],
  };
};

// 使用 watch 来监听 `newData` 的变化并更新图表配置
watch(
  () => props.newData.memory_data,
  (newMemoryData) => {
    setOption(props.newData); // 强制刷新整图
  },
  { deep: true }
);

</script>

<template>
  <v-chart class="chart" :option="option" v-if="JSON.stringify(option) != '{}'" />
</template>

<style scoped lang="scss"></style>
