<script setup lang="ts">
import { onMounted, reactive, ref, watch } from "vue";
import { cloneDeep, merge } from "lodash-es";

// 类型定义
interface CapsuleData {
  name: string;
  used: number;
  total: number;
}

interface DefaultConfigType {
  colors: string[];
  unit: string;
  showValue: boolean;
}

const mergedConfig = ref<DefaultConfigType | any>(null);
const capsuleLength = ref<number[]>([]);
const capsuleValue = ref<string[]>([]);
const labelData = ref<string[]>([]);

// 默认配置
const defaultConfig = reactive<DefaultConfigType>({
  colors: ["#37a2da", "#32c5e9", "#67e0e3", "#9fe6b8", "#ffdb5c", "#ff9f7f", "#fb7293"],
  unit: "",
  showValue: true,
});

// Props
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

// 主逻辑
const calcData = () => {
  mergeConfig();
  calcCapsuleLengthAndLabelData();
};

const mergeConfig = () => {
  mergedConfig.value = merge(cloneDeep(defaultConfig), props.config || {});
};

const calcCapsuleLengthAndLabelData = () => {
  if (!props.data.length) return;

  // 排序
  const sortedData = [...props.data].sort((a, b) => b.used - a.used);

  capsuleValue.value = sortedData.map(item =>
    `${item.used.toFixed(2)}GB/${item.total.toFixed(2)}GB`
  );
  capsuleLength.value = sortedData.map(item =>
    item.total ? item.used / item.total : 0
  );
  labelData.value = sortedData.map(item => item.name);
};

watch(
  () => [props.data, props.config],
  () => {
    calcData();
  },
  { immediate: true, deep: true }
);

onMounted(() => {
  calcData();
});
</script>

<template>
  <div class="dv-capsule-chart">
    <template v-if="mergedConfig">
      <!-- 左侧标签列 -->
      <div class="label-column">
        <div v-for="name in labelData" :key="name">{{ name }}</div>
      </div>

      <!-- 胶囊条区域 -->
      <div class="capsule-container">
        <div class="capsule-item" v-for="(capsule, index) in capsuleLength" :key="index">
          <!-- ✅ 信息文字独立，居中显示在整行中 -->
          <div v-if="mergedConfig.showValue" class="capsule-item-value">
            {{ capsuleValue[index] }}
          </div>

          <!-- ✅ 胶囊条按使用率缩放 -->
          <div
            class="capsule-item-column"
            :style="`width: ${capsule * 100}%; background-color: ${mergedConfig.colors[index % mergedConfig.colors.length]}`"
          ></div>
        </div>
      </div>

      <!-- 单位显示 -->
      <div class="unit-text" v-if="mergedConfig.unit">
        {{ mergedConfig.unit }}
      </div>
    </template>
  </div>
</template>

<style scoped lang="scss">
.dv-capsule-chart {
  position: relative;
  display: flex;
  flex-direction: row;
  box-sizing: border-box;
  padding: 10px;
  color: #fff;

  .label-column {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    padding-right: 10px;
    text-align: right;
    font-size: 12px;

    div {
      height: 24px;
      line-height: 24px;
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
    height: 24px; /* 够显示文字和条 */
    margin: 5px 0;
    border-radius: 5px;

    .capsule-item-value {
      position: absolute;
      left: 50%;
      top: 50%;
      transform: translate(-50%, -50%);
      font-size: 12px;
      color: #fff;
      white-space: nowrap;
      z-index: 2;
      pointer-events: none;
    }

    .capsule-item-column {
      height: 8px;
      margin-top: 8px;
      border-radius: 5px;
      transition: all 0.3s;
    }
  }

  .unit-text {
    text-align: right;
    font-size: 12px;
    margin-left: 10px;
  }
}
</style>
