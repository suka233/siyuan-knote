<template>
  <div
    :style="{
      left: `${noteLeft}px`,
      top: `${noteTop}px`,
      visibility: noteVisible ? 'visible' : 'hidden'
    }"
    class="noteContentViewer"
    v-html="noteContent"
  ></div>
</template>

<script lang="tsx">
export default {
  name: 'ShowNote'
}
</script>
<script lang="tsx" setup>
import { creatNamedPublicStore } from '/src/components/kmindTab/src/store/modules/public'
import { inject, toRefs } from 'vue'
const name = inject('name')
const publicStore = creatNamedPublicStore(name)()
const { noteVisible, noteLeft, noteTop, noteContent } = toRefs(publicStore)
</script>

<style scoped>
.noteContentViewer {
  position: fixed;
  background-color: #fff;
  padding: 10px;
  border-radius: 5px;
  max-height: 300px;
  overflow-y: auto;
  box-shadow: gray 0px 0px 5px;
}
</style>
