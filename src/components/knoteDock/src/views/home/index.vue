<template>
  <div class="relative">
    <tool-bar class="sticky" />
    <control-bar />
    <new-knote v-show="showNewKnote" />
    <div class="KNote-Container" v-show="allSiyuanKnotes.length">
      <div class="包裹">
        <k-note v-for="knote in allSiyuanKnotes" :key="knote.id" :data="knote" />
      </div>
    </div>
    <div v-show="!allSiyuanKnotes.length">今天还没有！</div>
  </div>
</template>

<script setup lang="ts">
import ToolBar from '@/components/knoteDock/src/components/ToolBar/index.vue'
import { useData } from '@/components/knoteDock/src/hooks/useData'
import KNote from '../../components/KNote/index.vue'
import ControlBar from '@/components/knoteDock/src/components/ControlBar/index.vue'
import NewKnote from '@/components/knoteDock/src/components/NewKnote/index.vue'
const { allSiyuanKnotes, showNewKnote } = useData()
</script>

<style scoped></style>
