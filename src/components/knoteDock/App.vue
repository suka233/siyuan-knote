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
const { getConfig } = useData()
getConfig().then(() => {
  // console.log(res)
})
</script>

<style scoped></style>
