<script setup lang="ts">
import { ref ,reactive,watch} from 'vue';

// Define interfaces for type safety
interface Node {
    title: string;
    value: string;
    type: string;
}

interface Resource {
    title: string;
    value: string;
    type: string;
}

const props = defineProps<{
    cloudnum: number;
    edgenum: number;
    devicenum: number;
    cpu: number;
    gpu: number;
    memory: number;
    storage: number;
}>();

// Reactive data for nodes and resources
const nodes = reactive<Node[]>([
    { 
        title: '总计节点数量', 
        value: `${props.cloudnum + props.edgenum + props.devicenum}个节点`, 
        type: 'total-node' 
    },
    { title: '云侧节点数量', value: props.cloudnum+'个节点', type: 'cloud-node' },
    { title: '边侧节点数量', value: props.edgenum+'个节点', type: 'edge-node' },
    { title: '端侧节点数量', value: props.devicenum+'个节点', type: 'device-node' }
]);

const resources = reactive<Resource[]>([
    { title: 'CPU资源', value: props.cpu+'核', type: 'cpu-resource' },
    { title: 'GPU资源', value: props.gpu+'个', type: 'gpu-resource' },
    { title: '内存资源', value: Math.trunc(props.memory)+'GB', type: 'memory-resource' },
    { title: '存储资源', value: Math.trunc(props.storage)+'TB', type: 'storage-resource' }
]);

watch(
  () => ({
    cloudnum: props.cloudnum,
    edgenum: props.edgenum,
    devicenum: props.devicenum,
    cpu: props.cpu,
    gpu: props.gpu,
    memory: props.memory,
    storage: props.storage,
  }),
  (newProps) => {
    // 更新 nodes
    nodes[0].value = `${newProps.cloudnum+newProps.edgenum+newProps.devicenum}个节点`;
    nodes[1].value = `${newProps.cloudnum}个节点`;
    nodes[2].value = `${newProps.edgenum}个节点`;
    nodes[3].value = `${newProps.devicenum}个节点`;

    // 更新 resources
    resources[0].value = `${newProps.cpu}核`;
    resources[1].value = `${newProps.gpu}个`;
    resources[2].value = `${newProps.memory}GB`;
    resources[3].value = `${newProps.storage}TB`;
  },
  { deep: true }
);
// Particle count for background animation
const particleCount = 20;
</script>

<template>
    <div class="zoom-wrapper">
        <div class="tech-overview">
            <!-- Background decorations -->
            <div class="floating-particles">
                <div v-for="i in particleCount" :key="'particle-' + i" class="particle" :style="{
                    width: Math.random() * 6 + 2 + 'px',
                    height: Math.random() * 6 + 2 + 'px',
                    left: Math.random() * 100 + '%',
                    top: Math.random() * 100 + '%',
                    animationDuration: (Math.random() * 20 + 10) + 's'
                }"></div>
            </div>

            <!-- Center Container -->
            <div class="center-container">
                <!-- Nodes Container -->
                <div class="nodes-container">
                    <div v-for="node in nodes" :key="node.title" :class="['node-item', node.type]">
                        <div class="item-content">
                            <div class="item-title">{{ node.title }}</div>
                            <div class="item-value">{{ node.value }}</div>
                        </div>
                    </div>
                </div>

                <!-- Hexagon Container -->
                <div class="hexagon-container">
                    <div class="hexagon">
                        <div class="person-icon">
                            <div class="adult"></div>
                            <div class="child"></div>
                        </div>
                    </div>
                    <div class="connector left-connector">节点数量</div>
                    <div class="connector right-connector">资源数量</div>
                </div>

                <!-- Resources Container -->
                <div class="resources-container">
                    <div v-for="resource in resources" :key="resource.title" :class="['resource-item', resource.type]">
                        <div class="item-content">
                            <div class="item-title">{{ resource.title }}</div>
                            <div class="item-value">{{ resource.value }}</div>
                        </div>
                    </div>
                </div>
            </div>

        </div>
    </div>
</template>

<style scoped>
* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

