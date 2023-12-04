<template>
  <a-config-provider>
    <a-row>
      <a-col :span="12">
        <a-date-picker
          placeholder="请选择日期"
          class="w-full!"
          v-model:value="selected"
          @change="dateChange"
          :locale="locale"
          :disabled-date="disabledDate"
          :allow-clear="false"
        />
      </a-col>
      <a-col :span="12">
        <a-select
          :placeholder="`请选择笔记本`"
          class="w-full!"
          :options="siYuanNoteItems"
          v-model:value="dailyNotebookId"
          @change="handleChangeNotebook"
        />
      </a-col>
    </a-row>
  </a-config-provider>
</template>
<script setup lang="ts">
import locale from 'ant-design-vue/es/date-picker/locale/zh_CN'
import { useData } from '@/components/knoteDock/src/hooks/useData'
import { listNotebook } from '@/api/public'
import { onMounted, ref } from 'vue'
import dayjs from 'dayjs'

const { dailyNotebookId, refreshSiyuanKnotes, selectedDay, getTargetDailyDocId, saveConfig, getConfig } = useData()

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

const selected = ref(dayjs())
const dateChange = (value) => {
  console.log(value)
  selectedDay.value = dayjs(value).format('YYYY-MM-DD')
  refreshSiyuanKnotes()
  getTargetDailyDocId(selectedDay.value)
}

// 禁止选择今天之后的时间
const disabledDate = (current) => {
  return current && current > dayjs().endOf('day')
}

const handleChangeNotebook = () => {
  refreshSiyuanKnotes()
  getTargetDailyDocId(selectedDay.value)
  saveConfig()
}

onMounted(() => {
  selectedDay.value = dayjs().format('YYYY-MM-DD')
  // console.log(selectedDay.value)
  refreshSiyuanKnotes()
  getConfig().then(() => {
    // console.log(res)
    getTargetDailyDocId(selectedDay.value)
  })
})
</script>

<style scoped></style>
