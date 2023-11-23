重命名
<template>
  <a-modal v-model:open="visible" title="重命名" @ok="handleOk">
    <div class="p-5">
      <a-form>
        <a-row>
          <a-col :span="24">
            <a-form-item label="文件名称">
              <a-input
                v-model:value="kmindName"
                placeholder="不可以输入特殊符号哦~"
                addon-after=".kmind"
                show-count
                :maxlength="255"
                allow-clear
              />
            </a-form-item>
          </a-col>
        </a-row>
      </a-form>
    </div>
  </a-modal>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { message } from 'ant-design-vue'
import { useFile } from '@/hooks/useFile'
import type KmindPlugin from '@/index'
const props = defineProps<{
  visible: boolean
  refreshFn: () => void
  plugin: KmindPlugin
  name: string
}>()
const emits = defineEmits(['update:visible'])
const visible = computed({
  get() {
    return props.visible
  },
  set(value) {
    emits('update:visible', value)
  }
})
const kmindName = ref('')
const verify = (value: string) => {
  const reg = /[\\/:*?"<>|]/
  return reg.test(value)
}

// 校验同名
const { listKmindFiles, kmindFiles, renameFile } = useFile()
const verifySameName = async (name: string) => {
  await listKmindFiles()
  return kmindFiles.value.find((item) => item.label === name)
}
const handleOk = () => {
  // 校验特殊符号
  if (verify(kmindName.value)) {
    message.error('文件名不可以包含特殊符号哦~')
    return
  }
  // 校验同名
  verifySameName(kmindName.value).then(async (res) => {
    console.log(res)
    if (res) {
      message.error('文件名已存在，请重新输入')
      return
    }

    // 重命名
    await renameFile(props.name, kmindName.value).then(() => {
      message.success('重命名成功')
    })

    // 关掉老tab页
    props.plugin?.closeTab(props.name)
    // 刷新列表
    props.refreshFn()
    // 打开新tab页
    props.plugin.open(kmindName.value)

    visible.value = false
  })
}

watch(
  () => props.visible,
  (val) => {
    if (val) {
      kmindName.value = props.name
    }
  }
)
</script>

<style scoped lang="less"></style>
