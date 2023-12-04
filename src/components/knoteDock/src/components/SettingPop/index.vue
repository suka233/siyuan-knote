悬浮设置按钮
<template>
  <a-popover title="Hover title" trigger="click" placement="bottomRight">
    <div class="操作按钮">设置</div>
    <template #content>
      <div class="w-300px">
        <a-form>
          <a-form-item label="请选择笔记本">
            <a-select
              :placeholder="`请选择笔记本`"
              class="w-full!"
              :options="siYuanNoteItems"
              v-model:value="dailyNotebookId"
              @change="handleChangeNotebook"
            />
          </a-form-item>
        </a-form>
      </div>
    </template>
  </a-popover>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { listNotebook } from '@/api/public'
import { useData } from '@/components/knoteDock/src/hooks/useData'
const { dailyNotebookId, refreshSiyuanKnotes, selectedDay, getTargetDailyDocId, saveConfig } = useData()
const siYuanNoteItems = ref([])
listNotebook().then((res) => {
  console.log(res)
  siYuanNoteItems.value = res.data.notebooks.map((item: any) => {
    return {
      label: item.name,
      value: item.id
    }
  })
})

const handleChangeNotebook = () => {
  refreshSiyuanKnotes()
  getTargetDailyDocId(selectedDay.value)
  saveConfig()
}
</script>
<style scoped lang="less">
.操作按钮 {
  display: inline-block;
  width: 42px;
  height: 42px;
  cursor: pointer;
  text-align: center;

  &:hover {
    background-color: #dfe0e1;
  }
}
</style>
