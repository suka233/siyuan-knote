<template>
  <div>
    <home-view />
  </div>
</template>

<script setup lang="ts">
import 'vuetify/styles/elements/_index.sass'
import '@mdi/font/css/materialdesignicons.css'
import HomeView from './src/views/home/index.vue'
import { useData } from './src/hooks/useData'
import { watch } from 'vue'
const { getConfig, saveConfig, dailyNotebookId, displayMode, getTargetDailyDocId, selectedDay, useNewQuery } = useData()
getConfig().then(() => {
  // console.log(res)
  getTargetDailyDocId(selectedDay.value)
})

// 自动保存
watch([dailyNotebookId, displayMode, useNewQuery], () => {
  saveConfig()
})
</script>

<style scoped></style>
