<template>
  <div class="relative w-[300px] h-[180px] flex items-center justify-center">
    <!-- 背景整体结构 -->
    <svg viewBox="0 0 300 180" class="absolute inset-0 w-full h-full">
      <!-- 左梯形 -->
      <polygon points="0,90 60,40 60,140 0,90" fill="url(#leftGradient)" stroke="#00ffaa" stroke-width="1.5"
        opacity="0.95" />

      <!-- 右梯形 -->
      <polygon points="300,90 240,40 240,140 300,90" fill="url(#rightGradient)" stroke="#00ccff" stroke-width="1.5"
        opacity="0.95" />

      <!-- 六边形 -->
      <polygon :points="hexPoints" fill="url(#hexGradient)" stroke="url(#hexStroke)" stroke-width="3"
        filter="url(#glow)" />

      <!-- 左梯形文本 -->
      <foreignObject x="0" y="50" width="60" height="80">
        <div class="flex flex-col items-center justify-center h-full text-white text-xs leading-tight">
          <div class="text-green-300 font-semibold">节点数量</div>
        </div>
      </foreignObject>

      <!-- 右梯形文本 -->
      <foreignObject x="240" y="50" width="60" height="80">
        <div class="flex flex-col items-center justify-center h-full text-white text-xs leading-tight">
          <div class="text-cyan-300 font-semibold">资源数量</div>
        </div>
      </foreignObject>

      <!-- 渐变定义 -->
      <defs>
        <linearGradient id="leftGradient" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stop-color="#00ffaa" />
          <stop offset="100%" stop-color="transparent" />
        </linearGradient>
        <linearGradient id="rightGradient" x1="1" y1="0" x2="0" y2="0">
          <stop offset="0%" stop-color="#00ccff" />
          <stop offset="100%" stop-color="transparent" />
        </linearGradient>
        <linearGradient id="hexGradient" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stop-color="#003b6f" />
          <stop offset="100%" stop-color="#0070c9" />
        </linearGradient>
        <linearGradient id="hexStroke" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stop-color="#00ffaa" />
          <stop offset="100%" stop-color="#00ccff" />
        </linearGradient>
        <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
          <feDropShadow dx="0" dy="0" stdDeviation="6" flood-color="#00ccff" />
        </filter>
      </defs>
    </svg>

    <!-- 中心图标内容 -->
    <div class="relative z-10 text-white flex flex-col items-center">
      <v-icon size="40" color="white">mdi-server</v-icon>
    </div>


  </div>
</template>

<script setup lang="ts">

// 六边形坐标计算
const r = 60
const cx = 150
const cy = 90
const hexPoints = Array.from({ length: 6 }, (_, i) => {
  const angle = (Math.PI / 3) * i - Math.PI / 6
  const x = cx + r * Math.cos(angle)
  const y = cy + r * Math.sin(angle)
  return `${x},${y}`
}).join(' ')
</script>
