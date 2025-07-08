<script setup lang="ts">
import { reactive, ref, watch, withDefaults } from "vue";
import { onMounted, onUnmounted } from 'vue'

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
import new_daping_1 from "./new_daping_1.vue";
import new_daping_2 from "./new_daping_2.vue";
import new_daping_3 from "./new_daping_3.vue";
import new_center_Bottom from "./new_center-bottom.vue";
import { number } from "echarts";
import { groupListApi } from "@/api/modules";

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
  used: number;
  total: number;
  layer: string;
}

interface calculateresource {
  name: string;
  cpu_use: number;
  gpu_use: number;
  memory_use: number;
}

//const k8s_class3_url = "http://10.212.67.19:8000";
const k8s_class3_url = "http://120.220.95.189:8901";
const k8s_gpu_url= "http://120.220.95.189:8908";

const task_num = reactive({
  total_task_Num: 0,
  cloud_task_Num: 0,
  edge_task_Num: 0,
  device_task_Num: 0
});

const node_num = reactive({
  total_node_Num: 0,
  cloud_node_Num: 0,
  edge_node_Num: 0,
  device_node_Num: 0
});

const taskList = reactive<task_detail[]>([
]);

const store_use = reactive<storeuse[]>([
  {
    name: "云集群1",
    used: 10,
    total: 100,
    layer: "cloud"
  },
  {
    name: "边集群1",
    used: 8,
    total: 80,
    layer: "edge"
  },
  {
    name: "端集群1",
    used: 15,
    total: 150,
    layer: "device"
  },
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

const net_name = reactive<string[]>([]);
const net_xData = reactive<number[]>([]);
const net_yData = reactive<number[]>([ ]);
const net_yData2 = reactive<number[]>([]);
const net_yData3 = reactive<number[]>([]);
const net_yData4 = reactive<number[]>([]);
const net_yData5 = reactive<number[]>([ ]);

const task_chartData = reactive({
  category: ['总应用数', '排队中', '运行中', '已完成'],
  cpu_data: {
    电力: [0, 0, 0, 0],
    交通: [0, 0, 0, 0],
    制造: [0, 0, 0, 0],
  }
});
const chartData = reactive({
  category: [],
  cpu_data: [],
  gpu_data: [],
  memory_data: []
});

const device_num = reactive([
  {
    name: '虚拟机数',
    number: 0
  },
  {
    name: '容器数',
    number: 0
  },
  {
    name: '裸金属数',
    number: 0
  }
]);

let fetchVirtualUsageInterval: number | null = null
async function fetchVirtualUsage() {
  try {
    const response = await fetch(k8s_class3_url + '/containers/counts')
    const data = await response.json()
    // console.log('virtual total资源信息：', data);
    const extra_docker = Number(import.meta.env.VITE_EXTRA_DOCKER_NUM);
    const extra_virtual = Number(import.meta.env.VITE_EXTRA_VIRTUAL_NUM);
    const extra_metal = Number(import.meta.env.VITE_EXTRA_PHYSICAL_NUM);
    console.log('extra_virtual:', extra_virtual, extra_metal, extra_docker);
    device_num[0].number = (data.total_vms || 0) + extra_virtual;
    device_num[1].number = (data.total_containers || 0) + extra_docker;
    device_num[2].number = (data.total_metal_devices || 0) + extra_metal;
    // console.log('虚拟机数：', device_num);
  } catch (error) {
    console.error('获取信息失败：', error)
  }
}
fetchVirtualUsage();


const total_data = reactive({
  cloudnum: 0,
  edgenum: 0,
  devicenum: 0,
  cpu: 0,
  gpu: 0,
  memory: 0,
  storage: 0
});

let fetchTotalUsageInterval: number | null = null
async function fetchTotalUsage() {
  try {
    const response = await fetch(k8s_class3_url + '/dashboard/server-overview')
    const data = await response.json()
    //  console.log('total资源信息：', data);
    const extra_cloud = Number(import.meta.env.VITE_EXTRA_CLOUD);
    const extra_edge = Number(import.meta.env.VITE_EXTRA_EDGE);
    const extra_device = Number(import.meta.env.VITE_EXTRA_DEVICE);
    const extra_cpu = Number(import.meta.env.VITE_EXTRA_CPU_NUM);
    const extra_gpu = Number(import.meta.env.VITE_EXTRA_GPU_NUM);
    const extra_memory = Number(import.meta.env.VITE_EXTRA_RAM_SIZE);
    const extra_storage = Number(import.meta.env.VITE_EXTRA_STORE_SIZE);
    total_data.cloudnum = data.cloud_size + extra_cloud;
    total_data.edgenum = data.edge_size + extra_edge;
    total_data.devicenum = data.device_size + extra_device;
    total_data.cpu = data.cpu_size + extra_cpu;
    total_data.gpu = data.gpu_size + extra_gpu;
    total_data.memory = Math.trunc(data.ram_size / 1024 / 1024 / 1024 + extra_memory);
    total_data.storage = Math.trunc(data.disk_size / 1024 / 1024 / 1024 / 1024 + extra_storage / 1024);
  //  console.log('total资源信息：', total_data);
  } catch (error) {
    console.error('获取信息失败：', error)
  }
}
fetchCalculateUsage();

let fetchInterval: number | null = null

const typePriority = { cloud: 1, edge: 2, device: 3 };

// 转换函数（含排序）
const convertToDiskUse = (data) => {
  type NodeType = "cloud" | "edge" | "device";
  // const data1=toRaw(data.value);
  const typeCount = { cloud: 0, edge: 0, device: 0 };
  let extra_store_use: any[] = [];
  try {
    extra_store_use = JSON.parse(import.meta.env.VITE_STORE_USE || '[]').map((item: any) => ({
      name: item.name,
      used_size: item.used * 1024 ** 3,     // GB 转 Byte
      total_size: item.total * 1024 ** 3,
      layer: item.layer
    }));
  } catch (err) {
    console.error('解析 VITE_STORE_USE 出错：', err);
  }

  // 2. 确保原始数据结构正确
  if (!Array.isArray(data.storage_info)) {
    console.error('data.storage_info 不是数组：', data.storage_info);
    return [];
  }

  // 3. 合并数据
  const mergedList = [...data.storage_info, ...extra_store_use];
 // console.log('合并后的存储信息：', mergedList);
  const converted = mergedList.map(item => {
    const type: NodeType = item.layer as NodeType;;
    typeCount[type] += 1;

    let namePrefix;
    switch (type) {
      case 'cloud': namePrefix = '云节点'; break;
      case 'edge': namePrefix = '边节点'; break;
      case 'device': namePrefix = '端节点'; break;
      default: namePrefix = '节点';
    }
    const name = `${namePrefix}${typeCount[type]}`;
    const used = item.used_size;
    const total = item.total_size;
    const layer = item.layer;
    return { name, used, total, layer };
  }

  );
  //console.log('转换后的存储信息：', converted);
  // 按类型优先级排序（云 → 边 → 端）
  return converted.sort((a, b) => typePriority[a.layer] - typePriority[b.layer]);
};
async function fetchStorageUsage() {
  try {
    const response = await fetch(k8s_class3_url + '/dashboard/storage')
    const data = await response.json()
    //console.log('存储资源信息：', data);
    const data1 = convertToDiskUse(data);
  //  console.log('转换后的存储信息：', data, data1);
    if (Array.isArray(data1)) {
      store_use.splice(0, store_use.length,
        ...data1.map((item: any) => ({
          name: item.name,
          used: Math.floor(item.used / 1024 / 1024 / 1024) || 0,
          total: Math.floor(item.total / 1024 / 1024 / 1024) || 0,
        }))
      );
    }
  } catch (error) {
    console.error('获取存储信息失败：', error)
  }
}

let fetchCalculateUsageInterval: number | null = null
async function fetchCalculateUsage() {
  try {
    const response = await fetch(k8s_class3_url + '/dashboard/compute')
    const data = await response.json()
    const response_gpu = await fetch('http://120.220.95.189:8908/aggregate_gpu_utilization')
    const data_gpu = await response_gpu.json()
    console.log('test_gpu',data_gpu);
    // console.log('计算资源信息：', data);
    const date = new Date();
    const hours = date.getHours();    // 时 (0-23)
    const minutes = date.getMinutes(); // 分 (0-59)
    const seconds = date.getSeconds(); // 秒 (0-59)
    const formattedTime = `${hours}:${minutes}:${seconds}`;
    const cpu = (data.total.cpu_usage * 100 || 0).toFixed(2);
    const gpu = (data_gpu.global_avg_utilization  || 0).toFixed(2);
    const memory = (data.total.ram_usage * 100 || 0).toFixed(2);

    chartData.category.push(formattedTime);
    chartData.cpu_data.push(cpu);
    chartData.gpu_data.push(gpu);
    chartData.memory_data.push(memory);

    // 保持数组大小固定为7
    if (chartData.category.length > 7) {
      chartData.category.shift(); // 移除第一个元素
      chartData.cpu_data.shift();
      chartData.gpu_data.shift();
      chartData.memory_data.shift();
    }
  } catch (error) {
    console.error('获取信息失败：', error)
  }
}
fetchCalculateUsage();


let fetchNetworkUsageInterval: number | null = null
async function fetchNetworkUsage() {
  try {
    // console.log('网络资源信息：', data);
    const date = new Date();
    fetchClusterNetIO()
      .then(data => {
        console.log('集群网络数据:', data);
        net_yData.push(Math.floor(data.wifi as number / 1000));
        net_yData2.push(Math.floor(data.guwang as number / 1000));
      })
      .catch(error => {
        console.error('操作失败:', error);
      });
    const hours = date.getHours();    // 时 (0-23)
    const minutes = date.getMinutes(); // 分 (0-59)
    const seconds = date.getSeconds(); // 秒 (0-59)
    const formattedTime = `${hours}:${minutes}:${seconds}`;
    //net_name[0] = '名称:' + data.device_network[0].device_name + ' 类型：' + data.device_network[0].network_type;
    //net_name[1] = '名称:' + data.device_network[1].device_name + ' 类型：' + data.device_network[1].network_type;
    //net_name[2] = '名称:' + data.device_network[2].device_name + ' 类型：' + data.device_network[2].network_type;
    net_name[0] = ' 类型: wifi' ;
    net_name[1] = ' 类型：固网' ;
    net_name[2] = ' 类型: 4G' ;
    net_name[3] = ' 类型: 5G' ;
    net_name[4] = ' 类型: 卫星' ;
    // console.log('网络名称：', net_name);
    net_xData.push(formattedTime);
    net_yData3.push(Math.floor(0));
    net_yData4.push(Math.floor(0));
    net_yData5.push(Math.floor(0));
    //net_yData.push(data.device_network[0].latency);
   // net_yData2.push(data.device_network[1].latency);
   // net_yData3.push(data.device_network[2].latency);
    if (net_xData.length > 10) {
      net_xData.shift(); // 移除第一个元素
      net_yData.shift();
      net_yData2.shift();
      net_yData3.shift();
      net_yData4.shift();
      net_yData5.shift();
    }

    // 保持数组大小固定为7
  } catch (error) {
    console.error('获取信息失败：', error)
  }
}


async function fetchClusterNetIO() {
  const apiUrl = `http://120.220.95.189:8078/realtime/itemInfo?clusterId=21&appName=net&hostIds=2`;

  try {
    const response = await fetch(`${apiUrl}`, {
      headers: {
        'token': token,
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    console.log('networkAPI返回结果:', result.data['192.168.55.2'].net);
    // 检查业务状态码
    if (result.code !== 200) {
      throw new Error(`API Error: ${result.message || 'Unknown error'}`);
    }
    const guwang = (result.data['192.168.55.2'].net[0].lastValue+result.data['192.168.55.2'].net[1].lastValue)/2;
    const wifi = (result.data['192.168.55.2'].net[8].lastValue+result.data['192.168.55.2'].net[9].lastValue)/2;
    // 数据转换处理
    return {
      timestamp: result.data.timestamp,
      guwang: guwang,
      wifi: wifi,
    };

  } catch (error) {
    console.error('获取网络IO数据失败:', error);
    throw error; // 重新抛出以便外部处理
  }
}



// 使用示例
const token = 'bt1biafhapv2rpmhqofokwm7hnfotsi6lpno2fpgbkuoxlh5fsmimafucyp3';


onMounted(() => {
  fetchStorageUsage();
  fetchCalculateUsage();
  fetchNetworkUsage();
  fetchTotalUsage()
  fetchInterval = window.setInterval(fetchStorageUsage, 3000)
  fetchCalculateUsageInterval = window.setInterval(fetchCalculateUsage, 3000)
  fetchNetworkUsageInterval = window.setInterval(fetchNetworkUsage, 3000)
  fetchTotalUsageInterval = window.setInterval(fetchTotalUsage, 3000)
  fetchVirtualUsageInterval = window.setInterval(fetchVirtualUsage, 3000)
})

onUnmounted(() => {
  // 组件卸载时清除定时器
  if (fetchInterval) {
    clearInterval(fetchInterval)
    fetchInterval = null
  }
})
const fluctuateTaskNumbers = () => {
  setInterval(async () => {
    const res = await groupListApi({ NamespaceAll: '' });
    // console.log(res,'res');
    // 过滤掉状态错误的任务
    const curData = res.items.filter((item: any) => item.status.phase != 'Failed');
    // 过滤出待调度的任务
    const readyToDeploy = curData.filter((item: any) => item.status.node);
    task_num.cloud_task_Num = readyToDeploy.filter((item: any) => item.status.node.startsWith('Cloud')).length
    task_num.edge_task_Num = readyToDeploy.filter((item: any) => item.status.node.startsWith('Edge')).length
    task_num.device_task_Num = readyToDeploy.filter((item: any) => item.status.node.startsWith('End')).length
    task_num.total_task_Num = Number(task_num.cloud_task_Num) + Number(task_num.edge_task_Num) + Number(task_num.device_task_Num)
    //  console.log(task_num);
  }, 3000); // 每隔3秒波动一次
};

fluctuateTaskNumbers();

const task_fluctuateTaskNumbers = () => {
  setInterval(() => {
    // 随机改变每个任务数的波动（-2 到 2）
    task_chartData.cpu_data[0] += Math.floor(Math.random() * 5) - 2;
    task_chartData.cpu_data[1] += Math.floor(Math.random() * 5) - 2;
    task_chartData.cpu_data[2] += Math.floor(Math.random() * 5) - 2;
    task_chartData.cpu_data[3] += Math.floor(Math.random() * 5) - 2;

    // 确保任务数量保持在0以上


    // 打印新的任务数
    //  console.log(task_num);
  }, 3000); // 每隔3秒波动一次
};
task_fluctuateTaskNumbers();// 启动波动


function getNextTime(lastTime: string): string {
  const date = new Date(`2023-01-01T${lastTime}`);
  date.setSeconds(date.getSeconds() + 1); // 递增1秒
  return date.toTimeString().slice(0, 8); // 格式化成 HH:mm:ss
}

// 添加数据点


</script>

<template>
  <div class="index-box">
    <div class="contetn_left">
      <ItemWrap class="contetn_left-bottom contetn_lr-item" title="云边端计算资源总览">
        <!--RightCenter :data="store_use" /-->
        <CenterBottom :newData="chartData" />
      </ItemWrap>
      <ItemWrap class="contetn_left-bottom contetn_lr-item" title="云边端多种接入网络" style="padding: 0 10px 16px 10px">
        <!--CenterBottom :newData="chartData" /-->
        <RightTop :xData="net_xData" :yData="net_yData" :yData2="net_yData2" :yData3="net_yData3" :y-data4="net_yData4" :y-data5="net_yData5" :name="net_name" />

      </ItemWrap>
      <ItemWrap class="contetn_left-bottom contetn_lr-item" title="云边端存储资源总览 ">
        <!--RightBottom :data="calculateresource" /-->
        <RightCenter :data="store_use" />
      </ItemWrap>
    </div>
    <div class="contetn_center">

      <ItemWrap class="contetn_center-top" title="云边端资源总览">

        <new_daping_3 :cloudnum="total_data.cloudnum" :edgenum="total_data.edgenum" :devicenum="total_data.devicenum"
          :cpu="total_data.cpu" :memory="total_data.memory" :gpu="total_data.gpu" :storage="total_data.storage" />

      </ItemWrap>
      <ItemWrap class="contetn_center-bottom" title="云边端资源纳管总览">
        <new_center_Bottom :virtual_-num="device_num[0].number" :docker_-num="device_num[1].number"
          :meterial_-num="device_num[2].number"></new_center_Bottom>
      </ItemWrap>
    </div>
    <div class="contetn_right">

      <ItemWrap class="contetn_left-top contetn_lr-item" title="任务流总览">
        <New_Left_Top :newData="task_chartData" />
      </ItemWrap>
      <ItemWrap class="contetn_left-center contetn_lr-item" title="任务总览">

        <LeftTop :totalTaskNum=task_num.total_task_Num :cloudTaskNum=task_num.cloud_task_Num
          :edgeTaskNum=task_num.edge_task_Num :deviceTaskNum=task_num.device_task_Num />
      </ItemWrap>
      <ItemWrap class="contetn_left-bottom contetn_lr-item" title="任务详情" style="padding: 0 10px 16px 10px">
        <LeftBottom :list="taskList" />
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
  margin: 0 10px;
  display: flex;
  width: 750px;
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
