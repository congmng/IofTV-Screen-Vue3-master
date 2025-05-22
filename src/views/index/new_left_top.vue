<script setup lang="ts">
import { ref, watch } from "vue";
import { graphic } from "echarts/core";
import { groupListApi } from "@/api/modules";

const props = defineProps({
  newData: {
    type: Object,
    required: true,
  }
});

const option = ref({});
const sourceData = {
    'Train':'训练任务',
    'Infer':'推理任务',
    'Normal':'普通任务',
  };
// 获取组列表
const groupList = ref([]);
const getGroupList = async () => {
  const res = await groupListApi({Namespace: 'test'});
  const curData = res.items;
  // 将 Unknown 和 Pending 合并
  curData.forEach((item:any)=>{
    if(item.status.copy_status === 'Unknown' || item.status.copy_status === 'Pending'){
      item.status.copy_status = 'Unknown';
    }
  })
  // 数据处理，先以应用状态分类，然后以应用类型分类
  let status = ['Running','Unknown','ReadyToDeploy','Succeeded'];
  let lineData = {};
  status.forEach((item:any)=>{
    lineData[item] = curData.filter((val:any)=>val.status.copy_status === item);
  })
  // 再将lineData中的数据进行应用类型分类
  Object.keys(lineData).forEach((item:any)=>{
      Object.keys(sourceData).forEach((val:any)=>{
        let curSource = {};
        curSource[val] = lineData[item].filter((v:any)=> v.source === val);
        lineData[item] = curSource;
      })
  })
  // 三层级数组
  console.log(lineData);
   
};
getGroupList();

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
      data: ['总应用数','待调度','待部署','运行中','已完成'],
      axisLine: { lineStyle: { color: "#B4B4B4" } },
      axisTick: { show: false },
    },
    yAxis: {
      splitLine: { show: false },
      axisLine: { lineStyle: { color: "#B4B4B4" } },
    },
    series: [
      {
        name: "训练任务",
        type: "bar",
        stack: "任务数",
        barWidth: 20,
        itemStyle: {
          color: "#4CAF50", // 蓝色
          borderRadius: [0,0, 0, 0],
        },
        data: newData.cpu_data.电力,
      },
      {
        name: "推理任务",
        type: "bar",
        stack: "任务数",
        itemStyle: {
          color: "#F44336", // 绿色
        },
        data: newData.cpu_data.交通,
      },
      {
        name: "普通任务",
        type: "bar",
        stack: "任务数",
        itemStyle: {
          color: "#FFC107", // 蓝色
          borderRadius: [2, 2, 0, 0],
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
