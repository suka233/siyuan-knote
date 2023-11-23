<template>
  <div class="fn__flex-1 fn__flex-column">
    <!--    标题-->
    <div class="block__icons">
      <div class="block__logo">
        <svg>
          <use xlink:href="#iconKmind" />
        </svg>
        Kmind
      </div>
      <span class="fn__flex-1 fn__space"></span>
      <span data-type="min" class="block__icon b3-tooltips b3-tooltips__sw" aria-label="最小化">
        <svg>
          <use xlink:href="#iconMin" />
        </svg>
      </span>
      <span id="add-draw" class="block__icon b3-tooltips b3-tooltips__sw" aria-label="新建" @click="handleAddKmind">
        <svg>
          <use xlink:href="#iconAdd" />
        </svg>
      </span>
      <span id="refresh" class="block__icon b3-tooltips b3-tooltips__sw" aria-label="刷新" @click="handleRefresh">
        <svg>
          <use xlink:href="#iconRefresh" />
        </svg>
      </span>
    </div>
    <!--    内容-->
    <div class="ml-4">
      <!--      <a-select :options="kmindFiles" class="w-full" />-->
      <file-list
        v-for="item in kmindFiles"
        :key="item.label"
        :name="item.label"
        :plugin="plugin"
        :refreshFn="handleRefresh"
      />
      <!--      <a-button @click="handleTest">test</a-button>-->
    </div>
    <add-kmind v-model:visible="showAddModel" :refreshFn="handleRefresh" :plugin="plugin" />
  </div>
</template>
<script setup lang="ts">
import KmindPlugin from '@/index'
import { onMounted, ref } from 'vue'
import AddKmind from './components/AddKmind/index.vue'
import { useFile } from '@/hooks/useFile'
import FileList from './components/FileList/index.vue'
import { kmind } from '@/components/kmindTab/src/hooks/useKmind'
import { useNamedPublicStoreWithOut } from '@/components/kmindTab/src/store/modules/public'
import { useNewFeatNotify } from '@/hooks/useNewFeatNotify'
const props = defineProps<{
  plugin: KmindPlugin
}>()

const showAddModel = ref(false)
const handleAddKmind = () => {
  showAddModel.value = true
  // console.log('新建')
  // props.plugin.open('test')
  // props.plugin.open('test2')
}

const handleRefresh = async () => {
  await listKmindFiles()
}

const { listKmindFiles, kmindFiles } = useFile()
listKmindFiles()

const handleTest = () => {
  console.log(props.plugin.tabs)
  console.log(kmind)
  Object.keys(kmind).forEach((key) => {
    const publicStoreWithOutDiff = useNamedPublicStoreWithOut(key)
    console.log(publicStoreWithOutDiff)
  })
}

onMounted(() => {
  // 初次进入思源，如果默认打开了某些kmind tab页，则需要手动添加到tabs中，便于维护
  globalThis.siyuan.layout.centerLayout.children.forEach((item) => {
    // console.log(item.children[0]?.model?.type)
    // 实测发现，这里的item.children[0]?.model 的model，应该是思源异步拼接上去的，所以这里使用setTimeout才能获取到，否则为undefined
    // setTimeout(() => {
    //   if (item.children[0]?.model?.type === 'kmind-pluginkmind') {
    //     props.plugin.tabs.push({ name: item.children[0].title, tab: item.children[0] })
    //   }
    // })
    item.children.forEach((child) => {
      if (child.icon === 'iconKmind') {
        props.plugin.tabs.push({ name: child.title, tab: child })
      }
    })
  })

  useNewFeatNotify()
})
</script>
<style scoped lang="less"></style>
