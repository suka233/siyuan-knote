<template>
  <a-button :disabled="backEnd" class="mr-2" title="回退（撤销）" @click="handleBack">
    <rollback-outlined class="align-middle" />
  </a-button>
  <a-button :disabled="forwardEnd" class="mr-2" title="前进（取消撤销）" @click="handleForward"
    ><rollback-outlined class="align-middle" style="transform: rotateY(180deg)"
  /></a-button>
</template>

<script lang="tsx">
export default {
  name: 'BackForward'
}
</script>

<script lang="tsx" setup>
import { creatNamedPublicStore } from '/src/components/kmindTab/src/store/modules/public'
import { inject, toRefs } from 'vue'
import { RollbackOutlined } from '@ant-design/icons-vue'
import { kmind } from '/src/components/kmindTab/src/hooks/useKmind'
const name = inject('name')
const publicStore = creatNamedPublicStore(name)()
const { backEnd, forwardEnd } = toRefs(publicStore)

const handleBack = () => {
  kmind[name].execCommand('BACK')
}

const handleForward = () => {
  kmind[name].execCommand('FORWARD')
}
</script>

<style scoped></style>
