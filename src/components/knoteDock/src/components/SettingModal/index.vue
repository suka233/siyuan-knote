<template>
  <a-modal title="KNote设置" v-model:open="visible">
    <div>xxxx</div>
  </a-modal>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  visible: boolean
}>()
const emits = defineEmits(['update:visible'])

const visible = computed({
  get: () => props.visible,
  set: (val) => emits('update:visible', val)
})
</script>

<style scoped></style>
