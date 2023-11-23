<template>
  <suspense>
    <home-view :path="path" />
  </suspense>
</template>
<script lang="ts">
export default {
  name: 'Kmind'
}
</script>
<script setup lang="ts">
import HomeView from '/src/components/kmindTab/src/views/home/index.vue'
import { computed, provide } from 'vue'
import { creatNamedPublicStore } from '@/components/kmindTab/src/store/modules/public'
import { storeToRefs } from 'pinia'
import { useNewFeatNotify } from '@/hooks/useNewFeatNotify'
// const publicStore = usePublicStore()
// const { fileName, filePath } = storeToRefs(publicStore)
const props = defineProps<{
  name?: string
}>()
const path = computed(() => {
  return `/data/storage/petal/kmind/${props.name}.kmind`
})
const useNamedPublicStore = creatNamedPublicStore(props.name)
const namedPublicStore = useNamedPublicStore()
const { fileName, filePath } = storeToRefs(namedPublicStore)
fileName.value = props.name
filePath.value = path.value

provide('name', props.name)

useNewFeatNotify()
</script>
<style scoped></style>