.zoom-wrapper {
  width: 100%;
  height: 100%;
  overflow: auto;
  padding: 5px;
 /* border: 2px dashed #00f5ff; /* ✅ 可见的边框，颜色可自选 */
  box-sizing: border-box;
  text-align: left; 
}



.tech-overview {
    max-width: 700px;
    /* ✅ 设置最大宽度 */
    width: 100%;
    /* ✅ 宽度随容器变化 */   
    margin: 40px auto 0 auto;  
    /* ✅ 居中显示 */
    transform: scale(1.0);
    transform-origin: center center;
    padding: 10px;
    position: relative;
    overflow: hidden;
    background: transparent;
    border-radius: 20px;
    box-shadow: none;
  /*  border: 2px solid #00f5ff;*/
}


.tech-overview-bg {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-image:
        radial-gradient(circle at 10% 20%, rgba(0, 150, 255, 0.05) 0%, transparent 20%),
        radial-gradient(circle at 90% 80%, rgba(0, 200, 255, 0.05) 0%, transparent 20%),
        radial-gradient(circle at 50% 50%, rgba(0, 100, 255, 0.03) 0%, transparent 30%);
    z-index: 0;
    pointer-events: none;
}

.circuit-pattern {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background:
        linear-gradient(rgba(0, 100, 200, 0.1) 1px, transparent 1px),
        linear-gradient(90deg, rgba(0, 100, 200, 0.1) 1px, transparent 1px);
    background-size: 40px 40px;
    z-index: 0;
    opacity: 0.3;
    pointer-events: none;
}

.floating-particles {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 0;
    pointer-events: none;
}

.particle {
    position: absolute;
    background: rgba(0, 200, 255, 0.5);
    border-radius: 50%;
    filter: blur(2px);
    animation: float 15s infinite linear;
}

@keyframes float {
    0% {
        transform: translate(0, 0);
    }

    100% {
        transform: translate(100px, 100px);
    }
}

