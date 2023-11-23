<template>
  <a-popover :title="`导图数据发生变化时，会在延迟1秒后自动保存数据哦~`" placement="bottom">
    <template #content
      ><span class="text-gray-4">{{ `最后一次自动保存的时间：${lastSaveTime}` }}</span></template
    >
    <a-button @click="handleSave"> 保存 </a-button>
  </a-popover>
</template>

<script setup lang="tsx">
import { kmind } from '@/components/kmindTab/src/hooks/useKmind'
import { message } from 'ant-design-vue'
import { creatNamedPublicStore } from '@/components/kmindTab/src/store/modules/public'
import { inject, toRefs } from 'vue'
const name = inject('name')
const publicStore = creatNamedPublicStore(name)()
const { saveMindMapData } = publicStore
const { lastSaveTime } = toRefs(publicStore)
const handleSave = async () => {
  await saveMindMapData({ data: kmind[name].getData(true) }).then(() => message.success('保存导图数据成功'))
}
</script>

<style scoped></style>
