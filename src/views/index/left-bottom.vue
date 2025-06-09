<script setup lang="ts">
import { leftBottom } from "@/api";
import SeamlessScroll from "@/components/seamless-scroll";
import { computed, onMounted, reactive } from "vue";
import { useSettingStore } from "@/stores";
import { storeToRefs } from "pinia";
import EmptyCom from "@/components/empty-com";
import { ElMessage } from "element-plus";
import { watch } from "vue";
import { groupListApi } from "@/api/modules";
const props = defineProps<{
  list: [
    {
      task_id: string;
      task_name: string;
      task_type: number;
      task_node: string;
    }
  ];
}>();
const sourceData = {
  'HenanEP':'河南电力',
  'ShandongHS':'山东高速',
  'Cosmo':'卡奥斯制造'
};

const settingStore = useSettingStore();
const { defaultOption, indexConfig } = storeToRefs(settingStore);
const state = reactive<any>({
  list: [],
  defaultOption: {
    ...defaultOption.value,
    singleHeight: 256,
    limitScrollNum: 4,
  },
  scroll: true,
});

const getList = async () => {
  const res = await groupListApi({NamespaceAll: ''});
  const curData = res.items;
  curData.forEach((item: any, index: number) => {
    // 判断是否有label属性
    item.task_type = item.labels.hasOwnProperty('type')?item.labels.type == 'Train'?2:1
    :0
  });
  const newList = Object.keys(sourceData).map((key: string) => {
    return curData.filter((item: any) => item.namespace === key);
  });
  state.list = newList.flat();
}
getList();
const comName = computed(() => {
  if (indexConfig.value.leftBottomSwiper) {
    return SeamlessScroll;
  } else {
    return EmptyCom;
  }
});

// watch(() => props.list, (newVal) => {
//   if (newVal && newVal.length > 0) {
//     state.list = newVal;
//   }
// });

</script>

<template>
  <div class="left_boottom_wrap beautify-scroll-def" :class="{ 'overflow-y-auto': !indexConfig.leftBottomSwiper }">
    <component :is="comName" :list="state.list" v-model="state.scroll" :singleHeight="state.defaultOption.singleHeight"
      :step="state.defaultOption.step" :limitScrollNum="state.defaultOption.limitScrollNum"
      :hover="state.defaultOption.hover" :singleWaitTime="state.defaultOption.singleWaitTime"
      :wheel="state.defaultOption.wheel">
      <ul class="left_boottom">
        <li class="left_boottom_item" v-for="(item, i) in state.list" :key="i">
          <span class="orderNum doudong">{{ i + 1 }}</span>
          <div class="inner_right">
            <div class="dibu"></div>
            <div class="flex">
              <div class="info">
                <span class="labels">任务编号:</span>
                <!-- 样式超出显示省略号 -->
                <span class="text-content zhuyao doudong wangguan" style="width: 40px;"> {{ i+1 }}</span>
              </div>
              <div class="info">
                <span class="labels">任务名称：</span>
                <span class="text-content" style="display: inline-block; font-size: 12px; vertical-align: middle; overflow: hidden; white-space: nowrap; width: 155px;"> {{ item.name }}</span>
              </div>
            </div>

            <span class="types doudong" :class="{
              typeWhite: item.task_type == 0,
              typeGreen: item.task_type == 1,
              typeYellow: item.task_type == 2,
            }">{{ item.task_type == 1
              ? "训练任务"
              : item.task_type == 2
                ? "推理任务"
                : "普通任务" }}</span>

            <div class="flex addresswrap">
              <div class="info" style="margin-right: 0px;">
                <span class="labels">运行集群：</span>
                <span class="text-content wangguan1" style="font-size: 12px"> {{ item.status.node }}</span>
              </div>
              <div class="info">
                <span class="labels">应用来源：</span>
                <span class="text-content " style="font-size: 12px"> {{ sourceData[item.namespace] }}</span>
              </div>
            </div>
          </div>
        </li>
      </ul>
    </component>
  </div>
</template>

<style scoped lang="scss">
.left_boottom_wrap {
  overflow: hidden;
  width: 100%;
  height: 100%;
}

.doudong {
  overflow: hidden;
  backface-visibility: hidden;
}

.overflow-y-auto {
  overflow-y: auto;
}

.left_boottom {
  width: 100%;
  height: 100%;

  .left_boottom_item {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 8px;
    font-size: 14px;
    margin: 10px 0;

    .orderNum {
      margin: 0 16px 0 -20px;
    }

    .info {
      margin-right: 10px;
      display: flex;
      align-items: center;
      color: #fff;

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

    .inner_right {
      position: relative;
      height: 100%;
      width: 380px;
      flex-shrink: 0;
      line-height: 1;
      display: flex;
      align-items: center;
      justify-content: space-between;
      flex-wrap: wrap;

      .dibu {
        position: absolute;
        height: 2px;
        width: 104%;
        background-image: url("@/assets/img/zuo_xuxian.png");
        bottom: -10px;
        left: -2%;
        background-size: cover;
      }

      .addresswrap {
        width: 100%;
        display: flex;
        margin-top: 8px;
      }
    }

    .wangguan {
      color: #1890ff;
      font-size: 15px;
      width: 80px;
      flex-shrink: 0;
      font-weight: 900;

    }
    .wangguan1{
      font-size: 15px;
      width: 80px;
      flex-shrink: 0;
    }

    .time {
      font-size: 12px;
      // color: rgba(211, 210, 210,.8);
      color: #fff;
    }

    .address {
      font-size: 12px;
      cursor: pointer;
      // @include text-overflow(1);
    }

    .types {
      width: 30px;
      flex-shrink: 0;
    }

    .typeRed {
      color: #fc1a1a;
    }

    .typeGreen {
      color: #29fc29;
    }

    .typeWhite {
      color: white;
    }

    .typeYellow {
      color: yellow;
    }
  }
}
</style>
