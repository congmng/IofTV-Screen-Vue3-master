
<script setup lang="ts">
import { ref, reactive, watch } from "vue";
import { graphic } from "echarts/core";

const props = defineProps<{
  totalNum: number;
  cloudNum: number;
  edgeNum: number;
  deviceNum: number;
}>();

let colors = ["#0BFC7F", "#A0A0A0", "#F48C02", "#F4023C"];
const option = ref({});

const echartsGraphic = (colors: string[]) => {
  return new graphic.LinearGradient(1, 0, 0, 0, [
    { offset: 0, color: colors[0] },
    { offset: 1, color: colors[1] },
  ]);
};

const setOption = () => {
  option.value = {
    title: {
      top: "center",
      left: "center",
      text: [`{value|${props.totalNum}}`, "{name|总数}"].join("\n"),
      textStyle: {
        rich: {
          value: {
            color: "#ffffff",
            fontSize: 24,
            fontWeight: "bold",
            lineHeight: 20,
            padding: [4, 0, 4, 0],
          },
          name: {
            color: "#ffffff",
            lineHeight: 20,
          },
        },
      },
    },
    tooltip: {
      trigger: "item",
      backgroundColor: "rgba(0,0,0,.6)",
      borderColor: "rgba(147, 235, 248, .8)",
      textStyle: {
        color: "#FFF",
      },
    },
    series: [
      {
        name: "节点总览",
        type: "pie",
        radius: ["40%", "70%"],
        itemStyle: {
          borderRadius: 6,
          borderColor: "rgba(255,255,255,0)",
          borderWidth: 2,
        },
        color: colors,
        label: {
          show: true,
          formatter: "   {b|{b}}   \n   {c|{c}台}   {per|{d}%}  ",
          rich: {
            b: { color: "#fff", fontSize: 12, lineHeight: 26 },
            c: { color: "#31ABE3", fontSize: 14 },
            per: { color: "#31ABE3", fontSize: 14 },
          },
        },
        emphasis: { show: false },
        legend: { show: false },
        tooltip: { show: true },
        labelLine: {
          show: true,
          length: 20,
          length2: 36,
          smooth: 0.2,
          lineStyle: {},
        },
        data: [
          {
            value: props.edgeNum,
            name: "云侧设备数",
            itemStyle: {
              color: echartsGraphic(["#0BFC7F", "#A3FDE0"]),
            },
          },
          {
            value: props.deviceNum,
            name: "边侧设备数",
            itemStyle: {
              color: echartsGraphic(["blue", "#DBDFDD"]),
            },
          },
          {
            value: props.cloudNum,
            name: "端侧设备数",
            itemStyle: {
              color: echartsGraphic(["yellow", "#FB6CB7"]),
            },
          },
        ],
      },
    ],
  };
};

// 监听 props 变化，更新图表
watch(
  () => [props.totalNum, props.cloudNum, props.edgeNum, props.deviceNum],
  () => {
    setOption();
  },
  { immediate: true }
);

</script>

<template>
  <v-chart class="chart" :option="option" />
</template>

<style scoped lang="scss"></style>
