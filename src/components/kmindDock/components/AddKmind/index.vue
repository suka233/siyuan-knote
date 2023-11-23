创建一张新的导图
<template>
  <a-modal v-model:open="visible" title="创建一张新的导图" @ok="handleOk">
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
import { putFile } from '@/api/public'
import type KmindPlugin from '@/index'
const props = defineProps<{
  visible: boolean
  refreshFn: () => void
  plugin: KmindPlugin
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
const { listKmindFiles, kmindFiles } = useFile()
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
    // 创建文件
    const json = JSON.stringify({})
    const blob = new Blob([json], { type: 'application/json' })
    const file = new File([blob], `${kmindName.value}.kmind`, {
      type: 'application/json',
      lastModified: Date.now()
    })

    await putFile({ file, path: `/data/storage/petal/kmind/${kmindName.value}.kmind` })
      .then(async () => {
        message.success('新建kmind文件成功！')
        visible.value = false
        await props.refreshFn()
        // 不存在名为name的tab页，则打开
        if (!props.plugin.tabs.find((item) => item.name === kmindName.value)) {
          props.plugin.open(kmindName.value)
        }
      })
      .catch((e) => {
        message.error('新建kmind文件失败，请重试！')
        console.log(e)
      })
  })
}

watch(
  () => props.visible,
  (val) => {
    if (val) {
      kmindName.value = ''
    }
  }
)
</script>

<style scoped lang="less"></style>
