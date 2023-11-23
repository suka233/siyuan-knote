<template>
  <a-row class="cursor-pointer mb-1 group">
    <a-col :span="2">
      <file-markdown-outlined />
    </a-col>
    <a-col :span="18">
      <div @click="handleOpen">{{ props.name }}</div>
    </a-col>
    <a-col :span="2">
      <a-tooltip title="重命名" overlay-class-name="text-xs"
        ><edit-outlined class="invisible group-hover:visible" @click="handleRename"
      /></a-tooltip>
    </a-col>
    <a-col :span="2">
      <a-popconfirm placement="right" @confirm="handleDelete">
        <template #title>
          <p class="font-bold">确定要永久删除 {{ `${props.name}.kmind` }} 吗？</p>
          <p>警告：此操作不可逆！！！</p>
        </template>
        <delete-outlined class="invisible group-hover:visible text-red-500" />
      </a-popconfirm>
    </a-col>
  </a-row>
  <rename-kmind v-model:visible="showRenameModel" :name="props.name" :plugin="plugin" :refresh-fn="refreshFn" />
</template>

<script setup lang="ts">
import { FileMarkdownOutlined, DeleteOutlined, EditOutlined } from '@ant-design/icons-vue'
import type KmindPlugin from '@/index'
import { useFile } from '@/hooks/useFile'
import { message } from 'ant-design-vue'
import RenameKmind from './components/RenameKmind/index.vue'
import { ref } from 'vue'
const props = defineProps<{
  name?: string
  plugin?: KmindPlugin
  refreshFn: () => void
}>()
const handleOpen = () => {
  // 不存在名为name的tab页，则打开
  if (!props.plugin.tabs.find((item) => item.name === props.name)) {
    props.plugin.open(props.name)
  }
}

const { deleteFile } = useFile()
const handleDelete = async () => {
  // 关闭tab
  props.plugin?.closeTab(props.name)

  // 删除文件
  return deleteFile(props.name).then(() => {
    message.success('删除成功')
    props.refreshFn()
  })
}

const showRenameModel = ref(false)
const handleRename = () => {
  showRenameModel.value = true
}
</script>

<style scoped></style>
