<template>
  <a-modal
    v-model:visible="visible"
    width="1000px"
    :title="type === 'node' ? '请输入节点文本' : '请输入备注文本'"
    @ok="handleOk"
  >
    <div>
      <div id="vditor" ref="vditorRef"></div>
    </div>
  </a-modal>
</template>

<script lang="tsx">
export default {
  name: 'RemarkNoteEditor'
}
</script>

<script lang="tsx" setup>
import Vditor from 'vditor'
import 'vditor/dist/index.css'
import { onMounted, ref, inject, computed, watch } from 'vue'
// import { kmind } from '/src/components/kmindTab/src/hooks/useKmind'
const name = inject('name')
const vditor = ref<Vditor>()
const vditorRef = ref<HTMLElement>()
const props = defineProps<{
  visible: boolean
  node: any
  /**
   * node: 节点文本
   * note: 备注文本
   */
  type: 'node' | 'note'
}>()
const emits = defineEmits<{
  (event: 'update:visible', visible: boolean): void
}>()

const visible = computed({
  get() {
    return props.visible
  },
  set() {
    emits('update:visible', !visible.value)
  }
})

onMounted(() => {
  vditor.value = new Vditor('vditor', {
    minHeight: 280,
    // counter: {
    //   enable: true,
    //   type: 'text'
    // },
    cache: {
      enable: false
    },
    after() {
      console.log(vditor.value)
      console.log(props.node?.getData('text'))
      if (props.type === 'node') {
        vditor.value!.setValue(vditor.value!.html2md(props.node?.getData('text') ?? ''))
      } else {
        vditor.value!.setValue(vditor.value!.html2md(props.node?.getData('note') ?? ''))
      }
    }
  })
})

const handleOk = () => {
  // if (props.type === 'node') {
  //   kmind[name].renderer.setText(vditor.value.getValue())
  // } else {
  //   kmind[name].renderer.setNote(vditor.value.getValue())
  // }
  // visible.value = false
  console.log(vditor.value?.getValue())
  console.log(vditor.value?.getHTML())
  // vditor.value!.setValue(vditor.value!.html2md(props.node?.getData('text') ?? ''))

  if (props.type === 'node') {
    props.node.setText(vditor.value?.getHTML(), true)
    // TODO 使用 html-to-text 转换为纯文本 构建纯文本文档树，用来支撑搜索，大纲，插入导图内超链接等功能
    // props.node.nodeData.data.kmindParams = `测试额外数据`;
  } else {
    props.node.setNote(vditor.value?.getHTML())
    // 即使编辑器为空，editorContent.value也会有一个p标签，所以需要判断一下
    // if (editorContent.value !== '<p><br></p>') {
    //   props.node.setNote(vditor.value?.getHTML())
    // } else {
    //   props.node.setNote('')
    // }
  }
  // visible.value = false
}

watch(
  () => props.visible,
  (val) => {
    if (val) {
      // vditor.value!.setValue(props.node.getText())
      // console.log(vditor.value)
      // console.log(props.node?.getData('text'))
      // if (props.type === 'node') {
      //   vditor.value!.setValue(vditor.value!.html2md(props.node?.getData('text') ?? ''))
      // } else {
      //   vditor.value!.setValue(vditor.value!.html2md(props.node?.getData('note') ?? ''))
      // }
    }
  },
  {
    immediate: true
  }
)
</script>

<style scoped></style>
