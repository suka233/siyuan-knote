<template>
  <side-bar title="设置" :class="{ show: activeSidebar === 'setting' }" />
</template>
<script lang="tsx">
/**
 * 设置
 */
export default {
  name: 'Setting'
}
</script>
<script lang="tsx" setup>
import SideBar from '/src/components/kmindTab/src/components/SideBar/index.vue'
import { creatNamedPublicStore } from '/src/components/kmindTab/src/store/modules/public'
import { inject, toRefs } from 'vue'
// const publicStore = usePublicStore()
const name = inject('name')
const publicStore = creatNamedPublicStore(name)()
const { activeSidebar } = toRefs(publicStore)
</script>
<style scoped></style>
