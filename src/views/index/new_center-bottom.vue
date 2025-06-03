<script setup lang="ts">
import { ref, watch } from "vue";
import CountUp from "@/components/count-up";

const props = defineProps<{
  virtual_Num: number;
  meterial_Num: number;
  docker_Num: number;
}>();

const duration = ref(2);

const state = ref({
  total_task_Num: props.virtual_Num,
  cloud_task_Num: props.meterial_Num,
  edge_task_Num: props.docker_Num,
});

// 监听 props 变化时，更新 state
watch(
  () => props,
  (newVal) => {
    state.value.total_task_Num = newVal.virtual_Num;
    state.value.cloud_task_Num = newVal.meterial_Num;
    state.value.edge_task_Num = newVal.docker_Num;
  },
  { deep: true, immediate: true }
);
</script>


<template>
  <ul class="user_Overview flex">
    <li class="user_Overview-item" style="color: #00fdfa">
      <div class="user_Overview_nums allnum">
        <CountUp :endVal="state.total_task_Num" :duration="duration" />
      </div>
      <p>虚拟机数</p>
    </li>
    <li class="user_Overview-item" style="color: #07f7a8">
      <div class="user_Overview_nums online">
        <CountUp :endVal="state.edge_task_Num" :duration="duration" />
      </div>
      <p>容器数</p>
    </li>
    <li class="user_Overview-item" style="color: #e3b337">
      <div class="user_Overview_nums offline">
        <CountUp :endVal="state.cloud_task_Num" :duration="duration" />
      </div>
      <p>裸金属数</p>
    </li>
  </ul>
</template>

<style scoped lang="scss">
.left-top {
  width: 100%;
  height: 100%;
}

.user_Overview {
  li {
    flex: 1;

    p {
      text-align: center;
      height: 16px;
      font-size: 16px;
    }

    .user_Overview_nums {
      width: 100px;
      height: 100px;
      text-align: center;
      line-height: 100px;
      font-size: 22px;
      margin: 50px auto 30px;
      background-size: cover;
      background-position: center center;
      position: relative;

      &::before {
        content: "";
        position: absolute;
        width: 100%;
        height: 100%;
        top: 0;
        left: 0;
      }

      &.bgdonghua::before {
        animation: rotating 14s linear infinite;
      }
    }

    .allnum {
      &::before {
        background-image: url("@/assets/img/left_top_lan.png");
      }
    }

    .online {
      &::before {
        background-image: url("@/assets/img/left_top_lv.png");
      }
    }

    .offline {
      &::before {
        background-image: url("@/assets/img/left_top_huang.png");
      }
    }

    .laramnum {
      &::before {
        background-image: url("@/assets/img/left_top_hong.png");
      }
    }
  }
}
</style>