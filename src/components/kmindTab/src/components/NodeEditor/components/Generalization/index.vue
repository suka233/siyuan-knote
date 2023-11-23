<template>
  <a-button title="根节点无概要" @click="handleClick">
    <span class="align-middle">概要</span>
    <partition-outlined class="align-middle" style="transform: rotateY(180deg)" />
  </a-button>
</template>

<script lang="tsx">
export default {
  // eslint-disable-next-line vue/multi-word-component-names
  name: 'Generalization'
}
</script>

<script lang="tsx" setup>
import { PartitionOutlined } from '@ant-design/icons-vue'
import { kmind } from '/src/components/kmindTab/src/hooks/useKmind'
import { inject } from 'vue'
const name = inject('name')
const handleClick = () => {
  kmind[name].execCommand('ADD_GENERALIZATION')
}
</script>

<style scoped></style>
