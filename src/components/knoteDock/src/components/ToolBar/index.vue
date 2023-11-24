<template>
  <div id="toolbar">
    <v-toolbar title="KNote" density="compact">
      <v-toolbar-items>
        <v-btn class="test" @click="newKnote">新建</v-btn>
        <v-btn class="test" @click="refresh">刷新</v-btn>

        <!--        <v-menu>-->
        <!--          <template #activator="{ props }">-->
        <!--            &lt;!&ndash;            <v-btn v-bind="props" class="test" @click="openWindow" :class="{ 'text-blue': isLock }">测试</v-btn>&ndash;&gt;-->
        <!--            <v-btn v-bind="props" class="test">测试</v-btn>-->
        <!--          </template>-->

        <!--          <v-btn class="test">初始化数据</v-btn>-->
        <!--          <v-btn class="test">初始化1000条数据</v-btn>-->
        <!--          <v-btn class="test">插入一条测试数据</v-btn>-->
        <!--          <v-btn class="test" @click="refresh">刷新</v-btn>-->
        <!--          <v-btn class="test">清空</v-btn>-->
        <!--          <v-btn class="test">切换到</v-btn>-->
        <!--        </v-menu>-->
      </v-toolbar-items>
      <!--      <v-divider vertical class="mx-2" />-->

      <!--      <v-btn icon="mdi-dots-vertical" class="test" />-->
    </v-toolbar>
  </div>
</template>

<script setup lang="ts">
import { useData } from '@/components/knoteDock/src/hooks/useData'

const { refreshSiyuanKnotes, showNewKnote } = useData()

const newKnote = () => {
  showNewKnote.value = true
}
const refresh = () => {
  // refreshSiyuanKnotes().then(() => {
  //   console.log(allSiyuanKnotes.value)
  // })
  refreshSiyuanKnotes()
}
</script>

<style scoped></style>
