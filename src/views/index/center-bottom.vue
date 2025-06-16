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
      show: true,
      left: "10px",
      right: "30px",
      bottom: "10px",
      top: "32px",
      containLabel: true,
      borderColor: "#1F63A3",
    },
    xAxis: {
      data: newData.category,
      axisLine: {
        show: true,
        lineStyle: {
          color: "rgba(147, 235, 248, 0.8)", // 使用与tooltip边框相同的科技蓝绿色
          width: 1.5
        }
      },
      axisTick: {
        show: true,
        alignWithLabel: true,
        lineStyle: {
          color: "rgba(147, 235, 248, 0.5)" // 半透明的刻度线
        }
      },
      axisLabel: {
        color: "#7EB7FD", // 保持原有的标签颜色
        fontWeight: "500",
        fontSize: 12,
        interval: 0 // 强制显示所有标签
      },
    },
    yAxis: [
      {
        axisLine: {
          show: true,
          lineStyle: {
            color: "rgba(147, 235, 248, 0.8)", // 使用与tooltip边框相同的科技蓝绿色
            width: 1.5
          }
        },
        axisTick: {
          show: true,
          alignWithLabel: true,
          lineStyle: {
            color: "rgba(147, 235, 248, 0.5)" // 半透明的刻度线
          }
        },
        axisLabel: {
          color: "#7EB7FD", // 保持原有的标签颜色
          formatter: "{value}%",
          fontSize: 12,
          interval: 0 // 强制显示所有标签
        },
        splitLine: {
          show: false,
          lineStyle: {
            color: "rgba(100, 100, 100, 0.3)", // 更深的网格线
            type: "dashed"
          }
        },
      }
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

<style scoped></style>
