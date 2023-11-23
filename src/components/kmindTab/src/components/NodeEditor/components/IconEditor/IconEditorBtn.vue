<template>
  <a-popover v-if="activeNodeList.length" trigger="click">
    <template #content>
      <icon-editor />
    </template>
    <a-button v-bind="$attrs" class="mr-2">
      <span class="align-middle">图标</span>
      <smile-outlined class="align-middle" /> </a-button
  ></a-popover>

  <a-button v-else class="mr-2" v-bind="$attrs">
    <span class="align-middle">图标</span>
    <smile-outlined class="align-middle" />
  </a-button>
</template>

<script lang="tsx">
export default {
  name: 'IconEditorBtn'
}
</script>

<script lang="tsx" setup>
import { SmileOutlined } from '@ant-design/icons-vue'
import IconEditor from './IconEditor.vue'
import { creatNamedPublicStore } from '/src/components/kmindTab/src/store/modules/public'
import { inject, toRefs } from 'vue'
const name = inject('name')
const publicStore = creatNamedPublicStore(name)()
const { activeNodeList } = toRefs(publicStore)
</script>

<style scoped></style>
