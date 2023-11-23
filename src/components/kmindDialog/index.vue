<template>
  <div>
    <component :is="componentsMap[props.type]" />
  </div>
</template>

<script setup lang="tsx">
// 20230712105058-fkptf24
import { onMounted } from 'vue'
import GlobalConfig from '@/components/kmindDialog/components/GlobalConfig/index.vue'
import AddKmind from '@/components/kmindDialog/components/AddKmind/index.vue'
import KmindDock from '@/components/kmindDock/index.vue'
// import { Window } from '@/types/global'

const props = defineProps<{
  type: string
}>()

const componentsMap = {
  GlobalConfig,
  AddKmind,
  KmindDock
}
onMounted(() => {
  // new window.kmindApi.siyuan.Protyle(window.kmindApi.plugin.app, document.querySelector('#protyle233'), {
  //   blockId: '20230712105058-fkptf24'
  // })
  // window.kmindApi.siyuan.Protyle
})
</script>

<style scoped lang="less"></style>
