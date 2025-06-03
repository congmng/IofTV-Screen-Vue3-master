<script setup lang="ts">
import { reactive, ref, watch, withDefaults } from "vue";
import { onMounted } from 'vue'

import ItemWrap from "@/components/item-wrap";
import LeftTop from "./left-top.vue";
import LeftCenter from "./left-center.vue";
import LeftBottom from "./left-bottom.vue";
import CenterMap from "./center-map.vue";
import CenterBottom from "./center-bottom.vue";
import RightTop from "./right-top.vue";
import RightCenter from "./right-center.vue";
import RightBottom from "./right-bottom.vue";
import New_Left_Top from "./new_left_top.vue";
import new_center_Bottom from "./new_center-bottom.vue";
import { number } from "echarts";

interface task_detail {
  task_id: string;
  task_name: string;
  task_type: number;
  task_node: string;
}

interface MapNode {
  name: string;
  value: number;
}

interface storeuse {
  name: string;
  value: number;
}

interface calculateresource {
  name: string;
  cpu_use: number;
  gpu_use: number;
  memory_use: number;
}

const task_num = reactive({
  total_task_Num: 100,
  cloud_task_Num: 60,
  edge_task_Num: 30,
  device_task_Num: 10
});

const node_num = reactive({
  total_node_Num: 50,
  cloud_node_Num: 20,
  edge_node_Num: 20,
  device_node_Num: 10
});

const taskList = reactive<task_detail[]>([
  {
    task_id: "1",
    task_name: "任务17",
    task_type: 1,
    task_node: "云集群1"
  },
  {
    task_id: "2",
    task_name: "任务2",
    task_type: 2,
    task_node: "边集群1"
  },
  {
    task_id: "3",
    task_name: "任务3",
    task_type: 0,
    task_node: "边集群2"
  },
  {
    task_id: "4",
    task_name: "任务4",
    task_type: 2,
    task_node: "端设备1"
  }
]);

const store_use = reactive<storeuse[]>([
  {
    name: "云集群1",
    value: 10
  },
  {
    name: "云集群2",
    value: 8
  },
  {
    name: "边集群1",
    value: 15
  },
  {
    name: "边集群2",
    value: 17
  },
  {
    name: "边集群3",
    value: 11
  },
  {
    name: "端设备1",
    value: 2
  },
  {
    name: "端设备2",
    value: 4
  }
]);

const calculateresource = reactive<calculateresource[]>([
  {
    name: "云集群1",
    cpu_use: 10,
    gpu_use: 20,
    memory_use: 30
  },
  {
    name: "云集群2",
    cpu_use: 15,
    gpu_use: 25,
    memory_use: 35
  },
  {
    name: "边集群1",
    cpu_use: 20,
    gpu_use: 30,
    memory_use: 40
  },
]);

const net_xData = reactive(["19:45:00", "19:45:10", "19:45:20", "19:45:30", "19:45:40", "19:45:50", "19:46:00"]);
const net_yData = reactive([10, 17, 15, 14, 15, 16, 17]);
const net_yData2 = reactive([30, 20, 11, 20, 36, 11, 22]);
const net_yData3 = reactive([20, 40, 30, 40, 42, 51, 30]);
/*
const task_chartData = reactive({
  category: ['应用总数', '调度中', '运行中', '已完成'],
  cpu_data: [100, 40, 30, 30],
});
*/
const task_chartData = reactive({
  category: ['总应用数', '排队中', '运行中','已完成'],
  cpu_data: {
    电力: [100, 20, 10,10],
    交通: [30, 50, 80,10],
    制造: [3, 9, 12,10],
  }
});
const chartData = reactive({
  category: ['20:44', '20:45', '20:46', '20:47', '20:48', '20:49', '20:50',],
  cpu_data: [10, 20, 15, 30, 40, 20, 30],
  gpu_data: [45, 55, 65, 75, 70, 75, 80],
  memory_data: [50, 60, 58, 65, 60, 65, 70]
});

const device_num = reactive([
  {
    name: '虚拟机数',
    number: 10
  },
  {
    name: '容器数',
    number: 10
  },
  {
    name: '裸金属数',
    number: 10
  }
]);

