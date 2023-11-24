<template>
  <div class="relative flex flex-col" ref="wrapRef">
    <tool-bar class="" />
    <control-bar />
    <new-knote v-show="showNewKnote" ref="newKnoteRef" />
    <div class="KNote-Container overflow-y-auto" v-show="allSiyuanKnotes.length" ref="knoteContainerRef">
      <k-note v-for="knote in allSiyuanKnotes" :key="knote.id" :data="knote" />
    </div>
    <div v-show="!allSiyuanKnotes.length">暂无可以展示的Knote</div>
    <quick-input v-model:visible="showQuickInput" />
  </div>
</template>

<script setup lang="ts">
import ToolBar from '@/components/knoteDock/src/components/ToolBar/index.vue'
import { useData } from '@/components/knoteDock/src/hooks/useData'
import KNote from '../../components/KNote/index.vue'
import ControlBar from '@/components/knoteDock/src/components/ControlBar/index.vue'
import NewKnote from '@/components/knoteDock/src/components/NewKnote/index.vue'
import QuickInput from '@/components/knoteDock/src/components/QuickInput/index.vue'
import { nextTick, onMounted, onUnmounted, ref, watch } from 'vue'
const { allSiyuanKnotes, showNewKnote, showQuickInput } = useData()

const wrapRef = ref()
const newKnoteRef = ref()
const knoteContainerRef = ref()
// 计算knoteContainerRef的高度
onMounted(() => {
  const resizeHandler = () => {
    nextTick(() => {
      const toolbarHeight = 48
      const controlBarHeight = 32
      const newKnoteHeight = newKnoteRef.value.$el.offsetHeight
      const wrapHeight = wrapRef.value.parentNode.parentNode.offsetHeight
      const knoteContainerHeight = wrapHeight - toolbarHeight - controlBarHeight - newKnoteHeight
      knoteContainerRef.value.style.height = `${knoteContainerHeight}px`
    })
  }

  // 监听 resize 事件
  window.addEventListener('resize', resizeHandler)

  watch(
    () => showNewKnote.value,
    () => {
      resizeHandler()
    }
  )

  // 初始设置高度
  resizeHandler()

  // 在组件卸载时移除事件监听
  onUnmounted(() => {
    window.removeEventListener('resize', resizeHandler)
  })
})
</script>

<style scoped></style>
