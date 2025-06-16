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
const labelData = ref<string[]>([]);
const percentText = ref<string[]>([]);
const totalText = ref<string[]>([]);

const defaultConfig = reactive<DefaultConfigType>({
  colors: ["#37a2da", "#32c5e9", "#67e0e3", "#9fe6b8", "#ffdb5c", "#ff9f7f", "#fb7293"],
  unit: "",
  showValue: true,
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

const calcData = () => {
  mergeConfig();
  calcCapsuleData();
};

const mergeConfig = () => {
  mergedConfig.value = merge(cloneDeep(defaultConfig), props.config || {});
};

const calcCapsuleData = () => {
  if (!props.data.length) return;

  capsuleLength.value = props.data.map(item => item.total ? item.used / item.total : 0);
  percentText.value = capsuleLength.value.map(r => `${Math.round(r * 100)}%`);
  totalText.value = props.data.map(item => `${Math.floor(item.total)}GB`);
  labelData.value = props.data.map(item => item.name);
};

watch(
  () => [props.data, props.config],
  () => calcData(),
  { immediate: true, deep: true }
);

onMounted(() => {
  calcData();
});
</script>

<template>
  <div class="dv-capsule-chart">
    <template v-if="mergedConfig">
      <!-- 左侧标签 -->
      <div class="label-column">
        <div v-for="name in labelData" :key="name">{{ name }}</div>
      </div>

      <!-- 胶囊图区域 -->
      <div class="capsule-container">
        <div class="capsule-item" v-for="(ratio, index) in capsuleLength" :key="index">
          <div class="capsule-bar-bg">
            <div class="capsule-bar-fill" :style="{
              width: `${ratio * 100}%`,
              backgroundColor: mergedConfig.colors[index % mergedConfig.colors.length]
            }"></div>
            <div class="capsule-percent-text"> {{ (ratio * 100).toFixed(1) }}%</div>
          </div>

          <div class="capsule-total-text">
            {{ totalText[index] }}
          </div>
        </div>
      </div>

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
  padding: 10px;
  color: #fff;
  box-sizing: border-box;

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
      background-color: #3c3f4a; // ✅ 更清晰的未使用部分颜色
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
        color: #fff;
        z-index: 2;
        pointer-events: none;
        white-space: nowrap;
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
}
</style>
