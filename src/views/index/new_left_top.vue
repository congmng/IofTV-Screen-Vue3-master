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
    'HenanEP':'河南电力',
    'ShandongHS':'山东高速',
    'Cosmo':'卡奥斯制造'
  };
// 获取组列表
const groupList = ref([]);
const getGroupList = async () => {
  // const [res1, res2, res3]  = await Promise.all([groupListApi({Namespace: 'HenanEP'}), groupListApi({Namespace: 'ShandongHS'}), groupListApi({Namespace: 'Cosmo'})]);
  let res1 = await groupListApi({NamespaceAll: ''});
  const curData = res1.items;
  // 将 Unknown 和 Pending 合并
  curData.forEach((item:any)=>{
    if(item.status.copy_status === 'Unknown' || item.status.copy_status === 'Pending'){
      item.status.copy_status = 'Unknown';
    }
  })
  // 数据处理，先以应用类型分类
  Object.keys(sourceData).forEach((val:any)=>{
    curData[val] = curData.filter((v:any)=> v.namespace === val);
  })
  //console.log(curData,'curData');
  // 再根据应用类型进行应用状态分类
  let status = ['Unknown','ReadyToDeploy','Running','Succeeded'];
  let lineData = {};
  Object.keys(sourceData).forEach((item:any)=>{
    let curStatusList = []; // 存储所有状态
    status.forEach((val:any)=>{
      curStatusList.push(curData[item].filter((v:any)=>v.status.phase === val).length);
    })
    // 设置总应用数
    curStatusList.unshift(curStatusList.reduce((a:any,b:any)=>a+b,0));
    lineData[item] = curStatusList;
  })
  groupList.value = lineData;
  //console.log(groupList.value,'groupList.value');
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
        name: "河南电力",
        type: "bar",
        stack: "任务数",
        barWidth: 20,
        itemStyle: {
          color: "#4CAF50", // 蓝色
          borderRadius: [0,0, 0, 0],
        },
        data: groupList.value.HenanEP,
      },
      {
        name: "山东高速",
        type: "bar",
        stack: "任务数",
        itemStyle: {
          color: "#F44336", // 绿色
        },
        data: groupList.value.ShandongHS,
      },
      {
        name: "卡奥斯制造",
        type: "bar",
        stack: "任务数",
        itemStyle: {
          color: "#FFC107", // 蓝色
          borderRadius: [2, 2, 0, 0],
        },
        data: groupList.value.Cosmo,
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
