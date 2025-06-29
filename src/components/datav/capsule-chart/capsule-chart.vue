<script setup lang="ts">
import { onMounted, reactive, ref, watch, computed } from "vue";
import { cloneDeep, merge } from "lodash-es";

interface CapsuleData {
  name: string;
  used: number;
  total: number;
}

interface ColorRange {
  threshold: number;
  color: string;
}

interface DefaultConfigType {
  colorRanges: ColorRange[];
  unit: string;
  showValue: boolean;
}

const mergedConfig = ref<DefaultConfigType | any>(null);
const capsuleLength = ref<number[]>([]);
const labelData = ref<string[]>([]);
const percentText = ref<string[]>([]);
const totalText = ref<string[]>([]);

const defaultConfig = reactive<DefaultConfigType>({
  colorRanges: [
    { threshold: 0.2, color: "#52c41a" }, // 0-20%: 绿色
    { threshold: 0.5, color: "#a0d911" }, // 20-50%: 浅绿
    { threshold: 0.7, color: "#faad14" }, // 50-70%: 黄色
    { threshold: 0.9, color: "#fa8c16" }, // 70-90%: 橙色
    { threshold: 1.0, color: "#f5222d" }  // 90-100%: 红色
  ],
  unit: "",
  showValue: true
});

const props = withDefaults(
  defineProps<{
    config?: Partial<DefaultConfigType>;
    data: CapsuleData[];
  }>(),
  {
    config: () => ({}),
    data: () => [],
  }
);

// 分页控制
const page = ref(1);
const pageSize = 5;
const pagedData = computed(() => {
  const start = (page.value - 1) * pageSize;
  return props.data.slice(start, start + pageSize);
});

const getColorByUsage = (ratio: number): string => {
  if (!mergedConfig.value?.colorRanges?.length) return "#1890ff";
  
  const range = mergedConfig.value.colorRanges.find(
    range => ratio <= range.threshold
  );
  
  return range?.color || mergedConfig.value.colorRanges.slice(-1)[0].color;
};

const calcData = () => {
  mergeConfig();
  calcCapsuleData();
};

const mergeConfig = () => {
  const defaultClone = cloneDeep(defaultConfig);
  
  if (props.config?.colors && Array.isArray(props.config.colors)) {
    const colors = props.config.colors;
    defaultClone.colorRanges = [
      { threshold: 0.2, color: colors[0] || "#52c41a" },
      { threshold: 0.5, color: colors[1] || "#a0d911" },
      { threshold: 0.7, color: colors[2] || "#faad14" },
      { threshold: 0.9, color: colors[3] || "#fa8c16" },
      { threshold: 1.0, color: colors[4] || "#f5222d" }
    ];
  }
  
  mergedConfig.value = merge(defaultClone, props.config || {});
};

const calcCapsuleData = () => {
  if (!pagedData.value.length) return;

  capsuleLength.value = pagedData.value.map(item => item.total ? item.used / item.total : 0);
  percentText.value = capsuleLength.value.map(r => `${(r * 100).toFixed(1)}%`);
  totalText.value = pagedData.value.map(item => `${Math.floor(item.total)}GB`);
  labelData.value = pagedData.value.map(item => item.name);
};

watch(
  () => [props.data, props.config, page.value],
  () => calcData(),
  { immediate: true, deep: true }
);

onMounted(() => {
  calcData();
});
</script>

<template>
  <div class="dv-capsule-chart-outer">
    <div class="dv-capsule-chart">
      <!-- 左侧标签 -->
      <div class="label-column">
        <div v-for="name in labelData" :key="name">{{ name }}</div>
      </div>

      <!-- 右侧条形图 -->
      <div class="capsule-container">
        <div class="capsule-item" v-for="(ratio, index) in capsuleLength" :key="index">
          <div class="capsule-bar-bg">
            <div class="capsule-bar-fill" :style="{
              width: `${ratio * 100}%`,
              backgroundColor: getColorByUsage(ratio)
            }"></div>
            <div class="capsule-percent-text">{{ percentText[index] }}</div>
          </div>
          <div class="capsule-total-text">{{ totalText[index] }}</div>
        </div>
      </div>
    </div>

    <!-- 分页控制 -->
    <div class="pagination-controls">
      <button :disabled="page === 1" @click="page--">上一页</button>
      <span>第 {{ page }} 页</span>
      <button :disabled="page * pageSize >= props.data.length" @click="page++">下一页</button>
    </div>
  </div>
</template>
<style scoped lang="scss">
.dv-capsule-chart-outer {
  display: flex;
  flex-direction: column;
  padding: 10px;
  color: #fff;
  box-sizing: border-box;
}

.dv-capsule-chart {
  display: flex;
  flex-direction: row;
}

.label-column {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding-right: 10px;
  text-align: right;
  font-size: 12px;

  div {
    height: 28px;
    line-height: 28px;
  }
}

.capsule-container {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.capsule-item {
  position: relative;
  height: 28px;
  margin: 5px 0;
  display: flex;
  align-items: center;

  .capsule-bar-bg {
    position: relative;
    flex: 1;
    height: 10px;
    background-color: #3c3f4a;
    border-radius: 5px;
    overflow: hidden;
    margin-right: 8px;

    .capsule-bar-fill {
      height: 100%;
      transition: width 0.3s ease;
      border-radius: 5px 0 0 5px;
      position: relative;
      z-index: 1;
    }

.capsule-percent-text {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-size: 12px;
  font-weight: bold; /* 加粗 */
  color: #fff;
  text-shadow: 
    0 0 2px #000,
    0 0 4px #000; /* 多重阴影增强轮廓 */
  z-index: 2;
  pointer-events: none;
}
  }

  .capsule-total-text {
    font-size: 12px;
    margin-left: 6px;
    width: 60px;
    text-align: right;
    color: #bbb;
  }
}

.unit-text {
  text-align: right;
  font-size: 12px;
  margin-left: 10px;
}

.pagination-controls {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 16px;
  gap: 16px;

  button {
    background: linear-gradient(to bottom, #4e5a6d, #2e3440);
    color: #e0e0e0;
    border: 1px solid #5c677a;
    font-size: 12px;
    padding: 4px 14px;
    border-radius: 6px;
    cursor: pointer;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.3);
    transition: all 0.2s ease;
  }

  button:hover {
    background: linear-gradient(to bottom, #5f6d81, #38404d);
    color: #fff;
  }

  button:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    box-shadow: none;
  }

  span {
    font-size: 12px;
    color: #ccc;
  }
}
</style>