//const store_use = reactive<storeuse[]>([])

async function fetchStorageUsage() {
  try {
    const response = await fetch('http://10.212.67.19:8000/dashboard/storage')
    const data = await response.json()

    if (Array.isArray(data.storage_info)) {
      // 替换整个 store_use 的内容
      store_use.splice(0, store_use.length, 
        ...data.storage_info.map((item: any) => ({
          name: item.name,
          value: Number(item.used_size/1024/1024/1024) || 0
        }))
      )
    }
  } catch (error) {
    console.error('获取存储信息失败：', error)
  }
}


onMounted(() => {
  fetchStorageUsage()
})


</script>

<template>
  <div class="index-box">
    <div class="contetn_left">
      <ItemWrap class="contetn_left-top contetn_lr-item" title="应用总览">
        <!--LeftCenter :totalNum=node_num.total_node_Num :cloudNum=node_num.cloud_node_Num :edgeNum=node_num.edge_node_Num
          :deviceNum=node_num.device_node_Num /-->
        <New_Left_Top :newData="task_chartData" />
      </ItemWrap>
      <ItemWrap class="contetn_left-center contetn_lr-item" title="任务总览">

        <LeftTop :totalTaskNum=task_num.total_task_Num :cloudTaskNum=task_num.cloud_task_Num
          :edgeTaskNum=task_num.edge_task_Num :deviceTaskNum=task_num.device_task_Num />
      </ItemWrap>
      <ItemWrap class="contetn_left-bottom contetn_lr-item" title="应用详情" style="padding: 0 10px 16px 10px">
        <LeftBottom :list="taskList" />
      </ItemWrap>
    </div>
    <div class="contetn_center">
      <ItemWrap class="contetn_center-top" title="云边端拓扑示意图">
        <!--CenterMap  title="设备分布图" /-->
        <img src="@/assets/img/大屏4.png" class="center-image">
      </ItemWrap>
      <ItemWrap class="contetn_center-bottom" title="云边端设备总览">
        <!--RightTop :xData="net_xData" :yData="net_yData" :yData2="net_yData2" :yData3="net_yData3" /-->
        <!--LeftCenter :totalNum=node_num.total_node_Num :cloudNum=node_num.cloud_node_Num :edgeNum=node_num.edge_node_Num
          :deviceNum=node_num.device_node_Num /-->
        <new_center_Bottom :virtual_-num="device_num[0].number" :docker_-num="device_num[1].number" :meterial_-num="device_num[2].number"></new_center_Bottom>
      </ItemWrap>
    </div>
    <div class="contetn_right">
      <ItemWrap class="contetn_left-bottom contetn_lr-item" title="云边端计算资源总览">
        <!--RightCenter :data="store_use" /-->
        <CenterBottom :newData="chartData" />
      </ItemWrap>
      <ItemWrap class="contetn_left-bottom contetn_lr-item" title="云边端多种接入网络" style="padding: 0 10px 16px 10px">
        <!--CenterBottom :newData="chartData" /-->
        <RightTop :xData="net_xData" :yData="net_yData" :yData2="net_yData2" :yData3="net_yData3" />

      </ItemWrap>
      <ItemWrap class="contetn_left-bottom contetn_lr-item" title="云边端存储资源总览 ">
        <!--RightBottom :data="calculateresource" /-->
        <RightCenter :data="store_use" />
      </ItemWrap>
    </div>
  </div>
</template>

<style scoped lang="scss">
.index-box {
  width: 100%;
  display: flex;
  min-height: calc(100% - 64px);
  justify-content: space-between;
}

//左边 右边 结构一样
.contetn_left,
.contetn_right {
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  position: relative;
  width: 540px;
  box-sizing: border-box;
  flex-shrink: 0;
}

.contetn_center {
  flex: 1;
  margin: 0 54px;
  display: flex;
  flex-direction: column;
  justify-content: space-around;

  .contetn_center-bottom {
    height: 315px;
  }
    .contetn_center-top {
    height: 650px;
  }

  img.center-image {
    width: 100%;
    height: 100%;
    object-fit: fill;
    flex-shrink: 0;
  }

}

.contetn_lr-item {
  height: 310px;
}
</style>
