<script setup lang="ts">
import { rightBottom } from "@/api";
import SeamlessScroll from "@/components/seamless-scroll";
import { watch, ref, reactive } from "vue";
import { useSettingStore } from "@/stores";
import { storeToRefs } from "pinia";
import EmptyCom from "@/components/empty-com";
import { ElMessage } from "element-plus";

interface calculateresource {
  name: string;
  cpu_use: number;
  gpu_use: number;
  memory_use: number;
}

const props = defineProps<{
  data: calculateresource[];
}>();

const settingStore = useSettingStore();
const { defaultOption, indexConfig } = storeToRefs(settingStore);

const state = reactive<any>({
  list: [],
  defaultOption: {
    ...defaultOption.value,
    singleHeight: 1000,
    limitScrollNum: 3,
    step:0.5
  },
  scroll: true,
});

const comName = ref(SeamlessScroll);

// ✅ 1. 监听 props.data 更新，赋值给 state.list
watch(() => props.data, (newData) => {
  state.list = newData;
}, { immediate: true });

// ✅ 2. 监听 indexConfig.rightBottomSwiper，切换组件
watch(() => indexConfig.value.rightBottomSwiper, (val) => {
  comName.value = val ? SeamlessScroll : EmptyCom;
}, { immediate: true });

</script>


<template>
  <div class="right_bottom_wrap beautify-scroll-def" :class="{ 'overflow-y-auto': !indexConfig.rightBottomSwiper }">
    <component
      :is="comName"
      :list="state.list"
      v-model="state.scroll"
      :singleHeight="state.defaultOption.singleHeight"
      :step="state.defaultOption.step"
      :limitScrollNum="state.defaultOption.limitScrollNum"
      :hover="state.defaultOption.hover"
      :singleWaitTime="state.defaultOption.singleWaitTime"
      :wheel="state.defaultOption.wheel"
    >
      <ul class="right_bottom">
        <li class="right_center_item" v-for="(item, i) in state.list" :key="i">
          <span class="orderNum">{{ i + 1 }}</span>
          <div class="inner_right">
            <div class="dibu"></div>
            <div class="flex">
              <div class="info">
                <span class="labels">集群名称：</span>
                <span class="text-content ciyao" >
                  {{ item.name}}</span
                >
              </div>
            </div>
            <div class="flex">
              <div class="info">
                <span class="labels">CPU使用率</span>
                <span class="text-content zhuyao"> {{ item.cpu_use }}%</span>
              </div>
              <div class="info">
                <span class="labels">GPU使用率</span>
                <span class="text-content"> {{ item.gpu_use }}%</span>
              </div>
              <div class="info">
                <span class="labels">内存使用率</span>
                <span class="text-content warning"> {{ item.memory_use }}%</span>
              </div>
            </div>
          </div>
        </li>
      </ul>
    </component>
  </div>
</template>

<style scoped lang="scss">
.right_bottom {
  width: 100%;
  height: 100%;

  .right_center_item {
    display: flex;
    align-items: center;
    justify-content: center;
    height: auto;
    padding: 10px;
    font-size: 14px;
    color: #fff;

    .orderNum {
      margin: 0 20px 0 -20px;
    }

    .inner_right {
      position: relative;
      height: 100%;
      width: 400px;
      flex-shrink: 0;
      line-height: 1.5;

      .dibu {
        position: absolute;
        height: 2px;
        width: 104%;
        background-image: url("@/assets/img/zuo_xuxian.png");
        bottom: -12px;
        left: -2%;
        background-size: cover;
      }
    }

    .info {
      margin-right: 10px;
      display: flex;
      align-items: center;

      .labels {
        flex-shrink: 0;
        font-size: 12px;
        color: rgba(255, 255, 255, 0.6);
      }

      .zhuyao {
        color: $primary-color;
        font-size: 15px;
      }

      .ciyao {
        color: rgba(255, 255, 255, 0.8);
      }

      .warning {
        color: #e6a23c;
        font-size: 15px;
      }
    }
  }
}

.right_bottom_wrap {
  overflow: hidden;
  width: 100%;
  height: 252px;
}

.overflow-y-auto {
  overflow-y: auto;
}
</style>
