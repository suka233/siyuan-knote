<template>
  <div>
    <simple-mode :data="data" />
  </div>
</template>

<script setup lang="ts">
import SimpleMode from './components/SimpleMode/index.vue'
import type { KNoteModel } from '@/components/knoteDock/src/model/KNoteModel'
defineProps<{
  data: KNoteModel
}>()
</script>

<style scoped></style>