.chip-icon {
    background: linear-gradient(145deg, #0a3a6b, #082a4d);
    width: 60px;
    height: 60px;
    border-radius: 12px;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-right: 20px;
    box-shadow: 0 5px 15px rgba(0, 100, 255, 0.4);
    position: relative;
    overflow: hidden;
}

.chip-icon::before {
    content: '';
    position: absolute;
    width: 100%;
    height: 100%;
    background:
        linear-gradient(45deg, transparent 45%, rgba(0, 200, 255, 0.3) 50%, transparent 55%),
        linear-gradient(-45deg, transparent 45%, rgba(0, 200, 255, 0.3) 50%, transparent 55%);
    background-size: 10px 10px;
}

.chip-icon i {
    font-size: 30px;
    color: #4dc9e6;
}

.yellow {
    background: linear-gradient(to right, #ffd166, #ffb700);
}

.light-blue {
    background: linear-gradient(to right, #70d6ff, #4dc9e6);
}

.sky-blue {
    background: linear-gradient(to right, #90e0ef, #70d6ff);
}

.center-container {
     display: flex;
    grid-template-columns: 280px auto 280px;
    gap: 20px;
    align-items: center;
    justify-content: space-between;
}


.hexagon-container {
    position: relative;
    width: 260px;
    height: 300px;
    display: flex;
    justify-content: center;
    align-items: center;
}

.hexagon {
    position: absolute;
    width: 200px;
    height: 230px;
    background: linear-gradient(145deg, #0a3a6b, #082a4d);
    clip-path: polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%);
    display: flex;
    justify-content: center;
    align-items: center;
    box-shadow: 0 0 30px rgba(0, 150, 255, 0.6);
}

.hexagon::before {
    content: '';
    position: absolute;
    inset: 2px;
    background: linear-gradient(145deg, #0d2e55, #0a3a6b);
    clip-path: polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%);
    z-index: 1;
}

.person-icon {
    position: relative;
    z-index: 2;
    width: 120px;
    height: 120px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: flex-end;
}

.person-icon .adult {
    width: 60px;
    height: 80px;
    background: linear-gradient(to bottom, #a0e7ff, #4dc9e6);
    clip-path: polygon(50% 0%, 100% 25%, 100% 100%, 0 100%, 0 25%);
    border-radius: 50% 50% 0 0;
}

.person-icon .child {
    width: 40px;
    height: 55px;
    background: linear-gradient(to bottom, #a0e7ff, #4dc9e6);
    clip-path: polygon(50% 0%, 100% 25%, 100% 100%, 0 100%, 0 25%);
    border-radius: 50% 50% 0 0;
    margin-top: 10px;
}

.connector {
    height: 60px;
    width: 180px;
    display: flex;
    align-items: center;
    position: relative;
    z-index: 2;
    padding: 0 10px;
    font-weight: 600;
    letter-spacing: 1px;
    font-size: 18px;
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
}

.left-connector {
    background: linear-gradient(to right, #082a4d, #0a3a6b, #20bf55);
    border-radius: 0 30px 30px 0;
    justify-content: flex-end;
    color: #a0ffd0;
    text-shadow: 0 0 10px rgba(32, 191, 85, 0.7);
}

.right-connector {
    background: linear-gradient(to left, #082a4d, #0a3a6b, #4dc9e6);
    border-radius: 30px 0 0 30px;
    justify-content: flex-start;
    color: #a0e7ff;
    text-shadow: 0 0 10px rgba(77, 201, 230, 0.7);
}

.nodes-container,
.resources-container {
    display: flex;
    flex-direction: column;
    gap: 25px;
    position: relative;
    z-index: 2;
}

.nodes-container {
    align-items: flex-end;
}

.resources-container {
    align-items: flex-start;
}

.node-item,
.resource-item {
    width: 180px;
    padding: 10px;
    border-radius: 15px;
    position: relative;
    overflow: hidden;
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
    transition: transform 0.3s ease;
}

.node-item:hover,
.resource-item:hover {
    transform: translateY(-5px);
}

.node-item::before,
.resource-item::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: radial-gradient(circle at center, rgba(32, 191, 85, 0.15) 0%, transparent 70%);
    z-index: 0;
}

.resource-item::before {
    background: radial-gradient(circle at center, rgba(77, 201, 230, 0.15) 0%, transparent 70%);
}

.item-content {
    position: relative;
    z-index: 1;
}

.item-title {
    font-size: 18px;
    margin-bottom: 10px;
    font-weight: 500;
}

.item-value {
    font-size: 28px;
    font-weight: 700;
}

.total-node {
    background: linear-gradient(145deg, #0d2e55, rgba(32, 191, 85, 0.1));
}

.cloud-node {
    background: linear-gradient(145deg, #0d2e55, rgba(32, 191, 85, 0.1));
}

.edge-node {
    background: linear-gradient(145deg, #0d2e55, rgba(32, 191, 85, 0.15));
}

.device-node {
    background: linear-gradient(145deg, #0d2e55, rgba(32, 191, 85, 0.2));
}

.total-node .item-value {
    color: #a0ffd0;
}

.cloud-node .item-value {
    color: #a0ffd0;
}

.edge-node .item-value {
    color: #7affb3;
}

.device-node .item-value {
    color: #4dff9e;
}

.cpu-resource {
    background: linear-gradient(145deg, #0d2e55, rgba(77, 201, 230, 0.1));
}

.gpu-resource {
    background: linear-gradient(145deg, #0d2e55, rgba(77, 201, 230, 0.15));
}

.memory-resource {
    background: linear-gradient(145deg, #0d2e55, rgba(77, 201, 230, 0.2));
}

.storage-resource {
    background: linear-gradient(145deg, #0d2e55, rgba(77, 201, 230, 0.25));
}

.cpu-resource .item-value {
    color: #a0e7ff;
}

.gpu-resource .item-value {
    color: #8de1ff;
}

.memory-resource .item-value {
    color: #7adaff;
}

.storage-resource .item-value {
    color: #68d4ff;
}

.highlight {
    color: #a0e7ff;
    font-weight: 600;
}
</style>